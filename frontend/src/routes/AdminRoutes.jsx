import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from '../pages/admin/AdminDashboard';
import ProtectedRoute from '../components/ProtectedRoute';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
};

export default AdminRoutes;