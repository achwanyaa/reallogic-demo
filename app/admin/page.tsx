'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  Boxes,
  Crosshair,
  Ruler,
  ShieldCheck,
  ChevronLeft,
  Terminal,
  Database,
  Building2,
  Cpu,
  Upload,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Play,
  RefreshCw,
  Image as ImageIcon,
  Sparkles,
  ArrowRight,
} from 'lucide-react'
import { getAllListings, getHotspots, getEquipmentModels, getCaptureVerification } from '@/lib/data'
import { PanoramaViewer } from '@/components/tour/PanoramaViewer'
import type { Listing, Hotspot, EquipmentModel, CaptureVerification } from '@/lib/realsee/types'

type Tab = 'upload' | 'listings' | 'hotspots' | 'equipment' | 'verification'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('upload')
  const [listings, setListings] = useState<Listing[]>([])
  const [hotspots, setHotspots] = useState<Hotspot[]>([])
  const [equipment, setEquipment] = useState<EquipmentModel[]>([])
  const [verification, setVerification] = useState<CaptureVerification | null>(null)

  // Upload & Testing state
  const [uploadedFiles, setUploadedFiles] = useState<{ filename: string; url: string; size: number }[]>([])
  const [selectedPanoUrl, setSelectedPanoUrl] = useState<string>('/mock/pano-warehouse-main.jpg')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [reconstructJobId, setReconstructJobId] = useState<string | null>(null)
  const [reconstructStatus, setReconstructStatus] = useState<string | null>(null)
  const [isReconstructing, setIsReconstructing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Custom VR ID binder
  const [customVrId, setCustomVrId] = useState('80P29aOvr7kw98eDxE')
  const [customListingTitle, setCustomListingTitle] = useState('ONLYOU ELGEYO')

  useEffect(() => {
    getAllListings().then(setListings)
    getEquipmentModels().then(setEquipment)
  }, [])

  useEffect(() => {
    if (listings.length > 0) {
      getHotspots(listings[0].id).then(setHotspots)
      getCaptureVerification(listings[0].id).then(setVerification)
    }
  }, [listings])

  // Handle direct file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    setUploadError(null)

    try {
      const formData = new FormData()
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i])
      }

      const res = await fetch('/api/upload/pano', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to upload panorama files')
      }

      setUploadedFiles((prev) => [...data.files, ...prev])
      if (data.files.length > 0) {
        setSelectedPanoUrl(data.files[0].url)
      }
    } catch (err: any) {
      setUploadError(err?.message || 'Error uploading file')
    } finally {
      setIsUploading(false)
    }
  }

  // Trigger Argus 3D AI Reconstruction
  const handleTriggerArgus = async () => {
    if (uploadedFiles.length === 0) {
      setUploadError('Please upload at least one 360 panorama first')
      return
    }

    setIsReconstructing(true)
    setReconstructStatus('INITIALIZING RECONSTRUCTION PIPELINE...')
    setUploadError(null)

    try {
      const panoUrls = uploadedFiles.map((f) => f.url)
      const res = await fetch('/api/realsee/reconstruct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ panoUrls }),
      })

      const data = await res.json()
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Reconstruction trigger failed')
      }

      const jobId = data.jobId
      setReconstructJobId(jobId)
      setReconstructStatus(`JOB DISPATCHED: [${jobId}] • POLLING REALSEE ARGUS...`)

      // Poll job status
      const pollInterval = setInterval(async () => {
        try {
          const pollRes = await fetch(`/api/realsee/job/${encodeURIComponent(jobId)}`)
          const pollData = await pollRes.json()

          if (pollData.status === 'complete') {
            clearInterval(pollInterval)
            setReconstructStatus(`SUCCESS: RECONSTRUCTION COMPLETE! Model: ${pollData.outputs?.modelGlbUrl || '3D Space Ready'}`)
            setIsReconstructing(false)
          } else if (pollData.status === 'failed') {
            clearInterval(pollInterval)
            setReconstructStatus('FAILED: Realsee Argus was unable to build 3D mesh from the given images.')
            setIsReconstructing(false)
          } else {
            setReconstructStatus(`PROCESSING: Realsee Argus AI generating point clouds & 3D mesh (Status: ${pollData.status})...`)
          }
        } catch (e) {
          // ignore transient poll error
        }
      }, 5000)
    } catch (err: any) {
      setUploadError(err?.message || 'Reconstruction request error')
      setIsReconstructing(false)
    }
  }

  const tabs: { key: Tab; label: string; count?: number; icon: any }[] = [
    { key: 'upload', label: 'LIVE PANO UPLOADER & RECONSTRUCTION', icon: Upload },
    { key: 'listings', label: 'PROPERTY FLEET', count: listings.length, icon: Building2 },
    { key: 'hotspots', label: 'STRUCTURAL HOTSPOTS', count: hotspots.length, icon: Crosshair },
    { key: 'equipment', label: 'EQUIPMENT MODELS', count: equipment.length, icon: Boxes },
    { key: 'verification', label: 'AUDIT VERIFICATION', count: verification ? 1 : 0, icon: ShieldCheck },
  ]

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '32px 24px 80px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              color: 'var(--text-secondary)',
              textDecoration: 'none',
            }}
          >
            <ChevronLeft size={14} />
            <span>HOME</span>
          </Link>
          <div style={{ height: '16px', width: '1px', background: 'var(--border-medium)' }} />
          <h1 style={{ fontFamily: 'var(--font-ui)', fontWeight: 800, fontSize: '1.4rem', color: '#FFFFFF' }}>
            Reallogic Engineering & Spatial Studio
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="mono-metric" style={{ fontSize: '0.72rem', color: 'var(--accent-emerald)' }}>
            [REALSEE LIVE ADAPTER: READY]
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '6px',
          marginBottom: '24px',
          borderBottom: '1px solid var(--border-medium)',
          paddingBottom: '0',
          overflowX: 'auto',
        }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                background: isActive ? 'var(--bg-card)' : 'transparent',
                border: '1px solid transparent',
                borderBottom: isActive ? '2px solid var(--accent-orange)' : '2px solid transparent',
                color: isActive ? '#FFFFFF' : 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontWeight: isActive ? 700 : 500,
                fontFamily: 'var(--font-mono)',
                whiteSpace: 'nowrap',
              }}
            >
              <Icon size={14} color={isActive ? 'var(--accent-orange)' : 'var(--text-muted)'} />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  style={{
                    padding: '1px 6px',
                    borderRadius: '2px',
                    background: 'var(--bg-secondary)',
                    color: isActive ? 'var(--accent-orange)' : 'var(--text-muted)',
                    fontSize: '0.68rem',
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* ─── TAB 1: Pano Uploader & Live 360 Testing Studio ────────── */}
      {activeTab === 'upload' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: '24px' }} className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left Column: Upload Dropzone & Controls */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            {/* Upload Box */}
            <div
              className="hud-panel corner-brackets"
              style={{
                padding: '28px',
                textAlign: 'center',
                background: 'var(--bg-secondary)',
                border: '2px dashed var(--border-strong)',
                cursor: 'pointer',
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/jpg"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
              <Upload size={32} color="var(--accent-orange)" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '1.05rem', color: '#FFFFFF', marginBottom: '4px' }}>
                Drop 360° Equirectangular Panoramas Here
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: '16px' }}>
                Supports JPG, PNG (2:1 aspect ratio, e.g., 6000×3000 or 4000×2000 from Insta360 / Ricoh Theta)
              </p>
              <button
                type="button"
                className="tech-btn-primary"
                style={{ padding: '8px 16px', fontSize: '0.78rem', margin: '0 auto' }}
                disabled={isUploading}
              >
                {isUploading ? 'UPLOADING FILES...' : 'SELECT PANORAMAS FROM DISK'}
              </button>
            </div>

            {uploadError && (
              <div
                style={{
                  padding: '10px 14px',
                  background: 'rgba(244, 63, 94, 0.1)',
                  border: '1px solid var(--accent-rose)',
                  borderRadius: 'var(--radius-xs)',
                  color: '#FDA4AF',
                  fontSize: '0.78rem',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                ⚠ {uploadError}
              </div>
            )}

            {/* Uploaded Panoramas Gallery */}
            <div className="hud-panel" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span className="mono-tag" style={{ color: '#FFFFFF' }}>
                  ACTIVE PANORAMAS ({uploadedFiles.length + 1})
                </span>
                <span className="mono-metric" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  CLICK TO PREVIEW IN 360°
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                {/* Default Sample Pano */}
                <div
                  onClick={() => setSelectedPanoUrl('/mock/pano-warehouse-main.jpg')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    background: selectedPanoUrl === '/mock/pano-warehouse-main.jpg' ? 'rgba(249, 115, 22, 0.1)' : 'var(--bg-secondary)',
                    border: `1px solid ${selectedPanoUrl === '/mock/pano-warehouse-main.jpg' ? 'var(--accent-orange)' : 'var(--border-subtle)'}`,
                    borderRadius: 'var(--radius-xs)',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ImageIcon size={14} color="var(--accent-cyan)" />
                    <span style={{ color: '#FFFFFF' }}>pano-warehouse-main.jpg (Sample Warehouse Bay)</span>
                  </div>
                  <span style={{ color: 'var(--accent-emerald)' }}>READY</span>
                </div>

                {/* User uploaded files */}
                {uploadedFiles.map((file) => (
                  <div
                    key={file.url}
                    onClick={() => setSelectedPanoUrl(file.url)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      background: selectedPanoUrl === file.url ? 'rgba(249, 115, 22, 0.1)' : 'var(--bg-secondary)',
                      border: `1px solid ${selectedPanoUrl === file.url ? 'var(--accent-orange)' : 'var(--border-subtle)'}`,
                      borderRadius: 'var(--radius-xs)',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <ImageIcon size={14} color="var(--accent-orange)" />
                      <span style={{ color: '#FFFFFF' }}>{file.filename}</span>
                    </div>
                    <span style={{ color: 'var(--text-muted)' }}>{(file.size / (1024 * 1024)).toFixed(1)} MB</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Realsee Argus AI 3D Reconstruction Action */}
            <div className="hud-panel" style={{ padding: '20px', borderLeft: '3px solid var(--accent-orange)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Sparkles size={16} color="var(--accent-orange)" />
                <span className="mono-tag" style={{ color: 'var(--accent-orange)' }}>
                  REALSEE ARGUS AI 3D RECONSTRUCTION
                </span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: 1.5, marginBottom: '14px' }}>
                Upload 1 or more panoramas and send to Realsee Argus to automatically generate point clouds, 3D floor plans, and a complete spatial VR Space ID.
              </p>

              <button
                onClick={handleTriggerArgus}
                disabled={isReconstructing || uploadedFiles.length === 0}
                className="tech-btn-primary"
                style={{ width: '100%', padding: '10px 16px', fontSize: '0.82rem' }}
              >
                {isReconstructing ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>RECONSTRUCTING 3D MESH...</span>
                  </>
                ) : (
                  <>
                    <Play size={14} />
                    <span>DISPATCH ARGUS 3D RECONSTRUCTION ({uploadedFiles.length} IMAGES)</span>
                  </>
                )}
              </button>

              {reconstructStatus && (
                <div
                  style={{
                    marginTop: '12px',
                    padding: '10px 12px',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-xs)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    color: 'var(--accent-cyan)',
                  }}
                >
                  {reconstructStatus}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Live Instant 360° Interactive Canvas */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div
              className="hud-panel corner-brackets"
              style={{
                height: '420px',
                borderRadius: 'var(--radius-xs)',
                overflow: 'hidden',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div className="hud-panel-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Eye size={14} color="var(--accent-emerald)" />
                  <span>LIVE 360° EQUIRECTANGULAR PREVIEW</span>
                </div>
                <span className="mono-metric" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  DRAG TO ROTATE
                </span>
              </div>

              <div style={{ flex: 1, position: 'relative', background: '#000000' }}>
                <PanoramaViewer imageUrl={selectedPanoUrl} />
              </div>
            </div>

            {/* Bind Existing Realsee VR ID Quick-Launcher */}
            <div className="hud-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <Terminal size={15} color="var(--accent-cyan)" />
                <span className="mono-tag" style={{ color: 'var(--accent-cyan)' }}>
                  BIND LIVE REALSEE SPACE / WORK CODE
                </span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '12px' }}>
                Already have a live Galois LiDAR or Pano space? Enter its VR ID to preview with structural HUD:
              </p>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <input
                  type="text"
                  value={customVrId}
                  onChange={(e) => setCustomVrId(e.target.value)}
                  placeholder="e.g. nmRVg9JX4Cl62XiXmP or BD0ggLIAlcjVaVf1oN"
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-medium)',
                    borderRadius: 'var(--radius-xs)',
                    color: '#FFFFFF',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8rem',
                    outline: 'none',
                  }}
                />
                <Link
                  href={`/listing/a1b2c3d4-e5f6-7890-abcd-ef1234567890/tour`}
                  className="tech-btn-primary"
                  style={{ padding: '8px 14px', fontSize: '0.75rem' }}
                >
                  <span>LAUNCH TOUR</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

              <div style={{ display: 'flex', gap: '8px', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                <span>PRESET SPACES:</span>
                <button
                  onClick={() => setCustomVrId('80P29aOvr7kw98eDxE')}
                  style={{ background: 'none', border: 'none', color: 'var(--accent-emerald)', cursor: 'pointer', textDecoration: 'underline', fontWeight: 700 }}
                >
                  ONLYOU ELGEYO (Live 3D)
                </button>
                <span>•</span>
                <button
                  onClick={() => setCustomVrId('80QXy9Z85XY37vYa06')}
                  style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  ONLYOU ELGEYO 1
                </button>
                <span>•</span>
                <button
                  onClick={() => setCustomVrId('nmRVg9JX4Cl62XiXmP')}
                  style={{ background: 'none', border: 'none', color: 'var(--accent-orange)', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Deluxe Lounge (LiDAR)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 2: Listings ──────────────────────────────────────── */}
      {activeTab === 'listings' && (
        <div style={{ display: 'grid', gap: '12px' }}>
          {listings.map((listing) => (
            <div key={listing.id} className="hud-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h3 style={{ fontWeight: 700, fontSize: '1.05rem', color: '#FFFFFF' }}>{listing.title}</h3>
                <Link
                  href={`/listing/${listing.id}`}
                  className="tech-btn-secondary"
                  style={{ padding: '4px 10px', fontSize: '0.72rem' }}
                >
                  VIEW DOSSIER →
                </Link>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                📍 {listing.location}
              </p>
              <div
                style={{
                  display: 'flex',
                  gap: '20px',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-muted)',
                  flexWrap: 'wrap',
                }}
              >
                <span>ID: {listing.id}</span>
                <span>AREA: {listing.size_sqft?.toLocaleString()} SQFT</span>
                <span>RATE: KSH {listing.rent_ksh_per_sqft}/SQFT</span>
                <span>WORK_ID: [{listing.realsee_work_id || 'LOCAL'}]</span>
                <span style={{ color: 'var(--accent-emerald)' }}>TIER: {listing.tier?.toUpperCase()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── TAB 3: Hotspots ──────────────────────────────────────── */}
      {activeTab === 'hotspots' && (
        <div style={{ display: 'grid', gap: '12px' }}>
          {hotspots.map((hotspot) => (
            <div key={hotspot.id} className="hud-panel" style={{ padding: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#FFFFFF' }}>{hotspot.label}</h3>
                <span className="mono-metric" style={{ fontSize: '0.7rem', color: 'var(--accent-orange)' }}>
                  [{hotspot.category.toUpperCase()}]
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                POSITION VECTOR: ({hotspot.position.x}, {hotspot.position.y}, {hotspot.position.z})
              </p>
              <pre
                style={{
                  marginTop: '10px',
                  padding: '10px',
                  background: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-secondary)',
                  overflow: 'auto',
                }}
              >
                {JSON.stringify(hotspot.values, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      )}

      {/* ─── TAB 4: Equipment ─────────────────────────────────────── */}
      {activeTab === 'equipment' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
          {equipment.map((eq) => (
            <div key={eq.id} className="hud-panel" style={{ padding: '18px' }}>
              <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#FFFFFF', marginBottom: '6px' }}>{eq.name}</h3>
              <p className="mono-metric" style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)' }}>
                {eq.dimensions_m.length}m (L) × {eq.dimensions_m.width}m (W) × {eq.dimensions_m.height}m (H)
              </p>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '8px' }}>
                GLB ASSET: {eq.glb_url}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* ─── TAB 5: Verification ──────────────────────────────────── */}
      {activeTab === 'verification' && verification && (
        <div className="hud-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontWeight: 700, color: '#FFFFFF', marginBottom: '16px' }}>Capture Verification Record</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>CAPTURE TYPE</span>
              <p style={{ color: '#FFFFFF', fontWeight: 700, marginTop: '2px' }}>{verification.capture_type?.toUpperCase()}</p>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>OPERATOR ID</span>
              <p style={{ color: '#FFFFFF', fontWeight: 700, marginTop: '2px' }}>{verification.operator_id}</p>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>TIMESTAMP</span>
              <p style={{ color: '#FFFFFF', fontWeight: 700, marginTop: '2px' }}>{verification.captured_at ? new Date(verification.captured_at).toISOString() : '—'}</p>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>LINKED LISTING</span>
              <p style={{ color: 'var(--accent-orange)', marginTop: '2px' }}>{verification.listing_id}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
