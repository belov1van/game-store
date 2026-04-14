import { Router, Request, Response } from 'express';
import prisma from '../prisma/client';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

// GET /api/users/me
router.get('/me', async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const orders = await prisma.order.findMany({
      where: { userId: req.userId },
      include: { items: true },
    });

    const gamesOwned = new Set(orders.flatMap(o => o.items.map(i => i.gameId))).size;
    const ordersCount = orders.length;

    res.json({ ...user, gamesOwned, ordersCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/users/me
router.put('/me', async (req: Request, res: Response) => {
  try {
    const { username, email } = req.body as { username?: string; email?: string };

    const data: { username?: string; email?: string } = {};
    if (username !== undefined) data.username = username;
    if (email !== undefined) data.email = email;

    const user = await prisma.user.update({
      where: { id: req.userId },
      data,
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
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

// GET /api/users/me/orders
router.get('/me/orders', async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.userId },
      include: {
        items: {
          include: { game: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
