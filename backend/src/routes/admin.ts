import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../prisma/client';
import { authenticate } from '../middleware/auth';
import { requireAdmin } from '../middleware/admin';

const router = Router();
router.use(authenticate, requireAdmin);

// ─── Users ────────────────────────────────────────────────────────

// GET /api/admin/users
router.get('/users', async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, username: true, email: true, role: true, avatar: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/admin/users
router.post('/users', async (req: Request, res: Response) => {
  try {
    const { username, email, password, role } = req.body as {
      username: string; email: string; password: string; role?: string;
    };
    if (!username || !email || !password) {
      res.status(400).json({ error: 'username, email and password are required' });
      return;
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashed,
        role: role === 'ADMIN' ? 'ADMIN' : 'USER',
      },
      select: { id: true, username: true, email: true, role: true, avatar: true, createdAt: true },
    });
    res.status(201).json(user);
  } catch (error) {
    if ((error as any).code === 'P2002') {
      res.status(409).json({ error: 'Username or email already exists' });
      return;
    }
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/admin/users/:id
router.put('/users/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params['id']), 10);
    const { username, email, role } = req.body as {
      username?: string; email?: string; role?: string;
    };
    const data: Record<string, unknown> = {};
    if (username !== undefined) data['username'] = username;
    if (email !== undefined) data['email'] = email;
    if (role === 'ADMIN' || role === 'USER') data['role'] = role;

    const user = await prisma.user.update({
      where: { id },
      data,
      select: { id: true, username: true, email: true, role: true, avatar: true, createdAt: true },
    });
    res.json(user);
  } catch (error) {
    if ((error as any).code === 'P2002') {
      res.status(409).json({ error: 'Username or email already taken' });
      return;
    }
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params['id']), 10);
    // Prevent deleting self
    if (id === req.userId) {
      res.status(400).json({ error: 'Cannot delete your own account' });
      return;
    }
    await prisma.user.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── Games ────────────────────────────────────────────────────────

// GET /api/admin/games
router.get('/games', async (_req: Request, res: Response) => {
  try {
    const games = await prisma.game.findMany({ orderBy: { id: 'asc' } });
    res.json(games);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/admin/games
router.post('/games', async (req: Request, res: Response) => {
  try {
    const { title, image, price, rating, description, genre, releaseDate, developer } = req.body as {
      title: string; image: string; price: number; rating?: number;
      description: string; genre: string; releaseDate: string; developer: string;
    };
    if (!title || !image || price === undefined || !description || !genre || !releaseDate || !developer) {
      res.status(400).json({ error: 'All fields are required' });
      return;
    }
    const game = await prisma.game.create({
      data: { title, image, price: Number(price), rating: Number(rating ?? 0), description, genre, releaseDate, developer },
    });
    res.status(201).json(game);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/admin/games/:id
router.put('/games/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params['id']), 10);
    const { title, image, price, rating, description, genre, releaseDate, developer } = req.body as {
      title?: string; image?: string; price?: number; rating?: number;
      description?: string; genre?: string; releaseDate?: string; developer?: string;
    };
    const data: Record<string, unknown> = {};
    if (title !== undefined) data['title'] = title;
    if (image !== undefined) data['image'] = image;
    if (price !== undefined) data['price'] = Number(price);
    if (rating !== undefined) data['rating'] = Number(rating);
    if (description !== undefined) data['description'] = description;
    if (genre !== undefined) data['genre'] = genre;
    if (releaseDate !== undefined) data['releaseDate'] = releaseDate;
    if (developer !== undefined) data['developer'] = developer;

    const game = await prisma.game.update({ where: { id }, data });
    res.json(game);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/admin/games/:id
router.delete('/games/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params['id']), 10);
    await prisma.game.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
