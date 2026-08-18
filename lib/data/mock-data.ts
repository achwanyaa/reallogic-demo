// Reallogic — Mock Data
// Used as fallback when Supabase is not configured.
// Same shape as the seed.sql data — allows full app testing without a database.

import type { Listing, Hotspot, EquipmentModel, CaptureVerification } from '../realsee/types'

export const SAMPLE_LISTING_ID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'

export const mockListing: Listing = {
  id: SAMPLE_LISTING_ID,
  title: 'Godown Unit A3 — Industrial Area',
  location: 'Off Mombasa Road, Industrial Area, Nairobi',
  size_sqft: 10200,
  rent_ksh_per_sqft: 35,
  service_charge_ksh_per_sqft: 8,
  tier: 'live',
  realsee_work_id: 'nmRVg9JX4Cl62XiXmP',
  created_at: new Date().toISOString(),
}

export const mockHotspots: Hotspot[] = [
  {
    id: 'hs-floor-001',
    listing_id: SAMPLE_LISTING_ID,
    category: 'floor_slab',
    position: { x: 2.5, y: 0.1, z: -3.0 },
    label: 'Floor Slab — Main Bay',
    values: {
      thicknessMm: 200,
      concreteGrade: 'C30',
      loadCapacityKnPerSqm: 50,
      vibrationToleranceHz: 25,
    },
    created_at: new Date().toISOString(),
  },
  {
    id: 'hs-height-001',
    listing_id: SAMPLE_LISTING_ID,
    category: 'clear_height',
    position: { x: 0.0, y: 4.0, z: -1.5 },
    label: 'Clear Height — Central Span',
    values: {
      eaveHeightM: 8.5,
      lowestBeamHeightM: 7.2,
      sprinklerDropClearanceM: 6.8,
    },
    created_at: new Date().toISOString(),
  },
  {
    id: 'hs-power-001',
    listing_id: SAMPLE_LISTING_ID,
    category: 'utility_power',
    position: { x: -4.0, y: 1.5, z: 2.0 },
    label: 'Main Distribution Board',
    values: {
      powerAmperage: 200,
      powerPhase: '3-phase' as const,
      waterPressureBar: 4,
    },
    created_at: new Date().toISOString(),
  },
  {
    id: 'hs-logistics-001',
    listing_id: SAMPLE_LISTING_ID,
    category: 'logistics',
    position: { x: 5.0, y: 1.0, z: 0.0 },
    label: 'Loading Dock — Bay 1',
    values: {
      dockLevelerCapacityKg: 10000,
      rollerDoorWidthM: 4.5,
      rollerDoorHeightM: 4.8,
      turningRadiusM: 18,
    },
    created_at: new Date().toISOString(),
  },
]

export const mockEquipmentModels: EquipmentModel[] = [
  {
    id: 'eq-forklift-001',
    name: 'Forklift — Standard',
    glb_url: '/mock/equipment/forklift.glb',
    dimensions_m: { length: 2.5, width: 1.2, height: 2.1 },
    created_at: new Date().toISOString(),
  },
  {
    id: 'eq-pallet-001',
    name: 'Pallet Racking — 3 Tier',
    glb_url: '/mock/equipment/pallet-rack.glb',
    dimensions_m: { length: 2.7, width: 1.1, height: 6.0 },
    created_at: new Date().toISOString(),
  },
  {
    id: 'eq-container-001',
    name: 'Container — 20ft',
    glb_url: '/mock/equipment/container-20ft.glb',
    dimensions_m: { length: 6.1, width: 2.4, height: 2.6 },
    created_at: new Date().toISOString(),
  },
]

export const mockCaptureVerification: CaptureVerification = {
  id: 'cv-001',
  listing_id: SAMPLE_LISTING_ID,
  operator_id: 'OP-NBI-2024-047',
  capture_type: 'actual_visit',
  captured_at: '2024-11-15T10:30:00Z',
  created_at: new Date().toISOString(),
}
