// Reallogic — Live Realsee Adapter
// Production integration with Realsee OpenAPI and Argus gateway
// All calls happen strictly server-side — API keys are never exposed client-side.

import type { RealseeAdapter, ReconstructionJob } from './types'

const BASE_URL = process.env.REALSEE_API_BASE_URL || 'https://app-gateway.realsee.ai'

interface TokenCache {
  token: string
  expiresAt: number // epoch ms
}

let cachedToken: TokenCache | null = null

/**
 * Obtain a server-to-server Bearer access token using App Key & App Secret.
 * Tokens are cached in-memory until near expiration.
 */
export async function getAccessToken(): Promise<string> {
  const appId = process.env.REALSEE_APP_ID
  const appSecret = process.env.REALSEE_APP_SECRET

  if (!appId || !appSecret) {
    throw new Error('Missing REALSEE_APP_ID or REALSEE_APP_SECRET in environment variables')
  }

  // Use cached token if valid (with 5-minute safety buffer)
  if (cachedToken && cachedToken.expiresAt > Date.now() + 5 * 60 * 1000) {
    return cachedToken.token
  }

  const endpoint = `${BASE_URL}/auth/access_token`
  const params = new URLSearchParams()
  params.append('app_key', appId)
  params.append('app_secret', appSecret)

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: params.toString(),
  })

  if (!response.ok) {
    const errText = await response.text()
    throw new Error(`Failed to obtain Realsee access token (${response.status}): ${errText}`)
  }

  const result = await response.json()
  const token = result?.data?.access_token || result?.access_token

  if (!token) {
    throw new Error(`Invalid access token response from Realsee: ${JSON.stringify(result)}`)
  }

  // Cache token (default 1 hour if not specified)
  const expiresInMs = (result?.data?.expires_in || 3600) * 1000
  cachedToken = {
    token,
    expiresAt: Date.now() + expiresInMs,
  }

  return token
}

export const liveAdapter: RealseeAdapter = {
  /**
   * Trigger Argus 3D AI Reconstruction for submitted panoramic images.
   */
  async triggerReconstruction(panoUrls: string[]): Promise<{ jobId: string }> {
    const token = await getAccessToken()

    // Step 1: Create an upload session / input ID on Argus gateway
    const uploadTokenRes = await fetch(`${BASE_URL}/open/saas/v1/vggt/upload/token`, {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        input_image_id: '',
      }),
    })

    if (!uploadTokenRes.ok) {
      const errText = await uploadTokenRes.text()
      throw new Error(`Failed to create Argus upload session (${uploadTokenRes.status}): ${errText}`)
    }

    const uploadData = await uploadTokenRes.json()
    const inputImageId = uploadData?.data?.input_image_id

    if (!inputImageId) {
      throw new Error(`Argus upload token returned no input_image_id: ${JSON.stringify(uploadData)}`)
    }

    // Step 2: Trigger reconstruction task
    const triggerRes = await fetch(`${BASE_URL}/open/saas/v1/vggt/trigger`, {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        input_image_id: inputImageId,
        type: 'pano',
      }),
    })

    if (!triggerRes.ok) {
      const errText = await triggerRes.text()
      throw new Error(`Failed to trigger Argus reconstruction (${triggerRes.status}): ${errText}`)
    }

    return { jobId: inputImageId }
  },

  /**
   * Poll Argus 3D reconstruction task status.
   */
  async pollJob(jobId: string): Promise<ReconstructionJob> {
    const token = await getAccessToken()

    const pollRes = await fetch(
      `${BASE_URL}/open/saas/v1/vggt/poll?type=pano&input_image_id=${encodeURIComponent(jobId)}`,
      {
        method: 'GET',
        headers: {
          Authorization: token,
          Accept: 'application/json',
        },
      }
    )

    if (!pollRes.ok) {
      const errText = await pollRes.text()
      throw new Error(`Failed to poll Argus job status (${pollRes.status}): ${errText}`)
    }

    const json = await pollRes.json()
    const data = json?.data || {}
    const status = data.status // 'pending' | 'success' | 'failed'

    if (status === 'success') {
      return {
        jobId,
        status: 'complete',
        outputs: {
          panoramaUrls: data.panorama_urls || [],
          floorPlanUrl: data.floor_plan_url,
          modelGlbUrl: data.result_url || data.model_glb_url,
        },
      }
    }

    if (status === 'failed') {
      return {
        jobId,
        status: 'failed',
      }
    }

    return {
      jobId,
      status: 'processing',
    }
  },

  /**
   * Get an embed authorization token or view payload for a given space/work ID.
   */
  async getEmbedToken(workId: string): Promise<{ token: string; expiresAt: string }> {
    const token = await getAccessToken()
    const expiresAt = cachedToken?.expiresAt
      ? new Date(cachedToken.expiresAt).toISOString()
      : new Date(Date.now() + 3600 * 1000).toISOString()

    return {
      token,
      expiresAt,
    }
  },

  /**
   * Fetch complete published work.json data for a space to render in Five SDK.
   */
  async getWorkData(workId: string): Promise<any> {
    const token = await getAccessToken()

    const res = await fetch(`${BASE_URL}/open/work/show.json?work_id=${encodeURIComponent(workId)}`, {
      method: 'GET',
      headers: {
        Authorization: token,
        Accept: 'application/json',
      },
    })

    if (!res.ok) {
      // Fallback to /open/v1/work/detail.json if show.json is not supported for this work type
      const detailRes = await fetch(`${BASE_URL}/open/v1/work/detail.json`, {
        method: 'POST',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ work_id: workId }),
      })

      if (!detailRes.ok) {
        const errText = await detailRes.text()
        throw new Error(`Failed to fetch Realsee work data (${res.status} / ${detailRes.status}): ${errText}`)
      }

      const detailData = await detailRes.json()
      return detailData?.data || detailData
    }

    const showData = await res.json()
    return showData?.data || showData
  },
}
