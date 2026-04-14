import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prisma/client";

const router = Router();

const generateToken = (userId: number, role: string): string => {
  const secret = process.env.JWT_SECRET ?? "fallback_secret";
  return jwt.sign({ userId, role }, secret, { expiresIn: "7d" });
};

// POST /api/auth/register
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ error: "Invalid email format" });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: "Password must be at least 6 characters" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    const token = generateToken(user.id, user.role);

    res.status(201).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar ?? null,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    if ((error as any).code === "P2002") {
      res.status(409).json({ error: "Username or email already exists" });
      return;
    }
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/auth/login
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { login, password } = req.body;

    if (!login || !password) {
      res.status(400).json({ error: "Login and password are required" });
      return;
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ username: login }, { email: login }],
      },
    });

    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = generateToken(user.id, user.role);

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar ?? null,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
