import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, isLoading } = useAuth();
  const token = localStorage.getItem('token') || localStorage.getItem('studentToken');
  const adminInfo = localStorage.getItem('adminInfo');
  const studentInfo = localStorage.getItem('studentInfo');

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Loading...
      </div>
    );
  }

  // Check if token exists
  if (!token && !user) {
    return <Navigate to="/login" replace />;
  }

  // Check if admin route requires admin user
  if (requireAdmin && !adminInfo && !user?.role === 'admin') {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
