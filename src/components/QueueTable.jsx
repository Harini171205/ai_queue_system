// ─────────────────────────────────────────────────────────────
//  QueueTable.jsx – Admin table of all tokens
//  Props:
//    tokens        – array of token objects
//    onMarkCompleted – callback(tokenId) to mark a token done
// ─────────────────────────────────────────────────────────────

const STATUS_BADGE = {
  Waiting:   'bg-yellow-100 text-yellow-700',
  Serving:   'bg-teal-100   text-teal-700',
  Completed: 'bg-green-100  text-green-700',
};

const QueueTable = ({ tokens = [], onMarkCompleted }) => {
  return (
    <div className="overflow-x-auto rounded-xl shadow-sm border border-slate-100">
      <table className="w-full text-sm text-left bg-white">
        <thead className="bg-blue-700 text-white text-xs uppercase tracking-wider">
          <tr>
            <th className="px-4 py-3">Token #</th>
            <th className="px-4 py-3">Customer Name</th>
            <th className="px-4 py-3">Service Type</th>
            <th className="px-4 py-3">Time</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {tokens.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-10 text-slate-400">
                No tokens in queue.
              </td>
            </tr>
          ) : (
            tokens.map((token, idx) => (
              <tr
                key={token.id}
                className={`border-t border-slate-100 transition-colors
                  ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}
                  ${token.status === 'Serving' ? 'ring-1 ring-inset ring-teal-300' : ''}`}
              >
                <td className="px-4 py-3 font-bold text-blue-700">{token.tokenNumber}</td>
                <td className="px-4 py-3 text-slate-800">{token.customerName}</td>
                <td className="px-4 py-3 text-slate-600">{token.serviceType}</td>
                <td className="px-4 py-3 text-slate-500">{token.time}</td>
                <td className="px-4 py-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_BADGE[token.status]}`}>
                    {token.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  {token.status === 'Serving' ? (
                    <button
                      onClick={() => onMarkCompleted?.(token.id)}
                      className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
                    >
                      ✓ Complete
                    </button>
                  ) : token.status === 'Completed' ? (
                    <span className="text-green-500 text-xs font-medium">Done</span>
                  ) : (
                    <span className="text-slate-300 text-xs">—</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default QueueTable;
