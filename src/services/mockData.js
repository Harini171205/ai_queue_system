// ─────────────────────────────────────────────────────────────
//  mockData.js – Static mock data used throughout the app
//  No real backend is required; all pages consume this data.
// ─────────────────────────────────────────────────────────────

/** Service categories available for token generation */
export const SERVICE_TYPES = ['Hospital', 'Bank', 'Govt Office'];

/**
 * Sector-specific configuration that drives wait-time calculations.
 *  avgMinPerToken – average minutes a single token takes to serve
 *  counters       – number of parallel counters open in that sector
 *  icon / color   – UI decoration
 */
export const SECTOR_CONFIG = {
  Hospital:      { avgMinPerToken: 8,  counters: 3, icon: '🏥', color: 'rose'  },
  Bank:          { avgMinPerToken: 5,  counters: 4, icon: '🏦', color: 'blue'  },
  'Govt Office': { avgMinPerToken: 12, counters: 2, icon: '🏛️', color: 'amber' },
};

/** Possible statuses a token can have */
export const TOKEN_STATUS = {
  WAITING: 'Waiting',
  SERVING: 'Serving',
  COMPLETED: 'Completed',
};

/** Initial mock token queue for the admin dashboard */
export const MOCK_TOKENS = [
  { id: 1, tokenNumber: 'A001', customerName: 'Arjun Sharma',   serviceType: 'Hospital',    status: TOKEN_STATUS.COMPLETED, time: '09:00 AM', waitMin: 0  },
  { id: 2, tokenNumber: 'A002', customerName: 'Priya Mehta',    serviceType: 'Bank',        status: TOKEN_STATUS.COMPLETED, time: '09:05 AM', waitMin: 0  },
  { id: 3, tokenNumber: 'A003', customerName: 'Ravi Kumar',     serviceType: 'Govt Office', status: TOKEN_STATUS.SERVING,   time: '09:10 AM', waitMin: 5  },
  { id: 4, tokenNumber: 'A004', customerName: 'Sneha Patel',    serviceType: 'Hospital',    status: TOKEN_STATUS.WAITING,   time: '09:15 AM', waitMin: 10 },
  { id: 5, tokenNumber: 'A005', customerName: 'Karan Verma',    serviceType: 'Bank',        status: TOKEN_STATUS.WAITING,   time: '09:20 AM', waitMin: 15 },
  { id: 6, tokenNumber: 'A006', customerName: 'Anjali Singh',   serviceType: 'Hospital',    status: TOKEN_STATUS.WAITING,   time: '09:25 AM', waitMin: 20 },
  { id: 7, tokenNumber: 'A007', customerName: 'Deepak Nair',    serviceType: 'Govt Office', status: TOKEN_STATUS.WAITING,   time: '09:30 AM', waitMin: 25 },
  { id: 8, tokenNumber: 'A008', customerName: 'Meera Joshi',    serviceType: 'Bank',        status: TOKEN_STATUS.WAITING,   time: '09:35 AM', waitMin: 30 },
];

/** Summary statistics for the admin cards */
export const ADMIN_STATS = {
  totalTokensToday: 8,
  activeQueue: 5,
  avgWaitTime: 18, // minutes
  countersOpen: 3,
};

/** Peak-hour chart data (token count per hour) */
export const PEAK_HOURS_DATA = [
  { hour: '8AM',  tokens: 12 },
  { hour: '9AM',  tokens: 28 },
  { hour: '10AM', tokens: 45 },
  { hour: '11AM', tokens: 38 },
  { hour: '12PM', tokens: 20 },
  { hour: '1PM',  tokens: 15 },
  { hour: '2PM',  tokens: 30 },
  { hour: '3PM',  tokens: 42 },
  { hour: '4PM',  tokens: 35 },
  { hour: '5PM',  tokens: 18 },
];

/** Average wait time per service type (derived from SECTOR_CONFIG for consistency) */
export const AVG_WAIT_DATA = Object.entries(SECTOR_CONFIG).map(([service, cfg]) => ({
  service,
  avgWait: cfg.avgMinPerToken,
}));

/** Tokens served per counter */
export const COUNTER_DATA = [
  { counter: 'Counter 1', served: 18 },
  { counter: 'Counter 2', served: 24 },
  { counter: 'Counter 3', served: 14 },
  { counter: 'Counter 4', served: 20 },
];

/** Helper – generate a new sequential token number */
export const generateTokenNumber = (existing) => {
  const next = existing.length + 1;
  return `A${String(next).padStart(3, '0')}`;
};

/**
 * Helper – estimate wait time in minutes based on queue position and sector.
 * Formula: ceil(position * avgMinPerToken / counters)
 * Each sector has its own service rate and parallel counters, so wait times
 * differ meaningfully across Hospital, Bank, and Govt Office.
 */
export const estimateWait = (position, serviceType = 'Bank') => {
  const cfg = SECTOR_CONFIG[serviceType] ?? { avgMinPerToken: 5, counters: 1 };
  return Math.ceil((position * cfg.avgMinPerToken) / cfg.counters);
};
