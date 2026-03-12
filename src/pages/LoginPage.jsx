// ─────────────────────────────────────────────────────────────
//  LoginPage.jsx – Separate login tabs for Admin and User
// ─────────────────────────────────────────────────────────────
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

const TABS = [
  { role: 'user',  label: '👤 User Login',  icon: '👤' },
  { role: 'admin', label: '🛡️ System Manager Login', icon: '🛡️' },
];

const INITIAL_FORM = { email: '', password: '' };

const LoginPage = () => {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  // If redirected here from a protected route, go back after login
  const from = location.state?.from || '/';

  const [activeTab, setActiveTab] = useState('user');
  const [form,      setForm]      = useState(INITIAL_FORM);
  const [errors,    setErrors]    = useState({});
  const [apiError,  setApiError]  = useState('');
  const [loading,   setLoading]   = useState(false);
  const [showPass,  setShowPass]  = useState(false);

  // ── Basic validation ─────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!form.email.trim())    e.email    = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email address.';
    if (!form.password)        e.password = 'Password is required.';
    return e;
  };

  // ── Handle tab switch ────────────────────────────────────
  const handleTabChange = (role) => {
    setActiveTab(role);
    setForm(INITIAL_FORM);
    setErrors({});
    setApiError('');
  };

  // ── Form submit ──────────────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setErrors({});
    setApiError('');
    setLoading(true);

    setTimeout(() => {
      const result = login({ ...form, role: activeTab });
      setLoading(false);
      if (!result.success) {
        setApiError(result.message);
      } else {
        // Admin goes to dashboard, user goes to home or wherever they came from
        navigate(activeTab === 'admin' ? '/admin' : from, { replace: true });
      }
    }, 900);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-blue-600 to-teal-500 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* ── Header ────────────────────────────────────── */}
        <div className="bg-blue-700 px-8 py-7 text-white text-center">
          <div className="text-4xl mb-2">⬡</div>
          <h1 className="text-2xl font-extrabold">AI Queue System</h1>
          <p className="text-blue-200 text-sm mt-1">Sign in to your account</p>
        </div>

        {/* ── Role Tabs ─────────────────────────────────── */}
        <div className="flex border-b border-slate-100">
          {TABS.map(({ role, label }) => (
            <button
              key={role}
              onClick={() => handleTabChange(role)}
              className={`flex-1 py-3.5 text-sm font-semibold transition-colors
                ${activeTab === role
                  ? 'border-b-2 border-blue-700 text-blue-700 bg-blue-50'
                  : 'text-slate-500 hover:bg-slate-50'}`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── Form ──────────────────────────────────────── */}
        <form onSubmit={handleSubmit} noValidate className="px-8 py-7 space-y-5">

          {/* Admin hint */}
          {activeTab === 'admin' && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-xs text-blue-700">
              <strong>Demo System Manager credentials:</strong><br />
              Email: <code>systemmanager@gmail.com</code> &nbsp;|&nbsp; Password: <code>123456</code>
            </div>
          )}

          {/* API error */}
          {apiError && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 flex items-center gap-2">
              ❌ {apiError}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder={activeTab === 'admin' ? 'systemmanager@gmail.com' : 'you@example.com'}
              className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition
                ${errors.email ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Enter your password"
                className={`w-full border rounded-xl px-4 py-2.5 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition
                  ${errors.password ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}
              />
              <button
                type="button"
                onClick={() => setShowPass((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm"
                aria-label="Toggle password visibility"
              >
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full font-bold py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2
              ${activeTab === 'admin'
                ? 'bg-blue-900 hover:bg-blue-950 text-white disabled:opacity-60'
                : 'bg-blue-700 hover:bg-blue-800 text-white disabled:opacity-60'}`}
          >
            {loading
              ? <Loader size="sm" />
              : activeTab === 'admin' ? '🛡️ Sign In as System Manager' : '👤 Sign In'}
          </button>

          {/* Register link (only for users) */}
          {activeTab === 'user' && (
            <p className="text-center text-sm text-slate-500">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-700 font-semibold hover:underline">
                Register here
              </Link>
            </p>
          )}

          {/* Back to home */}
          <p className="text-center text-xs text-slate-400">
            <Link to="/" className="hover:text-blue-600 transition">← Back to Home</Link>
          </p>
        </form>

      </div>
    </div>
  );
};

export default LoginPage;
