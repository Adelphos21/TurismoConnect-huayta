// src/servicios/guides.ts
import api from "@lib/axios";

export interface GuideLanguage {
  code: string;
  name: string;
}

// Lo que devuelve GET /guides/{id}
export interface GuideDetail {
  id: string;
  nombres: string;
  apellidos: string;
  city: string;
  country: string;
  bio: string;
  certification: boolean;
  ratingAvg: number;
  languages: GuideLanguage[];
}

// Lo que devuelve /guides/search
export interface GuideSearchItem {
  id: string;
  fullName: string;
  city: string | null;
  ratingAvg: number;
  certification: boolean;
  languages: string[]; // códigos de idiomas: ["es", "en", ...]
  nextAvailable?: {
    startTime: string;
    endTime: string;
    status: string;
  };
  hourlyRate?: {
    currency: string;
    hourlyRate: number;
  };
}

// Perfil propio del guía (puedes usar mismo shape que GuideDetail)
export type GuideProfile = GuideDetail;

// ---------- API calls ----------

// GET /guides/search
export async function getGuides(params?: {
  city?: string;
  date?: string;
  language?: string;
  certification?: boolean;
}) {
  const { data } = await api.get("/guides/search", {
    params: {
      city: params?.city,
      date: params?.date,
      language: params?.language,
      certification:
        typeof params?.certification === "boolean"
          ? String(params.certification)
          : undefined,
    },
  });

  return data as GuideSearchItem[];
}

// GET /guides/{id}
export async function getGuideById(id: string) {
  const { data } = await api.get(`/guides/${id}`);
  return data as GuideDetail;
}

// POST /guides
export async function createGuide(body: {
  nombres: string;
  apellidos: string;
  dni: string;
  bio: string;
  city: string;
  country: string;
  certification: boolean;
  languages: GuideLanguage[];
  correo: string;
}) {
  const { data } = await api.post("/guides", body);
  return data;
}

// GET /guides/me
export async function getMyGuideProfile() {
  const { data } = await api.get("/guides/me");
  return data as GuideProfile;
}
