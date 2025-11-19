// src/servicios/guides.ts
import api from "@lib/axios";

/** Idioma de un guía */
export interface GuideLanguage {
  code: string;
  name: string;
}

/** Resumen de guía (listado / búsqueda) */
export interface GuideSummary {
  id: string;
  fullName: string;
  city?: string;
  ratingAvg: number;
  certification?: boolean;
  languages: string[];

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

/** Alias para usar en listas si ya tienes el tipo Guide en otras partes */
export type Guide = GuideSummary;

/** Perfil detallado de guía (vista de perfil, dashboard guía, etc.) */
export interface GuideProfile {
  id: string;
  nombres: string;
  apellidos: string;
  city?: string;
  country?: string;
  bio?: string;
  certification?: boolean;
  ratingAvg: number;
  languages: GuideLanguage[];
}

/** Crear guía (formulario "Conviértete en guía") */
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
  return data as { id: string; message: string };
}

/** Buscar guías (listado principal de guías) */
export async function getGuides(params?: {
  city?: string;
  date?: string;         // YYYY-MM-DD
  language?: string;
  certification?: boolean;
}) {
  const { data } = await api.get<GuideSummary[]>("/guides/search", {
    params: {
      city: params?.city,
      date: params?.date,
      language: params?.language,
      // el lambda espera "true"/"false" como string
      certification:
        typeof params?.certification === "boolean"
          ? String(params.certification)
          : undefined,
    },
  });

  return data;
}

/** Compat: si en algún lado importas getGuide en singular */
export async function getGuide(id: string) {
  const { data } = await api.get<GuideProfile>(`/guides/${id}`);
  return data;
}

/** Nombre alternativo más explícito por si lo usas así en alguna parte */
export const getGuideById = getGuide;

/** Perfil de guía del usuario autenticado (GET /guides/me) */
export async function getMyGuideProfile() {
  const { data } = await api.get<GuideProfile>("/guides/me");
  return data;
}
