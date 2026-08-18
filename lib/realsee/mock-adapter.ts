// Reallogic — Mock Adapter
// Returns static sample data. The entire app runs against this today.
// When Realsee credentials arrive, swap to live-adapter.ts — zero UI changes.

import type { RealseeAdapter, ReconstructionJob } from './types'

// Sample panorama URLs — using equirectangular images for the demo viewer
const MOCK_PANORAMA_URLS = [
  '/mock/pano-warehouse-main.jpg',
  '/mock/pano-warehouse-dock.jpg',
  '/mock/pano-warehouse-office.jpg',
]

export const mockAdapter: RealseeAdapter = {
  async triggerReconstruction(panoUrls: string[]): Promise<{ jobId: string }> {
    console.log('[mock-adapter] triggerReconstruction called with', panoUrls.length, 'images')
    // Simulate immediate job creation
    return { jobId: 'mock-job-001' }
  },

  async pollJob(jobId: string): Promise<ReconstructionJob> {
    console.log('[mock-adapter] pollJob called for', jobId)
    // Always return complete with mock data
    return {
      jobId,
      status: 'complete',
      outputs: {
        panoramaUrls: MOCK_PANORAMA_URLS,
        floorPlanUrl: '/mock/floor-plan-sample.png',
        modelGlbUrl: '/mock/warehouse-model.glb',
        cubemapUrl: '/mock/cubemap-sample.jpg',
      },
    }
  },

  async getEmbedToken(workId: string): Promise<{ token: string; expiresAt: string }> {
    console.log('[mock-adapter] getEmbedToken called for', workId)
    // Return a mock token that "expires" in 24 hours
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    return {
      token: 'mock-embed-token-' + workId,
      expiresAt,
    }
  },
}
