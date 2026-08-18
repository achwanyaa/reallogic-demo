// Reallogic — Realsee Adapter Types
// These types are the contract between the UI and the data layer.
// They don't change when the real Realsee API arrives.

// ─── Reconstruction Job ─────────────────────────────────────────────
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

// ─── Adapter Interface ──────────────────────────────────────────────
export interface RealseeAdapter {
  triggerReconstruction(panoUrls: string[]): Promise<{ jobId: string }>
  pollJob(jobId: string): Promise<ReconstructionJob>
  getEmbedToken(workId: string): Promise<{ token: string; expiresAt: string }>
  getWorkData?(workId: string): Promise<any>
}

// ─── Hotspot Value Types ────────────────────────────────────────────
export type HotspotCategory = 'floor_slab' | 'clear_height' | 'utility_power' | 'logistics'

export type FloorSlabValues = {
  thicknessMm: number
  concreteGrade: string
  loadCapacityKnPerSqm: number
  vibrationToleranceHz?: number
}

export type ClearHeightValues = {
  eaveHeightM: number
  lowestBeamHeightM: number
  sprinklerDropClearanceM: number
}

export type UtilityPowerValues = {
  powerAmperage: number
  powerPhase: '1-phase' | '3-phase'
  waterPressureBar: number
  gasLineDiameterMm?: number
  hvacCfm?: number
}

export type LogisticsValues = {
  dockLevelerCapacityKg: number
  rollerDoorWidthM: number
  rollerDoorHeightM: number
  turningRadiusM: number
}

export type HotspotValues = FloorSlabValues | ClearHeightValues | UtilityPowerValues | LogisticsValues

// ─── Database Row Types ─────────────────────────────────────────────
export type Listing = {
  id: string
  title: string
  location: string | null
  size_sqft: number | null
  rent_ksh_per_sqft: number | null
  service_charge_ksh_per_sqft: number | null
  tier: 'sample' | 'live'
  realsee_work_id: string | null
  created_at: string
}

export type Hotspot = {
  id: string
  listing_id: string
  category: HotspotCategory
  position: { x: number; y: number; z: number }
  label: string
  values: HotspotValues
  created_at: string
}

export type EquipmentModel = {
  id: string
  name: string
  glb_url: string
  dimensions_m: { length: number; width: number; height: number }
  created_at: string
}

export type CaptureVerification = {
  id: string
  listing_id: string
  operator_id: string | null
  capture_type: 'actual_visit' | 'virtually_staged' | null
  captured_at: string | null
  created_at: string
}

// ─── Tier System ────────────────────────────────────────────────────
export type TierLevel = 'live' | 'in-development' | 'coming-with-partnership'

export type TierConfig = {
  level: TierLevel
  label: string
  color: string
}

export const TIER_CONFIG: Record<TierLevel, TierConfig> = {
  'live': {
    level: 'live',
    label: 'Live',
    color: 'emerald',
  },
  'in-development': {
    level: 'in-development',
    label: 'In Development',
    color: 'amber',
  },
  'coming-with-partnership': {
    level: 'coming-with-partnership',
    label: 'Coming with Partnership',
    color: 'slate',
  },
}

// ─── Vantage Point Scan Nodes ──────────────────────────────────────
export interface VantagePoint {
  id: string
  name: string
  panoUrl: string
  category: 'ground' | 'mezzanine' | 'truss' | 'exterior'
  positionIndex: number
}

