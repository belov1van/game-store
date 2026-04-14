import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../app';
import prisma from '../prisma/client';
import { mockUser } from './helpers';

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

// ─── POST /api/auth/register ──────────────────────────────────────────────────

describe('POST /api/auth/register', () => {
  beforeEach(() => jest.clearAllMocks());

  it('400 — missing all fields', async () => {
    const res = await request(app).post('/api/auth/register').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('400 — missing email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'testuser', password: 'secret123' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('400 — missing password', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'testuser', email: 'test@example.com' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('400 — missing username', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@example.com', password: 'secret123' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('400 — invalid email format', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'testuser', email: 'not-an-email', password: 'secret123' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/email/i);
  });

  it('400 — password shorter than 6 characters', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'testuser', email: 'test@example.com', password: '123' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/password/i);
  });

  it('201 — success: returns token and user without password', async () => {
    db.user.create.mockResolvedValue(mockUser);

    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'testuser', email: 'test@example.com', password: 'secret123' });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(typeof res.body.token).toBe('string');
    expect(res.body.user).toBeDefined();
    expect(res.body.user.username).toBe('testuser');
    expect(res.body.user.email).toBe('test@example.com');
    expect(res.body.user.role).toBe('USER');
    expect(res.body.user.avatar).toBeNull();
    expect(res.body.user).not.toHaveProperty('password');
  });

  it('201 — success: bcrypt.hash is called with the plain password', async () => {
    db.user.create.mockResolvedValue(mockUser);

    await request(app)
      .post('/api/auth/register')
      .send({ username: 'testuser', email: 'test@example.com', password: 'secret123' });

    expect(bcryptMock.hash).toHaveBeenCalledWith('secret123', 10);
  });

  it('409 — duplicate username or email (Prisma P2002)', async () => {
    const err: any = new Error('Unique constraint failed');
    err.code = 'P2002';
    db.user.create.mockRejectedValue(err);

    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'testuser', email: 'test@example.com', password: 'secret123' });

    expect(res.status).toBe(409);
    expect(res.body.error).toBeDefined();
  });

  it('500 — unexpected error returns 500', async () => {
    db.user.create.mockRejectedValue(new Error('DB is down'));

    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'testuser', email: 'test@example.com', password: 'secret123' });

    expect(res.status).toBe(500);
    expect(res.body.error).toBeDefined();
  });
});

// ─── POST /api/auth/login ─────────────────────────────────────────────────────

describe('POST /api/auth/login', () => {
  beforeEach(() => jest.clearAllMocks());

  it('400 — missing both fields', async () => {
    const res = await request(app).post('/api/auth/login').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('400 — missing password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ login: 'testuser' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('400 — missing login', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ password: 'secret123' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('401 — user not found', async () => {
    db.user.findFirst.mockResolvedValue(null);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ login: 'nobody', password: 'pass' });

    expect(res.status).toBe(401);
    expect(res.body.error).toBeDefined();
    expect(bcryptMock.compare).not.toHaveBeenCalled();
  });

  it('401 — wrong password', async () => {
    db.user.findFirst.mockResolvedValue(mockUser);
    bcryptMock.compare.mockResolvedValue(false);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ login: 'testuser', password: 'wrongpass' });

    expect(res.status).toBe(401);
    expect(res.body.error).toBeDefined();
  });

  it('200 — success by username: returns token and user without password', async () => {
    db.user.findFirst.mockResolvedValue(mockUser);
    bcryptMock.compare.mockResolvedValue(true);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ login: 'testuser', password: 'secret123' });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(typeof res.body.token).toBe('string');
    expect(res.body.user).toBeDefined();
    expect(res.body.user.username).toBe('testuser');
    expect(res.body.user.role).toBe('USER');
    expect(res.body.user.avatar).toBeNull();
    expect(res.body.user).not.toHaveProperty('password');
  });

  it('200 — success by email', async () => {
    db.user.findFirst.mockResolvedValue(mockUser);
    bcryptMock.compare.mockResolvedValue(true);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ login: 'test@example.com', password: 'secret123' });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('test@example.com');
  });

  it('200 — findFirst is called with OR clause covering username and email', async () => {
    db.user.findFirst.mockResolvedValue(mockUser);
    bcryptMock.compare.mockResolvedValue(true);

    await request(app)
      .post('/api/auth/login')
      .send({ login: 'testuser', password: 'secret123' });

    expect(db.user.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: expect.arrayContaining([
            expect.objectContaining({ username: 'testuser' }),
            expect.objectContaining({ email: 'testuser' }),
          ]),
        }),
      }),
    );
  });

  it('500 — unexpected error returns 500', async () => {
    db.user.findFirst.mockRejectedValue(new Error('DB is down'));

    const res = await request(app)
      .post('/api/auth/login')
      .send({ login: 'testuser', password: 'secret123' });

    expect(res.status).toBe(500);
    expect(res.body.error).toBeDefined();
  });
});
