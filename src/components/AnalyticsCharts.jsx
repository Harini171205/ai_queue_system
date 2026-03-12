// ─────────────────────────────────────────────────────────────
//  AnalyticsCharts.jsx – Recharts visualisations for the
//  Queue Analytics page.
//  Three charts:
//    1. Peak Hours – AreaChart
//    2. Avg Wait Time per service – BarChart
//    3. Tokens served per counter – PieChart
// ─────────────────────────────────────────────────────────────
import {
  AreaChart, Area,
  BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid,
  Tooltip, Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  PEAK_HOURS_DATA,
  AVG_WAIT_DATA,
  COUNTER_DATA,
} from '../services/mockData';

const PIE_COLORS = ['#2563eb', '#0d9488', '#7c3aed', '#f59e0b'];

// ── Chart 1: Peak Hours ────────────────────────────────────
export const PeakHoursChart = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
    <h3 className="font-semibold text-slate-700 mb-4">Peak Hours (Token Volume)</h3>
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={PEAK_HOURS_DATA} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
        <defs>
          <linearGradient id="peakGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#2563eb" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#2563eb" stopOpacity={0}   />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,.1)' }} />
        <Area type="monotone" dataKey="tokens" stroke="#2563eb" strokeWidth={2} fill="url(#peakGrad)" name="Tokens" />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

// ── Chart 2: Avg Wait Time per service ────────────────────
export const AvgWaitChart = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
    <h3 className="font-semibold text-slate-700 mb-4">Average Wait Time (minutes)</h3>
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={AVG_WAIT_DATA} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey="service" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,.1)' }} />
        <Bar dataKey="avgWait" fill="#0d9488" radius={[6, 6, 0, 0]} name="Avg Wait (min)" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

// ── Chart 3: Tokens served per counter ────────────────────
const renderLabel = ({ name, percent }) =>
  `${name} ${(percent * 100).toFixed(0)}%`;

export const CounterPieChart = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
    <h3 className="font-semibold text-slate-700 mb-4">Tokens Served per Counter</h3>
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={COUNTER_DATA}
          dataKey="served"
          nameKey="counter"
          cx="50%"
          cy="50%"
          outerRadius={85}
          label={renderLabel}
          labelLine={false}
        >
          {COUNTER_DATA.map((_, index) => (
            <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,.1)' }} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </div>
);
