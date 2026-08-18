import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 })
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadDir, { recursive: true })

    const uploadedUrls: { filename: string; url: string; size: number }[] = []

    for (const file of files) {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Sanitize filename and create unique timestamped name
      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      const uniqueName = `pano_${Date.now()}_${safeName}`
      const filePath = path.join(uploadDir, uniqueName)

      await writeFile(filePath, buffer)

      uploadedUrls.push({
        filename: file.name,
        url: `/uploads/${uniqueName}`,
        size: file.size,
      })
    }

    return NextResponse.json({
      success: true,
      files: uploadedUrls,
    })
  } catch (error: any) {
    console.error('[API] Pano upload error:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to process upload' },
      { status: 500 }
    )
  }
}
