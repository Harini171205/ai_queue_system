// ─────────────────────────────────────────────────────────────
//  QueueContext.jsx – Global state for the queue system
//
//  Provides token list, admin actions, and the currently-
//  serving token to any component in the tree.
// ─────────────────────────────────────────────────────────────
import { createContext, useContext, useState, useCallback } from 'react';
import {
  MOCK_TOKENS,
  ADMIN_STATS,
  TOKEN_STATUS,
  SECTOR_CONFIG,
  generateTokenNumber,
  estimateWait,
} from '../services/mockData';

const QueueContext = createContext(null);

export const QueueProvider = ({ children }) => {
  const [tokens, setTokens] = useState(MOCK_TOKENS);
  const [stats, setStats] = useState(ADMIN_STATS);
  const [currentServing, setCurrentServing] = useState('A003');
  const [notifications, setNotifications] = useState([]);

  // ── Add a notification banner ──────────────────────────────
  const addNotification = useCallback((message, type = 'info') => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  }, []);

  // ── Per-sector stats (computed from current token list) ─────
  const getSectorStats = useCallback(() => {
    return Object.entries(SECTOR_CONFIG).map(([sector, cfg]) => {
      const sectorTokens = tokens.filter((t) => t.serviceType === sector);
      const waitingInSector = sectorTokens.filter((t) => t.status === TOKEN_STATUS.WAITING);
      const avgWait = waitingInSector.length > 0
        ? Math.ceil((waitingInSector.length * cfg.avgMinPerToken) / cfg.counters)
        : 0;
      return {
        sector,
        icon: cfg.icon,
        color: cfg.color,
        counters: cfg.counters,
        avgMinPerToken: cfg.avgMinPerToken,
        waiting: waitingInSector.length,
        total: sectorTokens.length,
        avgWait,
      };
    });
  }, [tokens]);

  // ── Generate a new token and add it to the queue ───────────
  const generateToken = useCallback(
    ({ name, phone, serviceType }) => {
      const tokenNumber = generateTokenNumber(tokens);
      // Position is counted only within the same sector's waiting queue
      const position = tokens.filter(
        (t) => t.status === TOKEN_STATUS.WAITING && t.serviceType === serviceType
      ).length + 1;
      const waitMin = estimateWait(position, serviceType);

      const newToken = {
        id: tokens.length + 1,
        tokenNumber,
        customerName: name,
        phone,
        serviceType,
        status: TOKEN_STATUS.WAITING,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        waitMin,
        position,
      };

      setTokens((prev) => [...prev, newToken]);
      setStats((prev) => ({
        ...prev,
        totalTokensToday: prev.totalTokensToday + 1,
        activeQueue: prev.activeQueue + 1,
      }));
      addNotification(`Token ${tokenNumber} generated for ${name}`, 'success');
      return newToken;
    },
    [tokens, addNotification]
  );

  // ── Call the next waiting token ────────────────────────────
  const callNextToken = useCallback(() => {
    const nextWaiting = tokens.find((t) => t.status === TOKEN_STATUS.WAITING);
    if (!nextWaiting) {
      addNotification('No more tokens in queue.', 'warning');
      return;
    }

    setTokens((prev) =>
      prev.map((t) => {
        if (t.status === TOKEN_STATUS.SERVING)
          return { ...t, status: TOKEN_STATUS.COMPLETED };
        if (t.id === nextWaiting.id)
          return { ...t, status: TOKEN_STATUS.SERVING };
        return t;
      })
    );
    setCurrentServing(nextWaiting.tokenNumber);
    addNotification(`Now serving ${nextWaiting.tokenNumber} – ${nextWaiting.customerName}`, 'info');
  }, [tokens, addNotification]);

  // ── Mark the currently-serving token as completed ──────────
  const markCompleted = useCallback(
    (tokenId) => {
      setTokens((prev) =>
        prev.map((t) =>
          t.id === tokenId ? { ...t, status: TOKEN_STATUS.COMPLETED } : t
        )
      );
      setStats((prev) => ({
        ...prev,
        activeQueue: Math.max(0, prev.activeQueue - 1),
      }));
      addNotification('Token marked as completed.', 'success');
    },
    [addNotification]
  );

  return (
    <QueueContext.Provider
      value={{
        tokens,
        stats,
        currentServing,
        setCurrentServing,
        notifications,
        addNotification,
        generateToken,
        callNextToken,
        markCompleted,
        getSectorStats,
      }}
    >
      {children}
    </QueueContext.Provider>
  );
};

/** Custom hook – consume queue context anywhere in the tree */
export const useQueue = () => {
  const ctx = useContext(QueueContext);
  if (!ctx) throw new Error('useQueue must be used inside <QueueProvider>');
  return ctx;
};
