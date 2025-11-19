// features/guides/guidesApi.ts
import api from "@lib/axios";

export interface GuideProfile {
  id: string;
  nombres: string;
  apellidos: string;
  city: string;
  country: string;
  bio: string;
  certification: boolean;
  ratingAvg: number;
  languages: { code: string; name: string }[];
}

export async function getMyGuideProfile() {
  const { data } = await api.get("/guides/me");
  return data as GuideProfile;
}
