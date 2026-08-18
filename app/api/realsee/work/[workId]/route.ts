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

      // Realsee returns { data: null, code: -1 } when the work ID doesn't exist
      // or belongs to a different account — surface this as a clear 404.
      if (data === null || data === undefined) {
        return NextResponse.json(
          {
            error: 'Work not found or not accessible with current credentials.',
            hint: 'Ensure the work ID belongs to the account matching REALSEE_APP_ID.',
            workId,
          },
          { status: 404 }
        )
      }

      return NextResponse.json(data)
    }

    const result = await realseeAdapter.getEmbedToken(workId)
    return NextResponse.json(result)
  } catch (error: any) {
    console.error('[API] work data error:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch work data' },
      { status: 500 }
    )
  }
}
