// ─────────────────────────────────────────────────────────────
//  Loader.jsx – Animated loading spinner
//  Props:
//    size   – 'sm' | 'md' (default) | 'lg'
//    label  – optional text below the spinner
// ─────────────────────────────────────────────────────────────

const SIZE_MAP = {
  sm: 'w-6 h-6 border-2',
  md: 'w-10 h-10 border-4',
  lg: 'w-16 h-16 border-4',
};

const Loader = ({ size = 'md', label }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-8">
    <div
      className={`rounded-full border-blue-200 border-t-blue-600 animate-spin ${SIZE_MAP[size]}`}
      role="status"
      aria-label="Loading"
    />
    {label && <p className="text-sm text-slate-500">{label}</p>}
  </div>
);

export default Loader;
