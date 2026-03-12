// ─────────────────────────────────────────────────────────────
//  AnalyticsPage.jsx – Queue analytics with Recharts charts
// ─────────────────────────────────────────────────────────────
import { useQueue } from '../context/QueueContext';
import Sidebar from '../components/Sidebar';
import {
  PeakHoursChart,
  AvgWaitChart,
  CounterPieChart,
} from '../components/AnalyticsCharts';
import { TOKEN_STATUS, PEAK_HOURS_DATA } from '../services/mockData';

// ── Small KPI card ─────────────────────────────────────────
const KpiCard = ({ label, value, sub, icon }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-start gap-4">
    <span className="text-3xl">{icon}</span>
    <div>
      <p className="text-2xl font-extrabold text-slate-800">{value}</p>
      <p className="text-sm font-medium text-slate-600">{label}</p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  </div>
);

const AnalyticsPage = () => {
  const { tokens, stats } = useQueue();

  // Derive some live KPIs from the token list
  const completed = tokens.filter((t) => t.status === TOKEN_STATUS.COMPLETED).length;
  const peakHour  = PEAK_HOURS_DATA.reduce((a, b) => (a.tokens > b.tokens ? a : b));

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* ── Sidebar ──────────────────────────────────────── */}
      <Sidebar />

      {/* ── Main content ─────────────────────────────────── */}
      <main className="flex-1 p-6 lg:p-8 space-y-8 overflow-auto">

        {/* Page title */}
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Queue Analytics</h1>
          <p className="text-slate-500 text-sm mt-1">
            Insights on traffic patterns, service efficiency, and counter performance.
          </p>
        </div>

        {/* ── KPI summary row ──────────────────────────── */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <KpiCard
            icon="🎫"
            label="Tokens Today"
            value={stats.totalTokensToday}
            sub="Since 8 AM"
          />
          <KpiCard
            icon="✅"
            label="Completed"
            value={completed}
            sub={`${Math.round((completed / stats.totalTokensToday) * 100)}% completion rate`}
          />
          <KpiCard
            icon="⏱️"
            label="Avg Wait Time"
            value={`${stats.avgWaitTime} min`}
            sub="Across all services"
          />
          <KpiCard
            icon="📈"
            label="Peak Hour"
            value={peakHour.hour}
            sub={`${peakHour.tokens} tokens`}
          />
        </div>

        {/* ── Charts ───────────────────────────────────── */}
        {/* Peak hours – full width */}
        <PeakHoursChart />

        {/* Avg wait + Pie – side by side on wide screens */}
        <div className="grid lg:grid-cols-2 gap-6">
          <AvgWaitChart />
          <CounterPieChart />
        </div>

        {/* ── Service breakdown table ───────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <h3 className="font-semibold text-slate-700 mb-4">Service Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase tracking-wider text-slate-400 border-b border-slate-100">
                <tr>
                  <th className="pb-3 pr-4">Service</th>
                  <th className="pb-3 pr-4">Tokens</th>
                  <th className="pb-3 pr-4">Completed</th>
                  <th className="pb-3">Avg Wait</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {['Hospital', 'Bank', 'Govt Office'].map((svc) => {
                  const svcTokens   = tokens.filter((t) => t.serviceType === svc);
                  const svcComplete = svcTokens.filter((t) => t.status === TOKEN_STATUS.COMPLETED);
                  const avgWait     = svcTokens.length
                    ? Math.round(svcTokens.reduce((a, t) => a + (t.waitMin || 0), 0) / svcTokens.length)
                    : 0;
                  return (
                    <tr key={svc} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 pr-4 font-medium text-slate-700">{svc}</td>
                      <td className="py-3 pr-4 text-slate-600">{svcTokens.length}</td>
                      <td className="py-3 pr-4">
                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium">
                          {svcComplete.length}
                        </span>
                      </td>
                      <td className="py-3 text-slate-600">{avgWait} min</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
};

export default AnalyticsPage;
