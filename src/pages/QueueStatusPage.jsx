// ─────────────────────────────────────────────────────────────
//  QueueStatusPage.jsx – Live queue status for a user
//  Simulates Socket.io updates via socketService.js
// ─────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { useQueue } from '../context/QueueContext';
import { onEvent, offEvent, startQueueSimulation } from '../services/socketService';
import { TOKEN_STATUS } from '../services/mockData';
import TokenCard from '../components/TokenCard';
import Loader from '../components/Loader';

// For the demo we let the user "search" by token number
const QueueStatusPage = () => {
  const { tokens, currentServing, setCurrentServing } = useQueue();
  const [search,     setSearch]     = useState('');
  const [userToken,  setUserToken]  = useState(null);
  const [liveServing, setLiveServing] = useState(currentServing);
  const [connected,  setConnected]  = useState(false);
  const [loading,    setLoading]    = useState(false);

  // ── Start socket simulation on mount ────────────────────
  useEffect(() => {
    setConnected(true);
    const stop = startQueueSimulation();

    // Listen for live queue updates
    const handleUpdate = ({ currentServing: cs }) => {
      setLiveServing(cs);
      setCurrentServing(cs);
    };
    onEvent('queue_update', handleUpdate);

    return () => {
      stop();
      offEvent('queue_update', handleUpdate);
      setConnected(false);
    };
  }, [setCurrentServing]);

  // ── Derive queue position from token list ───────────────
  const getQueueInfo = (token) => {
    const waitingTokens = tokens.filter((t) => t.status === TOKEN_STATUS.WAITING);
    const position = waitingTokens.findIndex((t) => t.id === token.id) + 1;
    return {
      position: position > 0 ? position : '—',
      waitMin:  position > 0 ? position * 5 : 0,
    };
  };

  // ── Token lookup ─────────────────────────────────────────
  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const found = tokens.find(
        (t) => t.tokenNumber.toLowerCase() === search.trim().toLowerCase()
      );
      setUserToken(found || null);
      setLoading(false);
    }, 800);
  };

  // Derive live position/wait whenever tokens or liveServing changes
  const queueInfo = userToken ? getQueueInfo(userToken) : null;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-8">

        {/* ── Page header ──────────────────────────────── */}
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Queue Status</h1>
          <p className="text-slate-500 text-sm mt-1">
            Enter your token number to see your live queue position.
          </p>
        </div>

        {/* ── Connection badge ─────────────────────────── */}
        <div className={`inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full
          ${connected ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-500'}`}>
          <span className={`w-2 h-2 rounded-full ${connected ? 'bg-teal-500 animate-pulse' : 'bg-slate-400'}`}></span>
          {connected ? 'Live Updates Active' : 'Disconnected'}
        </div>

        {/* ── Currently serving banner ─────────────────── */}
        <div className="bg-blue-700 text-white rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-lg">
          <div>
            <p className="text-blue-200 text-xs uppercase tracking-widest mb-1">Now Serving</p>
            <p className="text-4xl font-extrabold tracking-wider">{liveServing}</p>
          </div>
          <div className="text-right">
            <p className="text-blue-200 text-xs mb-1">Last updated</p>
            <p className="text-sm font-medium">{new Date().toLocaleTimeString()}</p>
          </div>
        </div>

        {/* ── Token search form ────────────────────────── */}
        <form onSubmit={handleSearch} className="flex gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Enter token number (e.g. A004)"
            className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-5 py-2.5 rounded-xl transition"
          >
            Search
          </button>
        </form>

        {/* ── Loading ──────────────────────────────────── */}
        {loading && <Loader label="Looking up your token…" />}

        {/* ── Token result ─────────────────────────────── */}
        {!loading && userToken && (
          <div className="space-y-4">
            <h2 className="font-semibold text-slate-700">Your Token</h2>
            <TokenCard token={{ ...userToken, ...queueInfo }} large />

            {/* Queue position progress */}
            {userToken.status === TOKEN_STATUS.WAITING && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-3">
                <div className="flex justify-between text-sm font-medium text-slate-600">
                  <span>Queue Position</span>
                  <span className="text-blue-700 font-bold">#{queueInfo.position}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all"
                    style={{ width: `${Math.max(5, 100 - queueInfo.position * 12)}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400">
                  Estimated wait: <strong className="text-slate-700">{queueInfo.waitMin} minutes</strong>
                </p>
              </div>
            )}

            {userToken.status === TOKEN_STATUS.SERVING && (
              <div className="bg-teal-50 border border-teal-300 rounded-2xl p-4 text-center text-teal-700 font-semibold">
                🔔 Your token is currently being served! Please proceed to the counter.
              </div>
            )}

            {userToken.status === TOKEN_STATUS.COMPLETED && (
              <div className="bg-green-50 border border-green-300 rounded-2xl p-4 text-center text-green-700 font-semibold">
                ✅ Service completed. Thank you for using AI Queue!
              </div>
            )}
          </div>
        )}

        {/* ── Not found ────────────────────────────────── */}
        {!loading && search && userToken === null && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center text-red-600">
            <p className="text-2xl mb-2">🔍</p>
            <p className="font-semibold">Token not found</p>
            <p className="text-sm text-red-400 mt-1">Check the token number and try again.</p>
          </div>
        )}

        {/* ── Quick queue overview ─────────────────────── */}
        <div>
          <h2 className="font-semibold text-slate-700 mb-3">Waiting Queue</h2>
          <div className="space-y-2">
            {tokens
              .filter((t) => t.status === TOKEN_STATUS.WAITING)
              .slice(0, 5)
              .map((t) => (
                <div
                  key={t.id}
                  className="bg-white rounded-xl px-4 py-3 flex justify-between items-center border border-slate-100 shadow-sm"
                >
                  <span className="font-bold text-blue-700">{t.tokenNumber}</span>
                  <span className="text-slate-500 text-sm">{t.serviceType}</span>
                  <span className="text-xs text-slate-400">{t.waitMin} min</span>
                </div>
              ))}
            {tokens.filter((t) => t.status === TOKEN_STATUS.WAITING).length === 0 && (
              <p className="text-slate-400 text-sm text-center py-4">Queue is empty 🎉</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default QueueStatusPage;
