import { Nav } from './components/layout/Nav'
import { Footer } from './components/layout/Footer'
import { Hero } from './sections/Hero'
import { Compat } from './sections/Compat'
import { Insight } from './sections/Insight'
import { Story } from './sections/Story'
import { Bento } from './sections/Bento'
import { Craft } from './sections/Craft'
import { Tiers } from './sections/Tiers'
import { Roadmap } from './sections/Roadmap'
import { Faq } from './sections/Faq'
import { FinalCta } from './sections/FinalCta'

// Nur Komposition. Saemtliche Copy liegt in src/content/* — damit laesst sich
// ein Claim-Review fahren, ohne JSX zu lesen (siehe content/claims-guard.md).
export default function App() {
  return (
    <div className="grain min-h-screen">
      <Nav />
      <main>
        <Hero />
        <Compat />
        <Insight />
        <Story />
        <Bento />
        <Craft />
        <Tiers />
        <Roadmap />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </div>
  )
}
