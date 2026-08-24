import { Nav } from './components/layout/Nav'
import { Footer } from './components/layout/Footer'
import { Hero } from './sections/Hero'
import { StatusBar } from './sections/StatusBar'
import { Insight } from './sections/Insight'
import { HowItWorks } from './sections/HowItWorks'
import { StickerCraft } from './sections/StickerCraft'
import { AppProof } from './sections/AppProof'
import { Tiers } from './sections/Tiers'
import { ProOutlook } from './sections/ProOutlook'
import { Ecosystem } from './sections/Ecosystem'
import { Waitlist } from './sections/Waitlist'
import { Faq } from './sections/Faq'

// Nur Komposition. Saemtliche Copy liegt in src/content/* — damit laesst sich
// ein Claim-Review fahren, ohne JSX zu lesen (siehe content/claims-guard.md).
export default function App() {
  return (
    <div className="grain min-h-screen">
      <Nav />
      <main>
        <Hero />
        <StatusBar />
        <Insight />
        <HowItWorks />
        <StickerCraft />
        <AppProof />
        <Tiers />
        <ProOutlook />
        <Ecosystem />
        <Waitlist />
        <Faq />
      </main>
      <Footer />
    </div>
  )
}
