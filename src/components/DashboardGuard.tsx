import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function DashboardGuard() {
  const { user, token } = useAuth();
  if (!token || !user) return <Navigate to="/login" replace />;
  return <Outlet />;
}
