// ─────────────────────────────────────────────────────────────
//  Sidebar.jsx – Left navigation sidebar used in Admin pages
// ─────────────────────────────────────────────────────────────
import { Link, useLocation } from 'react-router-dom';

const MENU_ITEMS = [
  { icon: '🏠', label: 'Dashboard',  to: '/admin'      },
  { icon: '📊', label: 'Analytics',  to: '/analytics'  },
];

const Sidebar = () => {
  const { pathname } = useLocation();

  return (
    <aside className="hidden md:flex flex-col w-56 bg-blue-900 text-white min-h-screen shadow-xl">
      {/* Sidebar header */}
      <div className="px-5 py-6 border-b border-blue-700">
        <p className="text-xs text-blue-300 uppercase tracking-widest">System Manager Panel</p>
        <h2 className="font-bold text-base mt-1 leading-tight">AI Queue Management</h2>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {MENU_ITEMS.map(({ icon, label, to }) => (
          <Link
            key={to}
            to={to}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
              ${pathname === to
                ? 'bg-teal-500 text-white'
                : 'hover:bg-blue-700 text-blue-100'}`}
          >
            <span className="text-base">{icon}</span>
            {label}
          </Link>
        ))}
      </nav>

      {/* Footer badge */}
      <div className="px-5 py-4 border-t border-blue-700">
        <span className="inline-flex items-center gap-1.5 text-xs text-teal-300">
          <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></span>
          System Online
        </span>
      </div>
    </aside>
  );
};

export default Sidebar;
