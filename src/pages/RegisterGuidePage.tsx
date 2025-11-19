import { useState, useEffect, type FormEvent } from "react";
import { createGuide, type GuideLanguage } from "servicios/guides";
import { useSession } from "features/auth/useSession";

const COLORS = {
  softOrange: "#fdf6e6",
  orange: "#f38b28",
  darkBrown: "#591a0b",
  turquoise: "#3a8b77",
  vividOrange: "#e8571e",
  mutedCyan: "#508484",
};

export default function RegisterGuidePage() {
  const { user } = useSession();

  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    dni: "",
    bio: "",
    city: "",
    country: "",
    certification: false,
    languages: "",
    correo: "",
  });

  const [loading, setLoading] = useState(false);

  // Prefill con datos del usuario logueado
  useEffect(() => {
    if (user?.email) {
      setFormData((prev) => ({
        ...prev,
        correo: prev.correo || user.email,
      }));
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const langs: GuideLanguage[] = (formData.languages || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((name) => ({
        code: name.slice(0, 2).toLowerCase(),
        name,
      }));

    try {
      await createGuide({
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        dni: formData.dni,
        bio: formData.bio,
        city: formData.city,
        country: formData.country,
        certification: formData.certification,
        languages: langs,
        correo: formData.correo,
      });

      alert("¡Tu perfil de guía se creó correctamente! 🎉");
      setFormData({
        nombres: "",
        apellidos: "",
        dni: "",
        bio: "",
        city: "",
        country: "",
        certification: false,
        languages: "",
        correo: user?.email || "",
      });
    } catch (err) {
      console.error("Error registrando guía:", err);
      alert(
        "Ocurrió un error al registrar tu perfil de guía. Por favor, intenta nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  const isLoggedEmail = !!user?.email;

  return (
    <div
      className="min-h-screen px-6 py-10 pt-24"
      style={{
        background: `linear-gradient(135deg, ${COLORS.softOrange}, #ffffff)`,
      }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Encabezado con info de usuario */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1
              className="text-3xl font-bold mb-2"
              style={{ color: COLORS.darkBrown }}
            >
              Conviértete en guía local
            </h1>
            <p className="text-sm text-gray-600 max-w-xl">
              Completa tu perfil para que turistas puedan encontrarte y
              reservar experiencias contigo. Usa una biografía atractiva y
              cuenta qué hace especial tu ciudad.
            </p>
          </div>

          {user && (
            <div className="bg-white shadow-sm rounded-xl px-4 py-3 border border-gray-100 text-sm flex flex-col gap-1">
              <span className="font-semibold text-gray-800">
                Sesión iniciada como:
              </span>
              <span className="text-gray-700">{user.username || user.email}</span>
              <span className="inline-flex mt-1 w-fit items-center rounded-full px-2 py-0.5 text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                Rol actual: {user.role === "guide" ? "Guía" : "Turista"}
              </span>
            </div>
          )}
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-md border border-[#f2e3cc]">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Datos personales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nombres */}
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="nombres"
                  style={{ color: COLORS.darkBrown }}
                >
                  Nombres
                </label>
                <input
                  type="text"
                  id="nombres"
                  name="nombres"
                  value={formData.nombres}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                  style={{ borderColor: "#e2d4bf" }}
                  required
                />
              </div>

              {/* Apellidos */}
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="apellidos"
                  style={{ color: COLORS.darkBrown }}
                >
                  Apellidos
                </label>
                <input
                  type="text"
                  id="apellidos"
                  name="apellidos"
                  value={formData.apellidos}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                  style={{ borderColor: "#e2d4bf" }}
                  required
                />
              </div>

              {/* DNI */}
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="dni"
                  style={{ color: COLORS.darkBrown }}
                >
                  DNI
                </label>
                <input
                  type="text"
                  id="dni"
                  name="dni"
                  value={formData.dni}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                  style={{ borderColor: "#e2d4bf" }}
                  required
                />
              </div>

              {/* Correo */}
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="correo"
                  style={{ color: COLORS.darkBrown }}
                >
                  Correo electrónico
                </label>
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2"
                  style={{ borderColor: "#e2d4bf" }}
                  required
                  readOnly={isLoggedEmail}
                />
                {isLoggedEmail && (
                  <p className="text-xs text-gray-500 mt-1">
                    Usaremos el mismo correo de tu cuenta para tu perfil de guía.
                  </p>
                )}
              </div>
            </div>

            {/* Bio */}
            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="bio"
                style={{ color: COLORS.darkBrown }}
              >
                Biografía
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg min-h-[120px] focus:outline-none focus:ring-2"
                style={{ borderColor: "#e2d4bf" }}
                placeholder="Cuenta quién eres, qué te apasiona de tu ciudad y por qué deberían elegirte como guía."
                required
              />
            </div>

            {/* Ciudad / País */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Ciudad */}
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="city"
                  style={{ color: COLORS.darkBrown }}
                >
                  Ciudad principal donde guías
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                  style={{ borderColor: "#e2d4bf" }}
                  placeholder="Ej: Cusco, Lima, Arequipa..."
                  required
                />
              </div>

              {/* País */}
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="country"
                  style={{ color: COLORS.darkBrown }}
                >
                  País
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                  style={{ borderColor: "#e2d4bf" }}
                  placeholder="Perú"
                  required
                />
              </div>
            </div>

            {/* Certificación */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="certification"
                name="certification"
                checked={formData.certification}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300"
              />
              <label
                htmlFor="certification"
                className="text-sm"
                style={{ color: COLORS.darkBrown }}
              >
                Soy guía turístico certificado
              </label>
            </div>

            {/* Idiomas */}
            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="languages"
                style={{ color: COLORS.darkBrown }}
              >
                Idiomas que hablas{" "}
                <span className="text-xs text-gray-500">
                  (separados por coma)
                </span>
              </label>
              <input
                type="text"
                id="languages"
                name="languages"
                value={formData.languages}
                onChange={handleChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                style={{ borderColor: "#e2d4bf" }}
                placeholder="Ej: Español, Inglés, Francés"
                required
              />
            </div>

            {/* Botón de enviar */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg font-semibold text-white shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
                style={{
                  background: `linear-gradient(135deg, ${COLORS.orange}, ${COLORS.vividOrange})`,
                }}
              >
                {loading ? "Guardando tu perfil..." : "Crear perfil de guía"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
