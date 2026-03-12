// ─────────────────────────────────────────────────────────────
//  TokenGenerationPage.jsx
//  Allows a user to fill in their details and generate a queue
//  token. After submission the token number, a QR code, and
//  the estimated wait time are displayed.
// ─────────────────────────────────────────────────────────────
import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useQueue } from '../context/QueueContext';
import { SERVICE_TYPES } from '../services/mockData';
import Loader from '../components/Loader';

const INITIAL_FORM = { name: '', phone: '', serviceType: SERVICE_TYPES[0] };
const PHONE_REGEX  = /^[0-9]{10}$/;

const TokenGenerationPage = () => {
  const { generateToken } = useQueue();
  const [form,      setForm]      = useState(INITIAL_FORM);
  const [errors,    setErrors]    = useState({});
  const [loading,   setLoading]   = useState(false);
  const [generated, setGenerated] = useState(null); // the new token object

  // ── Form validation ──────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!form.name.trim())               e.name  = 'Name is required.';
    if (!PHONE_REGEX.test(form.phone))   e.phone = 'Enter a valid 10-digit phone number.';
    if (!form.serviceType)               e.serviceType = 'Please select a service.';
    return e;
  };

  // ── Handle form submit ───────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setErrors({});
    setLoading(true);

    // Simulate a brief processing delay
    setTimeout(() => {
      const token = generateToken(form);
      setGenerated(token);
      setLoading(false);
    }, 1200);
  };

  // ── Reset to generate another token ─────────────────────
  const handleReset = () => {
    setGenerated(null);
    setForm(INITIAL_FORM);
  };

  // ── Success view ─────────────────────────────────────────
  if (generated) {
    const qrValue = JSON.stringify({
      token: generated.tokenNumber,
      name:  generated.customerName,
      service: generated.serviceType,
    });

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-3xl shadow-xl max-w-md w-full p-8 text-center space-y-6 animate-fade-in">

          {/* Success icon */}
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-3xl">
            ✅
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Token Generated!</h2>

          {/* Token badge */}
          <div className="bg-blue-700 text-white rounded-2xl py-6 px-8 shadow-inner">
            <p className="text-xs uppercase tracking-widest text-blue-200 mb-1">Your Token Number</p>
            <p className="text-5xl font-extrabold tracking-wider">{generated.tokenNumber}</p>
          </div>

          {/* QR code */}
          <div className="flex flex-col items-center gap-2">
            <QRCodeSVG
              value={qrValue}
              size={160}
              bgColor="#ffffff"
              fgColor="#1d4ed8"
              level="M"
              includeMargin
              className="rounded-xl shadow-md"
            />
            <p className="text-xs text-slate-400">Scan QR code at the counter</p>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-3 text-left">
            {[
              { label: 'Name',         value: generated.customerName },
              { label: 'Service',      value: generated.serviceType  },
              { label: 'Position',     value: `#${generated.position}` },
              { label: 'Est. Wait',    value: `${generated.waitMin} min`  },
            ].map(({ label, value }) => (
              <div key={label} className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-400 mb-0.5">{label}</p>
                <p className="font-semibold text-slate-800 text-sm">{value}</p>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="flex-1 border-2 border-blue-700 text-blue-700 font-semibold py-2.5 rounded-xl hover:bg-blue-50 transition"
            >
              Generate Another
            </button>
            <button
              onClick={() => window.print()}
              className="flex-1 bg-blue-700 text-white font-semibold py-2.5 rounded-xl hover:bg-blue-800 transition"
            >
              🖨 Print Token
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Form view ────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl shadow-xl max-w-md w-full p-8 space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Generate Your Token</h1>
          <p className="text-slate-500 text-sm mt-1">
            Fill in the form below to join the queue and receive your token instantly.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-5">

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Arjun Sharma"
              className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition
                ${errors.name ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="10-digit mobile number"
              maxLength={10}
              className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition
                ${errors.phone ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>

          {/* Service Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Service Type <span className="text-red-500">*</span>
            </label>
            <select
              value={form.serviceType}
              onChange={(e) => setForm({ ...form, serviceType: e.target.value })}
              className={`w-full border rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition
                ${errors.serviceType ? 'border-red-400' : 'border-slate-200'}`}
            >
              {SERVICE_TYPES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {errors.serviceType && <p className="text-red-500 text-xs mt-1">{errors.serviceType}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white font-bold py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2"
          >
            {loading ? <Loader size="sm" /> : '🎫 Generate Token'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TokenGenerationPage;
