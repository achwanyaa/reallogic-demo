Reallogic — Technical Build Spec (Agent Brief)

Read this whole file before writing code. This is the source of truth for architecture and task order. Realsee production access is pending — everything here is designed so the app is fully functional against mock data today, and Realsee's real API slots in later by swapping one adapter file, not by rewriting anything.

0. What we're building

A white-labeled property intelligence platform ("Reallogic") for a single sample warehouse/godown listing, demoing three visible tiers of capability to a prospective partner:

Tier 1 (Live): 360° tour + secure embed
Tier 2 (In Development): structural/utility/logistics hotspots + equipment clearance simulator + verified-capture badge
Tier 3 (Roadmap): shown as UI-only preview cards, not functional — live co-viewing, scan-to-BIM export, technical packet download

The UI itself should visibly label which tier each feature belongs to (small badge: "Live" / "In Development" / "Coming with Partnership"). That labeling is the pitch — don't hide it.

1. Stack
Framework: Next.js (App Router), TypeScript
3D rendering: @realsee/five for the tour scene, Three.js (standalone, react-three-fiber + @react-three/drei) for the equipment clearance simulator — keep these two renderers isolated in separate routes/components, don't try to merge them into one canvas
Backend/data: Supabase (reuse ADM's existing project if there's spare capacity, otherwise a fresh project — agent should ask which before provisioning)
Hosting: Vercel
Styling: Tailwind CSS

2. The critical pattern: adapter interface, not direct API calls

Nothing in the UI should ever call Realsee directly. Everything goes through one adapter module with a fixed interface. Today it returns mock data. Later, swap the implementation — zero changes anywhere else in the app.

/lib/realsee/
  ├── types.ts          # shared types, defined now, used by both adapters
  ├── adapter.ts         # exports the ACTIVE adapter (mock today, live later)
  ├── mock-adapter.ts    # returns static/sample data
  └── live-adapter.ts    # real Argus Flow + Five SDK calls — build this LAST

types.ts — define these now, they don't change when the real API arrives:

```ts
export type ReconstructionJob = {
  jobId: string
  status: 'pending' | 'processing' | 'complete' | 'failed'
  outputs?: {
    panoramaUrls: string[]
    floorPlanUrl?: string
    modelGlbUrl?: string
    cubemapUrl?: string
  }
}

export interface RealseeAdapter {
  triggerReconstruction(panoUrls: string[]): Promise<{ jobId: string }>
  pollJob(jobId: string): Promise<ReconstructionJob>
  getEmbedToken(workId: string): Promise<{ token: string; expiresAt: string }>
}
```

adapter.ts:

```ts
import { mockAdapter } from './mock-adapter'
// import { liveAdapter } from './live-adapter' // uncomment when credentials land

export const realseeAdapter = mockAdapter // swap to liveAdapter later
```

Agent instruction: build mock-adapter.ts first, fully wire the UI to it, get the whole app working end to end. Only write live-adapter.ts once Realsee credentials exist — stub it with a throw new Error('not yet implemented') until then so it's obvious it's incomplete.

3. Environment variables (set up now, leave Realsee ones blank)
```
# .env.local

# Realsee — leave blank until access is granted
REALSEE_APP_ID=
REALSEE_APP_SECRET=
REALSEE_API_BASE_URL=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=   # server-only, never exposed client-side

# App
NEXT_PUBLIC_APP_NAME=Reallogic
```

All Realsee calls happen server-side (API routes / server actions) even in the live adapter — the key requirement from the pitch itself is "server-side proxying of all API keys, never exposed client-side." Build this constraint in from day one so it's not a retrofit.

