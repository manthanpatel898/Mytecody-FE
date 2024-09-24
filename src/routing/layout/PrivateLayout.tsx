import { Navigate, Outlet } from 'react-router-dom';
export default function PrivateLayout() {
  const token: string | null = localStorage.getItem("token");
  return token ? <Outlet /> : <Navigate to="/login" />;
}
