// app/ui/AppNavbar.tsx
import { useEffect } from "react";
import { useSession } from "features/auth/useSession";
import { PublicNavbar } from "./PublicNavbar";
import { TouristNavbar } from "./TouristNavbar";
import { GuideNavbar } from "./GuideNavbar";

export function AppNavbar() {
  const { status, me, user } = useSession();

  useEffect(() => {
    if (status === "unknown") {
      const token = localStorage.getItem("auth_token");
      if (token) {
        me();
      }
    }
  }, [status, me]);

  if (status !== "authenticated") {
    return <PublicNavbar />;
  }

  // Si es guía
  if (user?.role === "guide") {
    return <GuideNavbar />;
  }

  // Por defecto, turista
  return <TouristNavbar />;
}
