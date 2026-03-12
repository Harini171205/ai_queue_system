// ─────────────────────────────────────────────────────────────
//  Notification.jsx – Toast notification banner
//  Reads notifications array from QueueContext and renders
//  them in a fixed top-right stack.
// ─────────────────────────────────────────────────────────────
import { useQueue } from '../context/QueueContext';

const TYPE_STYLES = {
  success: 'bg-green-50  border-green-400 text-green-800',
  info:    'bg-blue-50   border-blue-400  text-blue-800',
  warning: 'bg-yellow-50 border-yellow-400 text-yellow-800',
  error:   'bg-red-50    border-red-400   text-red-800',
};

const TYPE_ICONS = {
  success: '✅',
  info:    'ℹ️',
  warning: '⚠️',
  error:   '❌',
};

const Notification = () => {
  const { notifications } = useQueue();

  if (!notifications.length) return null;

  return (
    <div
      className="fixed top-20 right-4 z-50 flex flex-col gap-2 max-w-sm w-full"
      aria-live="polite"
    >
      {notifications.map(({ id, message, type = 'info' }) => (
        <div
          key={id}
          className={`flex items-start gap-2 px-4 py-3 rounded-xl border shadow-md text-sm font-medium animate-fade-in
            ${TYPE_STYLES[type] || TYPE_STYLES.info}`}
        >
          <span>{TYPE_ICONS[type] || TYPE_ICONS.info}</span>
          <span>{message}</span>
        </div>
      ))}
    </div>
  );
};

export default Notification;
