import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Rides from "./pages/Rides";
import RideDetail from "./pages/RideDetail"; // NOUVELLE IMPORTATION
import Stats from "./pages/Stats";
import Settings from "./pages/Settings";
import PendingDrivers from "./pages/PendingDrivers";

import ContactMessages from "./pages/ContactMessages";
import SupportTickets from "./pages/SupportTickets";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pending-drivers"
          element={
            <ProtectedRoute>
              <PendingDrivers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/rides"
          element={
            <ProtectedRoute>
              <Rides />
            </ProtectedRoute>
          }
        />

        {/* NOUVELLE ROUTE POUR LES DÉTAILS D'UNE COURSE */}
        <Route
          path="/rides/:id"
          element={
            <ProtectedRoute>
              <RideDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/stats"
          element={
            <ProtectedRoute>
              <Stats />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/contact-messages"
          element={
            <ProtectedRoute>
              <ContactMessages />
            </ProtectedRoute>
          }
        />

        <Route
          path="/support-tickets"
          element={
            <ProtectedRoute>
              <SupportTickets />
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
