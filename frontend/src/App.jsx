import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import GoalForm from './pages/GoalForm';
import GoalDetail from './pages/GoalDetail';

// SPA (Lec 6): mot lan tai trang, sau do React Router doi giao dien
// theo URL ma KHONG goi lai server -> chuyen trang tuc thi.
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Route cong khai */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Route can dang nhap - boc trong PrivateRoute */}
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/goals/new" element={<PrivateRoute><GoalForm /></PrivateRoute>} />
          <Route path="/goals/:id" element={<PrivateRoute><GoalDetail /></PrivateRoute>} />
          <Route path="/goals/:id/edit" element={<PrivateRoute><GoalForm /></PrivateRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
