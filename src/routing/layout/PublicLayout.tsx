import { Navigate, Outlet } from 'react-router-dom';
export default function PublicLayout() {
  const token: string | null = localStorage.getItem("token");
  return !token ? <Outlet /> : <Navigate to="/dashboard" />;
}
