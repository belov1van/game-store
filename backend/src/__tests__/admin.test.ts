import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../app';
import prisma from '../prisma/client';
import { makeToken, mockUser, mockAdmin, mockGame } from './helpers';

jest.mock('../prisma/client', () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    game: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    order: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('$2a$10$mocked'),
  compare: jest.fn().mockResolvedValue(true),
}));

const db = prisma as any;
const bcryptMock = bcrypt as any;

// adminToken is signed with userId=2 (matches mockAdmin.id)
const adminToken = makeToken(2, 'ADMIN');
// userToken is signed with userId=1 (matches mockUser.id, role=USER)
const userToken = makeToken(1, 'USER');

/**
 * Stripped user object that mirrors what the route returns via `select`
 * (no password field).
 */
const mockUserResponse = {
  id: mockUser.id,
  username: mockUser.username,
  email: mockUser.email,
  role: mockUser.role,
  avatar: mockUser.avatar,
  createdAt: mockUser.createdAt,
};

const mockAdminResponse = {
  id: mockAdmin.id,
  username: mockAdmin.username,
  email: mockAdmin.email,
  role: mockAdmin.role,
  avatar: mockAdmin.avatar,
  createdAt: mockAdmin.createdAt,
};

// ─── Auth guard ───────────────────────────────────────────────────────────────

describe('Auth guard — /api/admin/*', () => {
  beforeEach(() => jest.clearAllMocks());

  it('401 — GET /api/admin/users without token', async () => {
    const res = await request(app).get('/api/admin/users');
    expect(res.status).toBe(401);
    expect(res.body.error).toBeDefined();
  });

  it('403 — GET /api/admin/users with USER token', async () => {
    const res = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(403);
    expect(res.body.error).toBeDefined();
    expect(db.user.findMany).not.toHaveBeenCalled();
  });

  it('401 — GET /api/admin/games without token', async () => {
    const res = await request(app).get('/api/admin/games');
    expect(res.status).toBe(401);
    expect(res.body.error).toBeDefined();
  });

  it('403 — GET /api/admin/games with USER token', async () => {
    const res = await request(app)
      .get('/api/admin/games')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(403);
    expect(db.game.findMany).not.toHaveBeenCalled();
  });

  it('401 — POST /api/admin/users without token', async () => {
    const res = await request(app)
      .post('/api/admin/users')
      .send({ username: 'x', email: 'x@x.com', password: 'pass123' });
    expect(res.status).toBe(401);
  });

  it('403 — POST /api/admin/games with USER token', async () => {
    const res = await request(app)
      .post('/api/admin/games')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ title: 'Game' });
    expect(res.status).toBe(403);
  });

  it('401 — DELETE /api/admin/users/1 without token', async () => {
    const res = await request(app).delete('/api/admin/users/1');
    expect(res.status).toBe(401);
  });

  it('401 — DELETE /api/admin/games/1 without token', async () => {
    const res = await request(app).delete('/api/admin/games/1');
    expect(res.status).toBe(401);
  });
});

// ─── GET /api/admin/users ─────────────────────────────────────────────────────

