import type {
  AuthResponse,
  AdminUser,
  Game,
  GamesResponse,
  Order,
  UserProfile,
} from "./types";

const BASE_URL = "/api";

function getToken(): string | null {
  return localStorage.getItem("token");
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) ?? {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const body = await res
      .json()
      .catch(() => ({ error: `HTTP ${res.status}` }));
    throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export interface GamesParams {
  search?: string;
  genre?: string;
  page?: number;
  limit?: number;
}

export const api = {
  auth: {
    register: (username: string, email: string, password: string) =>
      request<AuthResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ username, email, password }),
      }),

    login: (login: string, password: string) =>
      request<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ login, password }),
      }),
  },

  games: {
    list: (params?: GamesParams) => {
      const qs = new URLSearchParams();
      if (params?.search) qs.set("search", params.search);
      if (params?.genre) qs.set("genre", params.genre);
      if (params?.page !== undefined) qs.set("page", String(params.page));
      if (params?.limit !== undefined) qs.set("limit", String(params.limit));
      const query = qs.toString() ? `?${qs.toString()}` : "";
      return request<GamesResponse>(`/games${query}`);
    },

    get: (id: number) => request<Game>(`/games/${id}`),

    genres: () => request<string[]>("/games/genres"),
  },

  users: {
    me: () => request<UserProfile>("/users/me"),

    update: (data: { username?: string; email?: string }) =>
      request<UserProfile>("/users/me", {
        method: "PUT",
        body: JSON.stringify(data),
      }),

    orders: () => request<Order[]>("/users/me/orders"),

    uploadAvatar: (formData: FormData): Promise<{ avatarUrl: string }> => {
      const token = localStorage.getItem("token");
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;
      return fetch("/api/users/me/avatar", {
        method: "POST",
        headers,
        body: formData,
      }).then(async (res) => {
        if (!res.ok) {
          const body = await res
            .json()
            .catch(() => ({ error: "Upload failed" }));
          throw new Error(
            (body as { error?: string }).error ?? "Upload failed",
          );
        }
        return res.json() as Promise<{ avatarUrl: string }>;
      });
    },
  },

  orders: {
    create: (items: Array<{ gameId: number; quantity: number }>) =>
      request<Order>("/orders", {
        method: "POST",
        body: JSON.stringify({ items }),
      }),
  },

  admin: {
    // Users
    getUsers: () => request<AdminUser[]>("/admin/users"),
    createUser: (data: {
      username: string;
      email: string;
      password: string;
      role?: string;
    }) =>
      request<AdminUser>("/admin/users", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    updateUser: (
      id: number,
      data: { username?: string; email?: string; role?: string },
    ) =>
      request<AdminUser>(`/admin/users/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    deleteUser: (id: number) =>
      request<{ success: boolean }>(`/admin/users/${id}`, { method: "DELETE" }),

    getGames: () => request<Game[]>("/admin/games"),
    createGame: (data: Omit<Game, "id" | "createdAt" | "updatedAt">) =>
      request<Game>("/admin/games", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    updateGame: (
      id: number,
      data: Partial<Omit<Game, "id" | "createdAt" | "updatedAt">>,
    ) =>
      request<Game>(`/admin/games/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    deleteGame: (id: number) =>
      request<{ success: boolean }>(`/admin/games/${id}`, { method: "DELETE" }),
  },
};
