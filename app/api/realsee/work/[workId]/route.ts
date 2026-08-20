import { NextResponse } from 'next/server'
import { mockAdapter, realseeAdapter } from '@/lib/realsee/adapter'
import { fetchWorkFromShareLink } from '@/lib/realsee/share-resolver'

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

    // The public demo uses bundled panoramas and must not make a remote lookup.
    if (realseeAdapter === mockAdapter) {
      return NextResponse.json(
        { error: 'Mock spatial work data uses bundled panoramas.', workId },
        { status: 404 }
      )
    }

    // Step 1: Try official Realsee OpenAPI first
    if (realseeAdapter.getWorkData) {
      try {
        const data = await realseeAdapter.getWorkData(workId)
        if (data && typeof data === 'object' && (data.observers || data.panorama || data.model || data.base_url)) {
          return NextResponse.json(data)
        }
      } catch (apiErr) {
        console.warn('[API] OpenAPI lookup failed, attempting fallback resolver:', apiErr)
      }
    }

    // Step 2: Fallback to direct share link / work code resolver
    const shareData = await fetchWorkFromShareLink(workId)
    if (shareData) {
      return NextResponse.json(shareData)
    }

    // Step 3: If still not found, return clean 404
    return NextResponse.json(
      {
        error: 'Work not found or not accessible with current credentials.',
        hint: 'Ensure the work ID or share code (e.g. 7kyyNwq8) is valid.',
        workId,
      },
      { status: 404 }
    )
  } catch (error: any) {
    console.error('[API] work data error:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch work data' },
      { status: 500 }
    )
  }
}
