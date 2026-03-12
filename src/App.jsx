// ─────────────────────────────────────────────────────────────
//  App.jsx – Root component: routing + global providers
// ─────────────────────────────────────────────────────────────
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueueProvider } from './context/QueueContext';
import { AuthProvider }  from './context/AuthContext';

// Components
import Navbar          from './components/Navbar';
import Notification    from './components/Notification';
import ProtectedRoute  from './components/ProtectedRoute';

// Pages
import HomePage            from './pages/HomePage';
import TokenGenerationPage from './pages/TokenGenerationPage';
import QueueStatusPage     from './pages/QueueStatusPage';
import AdminDashboard      from './pages/AdminDashboard';
import AnalyticsPage       from './pages/AnalyticsPage';
import LoginPage           from './pages/LoginPage';
import RegisterPage        from './pages/RegisterPage';

function App() {
  return (
    // AuthProvider wraps everything so auth state is globally available.
    // QueueProvider is nested inside so it can also use auth if needed.
    <AuthProvider>
      <QueueProvider>
        <BrowserRouter>
          {/* Global toast notifications */}
          <Notification />

          {/* Sticky top navigation (reads auth state internally) */}
          <Navbar />

          <Routes>
            {/* ── Public routes ──────────────────────────── */}
            <Route path="/"         element={<HomePage />} />
            <Route path="/login"    element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* ── Protected: user only ───────────────────── */}
            <Route path="/token"  element={<ProtectedRoute role="user"><TokenGenerationPage /></ProtectedRoute>} />
            <Route path="/status" element={<ProtectedRoute role="user"><QueueStatusPage /></ProtectedRoute>} />

            {/* ── Protected: admin only ──────────────────── */}
            <Route path="/admin"     element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute role="admin"><AnalyticsPage /></ProtectedRoute>} />

            {/* Fallback */}
            <Route path="*" element={<HomePage />} />
          </Routes>
        </BrowserRouter>
      </QueueProvider>
    </AuthProvider>
  );
}

export default App;
