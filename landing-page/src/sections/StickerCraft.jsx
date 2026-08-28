import { CRAFT } from '../content/steps'
import { Container } from '../components/layout/Container'
import { Section } from '../components/layout/Section'
import { Eyebrow } from '../components/ui/Eyebrow'
import { Reveal } from '../components/ui/Reveal'

// Hier entsteht die Premium-Wahrnehmung: konkrete Masse, Materialangaben,
// echte Vektoren. Konkretheit ist der wirksamste Unterschied zu einer Seite,
// die ueber "innovative Technologie" spricht und nichts zeigt.
export function StickerCraft() {
  return (
    <Section id="sticker" space="lg">
      <Container grid className="gap-y-16">
        <div className="col-span-4 md:col-span-5 md:col-start-1">
          <Reveal>
            <Eyebrow>{CRAFT.eyebrow}</Eyebrow>
            <h2 className="mt-6 text-h2">{CRAFT.headline}</h2>
            <p className="mt-6 max-w-measure text-body text-ink/70">{CRAFT.lead}</p>
          </Reveal>

          <Reveal delay={120}>
            <div className="mt-10 border-t border-ink/10 pt-8">
              <h3 className="font-display text-h3">{CRAFT.design.title}</h3>
              <p className="mt-3 max-w-measure text-body text-ink/70">
                {CRAFT.design.body}
              </p>
            </div>
          </Reveal>

          {/* Die Druckvektoren in Originalproportion — sie zeigen beide
              Stanzformen, die das Foto daneben nicht gleichzeitig zeigen kann. */}
          <Reveal delay={180}>
            <figure className="mt-10">
              <div className="flex items-end gap-10">
                <img
                  src="/stickers/d2-terracotta-relief-profil.svg"
                  alt="Profil-Sticker in Terracotta-Relief, rund, mit botanischer Blattzeichnung"
                  width="160"
                  height="160"
                  loading="lazy"
                  decoding="async"
                  className="w-[40%] max-w-[160px]"
                />
                <img
                  src="/stickers/d2-terracotta-relief-giessen.svg"
                  alt="Gieß-Sticker in Terracotta-Relief, Tropfenform"
                  width="128"
                  height="160"
                  loading="lazy"
                  decoding="async"
                  className="w-[30%] max-w-[128px]"
                />
              </div>
              <figcaption className="mt-5 max-w-measure text-note text-ink/50">
                Zwei Stanzformen: rund fürs Pflanzenprofil, Tropfen fürs Gießen.
                Abgebildet sind die Druckvektoren in Originalproportion.
              </figcaption>
            </figure>
          </Reveal>
        </div>

        <div className="col-span-4 md:col-span-6 md:col-start-7">
          {/* Makroansicht aus demselben 3D-Modell wie im Hero, offline
              gerendert (scripts/render-medallion.mjs). Sie zeigt die Zeichnung
              gross genug, um sie lesen zu koennen — und ist als Darstellung
              ausgewiesen: das gedruckte Teil ist eine Folie, keine Tonscheibe.
              Ein Foto des fertigen Stickers gibt es erst nach der ersten
              Charge. */}
          <Reveal>
            <figure>
              <img
                src="/medallion/detail-1536.webp"
                srcSet="/medallion/detail-768.webp 768w, /medallion/detail-1536.webp 1536w"
                sizes="(min-width: 768px) 46vw, 92vw"
                width="1536"
                height="1152"
                alt="Makroansicht des Motivs: Pflanzenranke, NFC-Wellen und Schriftzug PLANUM in Terracotta-Tönen."
                loading="lazy"
                decoding="async"
                className="block w-full"
              />
              <figcaption className="mt-4 max-w-measure text-note text-ink/50">
                Darstellung aus dem 3D-Modell des Motivs. Ranke, Wellen und
                Schriftzug in Originalanordnung — Fotos des gedruckten Stickers
                folgen mit der ersten Charge.
              </figcaption>
            </figure>
          </Reveal>

          <dl className="mt-12">
            {CRAFT.specs.map((spec, index) => (
              <Reveal
                key={spec.label}
                delay={index * 45}
                className="grid grid-cols-[1fr,auto] items-baseline gap-x-6 gap-y-1 border-t border-ink/10 py-5"
              >
                <dt className="text-small text-ink/70">{spec.label}</dt>
                {/* tnum aus den Font-Features haelt die Masse in einer Flucht. */}
                <dd className="text-right font-display text-[1.15rem] tabular-nums">
                  {spec.value}
                </dd>
                <p className="col-span-2 text-note text-ink/50">{spec.note}</p>
              </Reveal>
            ))}
          </dl>
        </div>
      </Container>
    </Section>
  )
}
