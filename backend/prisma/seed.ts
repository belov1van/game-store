import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const games = [
{
    "title": "Celeste",
    "image": "https://cdn.akamai.steamstatic.com/steam/apps/504230/header.jpg",
    "price": 19.99,
    "rating": 4.9,
    "description": "Help Madeline survive her inner demons on her journey to the top of Celeste Mountain, in this super-tight platformer from the creators of TowerFall.",
    "genre": "Platformer",
    "releaseDate": "2018-01-25",
    "developer": "Maddy Makes Games"
  },
  {
    "title": "Hades",
    "image": "https://cdn.akamai.steamstatic.com/steam/apps/1145360/header.jpg",
    "price": 24.99,
    "rating": 4.9,
    "description": "Defy the god of the dead as you hack and slash your way out of the Underworld in this rogue-like dungeon crawler.",
    "genre": "Roguelike",
    "releaseDate": "2020-09-17",
    "developer": "Supergiant Games"
  },
  {
    "title": "Stardew Valley",
    "image": "https://cdn.akamai.steamstatic.com/steam/apps/413150/header.jpg",
    "price": 14.99,
    "rating": 4.8,
    "description": "You've inherited your grandfather's old farm plot in Stardew Valley. Armed with hand-me-down tools and a few coins, you set out to begin your new life.",
    "genre": "Simulation",
    "releaseDate": "2016-02-26",
    "developer": "ConcernedApe"
  },
  {
    "title": "Disco Elysium",
    "image": "https://cdn.akamai.steamstatic.com/steam/apps/632470/header.jpg",
    "price": 39.99,
    "rating": 4.8,
    "description": "A groundbreaking role-playing game where you're a detective solving a murder in a unique open world.",
    "genre": "RPG",
    "releaseDate": "2019-10-15",
    "developer": "ZA/UM"
  },
  {
    "title": "Hollow Knight",
    "image": "https://cdn.akamai.steamstatic.com/steam/apps/367520/header.jpg",
    "price": 14.99,
    "rating": 4.8,
    "description": "Forge your own path in this epic action-adventure through a vast ruined kingdom of insects and heroes.",
    "genre": "Metroidvania",
    "releaseDate": "2017-02-24",
    "developer": "Team Cherry"
  },
  {
    "title": "Dead Cells",
    "image": "https://cdn.akamai.steamstatic.com/steam/apps/588650/header.jpg",
    "price": 24.99,
    "rating": 4.7,
    "description": "A rogue-lite, metroidvania inspired, action-platformer with brutal combat and addictive gameplay.",
    "genre": "Roguelike",
    "releaseDate": "2018-08-07",
    "developer": "Motion Twin"
  },
  {
    "title": "Slay the Spire",
    "image": "https://cdn.akamai.steamstatic.com/steam/apps/646570/header.jpg",
    "price": 24.99,
    "rating": 4.7,
    "description": "A deck-building roguelike that combines card games with dungeon crawling.",
    "genre": "Card Game",
    "releaseDate": "2019-01-23",
    "developer": "Mega Crit Games"
  },
  {
    "title": "Ori and the Blind Forest",
    "image": "https://cdn.akamai.steamstatic.com/steam/apps/261570/header.jpg",
    "price": 19.99,
    "rating": 4.7,
    "description": "A beautiful platformer with emotional storytelling and stunning visuals.",
    "genre": "Platformer",
    "releaseDate": "2015-03-11",
    "developer": "Moon Studios"
  },
  {
    "title": "Undertale",
    "image": "https://cdn.akamai.steamstatic.com/steam/apps/391540/header.jpg",
    "price": 9.99,
    "rating": 4.8,
    "description": "An RPG where you don't have to kill anyone. Each enemy can be spared or defeated in a unique way.",
    "genre": "RPG",
    "releaseDate": "2015-09-15",
    "developer": "Toby Fox"
  },
  {
    "title": "Outer Wilds",
    "image": "https://cdn.akamai.steamstatic.com/steam/apps/753640/header.jpg",
    "price": 24.99,
    "rating": 4.8,
    "description": "A mystery game set in a solar system trapped in an endless time loop.",
    "genre": "Adventure",
    "releaseDate": "2019-05-29",
    "developer": "Mobius Digital"
  },
  {
    "title": "Subnautica",
    "image": "https://cdn.akamai.steamstatic.com/steam/apps/264710/header.jpg",
    "price": 29.99,
    "rating": 4.7,
    "description": "An underwater survival game set on an alien ocean planet.",
    "genre": "Survival",
    "releaseDate": "2018-01-23",
    "developer": "Unknown Worlds Entertainment"
  },
  {
    "title": "The Witness",
    "image": "https://cdn.akamai.steamstatic.com/steam/apps/210970/header.jpg",
    "price": 39.99,
    "rating": 4.6,
    "description": "A puzzle game set on a beautiful, mysterious island filled with hundreds of puzzles.",
    "genre": "Puzzle",
    "releaseDate": "2016-01-26",
    "developer": "Thekla, Inc."
  },
  {
    "title": "Return of the Obra Dinn",
    "image": "https://cdn.akamai.steamstatic.com/steam/apps/653530/header.jpg",
    "price": 19.99,
    "rating": 4.8,
    "description": "A mystery game about a merchant ship found adrift with all crew members dead or missing.",
    "genre": "Puzzle",
    "releaseDate": "2018-10-18",
    "developer": "Lucas Pope"
  },
  {
    "title": "Inside",
    "image": "https://cdn.akamai.steamstatic.com/steam/apps/304430/header.jpg",
    "price": 19.99,
    "rating": 4.7,
    "description": "A dark, atmospheric puzzle-platformer from the creators of Limbo.",
    "genre": "Puzzle",
    "releaseDate": "2016-07-07",
    "developer": "Playdead"
  },
  {
    "title": "Cuphead",
    "image": "https://cdn.akamai.steamstatic.com/steam/apps/268910/header.jpg",
    "price": 19.99,
    "rating": 4.7,
    "description": "A run and gun game with stunning 1930s cartoon visuals and challenging boss battles.",
    "genre": "Action",
    "releaseDate": "2017-09-29",
    "developer": "Studio MDHR"
  },
  {
    "title": "Terraria",
    "image": "https://cdn.akamai.steamstatic.com/steam/apps/105600/header.jpg",
    "price": 9.99,
    "rating": 4.8,
    "description": "Dig, fight, explore, build in a vast sandbox adventure.",
    "genre": "Sandbox",
    "releaseDate": "2011-05-16",
    "developer": "Re-Logic"
  },
  {
    "title": "Factorio",
    "image": "https://cdn.akamai.steamstatic.com/steam/apps/427520/header.jpg",
    "price": 35.00,
    "rating": 4.9,
    "description": "Build and manage automated factories in this deep strategy game.",
    "genre": "Strategy",
    "releaseDate": "2020-08-14",
    "developer": "Wube Software"
  },
  {
    "title": "RimWorld",
    "image": "https://cdn.akamai.steamstatic.com/steam/apps/294100/header.jpg",
    "price": 34.99,
    "rating": 4.8,
    "description": "A sci-fi colony sim driven by an intelligent AI storyteller.",
    "genre": "Simulation",
    "releaseDate": "2018-10-17",
    "developer": "Ludeon Studios"
  },
  {
    "title": "Portal 2",
    "image": "https://cdn.akamai.steamstatic.com/steam/apps/620/header.jpg",
    "price": 9.99,
    "rating": 4.9,
    "description": "The award-winning puzzle game with innovative portal mechanics and hilarious writing.",
    "genre": "Puzzle",
    "releaseDate": "2011-04-18",
    "developer": "Valve"
  },
  {
    "title": "The Witcher 3",
    "image": "https://cdn.akamai.steamstatic.com/steam/apps/292030/header.jpg",
    "price": 39.99,
    "rating": 4.9,
    "description": "An epic open-world RPG with rich storytelling and memorable characters.",
    "genre": "RPG",
    "releaseDate": "2015-05-18",
    "developer": "CD Projekt Red"
  },
  {
    "title": "Cyberpunk 2077",
    "image": "https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg",
    "price": 59.99,
    "rating": 4.5,
    "description": "An open-world action RPG set in Night City, a megalopolis obsessed with power and body modification.",
    "genre": "RPG",
    "releaseDate": "2020-12-10",
    "developer": "CD Projekt Red"
  },
  {
    "title": "Elden Ring",
    "image": "https://cdn.akamai.steamstatic.com/steam/apps/1245620/header.jpg",
    "price": 59.99,
    "rating": 4.9,
    "description": "A fantasy action RPG where players must traverse the Lands Between to become the Elden Lord.",
    "genre": "Action RPG",
    "releaseDate": "2022-02-25",
    "developer": "FromSoftware"
  },
  {
    "title": "God of War",
    "image": "https://cdn.akamai.steamstatic.com/steam/apps/1593500/header.jpg",
    "price": 49.99,
    "rating": 4.8,
    "description": "Kratos and his son Atreus embark on a journey through the Norse wilds.",
    "genre": "Action",
    "releaseDate": "2022-01-14",
    "developer": "Santa Monica Studio"
  },
  {
    "title": "Red Dead Redemption 2",
    "image": "https://cdn.akamai.steamstatic.com/steam/apps/1174180/header.jpg",
    "price": 59.99,
    "rating": 4.9,
    "description": "An epic tale of life in America's unforgiving heartland.",
    "genre": "Action",
    "releaseDate": "2019-12-05",
    "developer": "Rockstar Games"
  },
  {
    "title": "DOOM Eternal",
    "image": "https://cdn.akamai.steamstatic.com/steam/apps/782330/header.jpg",
    "price": 39.99,
    "rating": 4.7,
    "description": "Rip and tear your way through demon hordes in this fast-paced FPS.",
    "genre": "Shooter",
    "releaseDate": "2020-03-20",
    "developer": "id Software"
  },
  {
    "title": "Resident Evil 4",
    "image": "https://cdn.akamai.steamstatic.com/steam/apps/2050650/header.jpg",
    "price": 59.99,
    "rating": 4.8,
    "description": "A remake of the survival horror classic with modern gameplay.",
    "genre": "Horror",
    "releaseDate": "2023-03-24",
    "developer": "Capcom"
  },
  {
    "title": "Baldur's Gate 3",
    "image": "https://cdn.akamai.steamstatic.com/steam/apps/1086940/header.jpg",
    "price": 59.99,
    "rating": 4.9,
    "description": "A deep CRPG based on Dungeons & Dragons 5th edition rules.",
    "genre": "RPG",
    "releaseDate": "2023-08-03",
    "developer": "Larian Studios"
  },
  {
    "title": "Starfield",
    "image": "https://cdn.akamai.steamstatic.com/steam/apps/1716740/header.jpg",
    "price": 69.99,
    "rating": 4.4,
    "description": "An epic space RPG set in a vast universe of planets to explore.",
    "genre": "RPG",
    "releaseDate": "2023-09-06",
    "developer": "Bethesda Game Studios"
  },
  {
    "title": "Hogwarts Legacy",
    "image": "https://cdn.akamai.steamstatic.com/steam/apps/990080/header.jpg",
    "price": 59.99,
    "rating": 4.6,
    "description": "An open-world action RPG set in the wizarding world of Harry Potter.",
    "genre": "RPG",
    "releaseDate": "2023-02-10",
    "developer": "Avalanche Software"
  },
  {
    "title": "Diablo IV",
    "image": "https://cdn.akamai.steamstatic.com/steam/apps/2344520/header.jpg",
    "price": 69.99,
    "rating": 4.3,
    "description": "The next generation of action RPG, filled with legendary loot and brutal combat.",
    "genre": "Action RPG",
    "releaseDate": "2023-06-06",
    "developer": "Blizzard Entertainment"
  },
  {
    "title": "Street Fighter 6",
    "image": "https://cdn.akamai.steamstatic.com/steam/apps/1364780/header.jpg",
    "price": 59.99,
    "rating": 4.7,
    "description": "The latest entry in the legendary fighting game franchise.",
    "genre": "Fighting",
    "releaseDate": "2023-06-02",
    "developer": "Capcom"
  },
  {
    "title": "Final Fantasy XVI",
    "image": "https://cdn.akamai.steamstatic.com/steam/apps/2515020/header.jpg",
    "price": 69.99,
    "rating": 4.6,
    "description": "A dark fantasy epic with real-time combat and massive Eikon battles.",
    "genre": "RPG",
    "releaseDate": "2024-09-17",
    "developer": "Square Enix"
  },
  {
    "title": "Alan Wake 2",
    "image": "https://cdn.akamai.steamstatic.com/steam/apps/2043130/header.jpg",
    "price": 59.99,
    "rating": 4.7,
    "description": "A survival horror game that blends psychological thriller elements.",
    "genre": "Horror",
    "releaseDate": "2023-10-27",
    "developer": "Remedy Entertainment"
  },
  {
    "title": "Marvel's Spider-Man 2",
    "image": "https://cdn.akamai.steamstatic.com/steam/apps/2650630/header.jpg",
    "price": 69.99,
    "rating": 4.8,
    "description": "Swing through New York as both Peter Parker and Miles Morales.",
    "genre": "Action",
    "releaseDate": "2025-01-30",
    "developer": "Insomniac Games"
  },
  {
    "title": "The Legend of Zelda: Tears of the Kingdom",
    "image": "https://m.media-amazon.com/images/I/81lmbDqTpCL._AC_UF894,1000_QL80_.jpg",
    "price": 69.99,
    "rating": 4.9,
    "description": "Explore the skies and depths of Hyrule in this epic sequel.",
    "genre": "Adventure",
    "releaseDate": "2023-05-12",
    "developer": "Nintendo"
  },
  {
    "title": "Super Mario Bros. Wonder",
    "image": "https://m.media-amazon.com/images/I/81vEJqLGMVL._AC_UF894,1000_QL80_.jpg",
    "price": 59.99,
    "rating": 4.8,
    "description": "A new 2D Mario adventure with wonder flowers that transform levels.",
    "genre": "Platformer",
    "releaseDate": "2023-10-20",
    "developer": "Nintendo"
  },
  {
    "title": "Persona 5 Royal",
    "image": "https://cdn.akamai.steamstatic.com/steam/apps/1687950/header.jpg",
    "price": 59.99,
    "rating": 4.9,
    "description": "A stylish JRPG about rebellion and fighting injustice.",
    "genre": "JRPG",
    "releaseDate": "2022-10-21",
    "developer": "Atlus"
  },
  {
    "title": "Metroid Dread",
    "image": "https://m.media-amazon.com/images/I/81gwhOjwR5L._AC_UF894,1000_QL80_.jpg",
    "price": 59.99,
    "rating": 4.7,
    "description": "The first 2D Metroid game in 19 years with intense action and exploration.",
    "genre": "Metroidvania",
    "releaseDate": "2021-10-08",
    "developer": "Nintendo"
  },
  {
    "title": "Xenoblade Chronicles 3",
    "image": "https://m.media-amazon.com/images/I/81pZQd4BpIL._AC_UF894,1000_QL80_.jpg",
    "price": 59.99,
    "rating": 4.8,
    "description": "An expansive JRPG with deep combat and emotional storytelling.",
    "genre": "JRPG",
    "releaseDate": "2022-07-29",
    "developer": "Monolith Soft"
  },
  {
    "title": "Fire Emblem Engage",
    "image": "https://m.media-amazon.com/images/I/81yYCW6AXZL._AC_UF894,1000_QL80_.jpg",
    "price": 59.99,
    "rating": 4.6,
    "description": "Summon past heroes to battle in this tactical RPG.",
    "genre": "Strategy",
    "releaseDate": "2023-01-20",
    "developer": "Intelligent Systems"
  },
  {
    "title": "Pikmin 4",
    "image": "https://m.media-amazon.com/images/I/81o2VrCBvWL._AC_UF894,1000_QL80_.jpg",
    "price": 59.99,
    "rating": 4.7,
    "description": "Command Pikmin to explore and solve puzzles in this charming strategy game.",
    "genre": "Strategy",
    "releaseDate": "2023-07-21",
    "developer": "Nintendo"
  },
  {
    "title": "Kirby and the Forgotten Land",
    "image": "https://m.media-amazon.com/images/I/81bO+0iQ5-L._AC_UF894,1000_QL80_.jpg",
    "price": 59.99,
    "rating": 4.8,
    "description": "Kirby's first full 3D platformer adventure.",
    "genre": "Platformer",
    "releaseDate": "2022-03-25",
    "developer": "HAL Laboratory"
  },
  {
    "title": "Bayonetta 3",
    "image": "https://m.media-amazon.com/images/I/81PyGXRTBuL._AC_UF894,1000_QL80_.jpg",
    "price": 59.99,
    "rating": 4.7,
    "description": "Stylish action combat with demon summoning and dimension-hopping.",
    "genre": "Action",
    "releaseDate": "2022-10-28",
    "developer": "PlatinumGames"
  },
  {
    "title": "Octopath Traveler 2",
    "image": "https://cdn.akamai.steamstatic.com/steam/apps/1971650/header.jpg",
    "price": 59.99,
    "rating": 4.8,
    "description": "A beautiful HD-2D JRPG with eight distinct protagonists.",
    "genre": "JRPG",
    "releaseDate": "2023-02-24",
    "developer": "Square Enix"
  },
  {
    "title": "Live A Live",
    "image": "https://cdn.akamai.steamstatic.com/steam/apps/2014380/header.jpg",
    "price": 49.99,
    "rating": 4.7,
    "description": "A unique JRPG that spans multiple eras and characters.",
    "genre": "JRPG",
    "releaseDate": "2022-07-22",
    "developer": "Square Enix"
  },
  {
    "title": "Triangle Strategy",
    "image": "https://cdn.akamai.steamstatic.com/steam/apps/1850510/header.jpg",
    "price": 59.99,
    "rating": 4.6,
    "description": "A tactical RPG where your choices shape the story.",
    "genre": "Strategy",
    "releaseDate": "2022-10-13",
    "developer": "Square Enix"
  },
  {
    "title": "Advance Wars 1+2: Re-Boot Camp",
    "image": "https://m.media-amazon.com/images/I/81btTf9tA4L._AC_UF894,1000_QL80_.jpg",
    "price": 59.99,
    "rating": 4.5,
    "description": "Classic tactical strategy games remastered with new visuals.",
    "genre": "Strategy",
    "releaseDate": "2023-04-21",
    "developer": "WayForward"
  },
  {
    "title": "Mario + Rabbids Sparks of Hope",
    "image": "https://m.media-amazon.com/images/I/81eWstcfi6L._AC_UF894,1000_QL80_.jpg",
    "price": 59.99,
    "rating": 4.6,
    "description": "Turn-based tactical combat with Mario and Rabbids characters.",
    "genre": "Strategy",
    "releaseDate": "2022-10-20",
    "developer": "Ubisoft"
  },
  {
    "title": "Splatoon 3",
    "image": "https://m.media-amazon.com/images/I/71YhN9A75PL._AC_UF894,1000_QL80_.jpg",
    "price": 59.99,
    "rating": 4.7,
    "description": "Ink-based multiplayer shooter with chaotic and colorful battles.",
    "genre": "Shooter",
    "releaseDate": "2022-09-09",
    "developer": "Nintendo"
  },
  {
    "title": "Monster Hunter Rise",
    "image": "https://cdn.akamai.steamstatic.com/steam/apps/1446780/header.jpg",
    "price": 39.99,
    "rating": 4.7,
    "description": "Hunt massive monsters in this action RPG with wirebug mechanics.",
    "genre": "Action",
    "releaseDate": "2022-01-12",
    "developer": "Capcom"
  },
  {
    "title": "Dragon Quest XI S",
    "image": "https://cdn.akamai.steamstatic.com/steam/apps/1295510/header.jpg",
    "price": 39.99,
    "rating": 4.8,
    "description": "A classic JRPG with charming characters and turn-based combat.",
    "genre": "JRPG",
    "releaseDate": "2020-12-04",
    "developer": "Square Enix"
  },
  {
    "title": "Nier: Automata",
    "image": "https://cdn.akamai.steamstatic.com/steam/apps/524220/header.jpg",
    "price": 39.99,
    "rating": 4.9,
    "description": "A philosophical action RPG with multiple endings and brilliant combat.",
    "genre": "Action RPG",
    "releaseDate": "2017-03-17",
    "developer": "PlatinumGames"
  },
  {
    "title": "Sekiro: Shadows Die Twice",
    "image": "https://cdn.akamai.steamstatic.com/steam/apps/814380/header.jpg",
    "price": 59.99,
    "rating": 4.8,
    "description": "A challenging action-adventure set in a fantasy Japan.",
    "genre": "Action",
    "releaseDate": "2019-03-22",
    "developer": "FromSoftware"
  },
  {
    "title": "Dark Souls III",
    "image": "https://cdn.akamai.steamstatic.com/steam/apps/374320/header.jpg",
    "price": 59.99,
    "rating": 4.8,
    "description": "The epic conclusion to the Dark Souls trilogy.",
    "genre": "Action RPG",
    "releaseDate": "2016-04-12",
    "developer": "FromSoftware"
  },
  {
    "title": "Bloodborne",
    "image": "https://image.api.playstation.com/vulcan/ap/rnd/202206/0221/e7VyZ2tIxnN0tUPM67s0HxhT.png",
    "price": 39.99,
    "rating": 4.9,
    "description": "A gothic horror action RPG from the creators of Dark Souls.",
    "genre": "Action RPG",
    "releaseDate": "2015-03-24",
    "developer": "FromSoftware"
  },
  {
    "title": "Demon's Souls",
    "image": "https://image.api.playstation.com/vulcan/ap/rnd/202008/2421/xY5iGYkKJd88nqOKVRlR3MsV.png",
    "price": 69.99,
    "rating": 4.8,
    "description": "The classic that started the Souls genre, rebuilt from the ground up.",
    "genre": "Action RPG",
    "releaseDate": "2020-11-12",
    "developer": "Bluepoint Games"
  },
  {
    "title": "Ghost of Tsushima",
    "image": "https://image.api.playstation.com/vulcan/ap/rnd/202011/0616/Xvl9D9QTXejh0Dp0KvUYrPVO.png",
    "price": 59.99,
    "rating": 4.9,
    "description": "A samurai epic set in feudal Japan during the Mongol invasion.",
    "genre": "Action",
    "releaseDate": "2020-07-17",
    "developer": "Sucker Punch Productions"
  },
  {
    "title": "Horizon Forbidden West",
    "image": "https://image.api.playstation.com/vulcan/ap/rnd/202207/1210/4xJ8XB3biMNk1r2i5Rng8p5L.png",
    "price": 59.99,
    "rating": 4.8,
    "description": "Explore a post-apocalyptic world filled with robotic creatures.",
    "genre": "Action RPG",
    "releaseDate": "2022-02-18",
    "developer": "Guerrilla Games"
  },
  {
    "title": "The Last of Us Part I",
    "image": "https://image.api.playstation.com/vulcan/ap/rnd/202206/0220/4B6D1LdT3E7Z0gR5cN1a8Y9p.png",
    "price": 69.99,
    "rating": 4.9,
    "description": "A masterful remake of the acclaimed post-apocalyptic story.",
    "genre": "Action",
    "releaseDate": "2022-09-02",
    "developer": "Naughty Dog"
  },
  {
    "title": "Uncharted: Legacy of Thieves Collection",
    "image": "https://image.api.playstation.com/vulcan/ap/rnd/202111/1716/0VpX5hR4fJ2K1m8L7wN9bY3q.png",
    "price": 49.99,
    "rating": 4.7,
    "description": "Two epic treasure-hunting adventures remastered.",
    "genre": "Action",
    "releaseDate": "2022-01-28",
    "developer": "Naughty Dog"
  },
  {
    "title": "Ratchet & Clank: Rift Apart",
    "image": "https://image.api.playstation.com/vulcan/ap/rnd/202011/0412/7xY7V7dN9nL9qL1qW2pM2K2c.png",
    "price": 69.99,
    "rating": 4.8,
    "description": "A dimension-hopping adventure with stunning visuals.",
    "genre": "Platformer",
    "releaseDate": "2021-06-11",
    "developer": "Insomniac Games"
  },
  {
    "title": "Returnal",
    "image": "https://image.api.playstation.com/vulcan/ap/rnd/202207/1210/5xM7xN1xZ1xR1xQ1xP1xO1xN1.png",
    "price": 69.99,
    "rating": 4.7,
    "description": "A roguelike shooter with time-loop mechanics and intense combat.",
    "genre": "Roguelike",
    "releaseDate": "2021-04-30",
    "developer": "Housemarque"
  },
  {
    "title": "Death Stranding Director's Cut",
    "image": "https://image.api.playstation.com/vulcan/ap/rnd/202109/0212/8xY7V7dN9nL9qL1qW2pM2K2c.png",
    "price": 49.99,
    "rating": 4.6,
    "description": "A unique open-world game about connecting a fractured society.",
    "genre": "Adventure",
    "releaseDate": "2021-09-24",
    "developer": "Kojima Productions"
  },
  {
    "title": "Days Gone",
    "image": "https://image.api.playstation.com/vulcan/ap/rnd/202008/2421/7xY7V7dN9nL9qL1qW2pM2K2c.png",
    "price": 39.99,
    "rating": 4.5,
    "description": "Survive in a post-apocalyptic world filled with zombie hordes.",
    "genre": "Survival",
    "releaseDate": "2019-04-26",
    "developer": "Bend Studio"
  },
  {
    "title": "Infamous Second Son",
    "image": "https://image.api.playstation.com/vulcan/ap/rnd/202008/2421/8xY7V7dN9nL9qL1qW2pM2K2c.png",
    "price": 19.99,
    "rating": 4.6,
    "description": "Wield superpowers in an open-world Seattle.",
    "genre": "Action",
    "releaseDate": "2014-03-21",
    "developer": "Sucker Punch Productions"
  },
  {
    "title": "Control",
    "image": "https://cdn.akamai.steamstatic.com/steam/apps/870780/header.jpg",
    "price": 39.99,
    "rating": 4.7,
    "description": "A supernatural action game set in a mysterious government building.",
    "genre": "Action",
    "releaseDate": "2019-08-27",
    "developer": "Remedy Entertainment"
  },
  {
    "title": "Quantum Break",
    "image": "https://cdn.akamai.steamstatic.com/steam/apps/474960/header.jpg",
    "price": 39.99,
    "rating": 4.5,
    "description": "A time-bending action game with live-action episodes.",
    "genre": "Action",
    "releaseDate": "2016-04-05",
    "developer": "Remedy Entertainment"
  },
  {
    "title": "Hellblade: Senua's Sacrifice",
    "image": "https://cdn.akamai.steamstatic.com/steam/apps/414340/header.jpg",
    "price": 29.99,
    "rating": 4.7,
    "description": "A dark fantasy game about mental health and Norse mythology.",
    "genre": "Action",
    "releaseDate": "2017-08-08",
    "developer": "Ninja Theory"
  },
  {
    "title": "A Plague Tale: Requiem",
    "image": "https://cdn.akamai.steamstatic.com/steam/apps/1182900/header.jpg",
    "price": 49.99,
    "rating": 4.7,
    "description": "A gripping tale of survival in medieval France.",
    "genre": "Adventure",
    "releaseDate": "2022-10-18",
    "developer": "Asobo Studio"
  },
  {
    "title": "Metro Exodus",
    "image": "https://cdn.akamai.steamstatic.com/steam/apps/412020/header.jpg",
    "price": 39.99,
    "rating": 4.7,
    "description": "A post-apocalyptic FPS with survival elements.",
    "genre": "Shooter",
    "releaseDate": "2019-02-15",
    "developer": "4A Games"
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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
