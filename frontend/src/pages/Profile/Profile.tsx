import React, { useState } from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer /Footer";
import "./Profile.css";

interface UserData {
  username: string;
  email: string;
  avatar: string;
  memberSince: string;
  gamesOwned: number;
  reviewsWritten: number;
  wishlistCount: number;
}

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    username: "gamer123",
    email: "gamer@example.com",
    avatar: "",
    memberSince: "January 2024",
    gamesOwned: 24,
    reviewsWritten: 12,
    wishlistCount: 8,
  });

  const [editForm, setEditForm] = useState({
    username: userData.username,
    email: userData.email,
  });

  const handleSearch = (term: string) => {
    console.log("Searching for:", term);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setUserData({
      ...userData,
      username: editForm.username,
      email: editForm.email,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm({
      username: userData.username,
      email: userData.email,
    });
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const purchasedGames = [
    { id: 1, title: "Cyberpunk 2077", price: "1.5$" },
    { id: 2, title: "The Witcher 3", price: "1.5$" },
    { id: 3, title: "Elden Ring", price: "1.5$" },
  ];

  return (
    <div className="profile-container">
      <Header onSearch={handleSearch} />

      <main className="profile-main">
        <div className="profile-content">
          <div className="profile-header">
            <div className="profile-avatar">
              <div className="avatar-icon">{userData.avatar}</div>
              <button className="change-avatar-btn">change avatar</button>
            </div>

            <div className="profile-info">
              {!isEditing ? (
                <>
                  <h1 className="profile-username">{userData.username}</h1>
                  <p className="profile-email">{userData.email}</p>
                  <p className="profile-member">
                    member since {userData.memberSince}
                  </p>
                  <button className="edit-profile-btn" onClick={handleEdit}>
                    edit profile
                  </button>
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
                  <div className="edit-actions">
                    <button className="save-btn" onClick={handleSave}>
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
              <div className="stat-value">{userData.gamesOwned}</div>
              <div className="stat-label">games owned</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{userData.reviewsWritten}</div>
              <div className="stat-label">reviews written</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{userData.wishlistCount}</div>
              <div className="stat-label">wishlist</div>
            </div>
          </div>

          <div className="recent-games-section">
            <h2 className="section-title">purchased games</h2>
            <div className="recent-games-list">
              {purchasedGames.map((game) => (
                <div key={game.id} className="recent-game-card">
                  <div className="game-details">
                    <h3 className="game-title">{game.title}</h3>
                    <p className="game-playtime">price: {game.price}</p>
                  </div>
                  <button className="details-btn">details</button>
                </div>
              ))}
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
