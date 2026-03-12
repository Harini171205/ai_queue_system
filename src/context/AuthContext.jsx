// ─────────────────────────────────────────────────────────────
//  AuthContext.jsx – Authentication state for Admin & User
//
//  Mock credentials (no backend needed):
//    Admin → email: admin@aiqueue.com  password: Admin@123
//    Users → self-registered; stored in localStorage
// ─────────────────────────────────────────────────────────────
import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

// ── Hard-coded admin account ──────────────────────────────────
const ADMIN_ACCOUNT = {
  name: 'System Manager',
  email: 'systemmanager@gmail.com',
  password: '123456',
  role: 'admin',
};

// ── Helpers for persisted user storage ───────────────────────
const STORAGE_USERS_KEY = 'aq_users';
const STORAGE_SESSION_KEY = 'aq_session';

const getStoredUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_USERS_KEY)) || [];
  } catch {
    return [];
  }
};

const saveStoredUsers = (users) =>
  localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));

const getStoredSession = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_SESSION_KEY)) || null;
  } catch {
    return null;
  }
};

// ── Provider ─────────────────────────────────────────────────
export const AuthProvider = ({ children }) => {
  // Rehydrate session from localStorage so page refresh keeps user logged in
  const [user, setUser] = useState(() => getStoredSession());

  // ── Register a new user account ─────────────────────────
  const register = useCallback(({ name, email, password }) => {
    const users = getStoredUsers();

    // Prevent duplicate emails (case-insensitive)
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const newUser = { name, email: email.toLowerCase(), password, role: 'user' };
    saveStoredUsers([...users, newUser]);

    // Auto-login after registration
    const session = { name, email: email.toLowerCase(), role: 'user' };
    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));
    setUser(session);

    return { success: true };
  }, []);

  // ── Login ────────────────────────────────────────────────
  const login = useCallback(({ email, password, role }) => {
    const normalizedEmail = email.trim().toLowerCase();

    // Admin login
    if (role === 'admin') {
      if (
        normalizedEmail === ADMIN_ACCOUNT.email.toLowerCase() &&
        password === ADMIN_ACCOUNT.password
      ) {
        const session = { name: ADMIN_ACCOUNT.name, email: normalizedEmail, role: 'admin' };
        localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));
        setUser(session);
        return { success: true };
      }
      return { success: false, message: 'Invalid admin credentials.' };
    }

    // User login
    const users = getStoredUsers();
    const found = users.find(
      (u) => u.email === normalizedEmail && u.password === password
    );
    if (!found) {
      return { success: false, message: 'Incorrect email or password.' };
    }

    const session = { name: found.name, email: found.email, role: 'user' };
    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));
    setUser(session);
    return { success: true };
  }, []);

  // ── Logout ───────────────────────────────────────────────
  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_SESSION_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

/** Custom hook – consume auth context */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};
