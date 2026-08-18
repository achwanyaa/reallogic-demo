// GET /api/realsee/work/[workId]
// Server-side proxy for Realsee work.json space data

import { NextResponse } from 'next/server'
import { realseeAdapter } from '@/lib/realsee/adapter'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ workId: string }> }
) {
  try {
    const { workId } = await params

    if (!workId) {
      return NextResponse.json(
        { error: 'workId is required' },
        { status: 400 }
      )
    }

    if (realseeAdapter.getWorkData) {
      const data = await realseeAdapter.getWorkData(workId)
      return NextResponse.json(data)
    }

    const result = await realseeAdapter.getEmbedToken(workId)
    return NextResponse.json(result)
  } catch (error) {
    console.error('[API] work data error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch work data' },
      { status: 500 }
    )
  }
}
