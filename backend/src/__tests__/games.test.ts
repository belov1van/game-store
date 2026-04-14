import request from "supertest";
import app from "../app";
import prisma from "../prisma/client";
import { mockGame } from "./helpers";

jest.mock("../prisma/client", () => ({
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

// ─── GET /api/games ───────────────────────────────────────────────────────────

describe("GET /api/games", () => {
  beforeEach(() => jest.clearAllMocks());

  it("200 — returns correct structure: games, total, page, limit, totalPages", async () => {
    db.game.findMany.mockResolvedValue([mockGame]);
    db.game.count.mockResolvedValue(1);

    const res = await request(app).get("/api/games");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("games");
    expect(res.body).toHaveProperty("total");
    expect(res.body).toHaveProperty("page");
    expect(res.body).toHaveProperty("limit");
    expect(res.body).toHaveProperty("totalPages");
    expect(Array.isArray(res.body.games)).toBe(true);
    expect(res.body.games).toHaveLength(1);
    expect(res.body.games[0].title).toBe("Test Game");
    expect(res.body.total).toBe(1);
    expect(res.body.page).toBe(1);
    expect(res.body.limit).toBe(12);
    expect(res.body.totalPages).toBe(1);
  });

  it("200 — returns empty games array when none exist", async () => {
    db.game.findMany.mockResolvedValue([]);
    db.game.count.mockResolvedValue(0);

    const res = await request(app).get("/api/games");

    expect(res.status).toBe(200);
    expect(res.body.games).toEqual([]);
    expect(res.body.total).toBe(0);
    expect(res.body.totalPages).toBe(0);
  });

  it("200 — ?search=Test passes title filter to findMany", async () => {
    db.game.findMany.mockResolvedValue([mockGame]);
    db.game.count.mockResolvedValue(1);

    const res = await request(app).get("/api/games?search=Test");

    expect(res.status).toBe(200);
    expect(db.game.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          title: expect.objectContaining({ contains: "Test" }),
        }),
      }),
    );
    expect(db.game.count).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          title: expect.objectContaining({ contains: "Test" }),
        }),
      }),
    );
  });

  it("200 — ?genre=RPG passes genre filter to findMany", async () => {
    db.game.findMany.mockResolvedValue([mockGame]);
    db.game.count.mockResolvedValue(1);

    const res = await request(app).get("/api/games?genre=RPG");

    expect(res.status).toBe(200);
    expect(db.game.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          genre: expect.objectContaining({ equals: "RPG" }),
        }),
      }),
    );
  });

  it("200 — ?search and ?genre can be combined", async () => {
    db.game.findMany.mockResolvedValue([mockGame]);
    db.game.count.mockResolvedValue(1);

    const res = await request(app).get("/api/games?search=Test&genre=RPG");

    expect(res.status).toBe(200);
    expect(db.game.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          title: expect.objectContaining({ contains: "Test" }),
          genre: expect.objectContaining({ equals: "RPG" }),
        }),
      }),
    );
  });

  it("200 — ?page=2&limit=5 results in skip=5 and take=5", async () => {
    db.game.findMany.mockResolvedValue([]);
    db.game.count.mockResolvedValue(10);

    const res = await request(app).get("/api/games?page=2&limit=5");

    expect(res.status).toBe(200);
    expect(res.body.page).toBe(2);
    expect(res.body.limit).toBe(5);
    expect(res.body.totalPages).toBe(2);
    expect(db.game.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 5,
        take: 5,
      }),
    );
  });

  it("200 — page=1&limit=3 results in skip=0 and take=3", async () => {
    db.game.findMany.mockResolvedValue([mockGame]);
    db.game.count.mockResolvedValue(3);

    const res = await request(app).get("/api/games?page=1&limit=3");

    expect(res.status).toBe(200);
    expect(res.body.page).toBe(1);
    expect(res.body.limit).toBe(3);
    expect(db.game.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 0,
        take: 3,
      }),
    );
  });

  it("200 — totalPages is calculated correctly for 10 items, limit 3", async () => {
    db.game.findMany.mockResolvedValue([mockGame]);
    db.game.count.mockResolvedValue(10);

    const res = await request(app).get("/api/games?limit=3");

    expect(res.status).toBe(200);
    expect(res.body.totalPages).toBe(4); // ceil(10/3)
  });

  it("200 — result is ordered by createdAt desc", async () => {
    db.game.findMany.mockResolvedValue([mockGame]);
    db.game.count.mockResolvedValue(1);

    await request(app).get("/api/games");

    expect(db.game.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: { createdAt: "desc" },
      }),
    );
  });
});

// ─── GET /api/games/genres ────────────────────────────────────────────────────

describe("GET /api/games/genres", () => {
  beforeEach(() => jest.clearAllMocks());

  it("200 — returns array of genre strings", async () => {
    db.game.findMany.mockResolvedValue([{ genre: "RPG" }, { genre: "Action" }]);

    const res = await request(app).get("/api/games/genres");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(["RPG", "Action"]);
  });

  it("200 — returns empty array when no games exist", async () => {
    db.game.findMany.mockResolvedValue([]);

    const res = await request(app).get("/api/games/genres");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("200 — returns a single genre", async () => {
    db.game.findMany.mockResolvedValue([{ genre: "Strategy" }]);

    const res = await request(app).get("/api/games/genres");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(["Strategy"]);
  });

  it("200 — response is a plain array (not an object)", async () => {
    db.game.findMany.mockResolvedValue([{ genre: "RPG" }]);

    const res = await request(app).get("/api/games/genres");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(typeof res.body[0]).toBe("string");
  });
});

// ─── GET /api/games/:id ───────────────────────────────────────────────────────

describe("GET /api/games/:id", () => {
  beforeEach(() => jest.clearAllMocks());

  it("200 — returns game by valid numeric id", async () => {
    db.game.findUnique.mockResolvedValue(mockGame);

    const res = await request(app).get("/api/games/1");

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(1);
    expect(res.body.title).toBe("Test Game");
    expect(res.body.genre).toBe("RPG");
    expect(res.body.price).toBe(29.99);
  });

  it("200 — findUnique is called with the correct id", async () => {
    db.game.findUnique.mockResolvedValue(mockGame);

    await request(app).get("/api/games/1");

    expect(db.game.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 1 } }),
    );
  });

  it("404 — game not found when findUnique returns null", async () => {
    db.game.findUnique.mockResolvedValue(null);

    const res = await request(app).get("/api/games/999");

    expect(res.status).toBe(404);
    expect(res.body.error).toBeDefined();
  });

  it("400 — non-numeric id returns 400", async () => {
    const res = await request(app).get("/api/games/abc");

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
    expect(db.game.findUnique).not.toHaveBeenCalled();
  });

  it('404 — parseInt truncates "1.5abc" to 1, so a missing game returns 404', async () => {
    // parseInt('1.5abc', 10) === 1 (stops at the dot) → NaN check passes
    // the route then does a DB lookup; with no match it returns 404
    db.game.findUnique.mockResolvedValue(null);

    const res = await request(app).get("/api/games/1.5abc");

    expect(res.status).toBe(404);
    expect(db.game.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 1 } }),
    );
  });
});
