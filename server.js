// server.js
import jsonServer from "json-server";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "db.json"));
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Simulamos usuario logueado
const LOGGED_USER_ID = 1; // turista
const LOGGED_GUIDE_ID = 2; // guía

// 🔹 /me → devuelve el usuario logueado
server.get("/me", (req, res) => {
  const db = router.db;
  const user = db.get("users").find({ id: LOGGED_USER_ID }).value();
  if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
  res.json(user);
});

// 🔹 /reservations/me → reservas del turista logueado
server.get("/reservations/me", (req, res) => {
  const db = router.db;
  const reservations = db
    .get("reservations")
    .filter({ touristId: LOGGED_USER_ID })
    .value();
  res.json(reservations);
});

// 🔹 /reservations/guide → reservas del guía logueado
server.get("/reservations/guide", (req, res) => {
  const db = router.db;
  const reservations = db
    .get("reservations")
    .filter({ guideId: LOGGED_GUIDE_ID })
    .value();
  res.json(reservations);
});

// 🔹 /internal/guides → simulación del microservicio de guías
server.get("/internal/guides", (req, res) => {
  const db = router.db;
  const guides = db.get("guides").value();
  res.json(guides);
});

// 🔹 /internal/auth/private → simulación de auth service
server.get("/internal/auth/private", (req, res) => {
  res.json({ ok: true, user: { id: LOGGED_USER_ID, name: "Usuario Mock" } });
});

// 🔹 Delega al router para el resto (CRUD normal)
server.use(router);

// 🚀 Arrancar servidor
const PORT = 4000;
server.listen(PORT, () => {
  console.log(`✅ Fake backend corriendo en http://localhost:${PORT}`);
});
