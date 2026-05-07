import { Router, Request, Response } from "express";
import prisma from "../prisma/client";
import { authenticate } from "../middleware/auth";
import { randomInt } from "crypto";

/**
 * Generate a user-friendly 20-char code excluding ambiguous characters (0,1,O,I,l).
 * Uses crypto-grade randomness.
 */
function generateCode(length = 20) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  let out = "";
  for (let i = 0; i < length; i++) {
    out += chars[randomInt(0, chars.length)];
  }
  return out;
}
const router = Router();

router.use(authenticate);

router.post("/", async (req: Request, res: Response) => {
  try {
    const { items } = req.body as {
      items: Array<{ gameId: number; quantity: number }>;
    };

    if (!Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: "Items must be a non-empty array" });
      return;
    }

    for (const item of items) {
      if (
        typeof item.gameId !== "number" ||
        typeof item.quantity !== "number" ||
        item.quantity < 1
      ) {
        res.status(400).json({
          error: "Each item must have a valid gameId and quantity >= 1",
        });
        return;
      }
    }

    const validatedItems: Array<{
      gameId: number;
      quantity: number;
      price: number;
    }> = [];

    for (const item of items) {
      const game = await prisma.game.findUnique({
        where: { id: item.gameId },
      });

      if (!game) {
        res
          .status(404)
          .json({ error: `Game with id ${item.gameId} not found` });
        return;
      }

      validatedItems.push({
        gameId: item.gameId,
        quantity: item.quantity,
        price: game.price,
      });
    }

    const total = validatedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const order = await prisma.order.create({
      data: {
        userId: req.userId!,
        total,
      },
      select: {
        id: true,
        createdAt: true,
        userId: true,
        total: true,
      },
    });

    // Create order items via createMany
    await prisma.orderItem.createMany({
      data: validatedItems.map((item) => ({
        orderId: order.id,
        gameId: item.gameId,
        quantity: item.quantity,
        price: item.price,
        code: generateCode(20),
      })),
    });

    // Codes are assigned during createMany above

    const updatedOrder = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        items: {
          include: { game: true },
        },
      },
    });

    res.status(201).json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
