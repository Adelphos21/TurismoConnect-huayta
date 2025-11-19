import { Link } from "react-router-dom";
import { useSession } from "features/auth/useSession";

export function TouristNavbar() {
  const { user, logout } = useSession();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-3">

        {/* Logo */}
        <Link to="/" className="text-xl font-bold">
          TurismoConect
        </Link>

        {/* Links */}
        <div className="flex gap-4 items-center text-sm font-medium">
          <Link to="/guides">Guías</Link>
          <Link to="/reservations/me">Mis reservas</Link>
          <Link to="/profile">Perfil</Link>

          {/* User */}
          <span className="text-gray-600">
            {user?.username || user?.email}
          </span>

          {/* Logout */}
          <button
            onClick={logout}
            className="px-3 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Cerrar sesión
          </button>
        </div>

      </div>
    </nav>
  );
}
