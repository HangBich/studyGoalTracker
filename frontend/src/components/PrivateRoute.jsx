import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// LUU Y QUAN TRONG khi van dap:
// Component nay chi la TRAI NGHIEM NGUOI DUNG, KHONG phai bao mat.
// No chay tren trinh duyet nen ai cung sua duoc.
// Bao mat that nam o authMiddleware phia server.
export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  // Cho kiem tra token xong roi moi quyet dinh, tranh nhay ve login roi nhay lai
  if (loading) return <div className="center-box">Dang tai...</div>;

  return user ? children : <Navigate to="/login" replace />;
}
