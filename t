[1mdiff --git a/backend/package.json b/backend/package.json[m
[1mindex 38c558a..18f6111 100644[m
[1m--- a/backend/package.json[m
[1m+++ b/backend/package.json[m
[36m@@ -12,7 +12,10 @@[m
     "prisma:generate": "prisma generate",[m
     "prisma:migrate": "prisma migrate dev",[m
     "prisma:seed": "ts-node prisma/seed.ts",[m
[31m-    "db:push": "prisma db push"[m
[32m+[m[32m    "db:push": "prisma db push",[m
[32m+[m[32m    "test": "jest --forceExit",[m
[32m+[m[32m    "test:watch": "jest --watch",[m
[32m+[m[32m    "test:coverage": "jest --coverage --forceExit"[m
   },[m
   "dependencies": {[m
     "@prisma/client": "^5.22.0",[m
[36m@@ -27,11 +30,16 @@[m
     "@types/bcryptjs": "^2.4.6",[m
     "@types/cors": "^2.8.17",[m
     "@types/express": "^5.0.0",[m
[32m+[m[32m    "@types/jest": "^29.5.14",[m
     "@types/jsonwebtoken": "^9.0.7",[m
     "@types/multer": "^1.4.12",[m
     "@types/node": "^22.9.0",[m
[32m+[m[32m    "@types/supertest": "^6.0.3",[m
[32m+[m[32m    "jest": "^29.7.0",[m
     "nodemon": "^3.1.7",[m
     "prisma": "^5.22.0",[m
[32m+[m[32m    "supertest": "^7.2.2",[m
[32m+[m[32m    "ts-jest": "^29.4.9",[m
     "ts-node": "^10.9.2",[m
     "typescript": "^5.6.3"[m
   }[m
[1mdiff --git a/backend/src/index.ts b/backend/src/index.ts[m
[1mindex 8ea53db..a4bb6cd 100644[m
[1m--- a/backend/src/index.ts[m
[1m+++ b/backend/src/index.ts[m
[36m@@ -1,68 +1,7 @@[m
[31m-import express from "express";[m
[31m-import cors from "cors";[m
[31m-import dotenv from "dotenv";[m
[31m-import path from "path";[m
[31m-import fs from "fs";[m
[31m-import authRouter from "./routes/auth";[m
[31m-import gamesRouter from "./routes/games";[m
[31m-import usersRouter from "./routes/users";[m
[31m-import ordersRouter from "./routes/orders";[m
[31m-import adminRouter from "./routes/admin";[m
[32m+[m[32mimport app from "./app";[m
 [m
[31m-dotenv.config();[m
[31m-[m
[31m-const app = express();[m
 const PORT = process.env.PORT ?? 8000;[m
 [m
[31m-// Uploads directory[m
[31m-const uploadsDir = path.join(process.cwd(), "uploads");[m
[31m-if (!fs.existsSync(uploadsDir)) {[m
[31m-  fs.mkdirSync(uploadsDir, { recursive: true });[m
[31m-}[m
[31m-[m
[31m-app.use([m
[31m-  cors({[m
[31m-    origin: process.env.CORS_ORIGIN ?? "http://localhost:5173",[m
[31m-    credentials: true,[m
[31m-  }),[m
[31m-);[m
[31m-app.use(express.json());[m
[31m-[m
[31m-// Static uploads[m
[31m-app.use("/api/uploads", express.static(uploadsDir));[m
[31m-[m
[31m-// Routes[m
[31m-app.use("/api/auth", authRouter);[m
[31m-app.use("/api/games", gamesRouter);[m
[31m-app.use("/api/users", usersRouter);[m
[31m-app.use("/api/orders", ordersRouter);[m
[31m-app.use("/api/admin", adminRouter);[m
[31m-[m
[31m-// Health check[m
[31m-app.get("/health", (_req, res) => {[m
[31m-  res.json({ status: "ok" });[m
[31m-});[m
[31m-[m
[31m-// 404 handler[m
[31m-app.use((_req, res) => {[m
[31m-  res.status(404).json({ error: "Not found" });[m
[31m-});[m
[31m-[m
[31m-// Error handler[m
[31m-app.use([m
[31m-  ([m
[31m-    err: Error,[m
[31m-    _req: express.Request,[m
[31m-    res: express.Response,[m
[31m-    _next: express.NextFunction,[m
[31m-  ) => {[m
[31m-    console.error(err.stack);[m
[31m-    res.status(500).json({ error: "Internal server error" });[m
[31m-  },[m
[31m-);[m
[31m-[m
 app.listen(PORT, () => {[m
   console.log(`Server running on http://localhost:${PORT}`);[m
 });[m
[31m-[m
[31m-export default app;[m
[1mdiff --git a/frontend/src/App.tsx b/frontend/src/App.tsx[m
[1mindex 60937f8..aa6f942 100644[m
[1m--- a/frontend/src/App.tsx[m
[1m+++ b/frontend/src/App.tsx[m
[36m@@ -8,6 +8,7 @@[m [mimport RegisterForm from "./components/registration/RegisterForm";[m
 import LoginForm from "./components/login/LoginForm";[m
 import AboutUs from "./pages/About-us/AboutUs";[m
 import Profile from "./pages/Profile/Profile";[m
[32m+[m[32mimport AdminPanel from "./pages/Admin/AdminPanel";[m
 [m
 function App() {[m
   return ([m
[36m@@ -21,6 +22,7 @@[m [mfunction App() {[m
               <Route path="/login" element={<LoginForm />} />[m
               <Route path="/about" element={<AboutUs />} />[m
               <Route path="/profile" element={<Profile />} />[m
[32m+[m[32m              <Route path="/admin" element={<AdminPanel />} />[m
             </Routes>[m
           </Router>[m
         </CartProvider>[m
[1mdiff --git a/frontend/src/api/api.ts b/frontend/src/api/api.ts[m
[1mindex d098c98..6b6195d 100644[m
[1m--- a/frontend/src/api/api.ts[m
[1m+++ b/frontend/src/api/api.ts[m
[36m@@ -1,5 +1,6 @@[m
 import type {[m
   AuthResponse,[m
[32m+[m[32m  AdminUser,[m
   Game,[m
   GamesResponse,[m
   Order,[m
[36m@@ -84,6 +85,27 @@[m [mexport const api = {[m
       }),[m
 [m
     orders: () => request<Order[]>("/users/me/orders"),[m
[32m+[m
[32m+[m[32m    uploadAvatar: (formData: FormData): Promise<{ avatarUrl: string }> => {[m
[32m+[m[32m      const token = localStorage.getItem("token");[m
[32m+[m[32m      const headers: Record<string, string> = {};[m
[32m+[m[32m      if (token) headers["Authorization"] = `Bearer ${token}`;[m
[32m+[m[32m      return fetch("/api/users/me/avatar", {[m
[32m+[m[32m        method: "POST",[m
[32m+[m[32m        headers,[m
[32m+[m[32m        body: formData,[m
[32m+[m[32m      }).then(async (res) => {[m
[32m+[m[32m        if (!res.ok) {[m
[32m+[m[32m          const body = await res[m
[32m+[m[32m            .json()[m
[32m+[m[32m            .catch(() => ({ error: "Upload failed" }));[m
[32m+[m[32m          throw new Error([m
[32m+[m[32m            (body as { error?: string }).error ?? "Upload failed",[m
[32m+[m[32m          );[m
[32m+[m[32m        }[m
[32m+[m[32m        return res.json() as Promise<{ avatarUrl: string }>;[m
[32m+[m[32m      });[m
[32m+[m[32m    },[m
   },[m
 [m
   orders: {[m
[36m@@ -93,4 +115,47 @@[m [mexport const api = {[m
         body: JSON.stringify({ items }),[m
       }),[m
   },[m
[32m+[m
[32m+[m[32m  admin: {[m
[32m+[m[32m    // Users[m
[32m+[m[32m    getUsers: () => request<AdminUser[]>("/admin/users"),[m
[32m+[m[32m    createUser: (data: {[m
[32m+[m[32m      username: string;[m
[32m+[m[32m      email: string;[m
[32m+[m[32m      password: string;[m
[32m+[m[32m      role?: string;[m
[32m+[m[32m    }) =>[m
[32m+[m[32m      request<AdminUser>("/admin/users", {[m
[32m+[m[32m        method: "POST",[m
[32m+[m[32m        body: JSON.stringify(data),[m
[32m+[m[32m      }),[m
[32m+[m[32m    updateUser: ([m
[32m+[m[32m      id: number,[m
[32m+[m[32m      data: { username?: string; email?: string; role?: string },[m
[32m+[m[32m    ) =>[m
[32m+[m[32m      request<AdminUser>(`/admin/users/${id}`, {[m
[32m+[m[32m        method: "PUT",[m
[32m+[m[32m        body: JSON.stringify(data),[m
[32m+[m[32m      }),[m
[32m+[m[32m    deleteUser: (id: number) =>[m
[32m+[m[32m      request<{ success: boolean }>(`/admin/users/${id}`, { method: "DELETE" }),[m
[32m+[m
[32m+[m[32m    // Games[m
[32m+[m[32m    getGames: () => request<Game[]>("/admin/games"),[m
[32m+[m[32m    createGame: (data: Omit<Game, "id" | "createdAt" | "updatedAt">) =>[m
[32m+[m[32m      request<Game>("/admin/games", {[m
[32m+[m[32m        method: "POST",[m
[32m+[m[32m        body: JSON.stringify(data),[m
[32m+[m[32m      }),[m
[32m+[m[32m    updateGame: ([m
[32m+[m[32m      id: number,[m
[32m+[m[32m      data: Partial<Omit<Game, "id" | "createdAt" | "updatedAt">>,[m
[32m+[m[32m    ) =>[m
[32m+[m[32m      request<Game>(`/admin/games/${id}`, {[m
[32m+[m[32m        method: "PUT",[m
[32m+[m[32m        body: JSON.stringify(data),[m
[32m+[m[32m      }),[m
[32m+[m[32m    deleteGame: (id: number) =>[m
[32m+[m[32m      request<{ success: boolean }>(`/admin/games/${id}`, { method: "DELETE" }),[m
[32m+[m[32m  },[m
 };[m
[1mdiff --git a/frontend/src/api/types.ts b/frontend/src/api/types.ts[m
[1mindex c43e8f5..b31b841 100644[m
[1m--- a/frontend/src/api/types.ts[m
[1m+++ b/frontend/src/api/types.ts[m
[36m@@ -1,7 +1,11 @@[m
[32m+[m[32mexport type Role = "USER" | "ADMIN";[m
[32m+[m
 export interface AuthUser {[m
   id: number;[m
   username: string;[m
   email: string;[m
[32m+[m[32m  role: Role;[m
[32m+[m[32m  avatar: string | null;[m
   createdAt: string;[m
 }[m
 [m
[36m@@ -36,12 +40,23 @@[m [mexport interface UserProfile {[m
   id: number;[m
   username: string;[m
   email: string;[m
[32m+[m[32m  role: Role;[m
[32m+[m[32m  avatar: string | null;[m
   createdAt: string;[m
   updatedAt: string;[m
   gamesOwned: number;[m
   ordersCount: number;[m
 }[m
 [m
[32m+[m[32mexport interface AdminUser {[m
[32m+[m[32m  id: number;[m
[32m+[m[32m  username: string;[m
[32m+[m[32m  email: string;[m
[32m+[m[32m  role: Role;[m
[32m+[m[32m  avatar: string | null;[m
[32m+[m[32m  createdAt: string;[m
[32m+[m[32m}[m
[32m+[m
 export interface OrderItem {[m
   id: number;[m
   gameId: number;[m
[1mdiff --git a/frontend/src/components/header/Header.tsx b/frontend/src/components/header/Header.tsx[m
[1mindex f3e2ee9..7683725 100644[m
[1m--- a/frontend/src/components/header/Header.tsx[m
[1m+++ b/frontend/src/components/header/Header.tsx[m
[36m@@ -1,13 +1,14 @@[m
[31m-import React, { useState } from 'react';[m
[31m-import { Link, useNavigate } from 'react-router-dom';[m
[31m-import { useTheme } from '../../context/ThemeContext';[m
[31m-import { useCart } from '../../context/CartContext';[m
[31m-import ThemeToggle from '../ToggleTheme/ThemeToggle';[m
[31m-import SidebarMenu from '../sliderMenu/SliderMenu'; [m
[31m-import 'primeicons/primeicons.css';[m
[31m-import './Header.css';[m
[31m-import lightLogo from '../../assets/icons/game-controller-svgrepo-com (1).svg';[m
[31m-import darkLogo from '../../assets/icons/game-controller-svgrepo-com white.svg';[m
[32m+[m[32mimport React, { useState } from "react";[m
[32m+[m[32mimport { Link, useNavigate } from "react-router-dom";[m
[32m+[m[32mimport { useTheme } from "../../context/ThemeContext";[m
[32m+[m[32mimport { useCart } from "../../context/CartContext";[m
[32m+[m[32mimport { useAuth } from "../../context/AuthContext";[m
[32m+[m[32mimport ThemeToggle from "../ToggleTheme/ThemeToggle";[m
[32m+[m[32mimport SidebarMenu from "../sliderMenu/SliderMenu";[m
[32m+[m[32mimport "primeicons/primeicons.css";[m
[32m+[m[32mimport "./Header.css";[m
[32m+[m[32mimport lightLogo from "../../assets/icons/game-controller-svgrepo-com (1).svg";[m
[32m+[m[32mimport darkLogo from "../../assets/icons/game-controller-svgrepo-com white.svg";[m
 [m
 interface HeaderProps {[m
   onSearch?: (searchTerm: string) => void;[m
[36m@@ -15,11 +16,12 @@[m [minterface HeaderProps {[m
 }[m
 [m
 const Header: React.FC<HeaderProps> = ({ onSearch, onCartClick }) => {[m
[31m-  const [searchTerm, setSearchTerm] = useState('');[m
[32m+[m[32m  const [searchTerm, setSearchTerm] = useState("");[m
   const [isMenuOpen, setIsMenuOpen] = useState(false);[m
   const navigate = useNavigate();[m
   const { theme } = useTheme();[m
   const { getTotalItems } = useCart();[m
[32m+[m[32m  const { isAdmin } = useAuth();[m
 [m
   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {[m
     const value = e.target.value;[m
[36m@@ -27,16 +29,21 @@[m [mconst Header: React.FC<HeaderProps> = ({ onSearch, onCartClick }) => {[m
     if (onSearch) onSearch(value);[m
   };[m
 [m
[31m-  const handleLogoClick = () => navigate('/');[m
[32m+[m[32m  const handleLogoClick = () => navigate("/");[m
 [m
[31m-  const logoSrc = theme === 'dark' ? darkLogo : lightLogo;[m
[32m+[m[32m  const logoSrc = theme === "dark" ? darkLogo : lightLogo;[m
   const totalItems = getTotalItems();[m
 [m
   return ([m
     <>[m
       <header className="home-header">[m
         <div className="header-content">[m
[31m-          <div className="logo" onClick={handleLogoClick} role="button" tabIndex={0}>[m
[32m+[m[32m          <div[m
[32m+[m[32m            className="logo"[m
[32m+[m[32m            onClick={handleLogoClick}[m
[32m+[m[32m            role="button"[m
[32m+[m[32m            tabIndex={0}[m
[32m+[m[32m          >[m
             <div className="logo-icon">[m
               <img src={logoSrc} alt="logo" className="login-icon" />[m
             </div>[m
[36m@@ -44,8 +51,8 @@[m [mconst Header: React.FC<HeaderProps> = ({ onSearch, onCartClick }) => {[m
           </div>[m
 [m
           <nav className="main-nav">[m
[31m-            <button [m
[31m-              className="nav-link menu-button" [m
[32m+[m[32m            <button[m
[32m+[m[32m              className="nav-link menu-button"[m
               onClick={() => setIsMenuOpen(true)}[m
               aria-label="Open Sidebar Menu"[m
             >[m
[36m@@ -64,6 +71,12 @@[m [mconst Header: React.FC<HeaderProps> = ({ onSearch, onCartClick }) => {[m
               <i className="pi pi-cog nav-icon"></i>[m
               <span>Settings</span>[m
             </Link>[m
[32m+[m[32m            {isAdmin && ([m
[32m+[m[32m              <Link to="/admin" className="nav-link">[m
[32m+[m[32m                <i className="pi pi-shield nav-icon"></i>[m
[32m+[m[32m                <span>admin</span>[m
[32m+[m[32m              </Link>[m
[32m+[m[32m            )}[m
           </nav>[m
 [m
           <div className="search-section">[m
[36m@@ -94,4 +107,4 @@[m [mconst Header: React.FC<HeaderProps> = ({ onSearch, onCartClick }) => {[m
   );[m
 };[m
 [m
[31m-export default Header;[m
\ No newline at end of file[m
[32m+[m[32mexport default Header;[m
[1mdiff --git a/frontend/src/components/login/LoginForm.tsx b/frontend/src/components/login/LoginForm.tsx[m
[1mindex c7221a3..de1a2de 100644[m
[1m--- a/frontend/src/components/login/LoginForm.tsx[m
[1m+++ b/frontend/src/components/login/LoginForm.tsx[m
[36m@@ -52,7 +52,7 @@[m [mconst LoginForm: React.FC = () => {[m
 [m
     if (!formData.password) {[m
       newErrors.password = "Пароль обязателен";[m
[31m-    } else if (formData.password.length < 6) {[m
[32m+[m[32m    } else if (formData.password.length < 3) {[m
       newErrors.password = "Пароль должен быть минимум 6 символов";[m
     }[m
 [m
[1mdiff --git a/frontend/src/components/registration/RegisterForm.tsx b/frontend/src/components/registration/RegisterForm.tsx[m
[1mindex d05bf4d..aec85ea 100644[m
[1m--- a/frontend/src/components/registration/RegisterForm.tsx[m
[1m+++ b/frontend/src/components/registration/RegisterForm.tsx[m
[36m@@ -74,7 +74,7 @@[m [mconst RegisterForm: React.FC = () => {[m
 [m
     if (!formData.password) {[m
       newErrors.password = "Пароль обязателен";[m
[31m-    } else if (formData.password.length < 6) {[m
[32m+[m[32m    } else if (formData.password.length < 3) {[m
       newErrors.password = "Пароль должен быть минимум 6 символов";[m
     }[m
 [m
[1mdiff --git a/frontend/src/context/AuthContext.tsx b/frontend/src/context/AuthContext.tsx[m
[1mindex b9a2ecf..a0efbc7 100644[m
[1m--- a/frontend/src/context/AuthContext.tsx[m
[1m+++ b/frontend/src/context/AuthContext.tsx[m
[36m@@ -5,6 +5,7 @@[m [mexport interface AuthContextType {[m
   user: AuthUser | null;[m
   token: string | null;[m
   isAuthenticated: boolean;[m
[32m+[m[32m  isAdmin: boolean;[m
   login: (login: string, password: string) => Promise<void>;[m
   register: ([m
     username: string,[m
[1mdiff --git a/frontend/src/context/AuthProvider.tsx b/frontend/src/context/AuthProvider.tsx[m
[1mindex 34631ea..5b8bfaf 100644[m
[1m--- a/frontend/src/context/AuthProvider.tsx[m
[1m+++ b/frontend/src/context/AuthProvider.tsx[m
[36m@@ -1,10 +1,10 @@[m
[31m-import React, { useState, useCallback } from 'react';[m
[31m-import { AuthContext } from './AuthContext';[m
[31m-import { api } from '../api/api';[m
[31m-import type { AuthUser } from '../api/types';[m
[32m+[m[32mimport React, { useState, useCallback } from "react";[m
[32m+[m[32mimport { AuthContext } from "./AuthContext";[m
[32m+[m[32mimport { api } from "../api/api";[m
[32m+[m[32mimport type { AuthUser } from "../api/types";[m
 [m
[31m-const TOKEN_KEY = 'token';[m
[31m-const USER_KEY = 'auth_user';[m
[32m+[m[32mconst TOKEN_KEY = "token";[m
[32m+[m[32mconst USER_KEY = "auth_user";[m
 [m
 function loadToken(): string | null {[m
   return localStorage.getItem(TOKEN_KEY);[m
[36m@@ -19,7 +19,9 @@[m [mfunction loadUser(): AuthUser | null {[m
   }[m
 }[m
 [m
[31m-export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {[m
[32m+[m[32mexport const AuthProvider: React.FC<{ children: React.ReactNode }> = ({[m
[32m+[m[32m  children,[m
[32m+[m[32m}) => {[m
   const [token, setToken] = useState<string | null>(loadToken);[m
   const [user, setUser] = useState<AuthUser | null>(loadUser);[m
 [m
[36m@@ -30,15 +32,21 @@[m [mexport const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children[m
     setUser(newUser);[m
   }, []);[m
 [m
[31m-  const login = useCallback(async (loginValue: string, password: string) => {[m
[31m-    const data = await api.auth.login(loginValue, password);[m
[31m-    persist(data.token, data.user);[m
[31m-  }, [persist]);[m
[32m+[m[32m  const login = useCallback([m
[32m+[m[32m    async (loginValue: string, password: string) => {[m
[32m+[m[32m      const data = await api.auth.login(loginValue, password);[m
[32m+[m[32m      persist(data.token, data.user);[m
[32m+[m[32m    },[m
[32m+[m[32m    [persist],[m
[32m+[m[32m  );[m
 [m
[31m-  const register = useCallback(async (username: string, email: string, password: string) => {[m
[31m-    const data = await api.auth.register(username, email, password);[m
[31m-    persist(data.token, data.user);[m
[31m-  }, [persist]);[m
[32m+[m[32m  const register = useCallback([m
[32m+[m[32m    async (username: string, email: string, password: string) => {[m
[32m+[m[32m      const data = await api.auth.register(username, email, password);[m
[32m+[m[32m      persist(data.token, data.user);[m
[32m+[m[32m    },[m
[32m+[m[32m    [persist],[m
[32m+[m[32m  );[m
 [m
   const logout = useCallback(() => {[m
     localStorage.removeItem(TOKEN_KEY);[m
[36m@@ -53,6 +61,7 @@[m [mexport const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children[m
         user,[m
         token,[m
         isAuthenticated: token !== null,[m
[32m+[m[32m        isAdmin: user?.role === "ADMIN",[m
         login,[m
         register,[m
         logout,[m
[1mdiff --git a/frontend/src/pages/Profile/Profile.tsx b/frontend/src/pages/Profile/Profile.tsx[m
[1mindex 1d67ffd..1725557 100644[m
[1m--- a/frontend/src/pages/Profile/Profile.tsx[m
[1m+++ b/frontend/src/pages/Profile/Profile.tsx[m
[36m@@ -1,4 +1,4 @@[m
[31m-import React, { useState, useEffect } from "react";[m
[32m+[m[32mimport React, { useState, useEffect, useRef } from "react";[m
 import { useNavigate } from "react-router-dom";[m
 import Header from "../../components/header/Header";[m
 import Footer from "../../components/footer /Footer";[m
[36m@@ -15,6 +15,9 @@[m [mconst Profile: React.FC = () => {[m
   const [orders, setOrders] = useState<Order[]>([]);[m
   const [loading, setLoading] = useState(true);[m
 [m
[32m+[m[32m  const fileInputRef = useRef<HTMLInputElement>(null);[m
[32m+[m[32m  const [avatarUploading, setAvatarUploading] = useState(false);[m
[32m+[m
   const [isEditing, setIsEditing] = useState(false);[m
   const [editForm, setEditForm] = useState({ username: "", email: "" });[m
   const [saveError, setSaveError] = useState("");[m
[36m@@ -44,6 +47,25 @@[m [mconst Profile: React.FC = () => {[m
     }[m
   };[m
 [m
[32m+[m[32m  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {[m
[32m+[m[32m    const file = e.target.files?.[0];[m
[32m+[m[32m    if (!file || !profile) return;[m
[32m+[m[32m    setAvatarUploading(true);[m
[32m+[m[32m    try {[m
[32m+[m[32m      const formData = new FormData();[m
[32m+[m[32m      formData.append("avatar", file);[m
[32m+[m[32m      const result = await api.users.uploadAvatar(formData);[m
[32m+[m[32m      setProfile((prev) =>[m
[32m+[m[32m        prev ? { ...prev, avatar: result.avatarUrl } : prev,[m
[32m+[m[32m      );[m
[32m+[m[32m    } catch (err) {[m
[32m+[m[32m      console.error("Avatar upload failed:", err);[m
[32m+[m[32m    } finally {[m
[32m+[m[32m      setAvatarUploading(false);[m
[32m+[m[32m      if (fileInputRef.current) fileInputRef.current.value = "";[m
[32m+[m[32m    }[m
[32m+[m[32m  };[m
[32m+[m
   const handleEdit = () => setIsEditing(true);[m
 [m
   const handleSave = async () => {[m
[36m@@ -107,8 +129,38 @@[m [mconst Profile: React.FC = () => {[m
         <div className="profile-content">[m
           <div className="profile-header">[m
             <div className="profile-avatar">[m
[31m-              <div className="avatar-icon">👤</div>[m
[31m-              <button className="change-avatar-btn">change avatar</button>[m
[32m+[m[32m              {profile.avatar ? ([m
[32m+[m[32m                <img[m
[32m+[m[32m                  src={profile.avatar}[m
[32m+[m[32m                  alt="avatar"[m
[32m+[m[32m                  style={{[m
[32m+[m[32m                    width: "80px",[m
[32m+[m[32m                    height: "80px",[m
[32m+[m[32m                    borderRadius: "50%",[m
[32m+[m[32m                    objectFit: "cover",[m
[32m+[m[32m                  }}[m
[32m+[m[32m                />[m
[32m+[m[32m              ) : ([m
[32m+[m[32m                <div className="avatar-icon">[m
[32m+[m[32m                  {profile.username.slice(0, 2).toUpperCase()}[m
[32m+[m[32m                </div>[m
[32m+[m[32m              )}[m
[32m+[m[32m              <button[m
[32m+[m[32m                className="change-avatar-btn"[m
[32m+[m[32m                onClick={() => fileInputRef.current?.click()}[m
[32m+[m[32m                disabled={avatarUploading}[m
[32m+[m[32m              >[m
[32m+[m[32m                {avatarUploading ? "uploading..." : "change avatar"}[m
[32m+[m[32m              </button>[m
[32m+[m[32m              <input[m
[32m+[m[32m                ref={fileInputRef}[m
[32m+[m[32m                type="file"[m
[32m+[m[32m                accept="image/*"[m
[32m+[m[32m                style={{ display: "none" }}[m
[32m+[m[32m                onChange={(e) => {[m
[32m+[m[32m                  void handleAvatarChange(e);[m
[32m+[m[32m                }}[m
[32m+[m[32m              />[m
             </div>[m
 [m
             <div className="profile-info">[m
