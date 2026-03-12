// ─────────────────────────────────────────────────────────────
//  RegisterPage.jsx – New user registration (name/email/password)
// ─────────────────────────────────────────────────────────────
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

const INITIAL_FORM = { name: '', email: '', password: '', confirmPassword: '' };

// Password strength checker
const getStrength = (pwd) => {
  let score = 0;
  if (pwd.length >= 8)              score++;
  if (/[A-Z]/.test(pwd))           score++;
  if (/[0-9]/.test(pwd))           score++;
  if (/[^A-Za-z0-9]/.test(pwd))    score++;
  return score; // 0-4
};

const STRENGTH_LABELS = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const STRENGTH_COLORS = ['', 'bg-red-400', 'bg-yellow-400', 'bg-blue-400', 'bg-green-500'];

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate     = useNavigate();

  const [form,     setForm]     = useState(INITIAL_FORM);
  const [errors,   setErrors]   = useState({});
  const [apiError, setApiError] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [showPass, setShowPass] = useState(false);

  const strength = getStrength(form.password);

  // ── Validation ────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!form.name.trim())             e.name = 'Full name is required.';
    if (!form.email.trim())            e.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email.';
    if (!form.password)                e.password = 'Password is required.';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters.';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match.';
    return e;
  };

  // ── Submit ────────────────────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setErrors({});
    setApiError('');
    setLoading(true);

    setTimeout(() => {
      const result = register({ name: form.name, email: form.email, password: form.password });
      setLoading(false);
      if (!result.success) {
        setApiError(result.message);
      } else {
        navigate('/', { replace: true });
      }
    }, 900);
  };

  const field = (key) => ({
    value: form[key],
    onChange: (e) => setForm({ ...form, [key]: e.target.value }),
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-blue-600 to-teal-500 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* ── Header ────────────────────────────────────── */}
        <div className="bg-teal-600 px-8 py-7 text-white text-center">
          <div className="text-4xl mb-2">✨</div>
          <h1 className="text-2xl font-extrabold">Create Account</h1>
          <p className="text-teal-100 text-sm mt-1">Join the AI Queue System</p>
        </div>

        {/* ── Form ──────────────────────────────────────── */}
        <form onSubmit={handleSubmit} noValidate className="px-8 py-7 space-y-5">

          {/* API error */}
          {apiError && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 flex items-center gap-2">
              ❌ {apiError}
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Arjun Sharma"
              className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition
                ${errors.name ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}
              {...field('name')}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition
                ${errors.email ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}
              {...field('email')}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Password with strength meter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Minimum 6 characters"
                className={`w-full border rounded-xl px-4 py-2.5 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition
                  ${errors.password ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}
                {...field('password')}
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
            {/* Strength bar */}
            {form.password && (
              <div className="mt-2 space-y-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-colors
                        ${i <= strength ? STRENGTH_COLORS[strength] : 'bg-slate-100'}`}
                    />
                  ))}
                </div>
                <p className="text-xs text-slate-400">
                  Strength: <span className="font-medium text-slate-600">{STRENGTH_LABELS[strength]}</span>
                </p>
              </div>
            )}
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="Re-enter your password"
              className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition
                ${errors.confirmPassword ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}
              {...field('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2"
          >
            {loading ? <Loader size="sm" /> : '✨ Create Account'}
          </button>

          {/* Login link */}
          <p className="text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-700 font-semibold hover:underline">
              Sign in
            </Link>
          </p>

          <p className="text-center text-xs text-slate-400">
            <Link to="/" className="hover:text-blue-600 transition">← Back to Home</Link>
          </p>
        </form>

      </div>
    </div>
  );
};

export default RegisterPage;
