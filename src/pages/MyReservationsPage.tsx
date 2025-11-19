import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useSession } from "features/auth/useSession";
import {
  getMyReservations,
  type Reservation,
} from "../servicios/reservations";

const STATUS_LABELS: Record<Reservation["estado"], string> = {
  pendiente: "Pendiente",
  confirmado: "Confirmada",
  cancelado: "Cancelada",
};

function MyReservationsPage() {
  const { status, user } = useSession();
  const navigate = useNavigate();

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Si no está autenticado, mandamos a login
  useEffect(() => {
    if (status === "unauthenticated") {
      navigate("/login");
    }
  }, [status, navigate]);

  // Cargar reservas del usuario autenticado
  useEffect(() => {
    if (status !== "authenticated" || !user?.id) return;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getMyReservations(user.id);
        setReservations(data);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar tus reservas. Inténtalo de nuevo.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [status, user?.id]);

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString("es-PE", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return iso;
    }
  };

  const formatTime = (iso: string) => {
    try {
      return new Date(iso).toLocaleTimeString("es-PE", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  const statusPillClasses = (estado: Reservation["estado"]) => {
    switch (estado) {
      case "confirmado":
        // turquesa
        return "bg-[#3a8b77]/10 text-[#3a8b77] border border-[#3a8b77]/40";
      case "cancelado":
        // naranja vivido
        return "bg-[#e8571e]/10 text-[#e8571e] border border-[#e8571e]/40";
      default:
        // pendiente: cian apagado / naranja
        return "bg-[#f38b28]/10 text-[#f38b28] border border-[#f38b28]/40";
    }
  };

  if (status === "unknown") {
    return (
      <div className="min-h-[60vh] bg-gradient-to-b from-[#fdf6e6] via-white to-white">
        <div className="max-w-5xl mx-auto px-4 py-16">
          <p className="text-[#591a0b]">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] bg-gradient-to-b from-[#fdf6e6] via-white to-white">
      <div className="max-w-5xl mx-auto px-4 py-16">
        {/* Encabezado */}
        <header className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-[#508484] shadow-sm border border-[#fce0b8]">
            <span className="w-2 h-2 rounded-full bg-[#f38b28]" />
            Tu historial de experiencias
          </div>
          <h1 className="mt-3 text-3xl md:text-4xl font-bold text-[#591a0b]">
            Mis reservas
          </h1>
          <p className="mt-2 text-sm md:text-base text-[#508484] max-w-xl">
            Revisa tus tours programados, confirma detalles y lleva el control
            de tus próximas aventuras.
          </p>
        </header>

        {/* Estados de carga / error */}
        {loading && (
          <div className="text-[#508484] text-sm">Cargando reservas...</div>
        )}

        {error && (
          <div className="mb-4 rounded-xl border border-[#e8571e]/30 bg-[#e8571e]/5 px-4 py-3 text-sm text-[#e8571e]">
            {error}
          </div>
        )}

        {/* Sin reservas */}
        {!loading && !error && reservations.length === 0 && (
          <div className="mt-6 rounded-2xl border border-dashed border-[#f38b28]/40 bg-white/80 px-6 py-8 text-center shadow-sm">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#fdf6e6] border border-[#f38b28]/30 mb-3">
              <span className="text-2xl">🧳</span>
            </div>
            <h2 className="text-lg font-semibold text-[#591a0b]">
              Aún no tienes reservas
            </h2>
            <p className="mt-1 text-sm text-[#508484]">
              Explora nuestros guías y agenda tu primera experiencia turística.
            </p>
            <Link
              to="/guides"
              className="inline-flex items-center justify-center mt-4 px-4 py-2 rounded-full text-sm font-semibold text-white bg-[#f38b28] hover:bg-[#e8571e] transition-colors shadow-sm"
            >
              Ver guías disponibles
            </Link>
          </div>
        )}

        {/* Lista de reservas */}
        {!loading && !error && reservations.length > 0 && (
          <div className="mt-6 space-y-4">
            {reservations.map((r) => (
              <article
                key={r.id}
                className="relative overflow-hidden rounded-2xl bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-[#fce0b8]"
              >
                {/* Borde lateral decorativo */}
                <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-[#f38b28] via-[#e8571e] to-[#3a8b77]" />

                <div className="pl-4 pr-5 py-4 md:pl-6 md:pr-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  {/* Columna izquierda: info principal */}
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-baseline gap-2">
                        <h2 className="text-base md:text-lg font-semibold text-[#591a0b]">
                          Reserva #{r.id.slice(0, 8)}
                        </h2>
                        <span className="text-xs text-[#508484]">
                          creada el {formatDate(r.fecha_creacion)}
                        </span>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${statusPillClasses(
                          r.estado
                        )}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {STATUS_LABELS[r.estado]}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm mt-1">
                      <div className="flex flex-col">
                        <span className="text-xs uppercase tracking-wide text-[#508484]">
                          Fecha del servicio
                        </span>
                        <span className="text-sm font-medium text-[#591a0b]">
                          {formatDate(r.fecha_servicio)}
                        </span>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-xs uppercase tracking-wide text-[#508484]">
                          Hora
                        </span>
                        <span className="text-sm font-medium text-[#591a0b]">
                          {formatTime(r.fecha_servicio)}
                        </span>
                        <span className="text-xs text-[#508484]">
                          Duración: {r.duracion_horas} h
                        </span>
                      </div>

                      <div className="flex flex-col items-start sm:items-end">
                        <span className="text-xs uppercase tracking-wide text-[#508484]">
                          Precio total
                        </span>
                        <span className="text-lg font-bold text-[#f38b28]">
                          S/ {r.precio_total.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {r.comentario && (
                      <p className="mt-1 text-xs md:text-sm text-[#508484] bg-[#fdf6e6]/70 rounded-xl px-3 py-2">
                        <span className="font-medium text-[#591a0b]">
                          Nota:
                        </span>{" "}
                        {r.comentario}
                      </p>
                    )}
                  </div>

                  {/* (Futuras acciones) espacio derecho */}
                  {/* Aquí podrías agregar botones de ver detalles, cancelar, etc. */}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyReservationsPage;
