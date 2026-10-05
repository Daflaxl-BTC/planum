import { HERO, SITE } from '../content/site'
import { HERO_META } from '../content/landing'
import { Container } from '../components/layout/Container'
import { Reveal } from '../components/ui/Reveal'
import { StickerStage } from '../components/media/StickerStage'
import { WaitlistForm } from '../components/WaitlistForm'
import { HERO_POSE } from '../three/poses'

// Dunkle Buehne, links die Aussage, rechts die beiden Sticker als echtes
// 3D-Objekt in Echtzeit. Bis three.js geladen ist, steht das vorgerenderte
// Standbild an derselben Stelle (LCP).

const POSTER = {
  src: '/medallion/front-1120.webp',
  srcSet: '/medallion/front-560.webp 560w, /medallion/front-1120.webp 1120w',
  sizes: '(min-width: 1024px) 40rem, 90vw',
  width: 1120,
  height: 1120,
  priority: true,
}

export function Hero() {
  const [first, second] = HERO.headline.split('\n')
  const lastSpace = second.lastIndexOf(' ')

  return (
    <section
      id="inhalt"
      data-tone="dark"
      className="relative isolate overflow-hidden bg-night pb-20 pt-32 text-paper md:pb-28 md:pt-40"
    >
      <HeroBackdrop />

      <Container grid className="relative items-center gap-y-6">
        <div className="col-span-4 md:col-span-7 lg:col-span-6">
          <Reveal>
            <a
              href="#warteliste"
              className="chip whitespace-nowrap bg-white/[0.04] text-[0.75rem] text-paper/80 ring-white/10 transition-colors hover:bg-white/[0.08] sm:text-note"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-terra-300 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-terra-300" />
              </span>
              {HERO_META.chip}
              <span className="text-paper/40">·</span>
              <span className="text-paper/55">{HERO_META.chipNote}</span>
            </a>
          </Reveal>

          <Reveal delay={60}>
            <h1 className="mt-7 text-display-xl">
              {first}
              <br />
              {second.slice(0, lastSpace + 1)}
              <span className="text-glow">{second.slice(lastSpace + 1)}</span>
            </h1>
          </Reveal>

          <Reveal delay={120}>
            <p className="mt-7 max-w-[34rem] text-lead text-paper/65">{HERO.lead}</p>
          </Reveal>

          <Reveal delay={180}>
            <WaitlistForm tone="dark" submitLabel={HERO.submit} className="mt-9 max-w-[34rem]" />
            <p className="text-note text-paper/40">{HERO.reassurance}</p>
          </Reveal>
        </div>

        <Reveal
          delay={200}
          className="col-span-4 -mx-6 md:col-span-5 md:mx-0 lg:col-span-6"
        >
          <StickerStage
            pose={HERO_POSE}
            poster={POSTER}
            posterAlt="Planum-Profil-Sticker, rund, Ø 40 mm, mit Pflanzenranke, NFC-Zeichen und Schriftzug PLANUM."
            posterClassName="inset-[12%] h-[76%] w-[76%] object-contain"
            className="aspect-square w-full md:scale-[1.12]"
          >
            <TapRings />
          </StickerStage>
          <p className="-mt-2 text-center text-note text-paper/35 md:mt-6">
            Echtzeit-Darstellung aus dem 3D-Modell<span className="hidden md:inline"> · Maus bewegen</span>
          </p>
        </Reveal>
      </Container>

      <Container className="relative mt-16 md:mt-20">
        <Reveal delay={240}>
          <dl className="grid grid-cols-3 divide-x divide-white/10 rounded-lg bg-white/[0.03] ring-1 ring-inset ring-white/[0.08] backdrop-blur-sm">
            {HERO_META.facts.map((fact) => (
              <div key={fact.label} className="px-4 py-5 sm:px-8">
                <dt className="text-note text-paper/45">{fact.label}</dt>
                <dd className="mt-1 font-display text-[clamp(1.1rem,2.4vw,1.75rem)] font-semibold tracking-[-0.03em]">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-note text-paper/35">* {SITE.priceNote}</p>
        </Reveal>
      </Container>
    </section>
  )
}

// Zwei Lichtkegel und ein Raster, das zum Rand hin ausblendet.
function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      <div className="bg-grid absolute inset-0 opacity-70" />
      <div
        className="absolute -right-[10%] -top-[20%] h-[120%] w-[75%]"
        style={{
          background:
            'radial-gradient(50% 50% at 50% 50%, rgba(201,123,82,0.30) 0%, rgba(201,123,82,0.08) 45%, rgba(201,123,82,0) 70%)',
        }}
      />
      <div
        className="absolute -left-[15%] bottom-[-30%] h-[80%] w-[60%]"
        style={{
          background:
            'radial-gradient(50% 50% at 50% 50%, rgba(159,220,180,0.13) 0%, rgba(159,220,180,0) 70%)',
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-night" />
    </div>
  )
}

// NFC-Andeutung: Ringe, die vom Medaillon ausgehen.
function TapRings() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute left-[46%] top-[46%] h-0 w-0">
      {[0, 0.8, 1.6].map((delay) => (
        <span
          key={delay}
          className="absolute -left-[9rem] -top-[9rem] h-[18rem] w-[18rem] animate-pulse-ring rounded-full border border-terra-300/30"
          style={{ animationDelay: `${delay}s` }}
        />
      ))}
    </div>
  )
}
