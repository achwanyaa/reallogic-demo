// Reallogic — Active Adapter Export
// This is the single import point for the entire app.
// Today: mock. Later: swap one line, nothing else changes.

import { mockAdapter } from './mock-adapter'
// import { liveAdapter } from './live-adapter' // enable when Realsee credentials land

// Keep the deployed demo functional without production credentials.
export const realseeAdapter = mockAdapter
export { mockAdapter }

