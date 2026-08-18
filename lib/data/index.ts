// Reallogic — Data Access Layer
// Tries Supabase first, falls back to mock data if not configured.
// This allows the app to work fully without a database connection.

import { supabase, isSupabaseConfigured } from '../supabase/client'
import {
  mockListing,
  mockHotspots,
  mockEquipmentModels,
  mockCaptureVerification,
  SAMPLE_LISTING_ID,
} from './mock-data'
import type { Listing, Hotspot, EquipmentModel, CaptureVerification } from '../realsee/types'

export async function getListing(id: string): Promise<Listing | null> {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('id', id)
      .single()
    if (!error && data) return data as Listing
  }
  // Fallback to mock
  if (id === SAMPLE_LISTING_ID) return mockListing
  return null
}

export async function getAllListings(): Promise<Listing[]> {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error && data) return data as Listing[]
  }
  return [mockListing]
}

export async function getHotspots(listingId: string): Promise<Hotspot[]> {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('hotspots')
      .select('*')
      .eq('listing_id', listingId)
    if (!error && data) return data as Hotspot[]
  }
  return mockHotspots.filter((h) => h.listing_id === listingId)
}

export async function getEquipmentModels(): Promise<EquipmentModel[]> {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('equipment_models')
      .select('*')
    if (!error && data) return data as EquipmentModel[]
  }
  return mockEquipmentModels
}

export async function getCaptureVerification(
  listingId: string
): Promise<CaptureVerification | null> {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('capture_verification')
      .select('*')
      .eq('listing_id', listingId)
      .single()
    if (!error && data) return data as CaptureVerification
  }
  if (listingId === SAMPLE_LISTING_ID) return mockCaptureVerification
  return null
}

export { SAMPLE_LISTING_ID }
