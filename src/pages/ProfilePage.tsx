import { useEffect, useState } from "react";
import { useSession } from "features/auth/useSession";
import {
  getMyReservations,
  updateReservationStatus,
  type Reservation,
} from "servicios/reservations";

export default function ProfilePage() {
  const { user, me, status } = useSession();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        let currentUser = user;

        // Si aún no tenemos user y no estamos explicitamente desautenticados,
        // intentamos cargarlo desde /auth/me
        if (!currentUser && status !== "unauthenticated") {
          const fetched = await me();
          if (!fetched) {
            setLoading(false);
            return;
          }
          currentUser = fetched as any;
        }

        if (!currentUser) {
          setLoading(false);
          return;
        }

        // Obtener las reservas del usuario
        const res = await getMyReservations(currentUser.id);
        setReservations(res);
      } catch (err) {
        console.error("Error al cargar perfil:", err);
      } finally {
        setLoading(false);
      }
    };

    // Solo intentamos cargar si no estamos claramente desautenticados
    if (status !== "unauthenticated") {
      load();
    } else {
      setLoading(false);
    }
  }, [user, me, status]);

  const handleStatusChange = async (
    id: string,
    newStatus: "confirmado" | "cancelado"
  ) => {
    try {
      await updateReservationStatus(id, newStatus);

      // Después de cambiar el estado, recargar las reservas
      if (!user) return;
      const res = await getMyReservations(user.id);
      setReservations(res);
    } catch (error) {
      console.error("Error al actualizar estado de reserva:", error);
    }
  };

  // Estados de carga / sin sesión
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-24">
        <p className="text-gray-600">Cargando perfil...</p>
      </div>
    );
  }

  if (!user || status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-24">
        <div className="bg-white shadow rounded-2xl p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-semibold mb-2">Debes iniciar sesión</h1>
          <p className="text-gray-600">
            Inicia sesión para ver tu perfil y tus reservas.
          </p>
        </div>
      </div>
    );
  }

  // Vista principal del perfil + reservas
  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Información del usuario */}
        <div className="bg-white shadow rounded-2xl p-6 mb-8">
          <h1 className="text-2xl font-semibold mb-4">Mi perfil</h1>
          <div className="space-y-2 text-gray-800">
            <p>
              <span className="font-semibold">Nombre:</span> {user.username}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {user.email}
            </p>
            <p>
              <span className="font-semibold">Tipo:</span>{" "}
              {user.role === "guide" ? "Guía" : "Turista"}
            </p>
          </div>
        </div>

        {/* Lista de reservas */}
        <div className="bg-white shadow rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">Mis reservas</h2>

          {reservations.length === 0 ? (
            <p className="text-gray-600">No tienes reservas.</p>
          ) : (
            <ul className="space-y-3">
              {reservations.map((r) => (
                <li
                  key={r.id}
                  className="bg-gray-50 border border-gray-200 p-4 rounded-lg flex justify-between items-center"
                >
                  <div className="text-sm">
                    <p>
                      <span className="font-semibold">Fecha servicio:</span>{" "}
                      {new Date(r.fecha_servicio).toLocaleString("es-PE")}
                    </p>
                    <p>
                      <span className="font-semibold">Estado:</span>{" "}
                      {r.estado}
                    </p>
                  </div>

                  {r.estado === "pendiente" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStatusChange(r.id, "confirmado")}
                        className="px-3 py-1 text-xs rounded-md border border-green-500 text-green-600 hover:bg-green-50"
                      >
                        Confirmar
                      </button>
                      <button
                        onClick={() => handleStatusChange(r.id, "cancelado")}
                        className="px-3 py-1 text-xs rounded-md border border-red-500 text-red-600 hover:bg-red-50"
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
