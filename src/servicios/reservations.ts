import api from "@lib/axios";

// Interfaz para la estructura de una reserva
export interface Reservation {
  id: string;
  user_id: string;
  guide_id: string;
  fecha_reserva: string;
  fecha_servicio: string;
  duracion_horas: number;
  precio_total: number;
  estado: "pendiente" | "confirmado" | "cancelado";
  comentario: string;
  fecha_creacion: string;
}

// Función para crear una nueva reserva
export async function createReservation(body: {
  user_id: string;
  guide_id: string;
  fecha_servicio: string;
  duracion_horas: number;
  precio_total: number;
  comentario?: string;
}) {
  const { data } = await api.post("/internal/reservas", body);
  return data as Reservation;
}

// Función para obtener una reserva por ID
export async function getReservationById(id: string) {
  const { data } = await api.get(`/internal/reservas/${id}`);
  return data as Reservation;
}

// Función para obtener todas las reservas de un usuario
export async function getMyReservations(user_id: string) {
  const { data } = await api.get(`/internal/reservas/usuario/${user_id}`);
  return data as Reservation[];
}

// Función para obtener todas las reservas de un guía
export async function getGuideReservations(guide_id: string) {
  const { data } = await api.get(`/internal/reservas/guia/${guide_id}`);
  return data as Reservation[];
}

// Función para actualizar el estado de una reserva
export async function updateReservationStatus(
  id: string,
  status: "confirmado" | "cancelado"
) {
  // Determina la ruta dependiendo del estado de la reserva
  const path =
    status === "confirmado"
      ? `/internal/reservas/${id}/confirmar`
      : `/internal/reservas/${id}/cancelar`;

  const { data } = await api.put(path);
  return data as Reservation;
}
