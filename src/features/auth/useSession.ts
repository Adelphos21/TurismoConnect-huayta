// src/features/auth/useSession.ts
import { create } from "zustand";
import api from "@lib/axios";

export type SessionStatus = "unknown" | "authenticated" | "unauthenticated";

export interface SessionUser {
  id: string;
  email: string;
  username: string;
  role: "tourist" | "guide" | string;
}

interface LoginBody {
  email: string;
  password: string;
}

interface RegisterBody {
  email: string;
  username: string;
  password: string;
  role?: string; // normalmente "tourist", luego lo cambias a "guide"
}

interface SessionState {
  user: SessionUser | null;
  status: SessionStatus;

  login: (body: LoginBody) => Promise<SessionUser>;
  register: (body: RegisterBody) => Promise<SessionUser>;
  me: () => Promise<SessionUser | null>;
  logout: () => void;
}

const TOKEN_KEY = "auth_token";

export const useSession = create<SessionState>((set) => ({
  user: null,
  status: "unknown",

  // -------- LOGIN --------
  async login(body) {
    const { data } = await api.post("/auth/login", body);
    // backend (auth_handler.login_user) devuelve:
    // { access: <token>, user: { id, email, username, role } }

    const token = data.access as string;
    const user = data.user as SessionUser;

    // guardamos token en localStorage
    localStorage.setItem(TOKEN_KEY, token);

    // actualizamos el store
    set({ user, status: "authenticated" });

    return user;
  },

  // -------- REGISTER --------
  async register(body) {
    const { data } = await api.post("/auth/register", body);
    // backend (register_user) devuelve:
    // { id, email, username, role, access }

    const token = data.access as string;
    const user: SessionUser = {
      id: data.id,
      email: data.email,
      username: data.username,
      role: data.role ?? "tourist",
    };

    localStorage.setItem(TOKEN_KEY, token);
    set({ user, status: "authenticated" });

    return user;
  },

  // -------- ME (recuperar sesión desde token) --------
  async me() {
    const token = localStorage.getItem(TOKEN_KEY);

    // si no hay token, marcamos como no autenticado
    if (!token) {
      set({ user: null, status: "unauthenticated" });
      return null;
    }

    try {
      const { data } = await api.get("/auth/me");
      // auth/me devuelve: { id, email, username, role, createdAt }

      const user: SessionUser = {
        id: data.id,
        email: data.email,
        username: data.username,
        role: data.role ?? "tourist",
      };

      set({ user, status: "authenticated" });
      return user;
    } catch (err) {
      console.error("Error en /auth/me:", err);
      // si el token no sirve, lo limpiamos
      localStorage.removeItem(TOKEN_KEY);
      set({ user: null, status: "unauthenticated" });
      return null;
    }
  },

  // -------- LOGOUT --------
  logout() {
    localStorage.removeItem(TOKEN_KEY);
    set({ user: null, status: "unauthenticated" });
  },
}));
