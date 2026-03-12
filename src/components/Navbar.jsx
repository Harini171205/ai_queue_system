// ─────────────────────────────────────────────────────────────
//  Navbar.jsx – Top navigation bar shown on all public pages
// ─────────────────────────────────────────────────────────────
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { label: 'Home',            to: '/',         roles: ['guest', 'user'] },
  { label: 'Get Token',       to: '/token',    roles: ['user'] },
  { label: 'My Queue',        to: '/status',   roles: ['user'] },
  { label: 'Analytics',       to: '/analytics', roles: ['admin'] },
  { label: 'System Manager',  to: '/admin',    roles: ['admin'] },
];

const Navbar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Show links based on auth role
  const currentRole = user?.role || 'guest';
  const visibleLinks = NAV_LINKS.filter((l) => l.roles.includes(currentRole));

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMenuOpen(false);
    navigate('/');
  };

  // Avatar initials
  const initials = user
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '';

  return (
    <nav className="bg-blue-700 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Brand */}
          <Link to="/" className="flex items-center gap-2 font-bold text-lg tracking-wide">
            <span className="text-teal-300 text-2xl">⬡</span>
            <span>AI Queue</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {visibleLinks.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${pathname === to
                    ? 'bg-blue-900 text-teal-300'
                    : 'hover:bg-blue-600'}`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Desktop auth section */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              /* Logged-in user avatar + dropdown */
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen((o) => !o)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded-xl transition"
                >
                  <div className="w-7 h-7 bg-teal-400 text-blue-900 rounded-full flex items-center justify-center text-xs font-bold">
                    {initials}
                  </div>
                  <div className="text-left leading-tight">
                    <p className="text-xs font-semibold truncate max-w-[100px]">{user.name}</p>
                    <p className="text-xs text-blue-200">{user.role === 'admin' ? 'System Manager' : 'User'}</p>
                  </div>
                  <span className="text-blue-200 text-xs">{dropdownOpen ? '▲' : '▼'}</span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-sm font-semibold text-slate-800 truncate">{user.name}</p>
                      <p className="text-xs text-slate-400 truncate">{user.email}</p>
                      <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium
                        ${user.role === 'admin' ? 'bg-blue-100 text-blue-700' : 'bg-teal-100 text-teal-700'}`}>
                        {user.role === 'admin' ? '🛡️ System Manager' : '👤 User'}
                      </span>
                    </div>
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
                      >
                        🏠 Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      🚪 Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Guest: Login / Register */
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium hover:text-teal-300 transition px-2 py-1"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-teal-400 text-blue-900 font-bold text-sm px-4 py-1.5 rounded-xl hover:bg-teal-300 transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-blue-600 focus:outline-none"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <span className="block w-6 h-0.5 bg-white mb-1"></span>
            <span className="block w-6 h-0.5 bg-white mb-1"></span>
            <span className="block w-6 h-0.5 bg-white"></span>
          </button>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="md:hidden pb-3 space-y-1">
            {visibleLinks.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={`block px-4 py-2 rounded-md text-sm font-medium
                  ${pathname === to
                    ? 'bg-blue-900 text-teal-300'
                    : 'hover:bg-blue-600'}`}
              >
                {label}
              </Link>
            ))}

            {/* Mobile auth */}
            <div className="border-t border-blue-600 pt-2 mt-1">
              {user ? (
                <>
                  <div className="px-4 py-2 text-sm text-blue-100">
                    Signed in as <strong>{user.name}</strong>
                    <span className="ml-1 text-xs text-blue-300">({user.role === 'admin' ? 'System Manager' : 'User'})</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-300 hover:bg-blue-600 rounded-md"
                  >
                    🚪 Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm hover:bg-blue-600 rounded-md">
                    Sign In
                  </Link>
                  <Link to="/register" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm text-teal-300 hover:bg-blue-600 rounded-md">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
