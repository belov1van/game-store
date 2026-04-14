import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header/Header";
import Footer from "../../components/footer /Footer";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../api/api";
import type { UserProfile, Order } from "../../api/types";
import "./Profile.css";

const Profile: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ username: "", email: "" });
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    void loadProfile();
  }, [isAuthenticated]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const [profileData, ordersData] = await Promise.all([
        api.users.me(),
        api.users.orders(),
      ]);
      setProfile(profileData);
      setOrders(ordersData);
      setEditForm({ username: profileData.username, email: profileData.email });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => setIsEditing(true);

  const handleSave = async () => {
    setSaveError("");
    try {
      const updated = await api.users.update(editForm);
      setProfile((prev) => (prev ? { ...prev, ...updated } : updated));
      setIsEditing(false);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Update failed");
    }
  };

  const handleCancel = () => {
    if (profile)
      setEditForm({ username: profile.username, email: profile.email });
    setIsEditing(false);
    setSaveError("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSearch = (term: string) => {
    console.log("Search:", term);
  };

  if (loading) {
    return (
      <div className="profile-container">
        <Header onSearch={handleSearch} />
        <main className="profile-main">
          <div style={{ textAlign: "center", padding: "60px" }}>
            Loading profile...
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!profile) return null;

  const memberSince = new Date(profile.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="profile-container">
      <Header onSearch={handleSearch} />

      <main className="profile-main">
        <div className="profile-content">
          <div className="profile-header">
            <div className="profile-avatar">
              <div className="avatar-icon">👤</div>
              <button className="change-avatar-btn">change avatar</button>
            </div>

            <div className="profile-info">
              {!isEditing ? (
                <>
                  <h1 className="profile-username">{profile.username}</h1>
                  <p className="profile-email">{profile.email}</p>
                  <p className="profile-member">member since {memberSince}</p>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button className="edit-profile-btn" onClick={handleEdit}>
                      edit profile
                    </button>
                    <button
                      className="edit-profile-btn"
                      onClick={handleLogout}
                      style={{ background: "transparent" }}
                    >
                      log out
                    </button>
                  </div>
                </>
              ) : (
                <div className="edit-form">
                  <div className="edit-field">
                    <label>username</label>
                    <input
                      type="text"
                      name="username"
                      value={editForm.username}
                      onChange={handleChange}
                      placeholder="Username"
                    />
                  </div>
                  <div className="edit-field">
                    <label>email</label>
                    <input
                      type="email"
                      name="email"
                      value={editForm.email}
                      onChange={handleChange}
                      placeholder="Email"
                    />
                  </div>
                  {saveError && (
                    <p style={{ color: "red", fontSize: "14px" }}>
                      {saveError}
                    </p>
                  )}
                  <div className="edit-actions">
                    <button
                      className="save-btn"
                      onClick={() => {
                        void handleSave();
                      }}
                    >
                      save
                    </button>
                    <button className="cancel-btn" onClick={handleCancel}>
                      cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="stats-cards">
            <div className="stat-card">
              <div className="stat-value">{profile.gamesOwned}</div>
              <div className="stat-label">games owned</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{profile.ordersCount}</div>
              <div className="stat-label">orders</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {orders.reduce((sum, o) => sum + o.items.length, 0)}
              </div>
              <div className="stat-label">items bought</div>
            </div>
          </div>

          <div className="recent-games-section">
            <h2 className="section-title">purchased games</h2>
            <div className="recent-games-list">
              {orders.length === 0 && (
                <p style={{ padding: "16px", opacity: 0.6 }}>
                  No purchases yet.
                </p>
              )}
              {orders.flatMap((order) =>
                order.items.map((item) => (
                  <div key={item.id} className="recent-game-card">
                    <div className="game-details">
                      <h3 className="game-title">{item.game.title}</h3>
                      <p className="game-playtime">
                        ${item.price.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                    <button className="details-btn">details</button>
                  </div>
                )),
              )}
            </div>
          </div>

          <div className="account-settings">
            <h2 className="section-title">account settings</h2>
            <div className="settings-list">
              <div className="setting-item">
                <span className="setting-label">notification preferences</span>
                <button className="setting-btn">manage</button>
              </div>
              <div className="setting-item">
                <span className="setting-label">privacy settings</span>
                <button className="setting-btn">manage</button>
              </div>
              <div className="setting-item">
                <span className="setting-label">payment methods</span>
                <button className="setting-btn">manage</button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
