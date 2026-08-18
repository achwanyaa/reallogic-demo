// POST /api/realsee/reconstruct
// Server-side proxy for reconstruction trigger — API keys never exposed client-side

import { NextResponse } from 'next/server'
import { realseeAdapter } from '@/lib/realsee/adapter'

export async function POST(request: Request) {
  try {
    const { panoUrls } = await request.json()

    if (!panoUrls || !Array.isArray(panoUrls) || panoUrls.length === 0) {
      return NextResponse.json(
        { error: 'panoUrls array is required' },
        { status: 400 }
      )
    }

    const result = await realseeAdapter.triggerReconstruction(panoUrls)
    return NextResponse.json(result)
  } catch (error) {
    console.error('[API] reconstruct error:', error)
    return NextResponse.json(
      { error: 'Failed to trigger reconstruction' },
      { status: 500 }
    )
  }
}
