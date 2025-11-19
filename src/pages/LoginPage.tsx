import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "features/auth/useSession";

export default function LoginPage() {
  const { login } = useSession();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form);
      navigate("/"); // Redirige al home después del login exitoso
    } catch (err) {
      console.error(err);
      alert("Error al iniciar sesión");
    } finally {
      setLoading(false); // Siempre se ejecuta después de la llamada
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-24">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow max-w-md w-full space-y-4"
      >
        <h1 className="text-2xl font-bold mb-2">Iniciar sesión</h1>

        {/* Campo de correo */}
        <input
          type="email"
          placeholder="Correo"
          className="w-full border rounded-md p-2"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        {/* Campo de contraseña */}
        <input
          type="password"
          placeholder="Contraseña"
          className="w-full border rounded-md p-2"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        {/* Botón de submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-900 transition"
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
}
