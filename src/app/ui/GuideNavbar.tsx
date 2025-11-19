// app/ui/GuideNavbar.tsx
import { Link } from "react-router-dom";
import { useSession } from "features/auth/useSession";

export function GuideNavbar() {
  const { user, logout } = useSession();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-3">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-[#e8571e]">
          TurismoConect
        </Link>

        {/* Links */}
        <div className="flex gap-4 items-center text-sm font-medium">
          <Link
            to="/guide/dashboard"
            className="text-[#591a0b] hover:text-[#e8571e] transition-colors"
          >
            Mis reservas
          </Link>

          <Link
            to="/guides"
            className="text-[#591a0b] hover:text-[#e8571e] transition-colors"
          >
            Buscar guías
          </Link>

          <Link
            to="/profile"
            className="text-[#591a0b] hover:text-[#e8571e] transition-colors"
          >
            Mi perfil
          </Link>

          {/* User */}
          <span className="px-3 py-1 rounded-full bg-[#fdf6e6] text-[#591a0b] text-xs">
            Guía · {user?.username || user?.email}
          </span>

          {/* Logout */}
          <button
            onClick={logout}
            className="px-3 py-1 rounded-md border border-[#3a8b77] text-[#3a8b77] hover:bg-[#3a8b77] hover:text-white transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </nav>
  );
}
