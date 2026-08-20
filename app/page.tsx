import Link from 'next/link'
import { ArrowRight, Check, ChevronRight, CircleCheck, Ruler, ShieldCheck } from 'lucide-react'
import { TierBadge } from '@/components/ui/TierBadge'
import { SAMPLE_LISTING_ID } from '@/lib/data/mock-data'

const panos = [
  '/mock/alhusnain/IMG_20260523_100706_00_091.jpg',
  '/mock/alhusnain/IMG_20260523_101038_00_100.jpg',
]

const verificationAreas = [
  ['Floor slab', 'Thickness, grade, load capacity and vibration tolerance'],
  ['Clear height', 'Eaves, lowest beams and sprinkler drop clearance'],
  ['Utilities', 'Power, water, gas and HVAC information'],
  ['Logistics', 'Docks, doors and heavy-vehicle turning radius'],
]

export default function LandingPage() {
  return (
    <main>
      <section className="home-hero">
        <div className="home-hero__copy">
          <span className="eyebrow">LuxuryBoma360 · Reallogic Kenya</span>
          <h1 className="display-heading">The verification layer between property and capital.</h1>
          <p>Commercial property information that helps investors and tenants answer the questions a normal tour cannot.</p>
          <div className="home-hero__actions">
            <Link href={`/listing/${SAMPLE_LISTING_ID}`} className="tech-btn-primary">Explore the sample listing <ArrowRight size={16} /></Link>
            <a href="#how-it-works" className="tech-btn-secondary">See how it works</a>
          </div>
          <div className="home-hero__note"><CircleCheck size={16} /> Sample warehouse demonstration · no live Realsee work ID connected yet</div>
        </div>
        <div className="home-hero__visual">
          <img src={panos[0]} alt="Sample warehouse interior capture" />
          <div className="home-hero__visual-label"><span className="status-pulse-emerald" /> Actual capture workflow</div>
          <div className="home-hero__visual-caption"><strong>Godown Unit A3</strong><span>Industrial Area, Nairobi · 10,200 sqft</span></div>
        </div>
      </section>

      <section className="story-section story-section--light">
        <div className="section-intro"><span className="eyebrow">The problem</span><h2 className="display-heading">Cross-border capital does not trust what it cannot verify.</h2></div>
        <div className="problem-grid">
          <div className="stat-panel"><strong>61%</strong><span>of Kenyans living abroad say they fear investing back home, primarily because of trust issues.</span><small>Illustrative market evidence</small></div>
          <div className="problem-list">
            <div><b>Remote by necessity</b><p>Diaspora buyers rely on calls and PDFs. They cannot walk the property themselves.</p></div>
            <div><b>Easy to misrepresent</b><p>A short walkthrough can hide the details that matter before a lease or investment decision.</p></div>
            <div><b>What is actually needed</b><p>A structured, systematic view of the physical property, not another pretty video.</p></div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="story-section">
        <div className="section-intro section-intro--center"><span className="eyebrow">The workflow</span><h2 className="display-heading">From field capture to a decision-ready listing.</h2><p>Every stage turns a physical property into evidence that can be reviewed remotely.</p></div>
        <div className="workflow-grid">
          {['Field capture', 'QA review', 'Publish with verification', 'Portal syndication'].map((step, index) => <div className="workflow-step" key={step}><span>{index + 1}</span><strong>{step}</strong>{index < 3 && <ChevronRight className="workflow-arrow" size={24} />}</div>)}
        </div>
      </section>

      <section className="story-section story-section--teal">
        <div className="section-intro section-intro--center"><span className="eyebrow eyebrow--on-teal">The offer</span><h2 className="display-heading">Not a tour vendor. A verification platform.</h2><p>Reallogic combines the familiar property listing with the physical answers a tenant or investor needs.</p></div>
        <div className="offer-grid">
          <div className="offer-column offer-column--muted"><h3>A typical 360° tour</h3>{['Pretty, but generic', 'No structural or utility data', 'No way to verify who captured it or when', 'Ends at “look around”'].map((item) => <div key={item}><span>−</span>{item}</div>)}</div>
          <div className="offer-column offer-column--white"><h3>LuxuryBoma360</h3>{['Engineered for leasing and investment decisions', 'Structural, utility and logistics data on the scene', 'Operator-verified capture, timestamped', 'Ends at “ready to sign”'].map((item) => <div key={item}><Check size={18} />{item}</div>)}</div>
        </div>
      </section>

      <section className="story-section story-section--light">
        <div className="section-intro"><span className="eyebrow">One sample listing</span><h2 className="display-heading">See the warehouse the way a decision-maker sees it.</h2><p>Open the working demo to inspect the capture, review the measured information, and test equipment clearance.</p></div>
        <div className="sample-property">
          <div className="sample-property__image"><img src={panos[1]} alt="Sample warehouse bay" /><div className="sample-property__badge"><ShieldCheck size={16} /> Verified sample capture</div></div>
          <div className="sample-property__body"><span className="eyebrow">Industrial Area · Nairobi</span><h3 className="display-heading">Godown Unit A3</h3><p>Off Mombasa Road · 10,200 sqft · KSh 35 / sqft / month</p><div className="sample-metrics"><div><b>8.50m</b><span>eaves height</span></div><div><b>50 kN/m²</b><span>slab capacity</span></div><div><b>200A</b><span>3-phase power</span></div></div><Link href={`/listing/${SAMPLE_LISTING_ID}`} className="tech-btn-primary">Open property dossier <ArrowRight size={16} /></Link></div>
        </div>
      </section>

      <section className="story-section">
        <div className="section-intro section-intro--center"><span className="eyebrow">The capability plan</span><h2 className="display-heading">Useful now. More powerful with the partnership.</h2></div>
        <div className="tier-grid">
          <div className="tier-card"><TierBadge tier="live" size="md" /><span className="tier-card__number">01</span><h3>Live capture and secure embed</h3><p>360° panoramic tours, server-side key proxying and a white-label listing shell.</p><Link href={`/listing/${SAMPLE_LISTING_ID}/tour`}>Explore the tour <ArrowRight size={15} /></Link></div>
          <div className="tier-card tier-card--accent"><TierBadge tier="in-development" size="md" /><span className="tier-card__number">02</span><h3>Warehouse-specific verification</h3><p>Four data layers plus a clearance check before a tenant commits to a lease.</p><Link href={`/listing/${SAMPLE_LISTING_ID}/clearance`}>Try clearance checking <ArrowRight size={15} /></Link></div>
          <div className="tier-card"><TierBadge tier="coming-with-partnership" size="md" /><span className="tier-card__number">03</span><h3>Enterprise roadmap</h3><p>Live co-viewing, scan-to-BIM exports and sealed technical packet downloads.</p><Link href={`/listing/${SAMPLE_LISTING_ID}/packet`}>Preview the packet <ArrowRight size={15} /></Link></div>
        </div>
      </section>

      <section className="story-section story-section--light">
        <div className="section-intro section-intro--center"><span className="eyebrow">What gets verified</span><h2 className="display-heading">Answers attached to the property itself.</h2></div>
        <div className="verification-grid">{verificationAreas.map(([title, description], index) => <div key={title}><span>{String(index + 1).padStart(2, '0')}</span><Ruler size={18} /><h3>{title}</h3><p>{description}</p></div>)}</div>
      </section>
    </main>
  )
}
