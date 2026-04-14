import request from 'supertest';
import app from '../app';
import prisma from '../prisma/client';
import { makeToken, mockUser, mockAdmin, mockOrder, mockGame } from './helpers';

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

const db = prisma as any;

/**
 * What the route actually returns from prisma.user.findUnique with `select`
 * (no password field — mirrors the real DB layer).
 */
const mockUserProfile = {
  id: mockUser.id,
  username: mockUser.username,
  email: mockUser.email,
  role: mockUser.role,
  avatar: mockUser.avatar,
  createdAt: mockUser.createdAt,
  updatedAt: mockUser.updatedAt,
};

// ─── GET /api/users/me ────────────────────────────────────────────────────────

describe('GET /api/users/me', () => {
  beforeEach(() => jest.clearAllMocks());

  it('401 — no token provided', async () => {
    const res = await request(app).get('/api/users/me');
    expect(res.status).toBe(401);
    expect(res.body.error).toBeDefined();
  });

  it('401 — malformed Bearer token', async () => {
    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', 'Bearer this.is.garbage');
    expect(res.status).toBe(401);
  });

  it('200 — returns profile with gamesOwned and ordersCount', async () => {
    db.user.findUnique.mockResolvedValue(mockUserProfile);
    db.order.findMany.mockResolvedValue([mockOrder]);

    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${makeToken(1)}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(1);
    expect(res.body.username).toBe('testuser');
    expect(res.body.email).toBe('test@example.com');
    expect(res.body.role).toBe('USER');
    // 1 unique gameId across all order items
    expect(res.body.gamesOwned).toBe(1);
    expect(res.body.ordersCount).toBe(1);
  });

  it('200 — does not expose the password field', async () => {
    db.user.findUnique.mockResolvedValue(mockUserProfile);
    db.order.findMany.mockResolvedValue([mockOrder]);

    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${makeToken(1)}`);

    expect(res.status).toBe(200);
    expect(res.body).not.toHaveProperty('password');
  });

  it('200 — gamesOwned counts unique gameIds across multiple orders', async () => {
    const game2 = { ...mockGame, id: 2 };
    const order2 = {
      id: 2,
      userId: 1,
      total: 59.98,
      createdAt: new Date('2024-02-01'),
      items: [
        { id: 2, orderId: 2, gameId: 1, quantity: 1, price: 29.99, game: mockGame },
        { id: 3, orderId: 2, gameId: 2, quantity: 1, price: 29.99, game: game2 },
      ],
    };
    db.user.findUnique.mockResolvedValue(mockUserProfile);
    db.order.findMany.mockResolvedValue([mockOrder, order2]);

    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${makeToken(1)}`);

    expect(res.status).toBe(200);
    // mockOrder has gameId=1; order2 has gameId=1 and gameId=2 → unique set = {1, 2}
    expect(res.body.gamesOwned).toBe(2);
    expect(res.body.ordersCount).toBe(2);
  });

  it('200 — gamesOwned and ordersCount are 0 when user has no orders', async () => {
    db.user.findUnique.mockResolvedValue(mockUserProfile);
    db.order.findMany.mockResolvedValue([]);

    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${makeToken(1)}`);

    expect(res.status).toBe(200);
    expect(res.body.gamesOwned).toBe(0);
    expect(res.body.ordersCount).toBe(0);
  });

  it('404 — user not found in database', async () => {
    db.user.findUnique.mockResolvedValue(null);
    db.order.findMany.mockResolvedValue([]);

    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${makeToken(1)}`);

    expect(res.status).toBe(404);
    expect(res.body.error).toBeDefined();
  });

  it('200 — findUnique is called with the userId from the token', async () => {
    db.user.findUnique.mockResolvedValue(mockUserProfile);
    db.order.findMany.mockResolvedValue([]);

    await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${makeToken(1)}`);

    expect(db.user.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 1 } }),
    );
  });

  it('200 — order.findMany is called with the userId from the token', async () => {
    db.user.findUnique.mockResolvedValue(mockUserProfile);
    db.order.findMany.mockResolvedValue([]);

    await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${makeToken(1)}`);

    expect(db.order.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: 1 } }),
    );
  });

  it('200 — works with ADMIN token as well', async () => {
    const adminProfile = {
      id: mockAdmin.id,
      username: mockAdmin.username,
      email: mockAdmin.email,
      role: mockAdmin.role,
      avatar: mockAdmin.avatar,
      createdAt: mockAdmin.createdAt,
      updatedAt: mockAdmin.updatedAt,
    };
    db.user.findUnique.mockResolvedValue(adminProfile);
    db.order.findMany.mockResolvedValue([]);

    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${makeToken(2, 'ADMIN')}`);

    expect(res.status).toBe(200);
    expect(res.body.role).toBe('ADMIN');
  });
});

// ─── PUT /api/users/me ────────────────────────────────────────────────────────

describe('PUT /api/users/me', () => {
  beforeEach(() => jest.clearAllMocks());

  it('401 — no token provided', async () => {
    const res = await request(app)
      .put('/api/users/me')
      .send({ username: 'newname' });
    expect(res.status).toBe(401);
    expect(res.body.error).toBeDefined();
  });

  it('200 — updates username successfully', async () => {
    const updatedProfile = { ...mockUserProfile, username: 'updateduser' };
    db.user.update.mockResolvedValue(updatedProfile);

    const res = await request(app)
      .put('/api/users/me')
      .set('Authorization', `Bearer ${makeToken(1)}`)
      .send({ username: 'updateduser' });

    expect(res.status).toBe(200);
    expect(res.body.username).toBe('updateduser');
  });

  it('200 — updates email successfully', async () => {
    const updatedProfile = { ...mockUserProfile, email: 'new@example.com' };
    db.user.update.mockResolvedValue(updatedProfile);

    const res = await request(app)
      .put('/api/users/me')
      .set('Authorization', `Bearer ${makeToken(1)}`)
      .send({ email: 'new@example.com' });

    expect(res.status).toBe(200);
    expect(res.body.email).toBe('new@example.com');
  });

  it('200 — updates both username and email at once', async () => {
    const updatedProfile = {
      ...mockUserProfile,
      username: 'brandnew',
      email: 'brand@new.com',
    };
    db.user.update.mockResolvedValue(updatedProfile);

    const res = await request(app)
      .put('/api/users/me')
      .set('Authorization', `Bearer ${makeToken(1)}`)
      .send({ username: 'brandnew', email: 'brand@new.com' });

    expect(res.status).toBe(200);
    expect(res.body.username).toBe('brandnew');
    expect(res.body.email).toBe('brand@new.com');
  });

  it('200 — does not expose the password field in the response', async () => {
    db.user.update.mockResolvedValue(mockUserProfile);

    const res = await request(app)
      .put('/api/users/me')
      .set('Authorization', `Bearer ${makeToken(1)}`)
      .send({ username: 'updateduser' });

    expect(res.status).toBe(200);
    expect(res.body).not.toHaveProperty('password');
  });

  it('200 — user.update is called with the userId from the token', async () => {
    db.user.update.mockResolvedValue(mockUserProfile);

    await request(app)
      .put('/api/users/me')
      .set('Authorization', `Bearer ${makeToken(1)}`)
      .send({ username: 'someone' });

    expect(db.user.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 1 } }),
    );
  });

  it('409 — returns 409 on duplicate username or email (P2002)', async () => {
    const err: any = new Error('Unique constraint failed');
    err.code = 'P2002';
    db.user.update.mockRejectedValue(err);

    const res = await request(app)
      .put('/api/users/me')
      .set('Authorization', `Bearer ${makeToken(1)}`)
      .send({ username: 'existinguser' });

    expect(res.status).toBe(409);
    expect(res.body.error).toBeDefined();
  });

  it('500 — unexpected error returns 500', async () => {
    db.user.update.mockRejectedValue(new Error('DB exploded'));

    const res = await request(app)
      .put('/api/users/me')
      .set('Authorization', `Bearer ${makeToken(1)}`)
      .send({ username: 'someone' });

    expect(res.status).toBe(500);
    expect(res.body.error).toBeDefined();
  });
});

// ─── GET /api/users/me/orders ─────────────────────────────────────────────────

describe('GET /api/users/me/orders', () => {
  beforeEach(() => jest.clearAllMocks());

  it('401 — no token provided', async () => {
    const res = await request(app).get('/api/users/me/orders');
    expect(res.status).toBe(401);
    expect(res.body.error).toBeDefined();
  });

  it('200 — returns array of orders', async () => {
    db.order.findMany.mockResolvedValue([mockOrder]);

    const res = await request(app)
      .get('/api/users/me/orders')
      .set('Authorization', `Bearer ${makeToken(1)}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].id).toBe(1);
    expect(res.body[0].total).toBe(29.99);
  });

  it('200 — each order contains items with nested game', async () => {
    db.order.findMany.mockResolvedValue([mockOrder]);

    const res = await request(app)
      .get('/api/users/me/orders')
      .set('Authorization', `Bearer ${makeToken(1)}`);

    expect(res.status).toBe(200);
    expect(res.body[0].items).toHaveLength(1);
    expect(res.body[0].items[0].game).toBeDefined();
    expect(res.body[0].items[0].game.title).toBe('Test Game');
  });

  it('200 — returns empty array when user has no orders', async () => {
    db.order.findMany.mockResolvedValue([]);

    const res = await request(app)
      .get('/api/users/me/orders')
      .set('Authorization', `Bearer ${makeToken(1)}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(0);
  });

  it('200 — order.findMany is called with the userId from the token', async () => {
    db.order.findMany.mockResolvedValue([]);

    await request(app)
      .get('/api/users/me/orders')
      .set('Authorization', `Bearer ${makeToken(1)}`);

    expect(db.order.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: 1 } }),
    );
  });

  it('200 — returns multiple orders sorted newest-first', async () => {
    const olderOrder = {
      ...mockOrder,
      id: 2,
      createdAt: new Date('2024-01-02'),
      items: [],
    };
    // The route orders by createdAt desc; we just verify both are returned
    db.order.findMany.mockResolvedValue([olderOrder, mockOrder]);

    const res = await request(app)
      .get('/api/users/me/orders')
      .set('Authorization', `Bearer ${makeToken(1)}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);

    expect(db.order.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: { createdAt: 'desc' },
      }),
    );
  });

  it('500 — unexpected error returns 500', async () => {
    db.order.findMany.mockRejectedValue(new Error('DB error'));

    const res = await request(app)
      .get('/api/users/me/orders')
      .set('Authorization', `Bearer ${makeToken(1)}`);

    expect(res.status).toBe(500);
    expect(res.body.error).toBeDefined();
  });
});
