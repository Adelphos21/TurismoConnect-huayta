import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import logaso from "../../assets/logaso.jpeg";

export function PublicNavbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gray-200/80 backdrop-blur-md shadow-sm transition">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img
            src={logaso}
            alt="Logo"
            className="w-9 h-9 rounded-full object-cover"
          />
          <span className="text-xl font-semibold text-gray-900">
            TurismoConect
          </span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center space-x-8 text-gray-800 font-medium">
          <Link to="/guides" className="hover:text-black transition">
            Buscar guías
          </Link>
          <HashLink smooth to="/#como-funciona" className="hover:text-black transition">
            Cómo funciona
          </HashLink>
          <HashLink smooth to="/#destinos" className="hover:text-black transition">
            Destinos
          </HashLink>
          <HashLink smooth to="/#conviertete-en-guia" className="hover:text-black transition">
            Conviértete en guía
          </HashLink>
        </div>

        {/* Auth */}
        <div className="flex items-center space-x-6">
          <Link
            to="/login"
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-black text-white font-medium"
          >
            Iniciar sesión
          </Link>
          <Link
            to="/register"
            className="hidden md:inline-block text-sm text-gray-800 hover:underline"
          >
            Crear cuenta
          </Link>
        </div>
      </div>
    </nav>
  );
}
