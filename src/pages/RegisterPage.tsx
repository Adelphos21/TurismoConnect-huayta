import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "features/auth/useSession";

export default function RegisterPage() {
  const { register } = useSession();
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Llamada al API para registrar al usuario
      await register({ ...form, role: "tourist" });
      navigate("/"); // Redirige a la página de inicio tras un registro exitoso
    } catch (err) {
      console.error(err);
      alert("Error al registrarse");
    } finally {
      setLoading(false); // Asegura que se resetee el estado de carga
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-24">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow max-w-md w-full space-y-4"
      >
        <h1 className="text-2xl font-bold mb-2">Crear cuenta</h1>

        {/* Campo de nombre de usuario */}
        <input
          type="text"
          placeholder="Nombre de usuario"
          className="w-full border rounded-md p-2"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />

        {/* Campo de correo electrónico */}
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
          {loading ? "Creando cuenta..." : "Registrarse"}
        </button>
      </form>
    </div>
  );
}
