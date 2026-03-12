// ─────────────────────────────────────────────────────────────
//  AdminDashboard.jsx – Admin view with stats, table, controls
// ─────────────────────────────────────────────────────────────
import { useState } from 'react';
import { useQueue } from '../context/QueueContext';
import Sidebar from '../components/Sidebar';
import QueueTable from '../components/QueueTable';
import { TOKEN_STATUS, SERVICE_TYPES } from '../services/mockData';

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

// ── Per-sector stats row ─────────────────────────────────────
const SectorRow = ({ stat }) => {
  const colorMap = {
    rose:  { bg: 'bg-rose-100',  text: 'text-rose-700',  badge: 'bg-rose-200'  },
    blue:  { bg: 'bg-blue-100',  text: 'text-blue-700',  badge: 'bg-blue-200'  },
    amber: { bg: 'bg-amber-100', text: 'text-amber-700', badge: 'bg-amber-200' },
  };
  const c = colorMap[stat.color] ?? colorMap.blue;
  return (
    <div className={`flex items-center justify-between rounded-xl px-4 py-3 ${c.bg}`}>
      <div className="flex items-center gap-2">
        <span className="text-xl">{stat.icon}</span>
        <span className={`font-semibold text-sm ${c.text}`}>{stat.sector}</span>
      </div>
      <div className="flex gap-4 text-xs text-slate-600">
        <span><span className="font-bold text-slate-800">{stat.waiting}</span> waiting</span>
        <span><span className="font-bold text-slate-800">{stat.counters}</span> counters</span>
        <span className={`font-bold px-2 py-0.5 rounded-full ${c.badge} ${c.text}`}>
          ~{stat.avgWait} min
        </span>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const { tokens, stats, currentServing, callNextToken, markCompleted, getSectorStats } = useQueue();
  const [sectorFilter, setSectorFilter] = useState('All');

  const servingToken = tokens.find((t) => t.status === TOKEN_STATUS.SERVING);
  const filteredTokens = sectorFilter === 'All'
    ? tokens
    : tokens.filter((t) => t.serviceType === sectorFilter);
  const waitingCount = tokens.filter((t) => t.status === TOKEN_STATUS.WAITING).length;
  const completedCount = tokens.filter((t) => t.status === TOKEN_STATUS.COMPLETED).length;
  const sectorStats = getSectorStats();

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

        {/* ── Per-sector wait time breakdown ───────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-3">
          <h2 className="font-semibold text-slate-700 text-base">Sector Wait Times</h2>
          <div className="space-y-2">
            {sectorStats.map((s) => <SectorRow key={s.sector} stat={s} />)}
          </div>
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
            <h2 className="font-semibold text-slate-700 text-lg">Token Queue</h2>
            {/* Sector filter tabs */}
            <div className="flex flex-wrap gap-2">
              {['All', ...SERVICE_TYPES].map((s) => (
                <button
                  key={s}
                  onClick={() => setSectorFilter(s)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border transition
                    ${sectorFilter === s
                      ? 'bg-blue-700 text-white border-blue-700'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-blue-400'}`}
                >
                  {s}
                </button>
              ))}
            </div>
            <span className="text-xs text-slate-400">{filteredTokens.length} tokens</span>
          </div>
          <QueueTable tokens={filteredTokens} onMarkCompleted={markCompleted} />
        </div>

      </main>
    </div>
  );
};

export default AdminDashboard;
