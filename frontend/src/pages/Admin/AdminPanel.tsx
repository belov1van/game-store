import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/header/Header';
import Footer from '../../components/footer /Footer';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/api';
import type { AdminUser, Game } from '../../api/types';
import './AdminPanel.css';

type Tab = 'users' | 'games';

interface UserFormData {
  username: string;
  email: string;
  password: string;
  role: 'USER' | 'ADMIN';
}

interface UserModalProps {
  initial: AdminUser | null;
  onSave: (data: Partial<UserFormData> & { password?: string }) => Promise<void>;
  onClose: () => void;
}

const UserModal: React.FC<UserModalProps> = ({ initial, onSave, onClose }) => {
  const [form, setForm] = useState<UserFormData>({
    username: initial?.username ?? '',
    email: initial?.email ?? '',
    password: '',
    role: initial?.role ?? 'USER',
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await onSave(
        initial
          ? { username: form.username, email: form.email, role: form.role }
          : form,
      );
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="ap-modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="ap-modal-card">
        <h3>{initial ? 'Edit User' : 'Add User'}</h3>
        <form onSubmit={(e) => { void handleSubmit(e); }}>
          <div className="ap-field">
            <label>Username</label>
            <input
              value={form.username}
              onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
              required
            />
          </div>
          <div className="ap-field">
            <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              required
            />
          </div>
          {!initial && (
            <div className="ap-field">
              <label>Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                required
                minLength={6}
              />
            </div>
          )}
          <div className="ap-field">
            <label>Role</label>
            <select
              value={form.role}
              onChange={(e) =>
                setForm((p) => ({ ...p, role: e.target.value as 'USER' | 'ADMIN' }))
              }
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
          {error && <p className="ap-error">{error}</p>}
          <div className="ap-modal-actions">
            <button type="submit" className="ap-save-btn" disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button type="button" className="ap-cancel-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

type GameFormData = Omit<Game, 'id' | 'createdAt' | 'updatedAt'>;

const EMPTY_GAME: GameFormData = {
  title: '',
  image: '',
  price: 0,
  rating: 0,
  description: '',
  genre: '',
  releaseDate: '',
  developer: '',
};

interface GameModalProps {
  initial: Game | null;
  onSave: (data: GameFormData) => Promise<void>;
  onClose: () => void;
}

const GameModal: React.FC<GameModalProps> = ({ initial, onSave, onClose }) => {
  const [form, setForm] = useState<GameFormData>(
    initial
      ? {
          title: initial.title,
          image: initial.image,
          price: initial.price,
          rating: initial.rating,
          description: initial.description,
          genre: initial.genre,
          releaseDate: initial.releaseDate,
          developer: initial.developer,
        }
      : EMPTY_GAME,
  );
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const set =
    (field: keyof GameFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((p) => ({
        ...p,
        [field]:
          field === 'price' || field === 'rating'
            ? parseFloat(e.target.value) || 0
            : e.target.value,
      }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="ap-modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="ap-modal-card ap-modal-wide">
        <h3>{initial ? 'Edit Game' : 'Add Game'}</h3>
        <form onSubmit={(e) => { void handleSubmit(e); }}>
          <div className="ap-fields-grid">
            <div className="ap-field">
              <label>Title</label>
              <input value={form.title} onChange={set('title')} required />
            </div>
            <div className="ap-field">
              <label>Genre</label>
              <input value={form.genre} onChange={set('genre')} required />
            </div>
            <div className="ap-field">
              <label>Developer</label>
              <input value={form.developer} onChange={set('developer')} required />
            </div>
            <div className="ap-field">
              <label>Release Date</label>
              <input
                value={form.releaseDate}
                onChange={set('releaseDate')}
                placeholder="YYYY-MM-DD"
                required
              />
            </div>
            <div className="ap-field">
              <label>Price ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={set('price')}
                required
              />
            </div>
            <div className="ap-field">
              <label>Rating (0-5)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={form.rating}
                onChange={set('rating')}
              />
            </div>
          </div>
          <div className="ap-field">
            <label>Image URL</label>
            <input value={form.image} onChange={set('image')} required />
          </div>
          <div className="ap-field">
            <label>Description</label>
            <textarea rows={3} value={form.description} onChange={set('description')} required />
          </div>
          {error && <p className="ap-error">{error}</p>}
          <div className="ap-modal-actions">
            <button type="submit" className="ap-save-btn" disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button type="button" className="ap-cancel-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdminPanel: React.FC = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('users');

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null | undefined>(undefined);

  const [games, setGames] = useState<Game[]>([]);
  const [gamesLoading, setGamesLoading] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null | undefined>(undefined);

  useEffect(() => {
    if (!isAdmin) navigate('/');
  }, [isAdmin, navigate]);

  useEffect(() => {
    if (tab === 'users') void loadUsers();
    if (tab === 'games') void loadGames();
  }, [tab]);

  const loadUsers = async () => {
    setUsersLoading(true);
    try {
      setUsers(await api.admin.getUsers());
    } catch (e) {
      console.error(e);
    } finally {
      setUsersLoading(false);
    }
  };

  const loadGames = async () => {
    setGamesLoading(true);
    try {
      setGames(await api.admin.getGames());
    } catch (e) {
      console.error(e);
    } finally {
      setGamesLoading(false);
    }
  };

  const handleSaveUser = async (data: {
    username?: string;
    email?: string;
    password?: string;
    role?: string;
  }) => {
    if (editingUser === null) {
      const created = await api.admin.createUser(
        data as { username: string; email: string; password: string; role?: string },
      );
      setUsers((prev) => [...prev, created]);
    } else if (editingUser) {
      const updated = await api.admin.updateUser(editingUser.id, data);
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    }
  };

  const handleDeleteUser = async (user: AdminUser) => {
    if (!window.confirm(`Delete user "${user.username}"? This action cannot be undone.`)) return;
    try {
      await api.admin.deleteUser(user.id);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  const handleSaveGame = async (data: GameFormData) => {
    if (editingGame === null) {
      const created = await api.admin.createGame(data);
      setGames((prev) => [...prev, created]);
    } else if (editingGame) {
      const updated = await api.admin.updateGame(editingGame.id, data);
      setGames((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
    }
  };

  const handleDeleteGame = async (game: Game) => {
    if (!window.confirm(`Delete game "${game.title}"?`)) return;
    try {
      await api.admin.deleteGame(game.id);
      setGames((prev) => prev.filter((g) => g.id !== game.id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  return (
    <div className="admin-container">
      <Header onSearch={() => {}} />

      <main className="admin-main">
        <div className="admin-panel">
          <div className="admin-panel-header">
            <h1 className="admin-panel-title">Admin Panel</h1>
            <div className="admin-tabs">
              <button
                className={`admin-tab-btn${tab === 'users' ? ' active' : ''}`}
                onClick={() => setTab('users')}
              >
                Users{users.length > 0 && <span className="tab-count">{users.length}</span>}
              </button>
              <button
                className={`admin-tab-btn${tab === 'games' ? ' active' : ''}`}
                onClick={() => setTab('games')}
              >
                Games{games.length > 0 && <span className="tab-count">{games.length}</span>}
              </button>
            </div>
          </div>

          {tab === 'users' && (
            <div className="admin-table-wrapper">
              <div className="admin-table-toolbar">
                <span className="admin-table-title">All Users</span>
                <button className="ap-add-btn" onClick={() => setEditingUser(null)}>
                  + add user
                </button>
              </div>
              {usersLoading ? (
                <div className="admin-loading">Loading...</div>
              ) : (
                <div className="admin-scroll">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Avatar</th>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Joined</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td>
                            {user.avatar ? (
                              <img
                                src={user.avatar}
                                alt=""
                                className="admin-avatar-img"
                              />
                            ) : (
                              <div className="admin-avatar-placeholder">
                                {user.username.slice(0, 2).toUpperCase()}
                              </div>
                            )}
                          </td>
                          <td className="admin-id">{user.id}</td>
                          <td>
                            <strong>{user.username}</strong>
                          </td>
                          <td className="admin-muted">{user.email}</td>
                          <td>
                            <span className={`role-badge ${user.role.toLowerCase()}`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="admin-muted">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td>
                            <div className="admin-actions">
                              <button
                                className="ap-edit-btn"
                                onClick={() => setEditingUser(user)}
                              >
                                edit
                              </button>
                              <button
                                className="ap-delete-btn"
                                onClick={() => { void handleDeleteUser(user); }}
                              >
                                delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {tab === 'games' && (
            <div className="admin-table-wrapper">
              <div className="admin-table-toolbar">
                <span className="admin-table-title">All Games</span>
                <button className="ap-add-btn" onClick={() => setEditingGame(null)}>
                  + add game
                </button>
              </div>
              {gamesLoading ? (
                <div className="admin-loading">Loading...</div>
              ) : (
                <div className="admin-scroll">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Cover</th>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Genre</th>
                        <th>Price</th>
                        <th>Rating</th>
                        <th>Developer</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {games.map((game) => (
                        <tr key={game.id}>
                          <td>
                            <img
                              src={game.image}
                              alt={game.title}
                              className="admin-game-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          </td>
                          <td className="admin-id">{game.id}</td>
                          <td>
                            <strong>{game.title}</strong>
                          </td>
                          <td className="admin-muted">{game.genre}</td>
                          <td>${game.price.toFixed(2)}</td>
                          <td>
                            {'⭐'.repeat(Math.round(game.rating))}
                            {game.rating.toFixed(1)}
                          </td>
                          <td className="admin-muted">{game.developer}</td>
                          <td>
                            <div className="admin-actions">
                              <button
                                className="ap-edit-btn"
                                onClick={() => setEditingGame(game)}
                              >
                                edit
                              </button>
                              <button
                                className="ap-delete-btn"
                                onClick={() => { void handleDeleteGame(game); }}
                              >
                                delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />

      {editingUser !== undefined && (
        <UserModal
          initial={editingUser}
          onSave={handleSaveUser}
          onClose={() => setEditingUser(undefined)}
        />
      )}
      {editingGame !== undefined && (
        <GameModal
          initial={editingGame}
          onSave={handleSaveGame}
          onClose={() => setEditingGame(undefined)}
        />
      )}
    </div>
  );
};

export default AdminPanel;
