import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

const games = [
  {
    title: "Celeste",
    image: "https://cdn.akamai.steamstatic.com/steam/apps/504230/header.jpg",
    price: 19.99,
    rating: 4.9,
    description:
      "A brutally challenging platformer where young Madeline struggles to conquer the mysterious Celeste Mountain. Along the way, she must face her own fears, anxieties, and a darker version of herself. The game masterfully blends pixel-perfect precision challenges with a poignant story about self-acceptance and fighting inner demons.",
    genre: "Platformer",
    releaseDate: "2018-01-25",
    developer: "Maddy Makes Games",
  },
  {
    title: "Hades",
    image: "https://cdn.akamai.steamstatic.com/steam/apps/1145360/header.jpg",
    price: 24.99,
    rating: 4.9,
    description:
      "The god of the dead refuses to let his son Zagreus escape the underworld, but Zagreus is determined to reach the surface at any cost. By fighting your way through the realm of the dead again and again, you'll use boons from the Olympian gods and permanently upgrade your abilities. Every death is not a defeat but a step forward in uncovering the story and your relationships with the underworld's quirky inhabitants.",
    genre: "Roguelike",
    releaseDate: "2020-09-17",
    developer: "Supergiant Games",
  },
  {
    title: "Stardew Valley",
    image: "https://cdn.akamai.steamstatic.com/steam/apps/413150/header.jpg",
    price: 14.99,
    rating: 4.8,
    description:
      "Having inherited your grandfather's old, run-down farm in a sleepy valley, you leave the noisy city life behind for the simple joys of farming. You'll need to clear the land of debris, grow crops, raise animals, build relationships with the townsfolk, and perhaps even find love. Beneath its unassuming surface lies an incredibly deep and relaxing simulator that offers absolute freedom to do whatever you want.",
    genre: "Simulation",
    releaseDate: "2016-02-26",
    developer: "ConcernedApe",
  },
  {
    title: "Disco Elysium",
    image: "https://cdn.akamai.steamstatic.com/steam/apps/632470/header.jpg",
    price: 39.99,
    rating: 4.8,
    description:
      "A groundbreaking role-playing game where you play a detective who has forgotten absolutely everything, trying to solve a murder in a grim, seaside district. There are no traditional combat systems — instead, battles are fought with your own internal voices, phobias, and dialogues with a wide range of eccentric characters. Your decisions, personality traits, and even your personal failures are just as important as the evidence, shaping a completely unique story.",
    genre: "RPG",
    releaseDate: "2019-10-15",
    developer: "ZA/UM",
  },
  {
    title: "Hollow Knight",
    image: "https://cdn.akamai.steamstatic.com/steam/apps/367520/header.jpg",
    price: 14.99,
    rating: 4.8,
    description:
      "You arrive in a long-dead kingdom of insects called Hallownest, where nothing remains but ruins and shadows. Exploring the sprawling, interconnected underground caverns, you'll fight infected bugs and mighty bosses while unlocking new abilities and learning the secrets of an ancient curse. It's a dark, atmospheric, and uncompromising tale of duty and sacrifice that will consume you for dozens of hours.",
    genre: "Metroidvania",
    releaseDate: "2017-02-24",
    developer: "Team Cherry",
  },
  {
    title: "Dead Cells",
    image: "https://cdn.akamai.steamstatic.com/steam/apps/588650/header.jpg",
    price: 24.99,
    rating: 4.7,
    description:
      "A roguelite action-platformer where you control a blob of slime that has taken over the body of a headless knight. Every run is unique thanks to procedurally generated levels, random weapons, and abilities you find along the way. The combat is incredibly fast and fluid, and death here is just the beginning of a new, more powerful run.",
    genre: "Roguelike",
    releaseDate: "2018-08-07",
    developer: "Motion Twin",
  },
  {
    title: "Slay the Spire",
    image: "https://cdn.akamai.steamstatic.com/steam/apps/646570/header.jpg",
    price: 24.99,
    rating: 4.7,
    description:
      "The perfect hybrid of a card game and a roguelike, where you build your deck while climbing a mysterious, ever-changing spire. On each floor, you'll face enemies, discover treasures, and encounter random events that can either supercharge your strategy or completely destroy it. With four unique characters and hundreds of cards, the game offers virtually endless replayability.",
    genre: "Card Game",
    releaseDate: "2019-01-23",
    developer: "Mega Crit Games",
  },
  {
    title: "Ori and the Blind Forest",
    image: "https://cdn.akamai.steamstatic.com/steam/apps/261570/header.jpg",
    price: 19.99,
    rating: 4.7,
    description:
      "A stunningly beautiful platformer that begins as a touching story of friendship between Ori, a forest spirit, and a bear-like creature named Naru. After a terrible tragedy, the forest of Nibel begins to die, and the young spirit must embark on a dangerous journey to its heart to save all living things. A deeply emotional story, breathtaking music, and a visual style like a living animated film leave no one indifferent.",
    genre: "Platformer",
    releaseDate: "2015-03-11",
    developer: "Moon Studios",
  },
  {
    title: "Undertale",
    image: "https://cdn.akamai.steamstatic.com/steam/apps/391540/header.jpg",
    price: 9.99,
    rating: 4.8,
    description:
      "An unusual role-playing game where you are a child who has fallen into the Underground, a world of monsters from which you desperately want to escape. The main twist is that absolutely any conflict can be resolved peacefully — by showing wit or mercy, you can avoid killing a single enemy. Your choices determine not only the ending but also how the monsters themselves treat you, and the game's sense of humor deserves a special award.",
    genre: "RPG",
    releaseDate: "2015-09-15",
    developer: "Toby Fox",
  },
  {
    title: "Outer Wilds",
    image: "https://cdn.akamai.steamstatic.com/steam/apps/753640/header.jpg",
    price: 24.99,
    rating: 4.8,
    description:
      "A tangled detective game where you are trapped in an endless 22-minute time loop at the edge of the galaxy. By exploring a mysterious anomaly in the sky and investigating unique, hand-crafted planets, you piece together the history of an ancient, vanished race. The only real progress here is your own knowledge, and the central mystery will make you truly feel the awe of space.",
    genre: "Adventure",
    releaseDate: "2019-05-29",
    developer: "Mobius Digital",
  },
  {
    title: "Portal 2",
    image: "https://cdn.akamai.steamstatic.com/steam/apps/620/header.jpg",
    price: 9.99,
    rating: 4.9,
    description:
      "A brilliant first-person puzzle game that pushes the boundaries of spatial thinking using a portal gun. Alongside the pushy yet charming robot Wheatley, you'll race through the abandoned Aperture Science labs, solving increasingly insane challenges. Add razor-sharp humor, the villainous GLaDOS, and an excellent co-op mode — you have one of the best puzzle games ever made.",
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
    description:
      "The sequel to a legendary saga, where Link gains new abilities that let you literally create weapons, vehicles, and elaborate contraptions on the fly from surrounding objects. Explore not only a familiar but drastically changed surface of Hyrule, but also mysterious sky islands and the dark depths beneath the earth. The game offers absolute freedom in solving puzzles and combat, rewarding the most incredible engineering ideas.",
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
    description:
      "The first fully new 2D game in 19 years featuring bounty hunter Samus Aran, continuing the classic storyline. On the planet ZDR, you'll face not only exploration of winding corridors and battles with dangerous robots, but also a lethal hunt from nearly indestructible E.M.M.I. killer machines. These invisible enemies add a slasher-like element, forcing you to constantly run and hide, building a genuine sense of dread.",
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
    description:
      "An epic samurai saga set during the first Mongol invasion of the Japanese island of Tsushima. The samurai Jin Sakai, to protect his people, is forced to break the warrior's code of bushido and become the Ghost — a warrior who uses stealth and poisoned weapons. This is not just a story about honor and the warrior's path, but a visual masterpiece about the beauty of nature and dying traditions.",
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
    description:
      "The continuation of archer Aloy's adventure, as she journeys to the forbidden lands of the west to find a way to stop a mysterious plague killing all plant life. The world once again amazes the imagination: giant machines now live underwater, in hot springs, and among the ruins of the American West Coast. Stunning graphics, thrilling combat against mechanical dinosaurs, and a deep story about our future await you.",
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
    description:
      "A masterfully remade version of the cult classic, telling the story of cynical smuggler Joel and teenage girl Ellie as they travel across a post-apocalyptic America. They might be humanity's last chance for a vaccine, but their journey will be filled with brutality, loss, and impossible moral dilemmas. This is the gold standard of storytelling in games: a powerful drama that makes you think about the price of survival and the power of love.",
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
    description:
      "A dazzling adventure starring the famous duo — lombax Ratchet and little robot Clank — who gain the ability to instantly jump between dimensions. Their main goal is to stop an evil emperor whose experiments with reality threaten the very existence of the universe, and a new heroine named Rivet from an alternate world joins the fight. The game fully utilizes the power of modern consoles and PCs to create seamless, instant transitions between planets with no loading screens, delivering pure action and signature humor.",
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
