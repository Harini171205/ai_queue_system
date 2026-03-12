// ─────────────────────────────────────────────────────────────
//  HomePage.jsx – Landing page with hero section
// ─────────────────────────────────────────────────────────────
import { Link } from 'react-router-dom';

// Feature highlights shown in the info section
const FEATURES = [
  {
    icon: '⚡',
    title: 'Real-Time Updates',
    desc: 'Live queue tracking powered by WebSocket technology keeps everyone informed instantly.',
  },
  {
    icon: '🤖',
    title: 'AI-Powered Predictions',
    desc: 'Smart wait-time estimates adapt dynamically based on service patterns and historical data.',
  },
  {
    icon: '📱',
    title: 'Mobile Friendly',
    desc: 'Fully responsive design — track your queue from any device, anywhere.',
  },
  {
    icon: '📊',
    title: 'Powerful Analytics',
    desc: 'Admin dashboards with peak-hour charts, efficiency metrics, and counter performance stats.',
  },
  {
    icon: '🔔',
    title: 'Smart Notifications',
    desc: 'Receive instant alerts when your turn is approaching so you never miss your slot.',
  },
  {
    icon: '🏥',
    title: 'Multi-Sector Support',
    desc: 'Designed for hospitals, banks, and government offices with sector-specific workflows.',
  },
];

// How-it-works steps
const STEPS = [
  { step: '01', title: 'Generate Token',  desc: 'Fill in your details and select a service to get a unique queue token.' },
  { step: '02', title: 'Track Your Queue', desc: 'Monitor your position live and receive estimated wait-time updates.' },
  { step: '03', title: 'Get Notified',    desc: 'Receive an alert when your turn is near — no more waiting in line!' },
];

const HomePage = () => (
  <div className="min-h-screen">

    {/* ── Hero Section ──────────────────────────────────── */}
    <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-teal-500 text-white">
      <div className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center">

        {/* Text */}
        <div className="space-y-6">
          <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full tracking-widest uppercase">
            AI-Powered Queue Management
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Smart Queues,<br />
            <span className="text-teal-200">Zero Waiting Stress</span>
          </h1>
          <p className="text-blue-100 text-lg leading-relaxed max-w-md">
            Eliminate chaotic waiting rooms with an intelligent queue system that serves
            hospitals, banks, and government offices in real time.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              to="/token"
              className="bg-white text-blue-700 font-bold px-7 py-3 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform transition"
            >
              🎫 Generate Token
            </Link>
            <Link
              to="/status"
              className="border-2 border-white/60 text-white font-semibold px-7 py-3 rounded-xl hover:bg-white/10 transition"
            >
              📍 Track My Queue
            </Link>
          </div>
        </div>

        {/* Illustration / stats card */}
        <div className="hidden md:flex justify-center">
          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-3xl p-8 w-72 space-y-5 shadow-2xl">
            <p className="text-teal-200 text-xs font-semibold uppercase tracking-widest">Live Stats</p>
            {[
              { label: 'Tokens Today',   value: '142' },
              { label: 'Avg Wait Time',  value: '18 min' },
              { label: 'Counters Active', value: '3 / 4' },
              { label: 'Satisfaction',   value: '96%' },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center border-b border-white/10 pb-3 last:border-0 last:pb-0">
                <span className="text-blue-100 text-sm">{label}</span>
                <span className="text-white font-bold text-lg">{value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>

    {/* ── How It Works ──────────────────────────────────── */}
    <section className="py-16 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {STEPS.map(({ step, title, desc }) => (
            <div key={step} className="flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 rounded-full bg-blue-700 text-white font-bold text-xl flex items-center justify-center shadow-md">
                {step}
              </div>
              <h3 className="font-semibold text-slate-800 text-lg">{title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── Features Grid ─────────────────────────────────── */}
    <section className="py-16 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-slate-800 mb-3">
          Why Choose AI Queue?
        </h2>
        <p className="text-center text-slate-500 mb-12 max-w-xl mx-auto">
          Built for modern service environments where every second counts.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(({ icon, title, desc }) => (
            <div
              key={title}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
            >
              <div className="text-3xl mb-3">{icon}</div>
              <h3 className="font-semibold text-slate-800 mb-2">{title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── CTA Banner ─────────────────────────────────────── */}
    <section className="bg-gradient-to-r from-teal-500 to-blue-600 text-white py-16">
      <div className="max-w-3xl mx-auto px-6 text-center space-y-6">
        <h2 className="text-3xl font-bold">Ready to Skip the Line?</h2>
        <p className="text-teal-100 text-lg">
          Generate your token now and let our system handle the rest.
        </p>
        <Link
          to="/token"
          className="inline-block bg-white text-blue-700 font-bold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform transition"
        >
          🎫 Get My Token
        </Link>
      </div>
    </section>

    {/* ── Footer ────────────────────────────────────────── */}
    <footer className="bg-blue-900 text-blue-200 text-sm text-center py-6">
      © {new Date().getFullYear()} AI Smart Queue Management System. All rights reserved.
    </footer>

  </div>
);

export default HomePage;
