import jwt from 'jsonwebtoken';

const TEST_SECRET = 'fallback_secret';

/** Generate a signed JWT for testing */
export const makeToken = (userId: number, role: 'USER' | 'ADMIN' = 'USER'): string =>
  jwt.sign({ userId, role }, TEST_SECRET, { expiresIn: '1h' });

/** Canonical mock objects — reused across test files */

export const mockUser = {
  id: 1,
  username: 'testuser',
  email: 'test@example.com',
  password: '$2a$10$hashedpassword',
  role: 'USER' as const,
  avatar: null,
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
  updatedAt: new Date('2024-01-01T00:00:00.000Z'),
};

export const mockAdmin = {
  id: 2,
  username: 'admin',
  email: 'admin@example.com',
  password: '$2a$10$hashedpassword',
  role: 'ADMIN' as const,
  avatar: null,
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
  updatedAt: new Date('2024-01-01T00:00:00.000Z'),
};

export const mockGame = {
  id: 1,
  title: 'Test Game',
  image: 'https://example.com/game.jpg',
  price: 29.99,
  rating: 4.5,
  description: 'A great test game',
  genre: 'RPG',
  releaseDate: '2024-01-01',
  developer: 'Test Dev',
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
  updatedAt: new Date('2024-01-01T00:00:00.000Z'),
};

export const mockOrder = {
  id: 1,
  userId: 1,
  total: 29.99,
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
  items: [
    {
      id: 1,
      orderId: 1,
      gameId: 1,
      quantity: 1,
      price: 29.99,
      game: mockGame,
    },
  ],
};

/** Reusable Prisma mock factory — call once per test file */
export const createPrismaMock = () => ({
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
});
