// POST /api/realsee/embed-token
// Server-side proxy for embed token generation

import { NextResponse } from 'next/server'
import { realseeAdapter } from '@/lib/realsee/adapter'

export async function POST(request: Request) {
  try {
    const { workId } = await request.json()

    if (!workId) {
      return NextResponse.json(
        { error: 'workId is required' },
        { status: 400 }
      )
    }

    const result = await realseeAdapter.getEmbedToken(workId)
    return NextResponse.json(result)
  } catch (error) {
    console.error('[API] embed-token error:', error)
    return NextResponse.json(
      { error: 'Failed to get embed token' },
      { status: 500 }
    )
  }
}
