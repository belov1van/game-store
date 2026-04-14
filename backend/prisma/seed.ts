import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const games = [
  {
    title: "Cyberpunk 2077",
    image: "https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg",
    price: 29.99,
    rating: 4.5,
    description:
      "An open-world, action-adventure RPG set in the megalopolis of Night City, where you play as a cyberpunk mercenary wrapped up in a do-or-die fight for survival.",
    genre: "RPG",
    releaseDate: "2020-12-10",
    developer: "CD Projekt Red",
  },
  {
    title: "The Witcher 3: Wild Hunt",
    image: "https://cdn.akamai.steamstatic.com/steam/apps/292030/header.jpg",
    price: 9.99,
    rating: 4.9,
    description:
      "A story-driven open world RPG set in a visually stunning fantasy universe full of meaningful choices and impactful consequences.",
    genre: "RPG",
    releaseDate: "2015-05-19",
    developer: "CD Projekt Red",
  },
  {
    title: "Elden Ring",
    image: "https://cdn.akamai.steamstatic.com/steam/apps/1245620/header.jpg",
    price: 59.99,
    rating: 4.8,
    description:
      "A fantasy action-RPG set in a vast world designed by Hidetaka Miyazaki and George R.R. Martin.",
    genre: "Action RPG",
    releaseDate: "2022-02-25",
    developer: "FromSoftware",
  },
  {
    title: "Red Dead Redemption 2",
    image: "https://cdn.akamai.steamstatic.com/steam/apps/1174180/header.jpg",
    price: 39.99,
    rating: 4.9,
    description:
      "America, 1899. The end of the wild west era has begun. After a robbery gone badly wrong, Arthur Morgan and the Van der Linde gang are forced to flee.",
    genre: "Action Adventure",
    releaseDate: "2019-11-05",
    developer: "Rockstar Games",
  },
  {
    title: "God of War",
    image: "https://cdn.akamai.steamstatic.com/steam/apps/1593500/header.jpg",
    price: 49.99,
    rating: 4.8,
    description:
      "His vengeance against the Gods of Olympus years behind him, Kratos now lives as a man in the realm of Norse Gods and monsters.",
    genre: "Action Adventure",
    releaseDate: "2022-01-14",
    developer: "Santa Monica Studio",
  },
  {
    title: "Hollow Knight",
    image: "https://cdn.akamai.steamstatic.com/steam/apps/367520/header.jpg",
    price: 14.99,
    rating: 4.8,
    description:
      "Forge your own path in Hollow Knight! An epic action adventure through a vast ruined kingdom of insects and heroes.",
    genre: "Metroidvania",
    releaseDate: "2017-02-24",
    developer: "Team Cherry",
  },
  {
    title: "Hades",
    image: "https://cdn.akamai.steamstatic.com/steam/apps/1145360/header.jpg",
    price: 24.99,
    rating: 4.8,
    description:
      "Defy the god of the dead as you hack and slash out of the Underworld in this rogue-like dungeon crawler from the creators of Bastion and Transistor.",
    genre: "Roguelite",
    releaseDate: "2020-09-17",
    developer: "Supergiant Games",
  },
  {
    title: "Disco Elysium",
    image: "https://cdn.akamai.steamstatic.com/steam/apps/632470/header.jpg",
    price: 39.99,
    rating: 4.7,
    description:
      "You're a detective with a unique skill system at your disposal and a whole city to carve your path across.",
    genre: "RPG",
    releaseDate: "2019-10-15",
    developer: "ZA/UM",
  },
  {
    title: "Stardew Valley",
    image: "https://cdn.akamai.steamstatic.com/steam/apps/413150/header.jpg",
    price: 13.99,
    rating: 4.9,
    description:
      "You've inherited your grandfather's old farm plot in Stardew Valley. Armed with hand-me-down tools and a few coins, you set out to begin your new life.",
    genre: "Simulation",
    releaseDate: "2016-02-26",
    developer: "ConcernedApe",
  },
  {
    title: "Sekiro: Shadows Die Twice",
    image: "https://cdn.akamai.steamstatic.com/steam/apps/814380/header.jpg",
    price: 59.99,
    rating: 4.7,
    description:
      "Carve your own clever path to vengeance in this challenging adventure game with a dark and twisted narrative.",
    genre: "Action Adventure",
    releaseDate: "2019-03-22",
    developer: "FromSoftware",
  },
  {
    title: "Death Stranding",
    image: "https://cdn.akamai.steamstatic.com/steam/apps/1190460/header.jpg",
    price: 39.99,
    rating: 4.3,
    description:
      "From legendary game creator Hideo Kojima comes a genre-defining experience: an open world action adventure game.",
    genre: "Action Adventure",
    releaseDate: "2020-07-14",
    developer: "Kojima Productions",
  },
  {
    title: "Celeste",
    image: "https://cdn.akamai.steamstatic.com/steam/apps/504230/header.jpg",
    price: 19.99,
    rating: 4.9,
    description:
      "Help Madeline survive her inner demons on her journey to the top of Celeste Mountain, in this super-tight platformer from the creators of TowerFall.",
    genre: "Platformer",
    releaseDate: "2018-01-25",
    developer: "Maddy Makes Games",
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
  if ((count = games.length)) {
    console.log(`DB already has ${count} games, skipping seed.`);
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
