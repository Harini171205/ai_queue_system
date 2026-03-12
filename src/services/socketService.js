// ─────────────────────────────────────────────────────────────
//  socketService.js – Simulated Socket.io live-update service
//
//  In a real app this would connect to:
//    const socket = io('http://your-backend-url');
//
//  Here we simulate periodic events using setInterval so the
//  UI behaves as if driven by real-time socket messages.
// ─────────────────────────────────────────────────────────────

/** Simulated event bus (listeners keyed by event name) */
const listeners = {};

/** Register a callback for a simulated socket event */
export const onEvent = (event, callback) => {
  if (!listeners[event]) listeners[event] = [];
  listeners[event].push(callback);
};

/** Remove a callback for a simulated socket event */
export const offEvent = (event, callback) => {
  if (!listeners[event]) return;
  listeners[event] = listeners[event].filter((cb) => cb !== callback);
};

/** Internal – fire all listeners registered for an event */
const emit = (event, data) => {
  if (listeners[event]) {
    listeners[event].forEach((cb) => cb(data));
  }
};

// ── Simulate the server pushing "queue_update" every 8 seconds ──
let currentServing = 3; // mock: token A003 is initially being served

export const startQueueSimulation = () => {
  const interval = setInterval(() => {
    // Advance the serving counter periodically
    currentServing = currentServing < 8 ? currentServing + 1 : 1;

    emit('queue_update', {
      currentServing: `A${String(currentServing).padStart(3, '0')}`,
      timestamp: new Date().toISOString(),
    });
  }, 8000);

  // Return a cleanup function
  return () => clearInterval(interval);
};

/** Get a snapshot of the currently-serving token */
export const getCurrentServing = () =>
  `A${String(currentServing).padStart(3, '0')}`;
