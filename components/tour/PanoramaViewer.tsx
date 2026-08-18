'use client'

import { useRef, useEffect, useState, useCallback } from 'react'

interface PanoramaViewerProps {
  imageUrl: string
  children?: React.ReactNode
}

export function PanoramaViewer({ imageUrl, children }: PanoramaViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const rotationRef = useRef({ lon: 0, lat: 0 })
  const isDraggingRef = useRef(false)
  const lastPosRef = useRef({ x: 0, y: 0 })
  const animFrameRef = useRef<number>(0)

  const render = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = (canvas as HTMLCanvasElement & { __panoImage?: HTMLImageElement }).__panoImage
    if (!img) return

    const w = canvas.width
    const h = canvas.height

    // Map lon/lat to source image coordinates for equirectangular projection
    const lon = rotationRef.current.lon
    const lat = Math.max(-85, Math.min(85, rotationRef.current.lat))

    // Calculate the visible portion of the equirectangular image
    const fovH = 90 // horizontal field of view in degrees
    const fovV = (fovH * h) / w

    const srcX = ((lon % 360 + 360) % 360 / 360) * img.width - (fovH / 360) * img.width / 2
    const srcY = ((90 - lat) / 180) * img.height - (fovV / 180) * img.height / 2
    const srcW = (fovH / 360) * img.width
    const srcH = (fovV / 180) * img.height

    ctx.fillStyle = '#0a0a0f'
    ctx.fillRect(0, 0, w, h)

    // Handle wrapping at edges
    const normalizedSrcX = ((srcX % img.width) + img.width) % img.width

    if (normalizedSrcX + srcW > img.width) {
      // Need to draw two parts (wrap around)
      const firstPartW = img.width - normalizedSrcX
      const firstPartCanvasW = (firstPartW / srcW) * w

      ctx.drawImage(
        img,
        normalizedSrcX,
        Math.max(0, srcY),
        firstPartW,
        Math.min(srcH, img.height),
        0,
        0,
        firstPartCanvasW,
        h
      )
      ctx.drawImage(
        img,
        0,
        Math.max(0, srcY),
        srcW - firstPartW,
        Math.min(srcH, img.height),
        firstPartCanvasW,
        0,
        w - firstPartCanvasW,
        h
      )
    } else {
      ctx.drawImage(
        img,
        normalizedSrcX,
        Math.max(0, srcY),
        srcW,
        Math.min(srcH, img.height),
        0,
        0,
        w,
        h
      )
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    // Set canvas size
    const updateSize = () => {
      const rect = container.getBoundingClientRect()
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = rect.height * window.devicePixelRatio
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      render()
    }

    // Load panorama image
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      ;(canvas as HTMLCanvasElement & { __panoImage?: HTMLImageElement }).__panoImage = img
      setIsLoading(false)
      updateSize()

      // Auto-rotate animation
      const autoRotate = () => {
        if (!isDraggingRef.current) {
          rotationRef.current.lon += 0.05
        }
        render()
        animFrameRef.current = requestAnimationFrame(autoRotate)
      }
      animFrameRef.current = requestAnimationFrame(autoRotate)
    }
    img.onerror = () => {
      setError('Failed to load panorama image')
      setIsLoading(false)
    }
    img.src = imageUrl

    // Mouse/touch controls
    const onPointerDown = (e: PointerEvent) => {
      isDraggingRef.current = true
      lastPosRef.current = { x: e.clientX, y: e.clientY }
      container.style.cursor = 'grabbing'
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return
      const dx = e.clientX - lastPosRef.current.x
      const dy = e.clientY - lastPosRef.current.y
      rotationRef.current.lon -= dx * 0.3
      rotationRef.current.lat += dy * 0.3
      rotationRef.current.lat = Math.max(-85, Math.min(85, rotationRef.current.lat))
      lastPosRef.current = { x: e.clientX, y: e.clientY }
    }

    const onPointerUp = () => {
      isDraggingRef.current = false
      container.style.cursor = 'grab'
    }

    window.addEventListener('resize', updateSize)
    container.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)

    return () => {
      window.removeEventListener('resize', updateSize)
      container.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [imageUrl, render])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        cursor: 'grab',
        background: 'var(--bg-secondary)',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
        }}
      />

      {isLoading && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-secondary)',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                border: '3px solid var(--border-subtle)',
                borderTopColor: 'var(--accent-primary)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 12px',
              }}
            />
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Loading panorama...
            </p>
          </div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {error && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-secondary)',
          }}
        >
          <div style={{ textAlign: 'center', padding: '24px' }}>
            <p style={{ color: 'var(--accent-rose)', marginBottom: '8px' }}>⚠ {error}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Using placeholder view — panorama images will be available with the full demo
            </p>
          </div>
        </div>
      )}

      {/* Hotspot overlay layer */}
      {children}

      {/* Controls hint */}
      {!isLoading && !error && (
        <div
          style={{
            position: 'absolute',
            bottom: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '8px 16px',
            background: 'rgba(0, 0, 0, 0.6)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
            pointerEvents: 'none',
          }}
        >
          Click and drag to look around
        </div>
      )}
    </div>
  )
}
