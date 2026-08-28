import { HERO } from '../content/site'
import { Container } from '../components/layout/Container'
import { Eyebrow } from '../components/ui/Eyebrow'
import { Reveal } from '../components/ui/Reveal'
import { Medallion } from '../components/media/Medallion'
import { WaitlistForm } from '../components/WaitlistForm'

// Asymmetrisch gesetzt: Text links auf 6 von 12 Spalten, Produktobjekt rechts
// auf 5, mit versetzter Grundlinie. Kein zentrierter Stapel — der ist das
// deutlichste Merkmal von Template-Seiten.
//
// Rechts steht bewusst kein Foto, sondern das 3D-Modell des Teils. Ein Foto
// von einem Sticker auf einem Topf zeigt einen Topf; das Objekt zeigt das
// Produkt — und laesst sich drehen, was ein Foto nicht kann.
export function Hero() {
  return (
    <section id="inhalt" className="relative overflow-hidden pb-section pt-16 md:pb-section-lg md:pt-24">
      <HeroAtmosphere />
      <Container grid className="relative items-center gap-y-14">
        <div className="col-span-4 md:col-span-6 md:col-start-1 lg:col-span-6">
          <Reveal>
            <Eyebrow>{HERO.eyebrow}</Eyebrow>
          </Reveal>

          <Reveal delay={60}>
            <h1 className="mt-7 whitespace-pre-line text-display-xl">{HERO.headline}</h1>
          </Reveal>

          <Reveal delay={120}>
            <p className="mt-7 max-w-measure text-lead text-ink/70">{HERO.lead}</p>
          </Reveal>

          <Reveal delay={180}>
            <WaitlistForm
              variant="compact"
              submitLabel={HERO.submit}
              className="mt-9 max-w-[34rem]"
            />
            <p className="mt-3 text-note text-ink/50">{HERO.reassurance}</p>
          </Reveal>
        </div>

        <Reveal
          delay={240}
          className="col-span-4 md:col-span-6 md:col-start-7 lg:col-span-5 lg:col-start-8"
        >
          <Medallion />
        </Reveal>
      </Container>
    </section>
  )
}

// Warme Lichtstimmung hinter dem Objekt statt einer flachen Farbflaeche. Zwei
// weiche Verlaeufe, kein Blur-Blob: der Farbton bleibt in der Palette und die
// Kanten laufen aus, statt als Kreis erkennbar zu bleiben.
function HeroAtmosphere() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      <div
        className="absolute -right-[18%] -top-[30%] h-[130%] w-[78%]"
        style={{
          background:
            'radial-gradient(50% 50% at 50% 50%, rgba(216,146,104,0.30) 0%, rgba(216,146,104,0.10) 46%, rgba(216,146,104,0) 72%)',
        }}
      />
      <div
        className="absolute -left-[12%] bottom-[-22%] h-[70%] w-[55%]"
        style={{
          background:
            'radial-gradient(50% 50% at 50% 50%, rgba(56,101,56,0.16) 0%, rgba(56,101,56,0) 70%)',
        }}
      />
    </div>
  )
}
