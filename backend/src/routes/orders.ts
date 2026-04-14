import { Router, Request, Response } from 'express';
import prisma from '../prisma/client';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/', async (req: Request, res: Response) => {
  try {
    const { items } = req.body as { items: Array<{ gameId: number; quantity: number }> };

    if (!Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: 'Items must be a non-empty array' });
      return;
    }

    for (const item of items) {
      if (typeof item.gameId !== 'number' || typeof item.quantity !== 'number' || item.quantity < 1) {
        res.status(400).json({ error: 'Each item must have a valid gameId and quantity >= 1' });
        return;
      }
    }

    const validatedItems: Array<{ gameId: number; quantity: number; price: number }> = [];

    for (const item of items) {
      const game = await prisma.game.findUnique({
        where: { id: item.gameId },
      });

      if (!game) {
        res.status(404).json({ error: `Game with id ${item.gameId} not found` });
        return;
      }

      validatedItems.push({
        gameId: item.gameId,
        quantity: item.quantity,
        price: game.price,
      });
    }

    const total = validatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = await prisma.order.create({
      data: {
        userId: req.userId!,
        total,
        items: {
          create: validatedItems.map(item => ({
            gameId: item.gameId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: {
          include: { game: true },
        },
      },
    });

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
