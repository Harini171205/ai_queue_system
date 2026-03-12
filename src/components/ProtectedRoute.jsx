// ─────────────────────────────────────────────────────────────
//  ProtectedRoute.jsx – Route guard for authenticated routes
//
//  Usage:
//    <ProtectedRoute>          → requires any logged-in user
//    <ProtectedRoute role="admin"> → requires admin role
// ─────────────────────────────────────────────────────────────
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();
  const location = useLocation();

  // Not logged in → send to /login, preserving intended destination
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Logged in but wrong role
  if (role && user.role !== role) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="bg-white rounded-2xl shadow-md p-10 max-w-sm text-center space-y-4">
          <div className="text-5xl">🚫</div>
          <h2 className="text-xl font-bold text-slate-800">Access Denied</h2>
          <p className="text-slate-500 text-sm">
            You do not have permission to view this page.
          </p>
          <a
            href="/"
            className="inline-block bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-blue-800 transition"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
