import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminLayout from "../layout/AdminLayout";

// Import Only Admin Pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import AssignVolunteer from "../pages/admin/AssignVolunteer";
import AdminBulletboard from "../pages/admin/AdminBulletboard";
import UpgradeData from "../pages/admin/UpgradeData";
import About from "../pages/admin/About";
import Setting from "../pages/students/Setting";
import StudentLogs from "../pages/admin/StudentLogs"; 
import Embedded from "../pages/admin/Embedded";
// Auth Pages
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import AdminWhatsAppBot from "../pages/admin/AdminWhatsAppBot";

const AdminRoutes = () => {
  return (
    <Routes>
      {/* Protected Admin Routes - paths are relative since App.jsx routes /admin/* here */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/assign-volunteers"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <AssignVolunteer />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/bulletboard"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <AdminBulletboard />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/upgrade-data"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <UpgradeData />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/student-logs"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <StudentLogs />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/about"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <About />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/whatsapp-bot"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <AdminWhatsAppBot />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/embedded"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Embedded />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Setting />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AdminRoutes;