describe('GET /api/admin/users', () => {
  beforeEach(() => jest.clearAllMocks());

  it('200 — returns array of users', async () => {
    db.user.findMany.mockResolvedValue([mockUserResponse, mockAdminResponse]);

    const res = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(2);
  });

  it('200 — returns empty array when no users exist', async () => {
    db.user.findMany.mockResolvedValue([]);

    const res = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('200 — returned users do not contain password field', async () => {
    db.user.findMany.mockResolvedValue([mockUserResponse]);

    const res = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body[0]).not.toHaveProperty('password');
  });

  it('500 — unexpected DB error returns 500', async () => {
    db.user.findMany.mockRejectedValue(new Error('DB is down'));

    const res = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(500);
    expect(res.body.error).toBeDefined();
  });
});

// ─── POST /api/admin/users ────────────────────────────────────────────────────

describe('POST /api/admin/users', () => {
  beforeEach(() => jest.clearAllMocks());

  it('400 — missing all required fields', async () => {
    const res = await request(app)
      .post('/api/admin/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
    expect(db.user.create).not.toHaveBeenCalled();
  });

  it('400 — missing email', async () => {
    const res = await request(app)
      .post('/api/admin/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ username: 'newuser', password: 'pass123' });

    expect(res.status).toBe(400);
    expect(db.user.create).not.toHaveBeenCalled();
  });

  it('400 — missing password', async () => {
    const res = await request(app)
      .post('/api/admin/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ username: 'newuser', email: 'new@example.com' });

    expect(res.status).toBe(400);
    expect(db.user.create).not.toHaveBeenCalled();
  });

  it('400 — missing username', async () => {
    const res = await request(app)
      .post('/api/admin/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ email: 'new@example.com', password: 'pass123' });

    expect(res.status).toBe(400);
    expect(db.user.create).not.toHaveBeenCalled();
  });

  it('201 — creates user with role USER by default', async () => {
    db.user.create.mockResolvedValue(mockUserResponse);

    const res = await request(app)
      .post('/api/admin/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ username: 'testuser', email: 'test@example.com', password: 'secret123' });

    expect(res.status).toBe(201);
    expect(res.body.username).toBe('testuser');
    expect(res.body.email).toBe('test@example.com');
    expect(res.body).not.toHaveProperty('password');
  });

  it('201 — creates user with role ADMIN when role=ADMIN is supplied', async () => {
    db.user.create.mockResolvedValue(mockAdminResponse);

    const res = await request(app)
      .post('/api/admin/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ username: 'admin2', email: 'admin2@example.com', password: 'secret123', role: 'ADMIN' });

    expect(res.status).toBe(201);
    expect(res.body.role).toBe('ADMIN');
  });

  it('201 — bcrypt.hash is called with the plain password', async () => {
    db.user.create.mockResolvedValue(mockUserResponse);

    await request(app)
      .post('/api/admin/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ username: 'testuser', email: 'test@example.com', password: 'secret123' });

    expect(bcryptMock.hash).toHaveBeenCalledWith('secret123', 10);
  });

  it('201 — user.create is called with the hashed password', async () => {
    db.user.create.mockResolvedValue(mockUserResponse);

    await request(app)
      .post('/api/admin/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ username: 'testuser', email: 'test@example.com', password: 'secret123' });

    expect(db.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ password: '$2a$10$mocked' }),
      }),
    );
  });

  it('409 — duplicate username or email (Prisma P2002)', async () => {
    const err: any = new Error('Unique constraint failed');
    err.code = 'P2002';
    db.user.create.mockRejectedValue(err);

    const res = await request(app)
      .post('/api/admin/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ username: 'testuser', email: 'test@example.com', password: 'secret123' });

    expect(res.status).toBe(409);
    expect(res.body.error).toBeDefined();
  });

  it('500 — unexpected DB error returns 500', async () => {
    db.user.create.mockRejectedValue(new Error('DB exploded'));

    const res = await request(app)
      .post('/api/admin/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ username: 'testuser', email: 'test@example.com', password: 'secret123' });

    expect(res.status).toBe(500);
    expect(res.body.error).toBeDefined();
  });
});

// ─── PUT /api/admin/users/:id ─────────────────────────────────────────────────

describe('PUT /api/admin/users/:id', () => {
  beforeEach(() => jest.clearAllMocks());

  it('200 — updates username', async () => {
    const updated = { ...mockUserResponse, username: 'renamed' };
    db.user.update.mockResolvedValue(updated);

    const res = await request(app)
      .put('/api/admin/users/1')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ username: 'renamed' });

    expect(res.status).toBe(200);
    expect(res.body.username).toBe('renamed');
  });

  it('200 — updates email', async () => {
    const updated = { ...mockUserResponse, email: 'new@example.com' };
    db.user.update.mockResolvedValue(updated);

    const res = await request(app)
      .put('/api/admin/users/1')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ email: 'new@example.com' });

    expect(res.status).toBe(200);
    expect(res.body.email).toBe('new@example.com');
  });

  it('200 — promotes user to ADMIN role', async () => {
    const updated = { ...mockUserResponse, role: 'ADMIN' };
    db.user.update.mockResolvedValue(updated);

    const res = await request(app)
      .put('/api/admin/users/1')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ role: 'ADMIN' });

    expect(res.status).toBe(200);
    expect(res.body.role).toBe('ADMIN');
  });

  it('200 — user.update is called with the correct id', async () => {
    db.user.update.mockResolvedValue(mockUserResponse);

    await request(app)
      .put('/api/admin/users/1')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ username: 'renamed' });

    expect(db.user.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 1 } }),
    );
  });

  it('200 — response does not expose password field', async () => {
    db.user.update.mockResolvedValue(mockUserResponse);

    const res = await request(app)
      .put('/api/admin/users/1')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ username: 'renamed' });

    expect(res.status).toBe(200);
    expect(res.body).not.toHaveProperty('password');
  });

  it('409 — returns 409 on duplicate (P2002)', async () => {
    const err: any = new Error('Unique constraint failed');
    err.code = 'P2002';
    db.user.update.mockRejectedValue(err);

    const res = await request(app)
      .put('/api/admin/users/1')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ email: 'already@taken.com' });

    expect(res.status).toBe(409);
    expect(res.body.error).toBeDefined();
  });
});

