// src/pages/GuideDashboardPage.tsx
import { useEffect, useState } from "react";
import { useSession } from "features/auth/useSession";
import {
  getGuideReservations,
  updateReservationStatus,
  type Reservation,
} from "servicios/reservations";
import { getMyGuideProfile, type GuideProfile } from "../servicios/guides";
import { Check, X, Clock, Calendar, User } from "lucide-react";

const COLORS = {
  softOrange: "#fdf6e6",
  orange: "#f38b28",
  darkBrown: "#591a0b",
  turquoise: "#3a8b77",
  vividOrange: "#e8571e",
  mutedCyan: "#508484",
};

export default function GuideDashboardPage() {
  const { status, user } = useSession();

  const [guide, setGuide] = useState<GuideProfile | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = status === "authenticated";
  const isGuide = user?.role === "guide";

  // Cargar perfil de guía + reservas
  useEffect(() => {
    const loadData = async () => {
      if (!isAuthenticated || !isGuide) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);

        const guideProfile = await getMyGuideProfile();
        setGuide(guideProfile);

        const resvs = await getGuideReservations(guideProfile.id);
        // Opcional: ordenar por fecha de servicio
        resvs.sort((a, b) =>
          (a.fecha_servicio || "").localeCompare(b.fecha_servicio || "")
        );
        setReservations(resvs);
      } catch (err) {
        console.error(err);
        setError("No pudimos cargar tus reservas. Intenta de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isAuthenticated, isGuide]);

  // Handler para aceptar / rechazar
  const handleUpdateStatus = async (
    reservationId: string,
    newStatus: "confirmado" | "cancelado"
  ) => {
    try {
      setActionLoadingId(reservationId);
      setError(null);
      const updated = await updateReservationStatus(reservationId, newStatus);

      setReservations((prev) =>
        prev.map((r) => (r.id === reservationId ? updated : r))
      );
    } catch (err) {
      console.error(err);
      setError("No se pudo actualizar el estado de la reserva.");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Estados de acceso
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-24 px-4">
        <div className="bg-white rounded-2xl shadow-md p-6 max-w-md w-full text-center">
          <h1 className="text-xl font-semibold mb-2" style={{ color: COLORS.darkBrown }}>
            Inicia sesión para ver tu panel de guía
          </h1>
          <p className="text-gray-600 text-sm">
            Este panel es solo para usuarios autenticados con perfil de guía.
          </p>
        </div>
      </div>
    );
  }

  if (!isGuide) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-24 px-4">
        <div className="bg-white rounded-2xl shadow-md p-6 max-w-md w-full text-center">
          <h1 className="text-xl font-semibold mb-2" style={{ color: COLORS.darkBrown }}>
            Aún no eres guía
          </h1>
          <p className="text-gray-600 text-sm mb-4">
            Crea tu perfil de guía para poder recibir y gestionar reservas.
          </p>
          <a
            href="/register-guide"
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold text-white"
            style={{
              background: `linear-gradient(135deg, ${COLORS.orange}, ${COLORS.vividOrange})`,
            }}
          >
            Crear perfil de guía
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen pt-24 px-4 pb-10"
      style={{
        background: `linear-gradient(135deg, ${COLORS.softOrange}, #ffffff)`,
      }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Encabezado */}
        <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1
              className="text-3xl font-bold mb-2"
              style={{ color: COLORS.darkBrown }}
            >
              Panel de guía
            </h1>
            <p className="text-sm text-gray-600 max-w-xl">
              Administra tus reservas: confirma, cancela y organiza tu agenda
              como guía local.
            </p>
          </div>

          {guide && (
            <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-[#f2e3cc] text-sm flex flex-col gap-1">
              <span className="font-semibold text-gray-800">
                {guide.nombres} {guide.apellidos}
              </span>
              <span className="text-gray-600 text-xs">
                {guide.city} {guide.city && guide.country && "·"} {guide.country}
              </span>
              <span className="inline-flex mt-1 w-fit items-center rounded-full px-2 py-0.5 text-xs font-medium bg-[#fdf6e6] text-[#8b4513] border border-[#f2e3cc]">
                Guía verificado en CityGuides
              </span>
            </div>
          )}
        </header>

        {/* Error global */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="flex items-center gap-3 text-gray-600">
              <Clock className="w-5 h-5 animate-spin" />
              <span>Cargando tus reservas...</span>
            </div>
          </div>
        ) : reservations.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md border border-[#f2e3cc] p-8 text-center">
            <h2 className="text-lg font-semibold mb-2" style={{ color: COLORS.darkBrown }}>
              Aún no tienes reservas
            </h2>
            <p className="text-sm text-gray-600">
              Cuando los viajeros reserven contigo, aparecerán aquí para que puedas
              aceptarlas o rechazarlas.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {reservations.map((reserva) => {
              const isPending = reserva.estado === "pendiente";
              const isWorking = actionLoadingId === reserva.id;

              return (
                <div
                  key={reserva.id}
                  className="bg-white rounded-2xl shadow-md border border-[#f2e3cc] p-5 flex flex-col justify-between"
                >
                  {/* Info principal */}
                  <div className="space-y-3">
                    {/* Estado + fecha servicio */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Reserva #{reserva.id.slice(0, 8)}
                      </span>
                      <StatusBadge estado={reserva.estado} />
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>
                        Servicio el{" "}
                        <strong>{reserva.fecha_servicio}</strong> ·{" "}
                        {reserva.duracion_horas} hora
                        {reserva.duracion_horas !== 1 ? "s" : ""}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <User className="w-4 h-4 text-gray-500" />
                      <span>
                        Turista:{" "}
                        <span className="font-mono text-xs bg-gray-50 px-2 py-0.5 rounded-full border border-gray-200">
                          {reserva.user_id}
                        </span>
                      </span>
                    </div>

                    {reserva.comentario && (
                      <p className="text-sm text-gray-600 bg-[#fdf6e6] border border-[#f2e3cc] rounded-xl px-3 py-2">
                        <span className="font-semibold text-xs text-gray-700">
                          Comentario del viajero:
                        </span>
                        <br />
                        {reserva.comentario}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-gray-500">
                        Creada: {reserva.fecha_creacion}
                      </span>
                      <span
                        className="text-base font-semibold"
                        style={{ color: COLORS.turquoise }}
                      >
                        S/ {reserva.precio_total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Botones */}
                  <div className="mt-4 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      disabled={!isPending || isWorking}
                      onClick={() =>
                        handleUpdateStatus(reserva.id, "cancelado")
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border border-red-200 text-red-700 hover:bg-red-50 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <X className="w-4 h-4" />
                      {isWorking && !isPending
                        ? "Procesando..."
                        : "Rechazar"}
                    </button>
                    <button
                      type="button"
                      disabled={!isPending || isWorking}
                      onClick={() =>
                        handleUpdateStatus(reserva.id, "confirmado")
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{
                        background: `linear-gradient(135deg, ${COLORS.turquoise}, ${COLORS.mutedCyan})`,
                      }}
                    >
                      <Check className="w-4 h-4" />
                      {isWorking ? "Actualizando..." : "Aceptar reserva"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// Badge de estado separado para que quede más limpio
function StatusBadge({ estado }: { estado: Reservation["estado"] }) {
  if (estado === "pendiente") {
    return (
      <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100">
        <Clock className="w-3 h-3 mr-1" />
        Pendiente
      </span>
    );
  }

  if (estado === "confirmado") {
    return (
      <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
        <Check className="w-3 h-3 mr-1" />
        Confirmado
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-red-50 text-red-700 border border-red-100">
      <X className="w-3 h-3 mr-1" />
      Cancelado
    </span>
  );
}
