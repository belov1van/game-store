import request from 'supertest';
import app from '../app';
import prisma from '../prisma/client';
import { makeToken, mockGame, mockOrder } from './helpers';

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

// ─── POST /api/orders ─────────────────────────────────────────────────────────

describe('POST /api/orders', () => {
  beforeEach(() => jest.clearAllMocks());

  // ── Auth guard ──────────────────────────────────────────────────────────────

  it('401 — no token provided', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({ items: [{ gameId: 1, quantity: 1 }] });

    expect(res.status).toBe(401);
    expect(res.body.error).toBeDefined();
    expect(db.order.create).not.toHaveBeenCalled();
  });

  it('401 — malformed Bearer token', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', 'Bearer not.a.valid.jwt')
      .send({ items: [{ gameId: 1, quantity: 1 }] });

    expect(res.status).toBe(401);
    expect(db.order.create).not.toHaveBeenCalled();
  });

  // ── Input validation ────────────────────────────────────────────────────────

  it('400 — items field is missing entirely', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${makeToken(1)}`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
    expect(db.game.findUnique).not.toHaveBeenCalled();
  });

  it('400 — items is a string, not an array', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${makeToken(1)}`)
      .send({ items: 'not-an-array' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
    expect(db.game.findUnique).not.toHaveBeenCalled();
  });

  it('400 — items is null', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${makeToken(1)}`)
      .send({ items: null });

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('400 — items is an empty array', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${makeToken(1)}`)
      .send({ items: [] });

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
    expect(db.game.findUnique).not.toHaveBeenCalled();
  });

  it('400 — item has a non-numeric gameId', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${makeToken(1)}`)
      .send({ items: [{ gameId: 'bad', quantity: 1 }] });

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
    expect(db.game.findUnique).not.toHaveBeenCalled();
  });

  it('400 — item has quantity of 0', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${makeToken(1)}`)
      .send({ items: [{ gameId: 1, quantity: 0 }] });

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
    expect(db.game.findUnique).not.toHaveBeenCalled();
  });

  it('400 — item has a negative quantity', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${makeToken(1)}`)
      .send({ items: [{ gameId: 1, quantity: -5 }] });

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
    expect(db.game.findUnique).not.toHaveBeenCalled();
  });

  it('400 — item has both invalid gameId and invalid quantity', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${makeToken(1)}`)
      .send({ items: [{ gameId: null, quantity: 'many' }] });

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  // ── Game look-up ────────────────────────────────────────────────────────────

  it('404 — game not found for a given gameId', async () => {
    db.game.findUnique.mockResolvedValue(null);

    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${makeToken(1)}`)
      .send({ items: [{ gameId: 999, quantity: 1 }] });

    expect(res.status).toBe(404);
    expect(res.body.error).toBeDefined();
    expect(db.game.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 999 } }),
    );
    expect(db.order.create).not.toHaveBeenCalled();
  });

  it('404 — stops at first missing game in a multi-item order', async () => {
    // first game exists, second does not
    db.game.findUnique
      .mockResolvedValueOnce(mockGame)
      .mockResolvedValueOnce(null);

    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${makeToken(1)}`)
      .send({ items: [{ gameId: 1, quantity: 1 }, { gameId: 42, quantity: 2 }] });

    expect(res.status).toBe(404);
    expect(db.order.create).not.toHaveBeenCalled();
  });

  // ── Successful creation ─────────────────────────────────────────────────────

  it('201 — creates order and returns it with items and nested game', async () => {
    db.game.findUnique.mockResolvedValue(mockGame);
    db.order.create.mockResolvedValue(mockOrder);

    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${makeToken(1)}`)
      .send({ items: [{ gameId: 1, quantity: 1 }] });

    expect(res.status).toBe(201);
    expect(res.body.id).toBe(1);
    expect(res.body.total).toBe(29.99);
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.items).toHaveLength(1);
    expect(res.body.items[0].game).toBeDefined();
    expect(res.body.items[0].game.title).toBe('Test Game');
  });

  it('201 — order.create is called with the userId from the JWT', async () => {
    db.game.findUnique.mockResolvedValue(mockGame);
    db.order.create.mockResolvedValue(mockOrder);

    await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${makeToken(1)}`)
      .send({ items: [{ gameId: 1, quantity: 1 }] });

    expect(db.order.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ userId: 1 }),
      }),
    );
  });

  it('201 — order.create includes total calculated from game price × quantity', async () => {
    db.game.findUnique.mockResolvedValue(mockGame); // price = 29.99
    db.order.create.mockResolvedValue(mockOrder);

    await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${makeToken(1)}`)
      .send({ items: [{ gameId: 1, quantity: 1 }] });

    expect(db.order.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ total: 29.99 }),
      }),
    );
  });

  it('201 — order.create total reflects quantity multiplier', async () => {
    db.game.findUnique.mockResolvedValue(mockGame); // price = 29.99
    const multiItemOrder = {
      ...mockOrder,
      total: 59.98,
      items: [
        { id: 1, orderId: 1, gameId: 1, quantity: 2, price: 29.99, game: mockGame },
      ],
    };
    db.order.create.mockResolvedValue(multiItemOrder);

    await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${makeToken(1)}`)
      .send({ items: [{ gameId: 1, quantity: 2 }] });

    expect(db.order.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ total: 59.98 }),
      }),
    );
  });

  it('201 — game.findUnique is called once per item', async () => {
    const game2 = { ...mockGame, id: 2, price: 9.99 };
    const multiOrder = {
      ...mockOrder,
      total: 39.98,
      items: [
        { id: 1, orderId: 1, gameId: 1, quantity: 1, price: 29.99, game: mockGame },
        { id: 2, orderId: 1, gameId: 2, quantity: 1, price: 9.99, game: game2 },
      ],
    };
    db.game.findUnique
      .mockResolvedValueOnce(mockGame)
      .mockResolvedValueOnce(game2);
    db.order.create.mockResolvedValue(multiOrder);

    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${makeToken(1)}`)
      .send({ items: [{ gameId: 1, quantity: 1 }, { gameId: 2, quantity: 1 }] });

    expect(res.status).toBe(201);
    expect(db.game.findUnique).toHaveBeenCalledTimes(2);
  });

  it('201 — order includes the include clause for items.game', async () => {
    db.game.findUnique.mockResolvedValue(mockGame);
    db.order.create.mockResolvedValue(mockOrder);

    await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${makeToken(1)}`)
      .send({ items: [{ gameId: 1, quantity: 1 }] });

    expect(db.order.create).toHaveBeenCalledWith(
      expect.objectContaining({
        include: expect.objectContaining({
          items: expect.objectContaining({
            include: expect.objectContaining({ game: true }),
          }),
        }),
      }),
    );
  });

  // ── Error handling ──────────────────────────────────────────────────────────

  it('500 — unexpected DB error during game lookup returns 500', async () => {
    db.game.findUnique.mockRejectedValue(new Error('DB is on fire'));

    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${makeToken(1)}`)
      .send({ items: [{ gameId: 1, quantity: 1 }] });

    expect(res.status).toBe(500);
    expect(res.body.error).toBeDefined();
  });

  it('500 — unexpected DB error during order creation returns 500', async () => {
    db.game.findUnique.mockResolvedValue(mockGame);
    db.order.create.mockRejectedValue(new Error('Insert failed'));

    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${makeToken(1)}`)
      .send({ items: [{ gameId: 1, quantity: 1 }] });

    expect(res.status).toBe(500);
    expect(res.body.error).toBeDefined();
  });
});
