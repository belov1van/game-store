import { Router, Request, Response } from "express";
import prisma from "../prisma/client";

const router = Router();

// GET /api/games
router.get("/", async (req: Request, res: Response) => {
  try {
    const {
      search,
      genre,
      page = "1",
      limit = "12",
    } = req.query as Record<string, string>;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 12));
    const skip = (pageNum - 1) * limitNum;

    const where: Record<string, unknown> = {};

    if (search) {
      where.title = { contains: search, mode: "insensitive" };
    }

    if (genre) {
      where.genre = { equals: genre, mode: "insensitive" };
    }

    const [games, total] = await Promise.all([
      prisma.game.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: "desc" },
      }),
      prisma.game.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.json({
      games,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/games/genres
router.get("/genres", async (_req: Request, res: Response) => {
  try {
    const rows = await prisma.game.findMany({
      select: { genre: true },
      distinct: ["genre"],
      orderBy: { genre: "asc" },
    });
    res.json(rows.map((r) => r.genre));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/games/:id
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params["id"]), 10);

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid game id" });
      return;
    }

    const game = await prisma.game.findUnique({
      where: { id },
    });

    if (!game) {
      res.status(404).json({ error: "Game not found" });
      return;
    }

    res.json(game);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
