// Reallogic — Active Adapter Export
// This is the single import point for the entire app.
// Today: mock. Later: swap one line, nothing else changes.

import { liveAdapter } from './live-adapter'
import { mockAdapter } from './mock-adapter'

// Active adapter: liveAdapter connects to real Realsee Open API & Argus
export const realseeAdapter = liveAdapter
export { mockAdapter }