// ─── DELETE /api/admin/users/:id ──────────────────────────────────────────────

describe('DELETE /api/admin/users/:id', () => {
  beforeEach(() => jest.clearAllMocks());

  it('200 — deletes a different user and returns { success: true }', async () => {
    db.user.delete.mockResolvedValue(mockUserResponse);

    // adminToken has userId=2; deleting user id=1 — allowed
    const res = await request(app)
      .delete('/api/admin/users/1')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(db.user.delete).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 1 } }),
    );
  });

  it('400 — cannot delete self (id in URL matches userId from token)', async () => {
    // adminToken was signed with userId=2 → trying to delete id=2 must fail
    const res = await request(app)
      .delete('/api/admin/users/2')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
    expect(db.user.delete).not.toHaveBeenCalled();
  });

  it('500 — unexpected DB error returns 500', async () => {
    db.user.delete.mockRejectedValue(new Error('Cannot delete'));

    const res = await request(app)
      .delete('/api/admin/users/1')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(500);
    expect(res.body.error).toBeDefined();
  });
});

// ─── GET /api/admin/games ─────────────────────────────────────────────────────

describe('GET /api/admin/games', () => {
  beforeEach(() => jest.clearAllMocks());

  it('200 — returns array of games', async () => {
    db.game.findMany.mockResolvedValue([mockGame]);

    const res = await request(app)
      .get('/api/admin/games')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].title).toBe('Test Game');
  });

  it('200 — returns empty array when no games exist', async () => {
    db.game.findMany.mockResolvedValue([]);

    const res = await request(app)
      .get('/api/admin/games')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('200 — returns multiple games', async () => {
    const game2 = { ...mockGame, id: 2, title: 'Second Game' };
    db.game.findMany.mockResolvedValue([mockGame, game2]);

    const res = await request(app)
      .get('/api/admin/games')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  it('500 — unexpected DB error returns 500', async () => {
    db.game.findMany.mockRejectedValue(new Error('DB is down'));

    const res = await request(app)
      .get('/api/admin/games')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(500);
    expect(res.body.error).toBeDefined();
  });
});

// ─── POST /api/admin/games ────────────────────────────────────────────────────

describe('POST /api/admin/games', () => {
  const validGamePayload = {
    title: 'Test Game',
    image: 'https://example.com/game.jpg',
    price: 29.99,
    description: 'A great test game',
    genre: 'RPG',
    releaseDate: '2024-01-01',
    developer: 'Test Dev',
  };

  beforeEach(() => jest.clearAllMocks());

  it('400 — missing all required fields', async () => {
    const res = await request(app)
      .post('/api/admin/games')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
    expect(db.game.create).not.toHaveBeenCalled();
  });

  it('400 — missing title', async () => {
    const { title: _t, ...payload } = validGamePayload;
    const res = await request(app)
      .post('/api/admin/games')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(payload);

    expect(res.status).toBe(400);
    expect(db.game.create).not.toHaveBeenCalled();
  });

  it('400 — missing image', async () => {
    const { image: _i, ...payload } = validGamePayload;
    const res = await request(app)
      .post('/api/admin/games')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(payload);

    expect(res.status).toBe(400);
    expect(db.game.create).not.toHaveBeenCalled();
  });

  it('400 — missing description', async () => {
    const { description: _d, ...payload } = validGamePayload;
    const res = await request(app)
      .post('/api/admin/games')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(payload);

    expect(res.status).toBe(400);
    expect(db.game.create).not.toHaveBeenCalled();
  });

  it('400 — missing genre', async () => {
    const { genre: _g, ...payload } = validGamePayload;
    const res = await request(app)
      .post('/api/admin/games')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(payload);

    expect(res.status).toBe(400);
    expect(db.game.create).not.toHaveBeenCalled();
  });

  it('400 — missing releaseDate', async () => {
    const { releaseDate: _r, ...payload } = validGamePayload;
    const res = await request(app)
      .post('/api/admin/games')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(payload);

    expect(res.status).toBe(400);
    expect(db.game.create).not.toHaveBeenCalled();
  });

  it('400 — missing developer', async () => {
    const { developer: _d, ...payload } = validGamePayload;
    const res = await request(app)
      .post('/api/admin/games')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(payload);

    expect(res.status).toBe(400);
    expect(db.game.create).not.toHaveBeenCalled();
  });

  it('201 — creates game with all required fields', async () => {
    db.game.create.mockResolvedValue(mockGame);

    const res = await request(app)
      .post('/api/admin/games')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(validGamePayload);

    expect(res.status).toBe(201);
    expect(res.body.id).toBe(1);
    expect(res.body.title).toBe('Test Game');
    expect(res.body.genre).toBe('RPG');
    expect(res.body.price).toBe(29.99);
  });

  it('201 — game.create is called with numeric price', async () => {
    db.game.create.mockResolvedValue(mockGame);

    await request(app)
      .post('/api/admin/games')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(validGamePayload);

    expect(db.game.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          price: expect.any(Number),
          title: 'Test Game',
          genre: 'RPG',
        }),
      }),
    );
  });

  it('201 — creates game with optional rating defaulting to 0', async () => {
    const gameWithZeroRating = { ...mockGame, rating: 0 };
    db.game.create.mockResolvedValue(gameWithZeroRating);

    const res = await request(app)
      .post('/api/admin/games')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(validGamePayload); // no rating field

    expect(res.status).toBe(201);
    expect(db.game.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ rating: 0 }),
      }),
    );
  });

  it('201 — creates game with explicit rating', async () => {
    const gameWithRating = { ...mockGame, rating: 4.5 };
    db.game.create.mockResolvedValue(gameWithRating);

    const res = await request(app)
      .post('/api/admin/games')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ ...validGamePayload, rating: 4.5 });

    expect(res.status).toBe(201);
    expect(db.game.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ rating: 4.5 }),
      }),
    );
  });

  it('500 — unexpected DB error returns 500', async () => {
    db.game.create.mockRejectedValue(new Error('Insert failed'));

    const res = await request(app)
      .post('/api/admin/games')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(validGamePayload);

    expect(res.status).toBe(500);
    expect(res.body.error).toBeDefined();
  });
});

