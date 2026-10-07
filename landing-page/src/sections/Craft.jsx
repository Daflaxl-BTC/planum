import { CRAFT } from '../content/steps'
import { Container } from '../components/layout/Container'
import { Section } from '../components/layout/Section'
import { Eyebrow } from '../components/ui/Eyebrow'
import { Reveal } from '../components/ui/Reveal'
import { StickerStage } from '../components/media/StickerStage'
import { MACRO_POSE } from '../three/poses'

// Material und Masse. Links die Nahaufnahme des Reliefs — dasselbe 3D-Modell
// wie im Hero, nah herangefahren. Als Darstellung ausgewiesen: das gedruckte
// Teil ist eine Folie, keine Tonscheibe (claims-guard.md, Bilder unterliegen
// § 5 UWG genauso wie Text).

const POSTER = {
  src: '/medallion/detail-1536.webp',
  srcSet: '/medallion/detail-768.webp 768w, /medallion/detail-1536.webp 1536w',
  sizes: '(min-width: 768px) 50vw, 92vw',
  width: 1536,
  height: 1152,
}

export function Craft() {
  return (
    <Section id="sticker" space="lg" tone="dark" className="overflow-hidden">
      <Container grid className="items-center gap-y-14">
        <div className="col-span-4 md:col-span-6">
          <Reveal>
            <div className="card-dark relative overflow-hidden">
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  background:
                    'radial-gradient(60% 60% at 50% 45%, rgba(201,123,82,0.22) 0%, rgba(201,123,82,0) 70%)',
                }}
              />
              <StickerStage
                pose={MACRO_POSE}
                poster={POSTER}
                // Auf dem Handy reicht das Standbild: es ist dieselbe Ansicht,
                // und ein dritter WebGL-Kontext waere dort reiner Speicherdruck.
                live="desktop"
                posterAlt="Makroansicht des Motivs: Pflanzenranke, NFC-Zeichen und Schriftzug PLANUM in Terracotta-Tönen."
                posterClassName="inset-0 h-full w-full object-cover"
                className="aspect-[4/3.4] w-full"
              />
              <p className="absolute bottom-4 left-5 text-note text-paper/40">
                Darstellung aus dem 3D-Modell · Motiv in Originalanordnung
              </p>
            </div>
          </Reveal>
        </div>

        <div className="col-span-4 md:col-span-5 md:col-start-8">
          <Reveal>
            <Eyebrow tone="dark">{CRAFT.eyebrow}</Eyebrow>
            <h2 className="mt-6 text-h2">{CRAFT.headline}</h2>
            <p className="mt-6 text-body text-paper/60">{CRAFT.lead}</p>
          </Reveal>

          <dl className="mt-10 divide-y divide-white/[0.08] border-y border-white/[0.08]">
            {CRAFT.specs.map((spec, index) => (
              <Reveal
                key={spec.label}
                delay={index * 45}
                className="grid grid-cols-[1fr,auto] items-baseline gap-x-6 gap-y-0.5 py-4"
              >
                <dt className="text-small text-paper/55">{spec.label}</dt>
                <dd className="text-right text-small font-semibold tabular-nums">{spec.value}</dd>
                <p className="col-span-2 text-note text-paper/35">{spec.note}</p>
              </Reveal>
            ))}
          </dl>

          <Reveal delay={120}>
            <div className="mt-8 flex items-start gap-5">
              <div className="flex shrink-0 items-end gap-3">
                <img
                  src="/stickers/d2-terracotta-relief-profil.svg"
                  alt=""
                  width="56"
                  height="56"
                  loading="lazy"
                  decoding="async"
                  className="h-14 w-14"
                />
                <img
                  src="/stickers/d2-terracotta-relief-giessen.svg"
                  alt=""
                  width="46"
                  height="56"
                  loading="lazy"
                  decoding="async"
                  className="h-14 w-auto"
                />
              </div>
              <div>
                <h3 className="text-small font-semibold">{CRAFT.design.title}</h3>
                <p className="mt-1 text-note text-paper/50">{CRAFT.design.body}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  )
}
