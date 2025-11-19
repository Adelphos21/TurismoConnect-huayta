import { useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { AppNavbar } from "app/ui/AppNavbar";

export function AppLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Navbar fijo y transparente */}
      <AppNavbar />

      {/* Si no estamos en home, agregamos espacio para que no se tape el contenido */}
      <main
        className={`flex-1 w-full ${!isHome ? "pt-24" : ""}`}
      >
        {children}
      </main>

      <footer className="bg-gray-100 text-center p-2 relative z-10">
        &copy; {new Date().getFullYear()} CityGuides
      </footer>
    </div>
  );
}
