import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "pages/HomePage";
import GuidesPage from "pages/GuidesPage";
import ProfilePage from "pages/ProfilePage";
import GuideProfilePage from "pages/GuideProfilePage";
import NewReservationPage from "pages/NewReservationPage";
import RegisterGuidePage from "pages/RegisterGuidePage";
import LoginPage from "pages/LoginPage";
import RegisterPage from "pages/RegisterPage";
import MyReservationsPage from "pages/MyReservationsPage";
import GuideDashboardPage from "pages/GuideDashboardPage";

import { AppLayout } from "@app/ui/AppLayout";

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          {/* Home */}
          <Route path="/" element={<HomePage />} />

          {/* Auth */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Turista */}
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/guides" element={<GuidesPage />} />
          <Route path="/guides/:id" element={<GuideProfilePage />} />
          <Route
            path="/reservations/new/:guideId"
            element={<NewReservationPage />}
          />
          <Route path="/reservations/me" element={<MyReservationsPage />} />

          {/* Guía */}
          <Route path="/register-guide" element={<RegisterGuidePage />} />
          <Route path="/guide/dashboard" element={<GuideDashboardPage />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
