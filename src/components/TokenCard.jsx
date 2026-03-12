// ─────────────────────────────────────────────────────────────
//  TokenCard.jsx – Displays a single token's information
//  Props:
//    token  – token object { tokenNumber, customerName,
//             serviceType, status, waitMin, time }
//    large  – (bool) show larger variant for status page
// ─────────────────────────────────────────────────────────────

/** Map status to badge colour */
const STATUS_STYLES = {
  Waiting:   'bg-yellow-100 text-yellow-700 border-yellow-300',
  Serving:   'bg-teal-100   text-teal-700   border-teal-300',
  Completed: 'bg-green-100  text-green-700  border-green-300',
};

/** Map service type to icon */
const SERVICE_ICONS = {
  Hospital:    '🏥',
  Bank:        '🏦',
  'Govt Office': '🏛️',
};

const TokenCard = ({ token, large = false }) => {
  if (!token) return null;
  const { tokenNumber, customerName, serviceType, status, waitMin, time } = token;

  return (
    <div
      className={`bg-white rounded-2xl shadow-md border border-slate-100 p-5 flex flex-col gap-3
        ${large ? 'md:flex-row md:items-center md:gap-8' : ''}`}
    >
      {/* Token badge */}
      <div className={`flex flex-col items-center justify-center rounded-xl font-bold text-blue-700 bg-blue-50 border-2 border-blue-200
        ${large ? 'w-28 h-28 text-3xl shrink-0' : 'w-16 h-16 text-xl'}`}>
        {tokenNumber}
      </div>

      {/* Details */}
      <div className="flex-1 space-y-1.5">
        {customerName && (
          <p className="font-semibold text-slate-800">{customerName}</p>
        )}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-slate-500">
            {SERVICE_ICONS[serviceType]} {serviceType}
          </span>
          {time && (
            <span className="text-xs text-slate-400">· {time}</span>
          )}
        </div>

        {/* Status badge */}
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${STATUS_STYLES[status] || ''}`}>
          {status}
        </span>
      </div>

      {/* Wait time */}
      {typeof waitMin === 'number' && status !== 'Completed' && (
        <div className="flex flex-col items-center text-center">
          <span className="text-2xl font-bold text-teal-600">{waitMin}</span>
          <span className="text-xs text-slate-400">min wait</span>
        </div>
      )}
    </div>
  );
};

export default TokenCard;
