import { useSession } from "./useSession";
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

// Componente que asegura que el usuario esté autenticado
export function RequireAuth({ children }: { children: ReactNode }) {
  const { status } = useSession();
  
  if (status === "unauthenticated") {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

// Componente que asegura que el usuario tenga un rol específico
export function RequireRole({ role, children }: { role: string; children: ReactNode }) {
  const { user } = useSession();
  
  if (!user || user.role !== role) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}
