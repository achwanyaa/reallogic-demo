// GET /api/realsee/job/[jobId]
// Server-side proxy for job polling

import { NextResponse } from 'next/server'
import { realseeAdapter } from '@/lib/realsee/adapter'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await params
    const result = await realseeAdapter.pollJob(jobId)
    return NextResponse.json(result)
  } catch (error) {
    console.error('[API] pollJob error:', error)
    return NextResponse.json(
      { error: 'Failed to poll job' },
      { status: 500 }
    )
  }
}
