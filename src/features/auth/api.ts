import api from "@lib/axios";

export type LoginCredentials = {
  email: string;
  password: string;
};

export type BackendUser = {
  id: string;
  email: string;
  username: string;
  role: "tourist" | "guide" | "admin";
};

export type LoginResponse = {
  access: string; // viene como "access" desde tu backend
  user: BackendUser;
};

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const { data } = await api.post("/auth/login", credentials);
  return data;
}

export async function register(payload: {
  email: string;
  password: string;
  username: string;
  role?: string;
}): Promise<LoginResponse> {
  const { data } = await api.post("/auth/register", payload);
  return data;
}

export async function me(): Promise<BackendUser> {
  const { data } = await api.get("/auth/me");
  return data;
}
