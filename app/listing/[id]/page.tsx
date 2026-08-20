import Link from 'next/link'
import { ArrowRight, CheckCircle2, ChevronLeft, Eye, FileText, Ruler, ShieldCheck, Zap } from 'lucide-react'
import { TierBadge } from '@/components/ui/TierBadge'
import { VerifiedBadge } from '@/components/listing/VerifiedBadge'
import { DossierTourPreview } from '@/components/tour/DossierTourPreview'
import { Tier3PreviewCards } from '@/components/listing/Tier3PreviewCards'
import { getCaptureVerification, getHotspots, getListing } from '@/lib/data'

interface ListingPageProps { params: Promise<{ id: string }> }

const facts = [
  ['Floor area', '10,200 sqft (947 m²)', 'Property'],
  ['Rent', 'KSh 35 / sqft / month', 'Commercial'],
  ['Service charge', 'KSh 8 / sqft / month', 'Commercial'],
  ['Eaves height', '8.50m', 'Clearance'],
  ['Lowest beam', '7.20m', 'Clearance'],
  ['Slab capacity', '50 kN/m² · C30', 'Structure'],
  ['Power supply', '415V · 3-phase · 200A', 'Utilities'],
  ['Loading access', '4.5m × 4.8m roller door', 'Logistics'],
]

export default async function ListingPage({ params }: ListingPageProps) {
  const { id } = await params
  const [listing, verification, hotspots] = await Promise.all([getListing(id), getCaptureVerification(id), getHotspots(id)])

  if (!listing) return <div className="empty-state"><h1 className="display-heading">Listing not found</h1><Link href="/" className="tech-btn-primary">Return to overview</Link></div>

  return (
    <main>
      <div className="listing-page">
        <Link href="/" className="back-link"><ChevronLeft size={16} /> Back to overview</Link>
        <section className="listing-hero">
          <div>
            <div className="listing-hero__eyebrows"><span className="eyebrow">Sample listing · Industrial Area</span><TierBadge tier="live" /></div>
            <h1 className="display-heading">{listing.title}</h1>
            <p className="listing-hero__location">{listing.location}</p>
            <p className="listing-hero__summary">A working example of how a verified property listing can give remote tenants and investors more confidence before they visit or sign.</p>
            <VerifiedBadge verification={verification} />
          </div>
          <div className="listing-hero__commercial"><span>Asking rent</span><strong>KSh {listing.rent_ksh_per_sqft || 35}</strong><small>per sqft / month</small><div>Service charge: KSh {listing.service_charge_ksh_per_sqft || 8} / sqft</div></div>
        </section>

        <section className="listing-actions"><Link href={`/listing/${id}/tour`} className="tech-btn-primary"><Eye size={17} /> Enter the 3D tour <ArrowRight size={16} /></Link><Link href={`/listing/${id}/clearance`} className="tech-btn-secondary"><Ruler size={17} /> Test equipment clearance</Link><Link href={`/listing/${id}/packet`} className="tech-btn-ghost"><FileText size={16} /> Preview technical packet</Link></section>

        <section className="listing-feature-grid">
          <div className="listing-feature-grid__tour"><DossierTourPreview listingId={id} hotspots={hotspots} /><div className="listing-tour-note"><span><CheckCircle2 size={15} /> Sample capture available now</span><span>Open the tour to inspect all four data layers</span></div></div>
          <div className="facts-panel"><div className="panel-heading"><div><span className="eyebrow">Property facts</span><h2 className="display-heading">The answers that matter.</h2></div><ShieldCheck size={24} color="var(--accent-emerald)" /></div><div className="facts-grid">{facts.map(([label, value, category]) => <div key={label}><span>{category}</span><b>{label}</b><p>{value}</p></div>)}</div></div>
        </section>

        <section className="listing-explanation"><div><span className="eyebrow">Why this is different</span><h2 className="display-heading">A tour becomes useful when the facts stay attached to the space.</h2></div><div className="explanation-points"><p><Zap size={18} /> Structural, utility and logistics information sits alongside the visual capture.</p><p><ShieldCheck size={18} /> Operator identity and capture timing make the record easier to trust.</p><p><Ruler size={18} /> A tenant can test a forklift or rack before committing to the property.</p></div></section>

        <section className="listing-roadmap"><div className="section-intro"><span className="eyebrow">With the partnership</span><h2 className="display-heading">The same listing can grow into a complete technical record.</h2></div><Tier3PreviewCards listingId={id} /></section>
      </div>
    </main>
  )
}
