/** Set `VITE_WAITLIST_MODE=true` to serve the waitlist as the homepage. */
export const WAITLIST_MODE = ['true', '1', 'yes'].includes(
  String(import.meta.env.VITE_WAITLIST_MODE ?? '').toLowerCase()
);
