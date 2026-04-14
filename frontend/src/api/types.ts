export interface AuthUser {
  id: number;
  username: string;
  email: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface Game {
  id: number;
  title: string;
  image: string;
  price: number;
  rating: number;
  description: string;
  genre: string;
  releaseDate: string;
  developer: string;
  createdAt: string;
  updatedAt: string;
}

export interface GamesResponse {
  games: Game[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  gamesOwned: number;
  ordersCount: number;
}

export interface OrderItem {
  id: number;
  gameId: number;
  quantity: number;
  price: number;
  game: Game;
}

export interface Order {
  id: number;
  userId: number;
  total: number;
  createdAt: string;
  items: OrderItem[];
}