// ─── PUT /api/admin/games/:id ─────────────────────────────────────────────────

describe('PUT /api/admin/games/:id', () => {
  beforeEach(() => jest.clearAllMocks());

  it('200 — updates game title', async () => {
    const updated = { ...mockGame, title: 'Updated Game' };
    db.game.update.mockResolvedValue(updated);

    const res = await request(app)
      .put('/api/admin/games/1')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Updated Game' });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated Game');
  });

  it('200 — updates game price', async () => {
    const updated = { ...mockGame, price: 49.99 };
    db.game.update.mockResolvedValue(updated);

    const res = await request(app)
      .put('/api/admin/games/1')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ price: 49.99 });

    expect(res.status).toBe(200);
    expect(res.body.price).toBe(49.99);
  });

  it('200 — updates game genre', async () => {
    const updated = { ...mockGame, genre: 'Action' };
    db.game.update.mockResolvedValue(updated);

    const res = await request(app)
      .put('/api/admin/games/1')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ genre: 'Action' });

    expect(res.status).toBe(200);
    expect(res.body.genre).toBe('Action');
  });

  it('200 — updates multiple fields at once', async () => {
    const updated = { ...mockGame, title: 'New Title', price: 19.99 };
    db.game.update.mockResolvedValue(updated);

    const res = await request(app)
      .put('/api/admin/games/1')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'New Title', price: 19.99 });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('New Title');
    expect(res.body.price).toBe(19.99);
  });

  it('200 — game.update is called with the correct id', async () => {
    db.game.update.mockResolvedValue(mockGame);

    await request(app)
      .put('/api/admin/games/1')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Updated' });

    expect(db.game.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 1 } }),
    );
  });

  it('500 — unexpected DB error returns 500', async () => {
    db.game.update.mockRejectedValue(new Error('Update failed'));

    const res = await request(app)
      .put('/api/admin/games/1')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Updated' });

    expect(res.status).toBe(500);
    expect(res.body.error).toBeDefined();
  });
});

// ─── DELETE /api/admin/games/:id ──────────────────────────────────────────────

describe('DELETE /api/admin/games/:id', () => {
  beforeEach(() => jest.clearAllMocks());

  it('200 — deletes game and returns { success: true }', async () => {
    db.game.delete.mockResolvedValue(mockGame);

    const res = await request(app)
      .delete('/api/admin/games/1')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('200 — game.delete is called with the correct id', async () => {
    db.game.delete.mockResolvedValue(mockGame);

    await request(app)
      .delete('/api/admin/games/1')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(db.game.delete).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 1 } }),
    );
  });

  it('200 — different game ids are handled correctly', async () => {
    db.game.delete.mockResolvedValue({ ...mockGame, id: 42 });

    const res = await request(app)
      .delete('/api/admin/games/42')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(db.game.delete).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 42 } }),
    );
  });

  it('500 — unexpected DB error returns 500', async () => {
    db.game.delete.mockRejectedValue(new Error('Cannot delete'));

    const res = await request(app)
      .delete('/api/admin/games/1')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(500);
    expect(res.body.error).toBeDefined();
  });
});
