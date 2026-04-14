import { Router, Request, Response } from "express";
import multer from "multer";
import path from "path";
import prisma from "../prisma/client";
import { authenticate } from "../middleware/auth";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) =>
    cb(null, path.join(process.cwd(), "uploads")),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `avatar-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    cb(null, file.mimetype.startsWith("image/"));
  },
});

const router = Router();

router.use(authenticate);

// GET /api/users/me
router.get("/me", async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const orders = await prisma.order.findMany({
      where: { userId: req.userId },
      include: { items: true },
    });

    const gamesOwned = new Set(
      orders.flatMap((o) => o.items.map((i) => i.gameId)),
    ).size;
    const ordersCount = orders.length;

    res.json({ ...user, gamesOwned, ordersCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/users/me
router.put("/me", async (req: Request, res: Response) => {
  try {
    const { username, email } = req.body as {
      username?: string;
      email?: string;
    };

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
        role: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json(user);
  } catch (error) {
    if ((error as any).code === "P2002") {
      res.status(409).json({ error: "Username or email already taken" });
      return;
    }
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/users/me/avatar
router.post(
  "/me/avatar",
  upload.single("avatar"),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        res.status(400).json({ error: "No file provided" });
        return;
      }
      const avatarUrl = `/api/uploads/${req.file.filename}`;
      const user = await prisma.user.update({
        where: { id: req.userId },
        data: { avatar: avatarUrl },
        select: { id: true, avatar: true },
      });
      res.json({ avatarUrl: user.avatar });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// GET /api/users/me/orders
router.get("/me/orders", async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.userId },
      include: {
        items: {
          include: { game: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