4. Data model (Supabase tables)
```sql
-- listings
create table listings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  location text,
  size_sqft integer,
  rent_ksh_per_sqft numeric,
  service_charge_ksh_per_sqft numeric,
  tier text default 'sample', -- 'sample' | 'live'
  realsee_work_id text,        -- null until a real reconstruction exists
  created_at timestamptz default now()
);

-- hotspots
create table hotspots (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references listings(id),
  category text not null,      -- 'floor_slab' | 'clear_height' | 'utility_power' | 'logistics'
  position jsonb not null,     -- {x, y, z} in scene coordinates
  label text not null,
  values jsonb not null,       -- flexible key/value per category, see 4a
  created_at timestamptz default now()
);

-- equipment_models
create table equipment_models (
  id uuid primary key default gen_random_uuid(),
  name text not null,          -- 'Forklift - standard', 'Pallet racking - 3 tier'
  glb_url text not null,
  dimensions_m jsonb not null, -- {length, width, height}
  created_at timestamptz default now()
);

-- capture_verification
create table capture_verification (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references listings(id),
  operator_id text,
  capture_type text,           -- 'actual_visit' | 'virtually_staged'
  captured_at timestamptz,
  created_at timestamptz default now()
);
```

4a. Hotspot values shape per category
```ts
type FloorSlabValues = {
  thicknessMm: number
  concreteGrade: string
  loadCapacityKnPerSqm: number
  vibrationToleranceHz?: number
}

type ClearHeightValues = {
  eaveHeightM: number
  lowestBeamHeightM: number
  sprinklerDropClearanceM: number
}

type UtilityPowerValues = {
  powerAmperage: number
  powerPhase: '1-phase' | '3-phase'
  waterPressureBar: number
  gasLineDiameterMm?: number
  hvacCfm?: number
}

type LogisticsValues = {
  dockLevelerCapacityKg: number
  rollerDoorWidthM: number
  rollerDoorHeightM: number
  turningRadiusM: number
}
```

Seed the sample listing with believable numbers for a ~10,000 sqft Industrial Area / Mombasa Rd style godown (agent: use realistic ranges, don't invent extreme values — mark clearly as SAMPLE DATA in the UI footer).

5. Routes / pages
```
/                          → landing: three-tier pitch framing, link to sample listing
/listing/[id]              → the main demo page
/listing/[id]/tour         → Five SDK panoramic scene with hotspot overlay (Tier 1 + 2)
/listing/[id]/clearance    → Three.js equipment clearance simulator (Tier 2)
/listing/[id]/packet       → "Property Technical Packet" preview — UI only, disabled download button, labeled Tier 3
/admin                     → simple listing/hotspot CRUD for editing sample content without touching code
```

6. Component build order (this is the task list)
1. Scaffold — Next.js + Tailwind + Supabase client, deploy an empty shell to Vercel to confirm the pipeline works
2. Mock adapter + types — as in section 2, before any UI
3. Listing page shell — static layout, tier badges, sample data pulled from Supabase
4. Tour view — render mock panorama data through @realsee/five (works once mock adapter returns real sample pano URLs from Realsee's own public demo assets, or your own captured sample panos hosted directly — doesn't require live API access to render, only to reconstruct)
5. Hotspot overlay — clickable markers positioned on the scene, pull from hotspots table, render category-specific info card
6. Clearance simulator — separate Three.js scene, load warehouse bounding box + equipment GLB models, basic drag/place + collision/fit check against dimensions
7. Verified-capture badge — small UI element on listing header pulling from capture_verification table
8. Tier 3 preview cards — static, clearly non-functional, "Coming with Partnership" labels
9. Admin CRUD — last, only if time allows; hardcoding sample data directly in Supabase is fine for the demo
10. Live adapter — only once Realsee credentials exist; swap adapter.ts, test end to end, nothing else in the app should need to change

7. What NOT to build yet
- Live co-viewing/multi-user sync (Tier 3 — static preview only)
- Scan-to-BIM export (Tier 3 — static preview only)
- Real payment/auth flows — this is a demo, not a production tenant portal
- Any attempt to reverse-engineer or scrape Realsee's hosted viewer — only use the official SDK/API once access is granted

8. Definition of done for the demo
- [ ] Deployed on a public Vercel URL
- [ ] Tour loads and is navigable
- [ ] All four hotspot categories are clickable with real-looking sample values
- [ ] Clearance simulator lets you place at least one equipment model and shows a basic fit/no-fit result
- [ ] Tier labels are visible throughout — this is not optional, it's the pitch
- [ ] Verified-capture badge is visible on the listing
- [ ] Tier 3 cards are present but visually distinct as "not yet live"
- [ ] live-adapter.ts exists as a stub, ready to fill in when Realsee responds