// ─────────────────────────────────────────────────────────────
//  AdminDashboard.jsx – Admin view with stats, table, controls
// ─────────────────────────────────────────────────────────────
import { useQueue } from '../context/QueueContext';
import Sidebar from '../components/Sidebar';
import QueueTable from '../components/QueueTable';
import { TOKEN_STATUS } from '../services/mockData';

// ── Stat card sub-component ─────────────────────────────────
const StatCard = ({ icon, label, value, colour }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-center gap-4`}>
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${colour}`}>
      {icon}
    </div>
    <div>
      <p className="text-2xl font-extrabold text-slate-800">{value}</p>
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const { tokens, stats, currentServing, callNextToken, markCompleted } = useQueue();

  const servingToken = tokens.find((t) => t.status === TOKEN_STATUS.SERVING);
  const waitingCount = tokens.filter((t) => t.status === TOKEN_STATUS.WAITING).length;
  const completedCount = tokens.filter((t) => t.status === TOKEN_STATUS.COMPLETED).length;

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* ── Sidebar ──────────────────────────────────────── */}
      <Sidebar />

      {/* ── Main content ─────────────────────────────────── */}
      <main className="flex-1 p-6 lg:p-8 space-y-8 overflow-auto">

        {/* Page title */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">System Manager Dashboard</h1>
            <p className="text-slate-500 text-sm">Manage the live queue and monitor performance.</p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={callNextToken}
              className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold px-5 py-2.5 rounded-xl shadow transition"
            >
              📣 Call Next Token
            </button>
            {servingToken && (
              <button
                onClick={() => markCompleted(servingToken.id)}
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2.5 rounded-xl shadow transition"
              >
                ✓ Mark Completed
              </button>
            )}
          </div>
        </div>

        {/* ── Stats cards ──────────────────────────────── */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard icon="🎫" label="Total Tokens Today" value={stats.totalTokensToday} colour="bg-blue-100"  />
          <StatCard icon="⏳" label="Active Queue"        value={waitingCount}           colour="bg-yellow-100"/>
          <StatCard icon="⚡" label="Avg Wait Time"       value={`${stats.avgWaitTime}m`} colour="bg-teal-100" />
          <StatCard icon="✅" label="Completed"           value={completedCount}          colour="bg-green-100"/>
        </div>

        {/* ── Currently serving banner ─────────────────── */}
        <div className="bg-gradient-to-r from-blue-700 to-teal-500 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-white shadow-lg">
          <div>
            <p className="text-blue-200 text-xs uppercase tracking-widest mb-1">Currently Serving</p>
            <p className="text-4xl font-extrabold">{currentServing}</p>
          </div>
          {servingToken && (
            <div className="text-right text-sm">
              <p className="font-semibold">{servingToken.customerName}</p>
              <p className="text-blue-200">{servingToken.serviceType}</p>
            </div>
          )}
        </div>

        {/* ── Token Table ──────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-slate-700 text-lg">Token Queue</h2>
            <span className="text-xs text-slate-400">{tokens.length} total tokens</span>
          </div>
          <QueueTable tokens={tokens} onMarkCompleted={markCompleted} />
        </div>

      </main>
    </div>
  );
};

export default AdminDashboard;
