-- Reallogic — Seed Data
-- Realistic sample data for a ~10,000 sqft Industrial Area / Mombasa Rd godown
-- All values are representative of Nairobi industrial market — clearly marked SAMPLE DATA

-- ─── Sample Listing ─────────────────────────────────────────────────
insert into listings (id, title, location, size_sqft, rent_ksh_per_sqft, service_charge_ksh_per_sqft, tier, realsee_work_id) values (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Godown Unit A3 — Industrial Area',
  'Off Mombasa Road, Industrial Area, Nairobi',
  10200,
  35,
  8,
  'live',
  '80P29aOvr7kw98eDxE'
)
on conflict (id) do update set
  title = excluded.title,
  location = excluded.location,
  tier = excluded.tier,
  realsee_work_id = excluded.realsee_work_id;

-- ─── Hotspots ───────────────────────────────────────────────────────
-- Floor Slab hotspot
insert into hotspots (listing_id, category, position, label, values) values (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'floor_slab',
  '{"x": 2.5, "y": 0.1, "z": -3.0}',
  'Floor Slab — Main Bay',
  '{"thicknessMm": 200, "concreteGrade": "C30", "loadCapacityKnPerSqm": 50, "vibrationToleranceHz": 25}'
);

-- Clear Height hotspot
insert into hotspots (listing_id, category, position, label, values) values (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'clear_height',
  '{"x": 0.0, "y": 4.0, "z": -1.5}',
  'Clear Height — Central Span',
  '{"eaveHeightM": 8.5, "lowestBeamHeightM": 7.2, "sprinklerDropClearanceM": 6.8}'
);

-- Utility / Power hotspot
insert into hotspots (listing_id, category, position, label, values) values (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'utility_power',
  '{"x": -4.0, "y": 1.5, "z": 2.0}',
  'Main Distribution Board',
  '{"powerAmperage": 200, "powerPhase": "3-phase", "waterPressureBar": 4}'
);

-- Logistics hotspot
insert into hotspots (listing_id, category, position, label, values) values (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'logistics',
  '{"x": 5.0, "y": 1.0, "z": 0.0}',
  'Loading Dock — Bay 1',
  '{"dockLevelerCapacityKg": 10000, "rollerDoorWidthM": 4.5, "rollerDoorHeightM": 4.8, "turningRadiusM": 18}'
);

-- ─── Equipment Models ───────────────────────────────────────────────
insert into equipment_models (name, glb_url, dimensions_m) values
  ('Forklift — Standard', '/mock/equipment/forklift.glb', '{"length": 2.5, "width": 1.2, "height": 2.1}'),
  ('Pallet Racking — 3 Tier', '/mock/equipment/pallet-rack.glb', '{"length": 2.7, "width": 1.1, "height": 6.0}'),
  ('Container — 20ft', '/mock/equipment/container-20ft.glb', '{"length": 6.1, "width": 2.4, "height": 2.6}');

-- ─── Capture Verification ───────────────────────────────────────────
insert into capture_verification (listing_id, operator_id, capture_type, captured_at) values (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'OP-NBI-2026-047',
  'actual_visit',
  '2026-08-14T10:30:00Z'
);
