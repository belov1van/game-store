import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

const games = [
  {
    title: "Celeste",
    image: "https://cdn.akamai.steamstatic.com/steam/apps/504230/header.jpg",
    price: 19.99,
    rating: 4.9,
    description: "Help Madeline survive her inner demons...",
    genre: "Platformer",
    releaseDate: "2018-01-25",
    developer: "Maddy Makes Games",
  },
  {
    title: "Hades",
    image: "https://cdn.akamai.steamstatic.com/steam/apps/1145360/header.jpg",
    price: 24.99,
    rating: 4.9,
    description: "Defy the god of the dead...",
    genre: "Roguelike",
    releaseDate: "2020-09-17",
    developer: "Supergiant Games",
  },
  {
    title: "Stardew Valley",
    image: "https://cdn.akamai.steamstatic.com/steam/apps/413150/header.jpg",
    price: 14.99,
    rating: 4.8,
    description: "You've inherited your grandfather's farm...",
    genre: "Simulation",
    releaseDate: "2016-02-26",
    developer: "ConcernedApe",
  },
  {
    title: "Disco Elysium",
    image: "https://cdn.akamai.steamstatic.com/steam/apps/632470/header.jpg",
    price: 39.99,
    rating: 4.8,
    description: "A groundbreaking role-playing game...",
    genre: "RPG",
    releaseDate: "2019-10-15",
    developer: "ZA/UM",
  },
  {
    title: "Hollow Knight",
    image: "https://cdn.akamai.steamstatic.com/steam/apps/367520/header.jpg",
    price: 14.99,
    rating: 4.8,
    description: "Forge your own path...",
    genre: "Metroidvania",
    releaseDate: "2017-02-24",
    developer: "Team Cherry",
  },
  {
    title: "Dead Cells",
    image: "https://cdn.akamai.steamstatic.com/steam/apps/588650/header.jpg",
    price: 24.99,
    rating: 4.7,
    description: "A rogue-lite action-platformer...",
    genre: "Roguelike",
    releaseDate: "2018-08-07",
    developer: "Motion Twin",
  },
  {
    title: "Slay the Spire",
    image: "https://cdn.akamai.steamstatic.com/steam/apps/646570/header.jpg",
    price: 24.99,
    rating: 4.7,
    description: "A deck-building roguelike...",
    genre: "Card Game",
    releaseDate: "2019-01-23",
    developer: "Mega Crit Games",
  },
  {
    title: "Ori and the Blind Forest",
    image: "https://cdn.akamai.steamstatic.com/steam/apps/261570/header.jpg",
    price: 19.99,
    rating: 4.7,
    description: "A beautiful platformer...",
    genre: "Platformer",
    releaseDate: "2015-03-11",
    developer: "Moon Studios",
  },
  {
    title: "Undertale",
    image: "https://cdn.akamai.steamstatic.com/steam/apps/391540/header.jpg",
    price: 9.99,
    rating: 4.8,
    description: "An RPG where you don't have to kill anyone.",
    genre: "RPG",
    releaseDate: "2015-09-15",
    developer: "Toby Fox",
  },
  {
    title: "Outer Wilds",
    image: "https://cdn.akamai.steamstatic.com/steam/apps/753640/header.jpg",
    price: 24.99,
    rating: 4.8,
    description: "A mystery game set in a time loop.",
    genre: "Adventure",
    releaseDate: "2019-05-29",
    developer: "Mobius Digital",
  },
  {
    title: "Portal 2",
    image: "https://cdn.akamai.steamstatic.com/steam/apps/620/header.jpg",
    price: 9.99,
    rating: 4.9,
    description: "Innovative portal mechanics...",
    genre: "Puzzle",
    releaseDate: "2011-04-18",
    developer: "Valve",
  },

  {
    title: "The Legend of Zelda: Tears of the Kingdom",
    image:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1971870/header.jpg",
    price: 69.99,
    rating: 4.9,
    description: "Explore the skies and depths of Hyrule.",
    genre: "Adventure",
    releaseDate: "2023-05-12",
    developer: "Nintendo",
  },

  {
    title: "Metroid Dread",
    image:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1787730/header.jpg",
    price: 59.99,
    rating: 4.7,
    description: "First 2D Metroid in 19 years.",
    genre: "Metroidvania",
    releaseDate: "2021-10-08",
    developer: "Nintendo",
  },
  {
    title: "Ghost of Tsushima",
    image:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2215430/header.jpg",
    price: 59.99,
    rating: 4.9,
    description: "A samurai epic.",
    genre: "Action",
    releaseDate: "2020-07-17",
    developer: "Sucker Punch Productions",
  },
  {
    title: "Horizon Forbidden West",
    image:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2420110/header.jpg",
    price: 59.99,
    rating: 4.8,
    description: "Post-apocalyptic world with machines.",
    genre: "Action RPG",
    releaseDate: "2022-02-18",
    developer: "Guerrilla Games",
  },
  {
    title: "The Last of Us Part I",
    image:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1888930/header.jpg",
    price: 69.99,
    rating: 4.9,
    description: "Post-apocalyptic story remake.",
    genre: "Action",
    releaseDate: "2022-09-02",
    developer: "Naughty Dog",
  },
  {
    title: "Ratchet & Clank: Rift Apart",
    image:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1895880/header.jpg",
    price: 69.99,
    rating: 4.8,
    description: "Dimension-hopping adventure.",
    genre: "Platformer",
    releaseDate: "2021-06-11",
    developer: "Insomniac Games",
  },
];

async function main() {
  console.log("Seeding database...");
  const count = await prisma.game.count();
  if (count < games.length) {
    await prisma.game.createMany({ data: games.slice(count) });
    console.log(`Seeded ${games.length - count} games.`);
  }
  if (count === 0) {
    await prisma.game.createMany({ data: games });
    console.log(`Seeded ${games.length} games.`);
  }
  if (count === games.length) {
    console.log(`DB already has ${count} games, skipping seed.`);
  }

  const bcrypt = await import("bcryptjs");

  const userPasswordHash = await bcrypt.default.hash("password123", 10);
  const demoUsers = Array.from({ length: 50 }, (_, i) => {
    const n = i + 1;
    return {
      username: `user${n}`,
      email: `user${n}@example.com`,
      password: userPasswordHash,
      role: Role.USER,
      avatar: `https://i.pravatar.cc/150?img=${(n % 70) + 1}`,
    };
  });
  await prisma.user.createMany({
    data: demoUsers,
    skipDuplicates: true,
  });

  // Create admin user if not exists
  const adminExists = await prisma.user.findUnique({
    where: { username: "admin" },
  });
  if (!adminExists) {
    const hashed = await bcrypt.default.hash("admin", 10);
    await prisma.user.create({
      data: {
        username: "admin",
        email: "admin@gamestore.com",
        password: hashed,
        role: Role.ADMIN,
      },
    });
    console.log("Admin user created (admin / admin)");
  } else {
    console.log("Admin user already exists");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
