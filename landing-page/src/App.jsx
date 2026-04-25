import { useState, useEffect, useRef } from 'react'

/* ─── SVG Icons ─── */
const LeafIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 17 3.5s1 7.5-4.2 11.8" />
    <path d="M6.7 17.3c3-3 4.7-7.6 5.1-11.3" />
  </svg>
)

const QrIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="8" height="8" rx="1" />
    <rect x="14" y="2" width="8" height="8" rx="1" />
    <rect x="2" y="14" width="8" height="8" rx="1" />
    <rect x="14" y="14" width="4" height="4" rx="0.5" />
    <line x1="22" y1="14" x2="22" y2="14.01" />
    <line x1="22" y1="18" x2="22" y2="22" />
    <line x1="18" y1="22" x2="18" y2="22.01" />
  </svg>
)

const CameraIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
    <circle cx="12" cy="13" r="3" />
  </svg>
)

const SparklesIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
  </svg>
)

const DropletIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
  </svg>
)

const SunIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
)

const ShoppingBagIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
)

const ChevronDown = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

const CheckIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const MenuIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
  </svg>
)

const XIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

/* ─── Intersection Observer Hook ─── */
function useInView(options = {}) {
  const ref = useRef(null)
  const [isInView, setIsInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setIsInView(true); observer.unobserve(el) }
    }, { threshold: 0.15, ...options })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return [ref, isInView]
}

/* ─── Section Component with Fade In ─── */
function FadeSection({ children, className = '', delay = 0 }) {
  const [ref, isInView] = useInView()
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

/* ─── Plant Status Dot ─── */
function StatusDot({ status }) {
  const colors = {
    good: 'bg-emerald-400 shadow-emerald-400/50',
    needs: 'bg-amber-400 shadow-amber-400/50',
    urgent: 'bg-red-400 shadow-red-400/50',
  }
  return <span className={`inline-block w-3 h-3 rounded-full shadow-lg ${colors[status]} animate-pulse`} />
}

/* ─── Navbar ─── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-cream-50/90 backdrop-blur-lg shadow-sm' : 'bg-transparent'}`}>
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-moss-600 flex items-center justify-center group-hover:bg-moss-500 transition-colors">
            <LeafIcon className="w-5 h-5 text-white" />
          </div>
          <span className="font-display text-xl text-sage-900">Planum</span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-sage-600 hover:text-sage-900 transition-colors">Features</a>
          <a href="#how-it-works" className="text-sm text-sage-600 hover:text-sage-900 transition-colors">So funktioniert's</a>
          <a href="#pricing" className="text-sm text-sage-600 hover:text-sage-900 transition-colors">Pakete</a>
          <a href="#faq" className="text-sm text-sage-600 hover:text-sage-900 transition-colors">FAQ</a>
          <a href="https://app.planum.de" className="text-sm text-sage-600 hover:text-sage-900 transition-colors">Mein Bereich</a>
          <a href="#cta" className="btn-primary !py-2.5 !px-6 text-sm">Jetzt kaufen</a>
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2">
          {mobileOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-cream-50/95 backdrop-blur-lg border-t border-sage-100 px-6 py-6 space-y-4">
          <a href="#features" onClick={() => setMobileOpen(false)} className="block text-sage-700 font-medium">Features</a>
          <a href="#how-it-works" onClick={() => setMobileOpen(false)} className="block text-sage-700 font-medium">So funktioniert's</a>
          <a href="#pricing" onClick={() => setMobileOpen(false)} className="block text-sage-700 font-medium">Pakete</a>
          <a href="#faq" onClick={() => setMobileOpen(false)} className="block text-sage-700 font-medium">FAQ</a>
          <a href="https://app.planum.de" onClick={() => setMobileOpen(false)} className="block text-sage-700 font-medium">Mein Bereich</a>
          <a href="#cta" onClick={() => setMobileOpen(false)} className="btn-primary w-full text-center text-sm">Jetzt kaufen</a>
        </div>
      )}
    </nav>
  )
}

/* ─── Hero ─── */
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 right-10 w-72 h-72 bg-moss-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-earth-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sage-100/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-28 pb-20 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left – Copy */}
        <div>
          <div className="animate-fade-in-up">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-moss-100 text-moss-700 text-sm font-medium mb-8">
              <SparklesIcon className="w-4 h-4" />
              KI-gestützte Pflanzenpflege
            </span>
          </div>

          <h1 className="animate-fade-in-up font-display text-5xl md:text-6xl lg:text-7xl leading-[1.1] text-sage-900 mb-6">
            Jede Pflanze<br />
            <span className="text-moss-600">verdient einen</span><br />
            <span className="italic text-earth-600">Plan.</span>
          </h1>

          <p className="animate-fade-in-up-delayed text-lg md:text-xl text-sage-500 leading-relaxed mb-10 max-w-lg">
            QR-Code scannen, Pflanze fotografieren, KI erkennt sie – und sagt dir genau, wann du gießen, düngen und umtopfen sollst. Nie wieder vergessene Pflanzen.
          </p>

          <div className="animate-fade-in-up-delayed-2 flex flex-col sm:flex-row gap-4">
            <a href="#pricing" className="btn-primary">
              <ShoppingBagIcon className="w-5 h-5 mr-2" />
              Starter-Paket – 19,99€
            </a>
            <a href="#how-it-works" className="btn-secondary">
              So funktioniert's
              <ChevronDown className="w-4 h-4 ml-2" />
            </a>
          </div>

          <div className="mt-10 flex items-center gap-6 text-sm text-sage-400">
            <span className="flex items-center gap-1.5"><CheckIcon className="w-4 h-4 text-moss-500" /> Einmalkauf</span>
            <span className="flex items-center gap-1.5"><CheckIcon className="w-4 h-4 text-moss-500" /> Kein Abo</span>
            <span className="flex items-center gap-1.5"><CheckIcon className="w-4 h-4 text-moss-500" /> 20 Pflanzen</span>
          </div>
        </div>

        {/* Right – App Mockup */}
        <div className="relative hidden lg:block">
          <div className="animate-float relative">
            {/* Phone frame */}
            <div className="mx-auto w-[300px] bg-white rounded-[2.5rem] shadow-2xl shadow-sage-900/10 border border-sage-100 p-3">
              <div className="bg-sage-50 rounded-[2rem] overflow-hidden">
                {/* Status bar */}
                <div className="px-6 pt-4 pb-3 bg-moss-600">
                  <div className="flex items-center justify-between text-white/80 text-xs mb-3">
                    <span>9:41</span>
                    <div className="flex gap-1">
                      <div className="w-4 h-2 bg-white/60 rounded-sm" />
                      <div className="w-4 h-2 bg-white/80 rounded-sm" />
                    </div>
                  </div>
                  <p className="text-white/70 text-xs">Hallo, Felix</p>
                  <h3 className="text-white font-display text-lg">Deine Pflanzen</h3>
                </div>

                {/* Plant cards */}
                <div className="p-4 space-y-3">
                  {[
                    { name: 'Monstera Deliciosa', days: 'Gießen in 2 Tagen', status: 'good', emoji: '🪴' },
                    { name: 'Ficus Lyrata', days: 'Düngen überfällig!', status: 'urgent', emoji: '🌿' },
                    { name: 'Sansevieria', days: 'Gießen morgen', status: 'needs', emoji: '🌱' },
                    { name: 'Calathea Orbifolia', days: 'Alles optimal', status: 'good', emoji: '🍃' },
                  ].map((plant, i) => (
                    <div key={i} className="flex items-center gap-3 bg-white rounded-2xl p-3 shadow-sm border border-sage-50">
                      <span className="text-2xl">{plant.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-sage-800 truncate">{plant.name}</p>
                        <p className="text-xs text-sage-400">{plant.days}</p>
                      </div>
                      <StatusDot status={plant.status} />
                    </div>
                  ))}
                </div>

                {/* Bottom nav */}
                <div className="flex justify-around py-3 border-t border-sage-100 bg-white">
                  <div className="flex flex-col items-center gap-0.5">
                    <LeafIcon className="w-5 h-5 text-moss-600" />
                    <span className="text-[10px] text-moss-600 font-medium">Pflanzen</span>
                  </div>
                  <div className="flex flex-col items-center gap-0.5">
                    <QrIcon className="w-5 h-5 text-sage-300" />
                    <span className="text-[10px] text-sage-300">Scannen</span>
                  </div>
                  <div className="flex flex-col items-center gap-0.5">
                    <ShoppingBagIcon className="w-5 h-5 text-sage-300" />
                    <span className="text-[10px] text-sage-300">Shop</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating elements */}
          <div className="absolute -top-4 -left-8 animate-float-delayed">
            <div className="bg-white rounded-2xl shadow-lg shadow-sage-200/50 p-3 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                <DropletIcon className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-sage-800">Gegossen!</p>
                <p className="text-[10px] text-sage-400">Monstera • gerade eben</p>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-2 -right-4 animate-float">
            <div className="bg-white rounded-2xl shadow-lg shadow-sage-200/50 p-3 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                <SparklesIcon className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-sage-800">KI erkannt</p>
                <p className="text-[10px] text-sage-400">Calathea Orbifolia</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-6 h-6 text-sage-300" />
      </div>
    </section>
  )
}

/* ─── Trusted By ─── */
function SocialProof() {
  return (
    <FadeSection>
      <section className="py-12 border-y border-sage-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 text-center">
            <div>
              <p className="text-3xl font-display text-sage-800">20+</p>
              <p className="text-sm text-sage-400 mt-1">Pflanzenarten erkannt</p>
            </div>
            <div className="hidden md:block w-px h-10 bg-sage-200" />
            <div>
              <p className="text-3xl font-display text-sage-800">95%</p>
              <p className="text-sm text-sage-400 mt-1">KI-Erkennungsrate</p>
            </div>
            <div className="hidden md:block w-px h-10 bg-sage-200" />
            <div>
              <p className="text-3xl font-display text-sage-800">0€</p>
              <p className="text-sm text-sage-400 mt-1">monatliche Kosten</p>
            </div>
            <div className="hidden md:block w-px h-10 bg-sage-200" />
            <div>
              <p className="text-3xl font-display text-sage-800">20</p>
              <p className="text-sm text-sage-400 mt-1">QR-Codes pro Paket</p>
            </div>
          </div>
        </div>
      </section>
    </FadeSection>
  )
}

/* ─── Features ─── */
function Features() {
  const features = [
    {
      icon: <QrIcon className="w-6 h-6" />,
      title: 'QR-Code pro Pflanze',
      description: 'Klebe einen Sticker auf den Topf, scanne ihn – und deine Pflanze hat ihre eigene digitale Identität. So einfach wie ein Name-Tag.',
      color: 'bg-moss-100 text-moss-700',
    },
    {
      icon: <SparklesIcon className="w-6 h-6" />,
      title: 'KI-Pflanzenerkennung',
      description: 'Fotografiere deine Pflanze und unsere KI erkennt die Art in Sekunden. Automatisch werden optimale Pflegepläne erstellt.',
      color: 'bg-amber-100 text-amber-700',
    },
    {
      icon: <DropletIcon className="w-6 h-6" />,
      title: 'Intelligentes Ampelsystem',
      description: 'Grün, Gelb, Rot – auf einen Blick siehst du, welche Pflanze Aufmerksamkeit braucht. Gießen, Düngen, Umtopfen nie mehr vergessen.',
      color: 'bg-blue-100 text-blue-700',
    },
    {
      icon: <CameraIcon className="w-6 h-6" />,
      title: 'Wachstumsgalerie',
      description: 'Dokumentiere das Wachstum jeder Pflanze mit Fotos. Erstelle automatisch einen Zeitraffer deiner grünen Reise.',
      color: 'bg-earth-100 text-earth-700',
    },
    {
      icon: <SunIcon className="w-6 h-6" />,
      title: 'Personalisierte Pflegetipps',
      description: 'Basierend auf Pflanzenart, Standort und Jahreszeit berechnet die KI deinen individuellen Pflegeplan. Er lernt aus deinem Verhalten.',
      color: 'bg-sage-100 text-sage-700',
    },
    {
      icon: <ShoppingBagIcon className="w-6 h-6" />,
      title: 'Integrierter Pflegeshop',
      description: 'Die App empfiehlt dir den passenden Dünger, die richtige Erde und das ideale Zubehör – direkt bestellbar.',
      color: 'bg-rose-100 text-rose-700',
    },
  ]

  return (
    <section id="features" className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <FadeSection className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sage-100 text-sage-600 text-sm font-medium mb-4">
            Features
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-sage-900 mb-4">
            Alles, was deine<br />Pflanzen brauchen
          </h2>
          <p className="text-lg text-sage-400 max-w-xl mx-auto">
            Von der Erkennung bis zur Pflege – Planum begleitet dich und deine Pflanzen durch jede Jahreszeit.
          </p>
        </FadeSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <FadeSection key={i} delay={i * 100}>
              <div className="group bg-white rounded-3xl p-8 border border-sage-100 hover:border-sage-200 hover:shadow-xl hover:shadow-sage-100/50 transition-all duration-500 h-full">
                <div className={`w-12 h-12 rounded-2xl ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="font-display text-xl text-sage-900 mb-3">{feature.title}</h3>
                <p className="text-sage-500 leading-relaxed">{feature.description}</p>
              </div>
            </FadeSection>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── How It Works ─── */
function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Sticker aufkleben',
      description: 'Nimm einen QR-Code-Sticker aus deinem Paket und klebe ihn auf den Topf deiner Pflanze.',
      visual: '🏷️',
    },
    {
      num: '02',
      title: 'QR-Code scannen',
      description: 'Öffne deine Kamera-App und scanne den QR-Code. Du wirst automatisch zur Planum-App weitergeleitet.',
      visual: '📱',
    },
    {
      num: '03',
      title: 'Pflanze fotografieren',
      description: 'Mach ein Foto deiner Pflanze. Die KI erkennt die Art und erstellt automatisch einen Pflegeplan.',
      visual: '📸',
    },
    {
      num: '04',
      title: 'Pflegen & Tracken',
      description: 'Logge dein Gießen, Düngen und Umtopfen. Das Ampelsystem zeigt dir immer, was als Nächstes dran ist.',
      visual: '🌱',
    },
  ]

  return (
    <section id="how-it-works" className="py-24 md:py-32 bg-sage-50/50">
      <div className="max-w-6xl mx-auto px-6">
        <FadeSection className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-moss-100 text-moss-600 text-sm font-medium mb-4">
            In 4 Schritten
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-sage-900 mb-4">
            So einfach geht's
          </h2>
          <p className="text-lg text-sage-400 max-w-xl mx-auto">
            Von der Verpackung zur gepflegten Pflanze in unter 2 Minuten.
          </p>
        </FadeSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <FadeSection key={i} delay={i * 150}>
              <div className="relative text-center">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-14 left-[60%] w-[80%] h-px bg-sage-200 z-0" />
                )}

                <div className="relative z-10">
                  <div className="w-28 h-28 mx-auto rounded-3xl bg-white shadow-lg shadow-sage-200/30 border border-sage-100 flex items-center justify-center text-5xl mb-6 hover:scale-105 transition-transform duration-300">
                    {step.visual}
                  </div>
                  <span className="inline-block text-xs font-bold text-moss-600 bg-moss-100 px-3 py-1 rounded-full mb-3">
                    Schritt {step.num}
                  </span>
                  <h3 className="font-display text-xl text-sage-900 mb-2">{step.title}</h3>
                  <p className="text-sage-500 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            </FadeSection>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Ampelsystem Demo ─── */
function AmpelDemo() {
  const statuses = [
    {
      color: 'bg-emerald-500',
      ring: 'ring-emerald-200',
      label: 'Gut',
      description: 'Alles im grünen Bereich. Nächste Aktion noch nicht fällig.',
      icon: '🟢',
    },
    {
      color: 'bg-amber-400',
      ring: 'ring-amber-200',
      label: 'Bedarf',
      description: 'In 1-2 Tagen steht eine Pflege-Aktion an. Schon mal vorbereiten!',
      icon: '🟡',
    },
    {
      color: 'bg-red-500',
      ring: 'ring-red-200',
      label: 'Hoher Bedarf',
      description: 'Aktion ist überfällig! Deine Pflanze braucht sofortige Aufmerksamkeit.',
      icon: '🔴',
    },
  ]

  return (
    <section className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <FadeSection>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-earth-100 text-earth-600 text-sm font-medium mb-4">
              Ampelsystem
            </span>
            <h2 className="font-display text-4xl md:text-5xl text-sage-900 mb-6">
              Auf einen Blick<br />
              <span className="text-moss-600">alles im Griff</span>
            </h2>
            <p className="text-lg text-sage-500 leading-relaxed mb-10">
              Das Ampelsystem zeigt dir sofort, welche deiner Pflanzen Aufmerksamkeit braucht. Nie wieder raten – die KI berechnet den optimalen Zeitpunkt für jede Aktion.
            </p>

            <div className="space-y-6">
              {statuses.map((s, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl ${s.color} ring-4 ${s.ring} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mt-0.5`}>
                    {s.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sage-800">{s.label}</h4>
                    <p className="text-sage-500 text-sm">{s.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </FadeSection>

          <FadeSection delay={200}>
            <div className="bg-white rounded-3xl shadow-xl shadow-sage-200/30 border border-sage-100 p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-lg text-sage-800">Dashboard</h3>
                <span className="text-xs text-sage-400">April 2026</span>
              </div>
              <div className="space-y-4">
                {[
                  { name: 'Monstera', action: 'Gießen in 3 Tagen', status: 'good', bar: 85 },
                  { name: 'Ficus Lyrata', action: 'Düngen morgen', status: 'needs', bar: 35 },
                  { name: 'Calathea', action: 'Umtopfen überfällig', status: 'urgent', bar: 8 },
                  { name: 'Sansevieria', action: 'Alles bestens', status: 'good', bar: 92 },
                  { name: 'Philodendron', action: 'Gießen in 1 Tag', status: 'needs', bar: 28 },
                ].map((plant, i) => (
                  <div key={i} className="group">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <StatusDot status={plant.status} />
                        <span className="font-medium text-sm text-sage-800">{plant.name}</span>
                      </div>
                      <span className="text-xs text-sage-400">{plant.action}</span>
                    </div>
                    <div className="h-2 bg-sage-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${
                          plant.status === 'good' ? 'bg-emerald-400' :
                          plant.status === 'needs' ? 'bg-amber-400' : 'bg-red-400'
                        }`}
                        style={{ width: `${plant.bar}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeSection>
        </div>
      </div>
    </section>
  )
}

/* ─── Pricing ─── */
function Pricing() {
  const packages = [
    {
      name: 'Starter',
      price: '19,99',
      slots: '20 QR-Codes',
      description: 'Perfekt für den Einstieg',
      features: [
        '20 Premium QR-Code Sticker',
        'KI-Pflanzenerkennung',
        'Ampelsystem & Pflegepläne',
        'Wachstumsgalerie',
        'Pflegeshop-Zugang',
      ],
      highlight: true,
      badge: 'Beliebteste Wahl',
    },
    {
      name: 'Erweiterung',
      price: '9,99',
      slots: '10 QR-Codes',
      description: 'Für wachsende Sammlungen',
      features: [
        '10 Premium QR-Code Sticker',
        'Alle Starter-Features',
        'Sofort einsatzbereit',
        'Gleiche App, mehr Pflanzen',
      ],
      highlight: false,
    },
    {
      name: 'Family',
      price: '39,99',
      slots: '50 QR-Codes',
      description: 'Für Pflanzenliebhaber',
      features: [
        '50 Premium QR-Code Sticker',
        'Alle Starter-Features',
        'Ideal für große Sammlungen',
        'Teilen mit der Familie',
        'Bester Preis pro Sticker',
      ],
      highlight: false,
      badge: 'Bester Wert',
    },
  ]

  return (
    <section id="pricing" className="py-24 md:py-32 bg-sage-50/50">
      <div className="max-w-6xl mx-auto px-6">
        <FadeSection className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-earth-100 text-earth-600 text-sm font-medium mb-4">
            Einmalkauf – kein Abo
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-sage-900 mb-4">
            Wähle dein Paket
          </h2>
          <p className="text-lg text-sage-400 max-w-xl mx-auto">
            Einmal kaufen, für immer nutzen. Keine versteckten Kosten, keine monatlichen Gebühren.
          </p>
        </FadeSection>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {packages.map((pkg, i) => (
            <FadeSection key={i} delay={i * 150}>
              <div className={`relative rounded-3xl p-8 h-full flex flex-col ${
                pkg.highlight
                  ? 'bg-moss-600 text-white shadow-2xl shadow-moss-600/20 scale-[1.02]'
                  : 'bg-white border border-sage-100 shadow-lg shadow-sage-100/30'
              }`}>
                {pkg.badge && (
                  <span className={`absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-4 py-1 rounded-full ${
                    pkg.highlight ? 'bg-amber-400 text-amber-900' : 'bg-earth-200 text-earth-700'
                  }`}>
                    {pkg.badge}
                  </span>
                )}

                <div className="mb-6">
                  <h3 className={`font-display text-xl mb-1 ${pkg.highlight ? 'text-white' : 'text-sage-900'}`}>
                    {pkg.name}
                  </h3>
                  <p className={`text-sm ${pkg.highlight ? 'text-moss-200' : 'text-sage-400'}`}>
                    {pkg.description}
                  </p>
                </div>

                <div className="mb-6">
                  <span className={`text-4xl font-display ${pkg.highlight ? 'text-white' : 'text-sage-900'}`}>
                    {pkg.price}€
                  </span>
                  <span className={`text-sm ml-1 ${pkg.highlight ? 'text-moss-200' : 'text-sage-400'}`}>
                    einmalig
                  </span>
                  <p className={`text-xs mt-1 ${pkg.highlight ? 'text-moss-200' : 'text-sage-400'}`}>
                    {pkg.slots}
                  </p>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {pkg.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-sm">
                      <CheckIcon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${pkg.highlight ? 'text-moss-200' : 'text-moss-500'}`} />
                      <span className={pkg.highlight ? 'text-moss-50' : 'text-sage-600'}>{f}</span>
                    </li>
                  ))}
                </ul>

                <a href="#cta" className={`w-full text-center py-3.5 rounded-full font-semibold transition-all duration-300 ${
                  pkg.highlight
                    ? 'bg-white text-moss-700 hover:bg-moss-50 hover:shadow-lg'
                    : 'bg-sage-100 text-sage-700 hover:bg-sage-200'
                }`}>
                  Auf Amazon kaufen
                </a>
              </div>
            </FadeSection>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── FAQ ─── */
function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      q: 'Brauche ich ein Abo für die App?',
      a: 'Nein! Planum funktioniert mit einem Einmalkauf. Du kaufst das QR-Code-Paket und hast dauerhaften Zugang zu allen Funktionen der App – ohne monatliche Kosten.',
    },
    {
      q: 'Wie genau ist die KI-Pflanzenerkennung?',
      a: 'Unsere KI erkennt über 10.000 Pflanzenarten mit einer Genauigkeit von über 95%. Bei gängigen Zimmerpflanzen wie Monstera, Ficus oder Calathea liegt die Erkennungsrate sogar bei 99%.',
    },
    {
      q: 'Was passiert, wenn meine 20 QR-Codes aufgebraucht sind?',
      a: 'Du kannst jederzeit ein Erweiterungspaket mit 10 zusätzlichen QR-Codes für 9,99€ nachkaufen. Oder greife direkt zum Family-Paket mit 50 Codes.',
    },
    {
      q: 'Funktioniert Planum auch im Garten / Outdoor?',
      a: 'Ja! Die QR-Code-Sticker sind wetterfest und UV-beständig. Die App berücksichtigt Standort und Wetterdaten für Outdoor-Pflanzen automatisch.',
    },
    {
      q: 'Ist die App auch offline nutzbar?',
      a: 'Die Grundfunktionen wie Pflege-Logging und das Ampelsystem funktionieren offline. Für die KI-Erkennung und Shop-Funktionen wird eine Internetverbindung benötigt.',
    },
    {
      q: 'Kann ich Planum mit meiner Familie teilen?',
      a: 'Absolut! Ein Account kann von mehreren Geräten genutzt werden. Perfekt für Familien oder WGs, die gemeinsam ihre Pflanzen pflegen.',
    },
  ]

  return (
    <section id="faq" className="py-24 md:py-32">
      <div className="max-w-3xl mx-auto px-6">
        <FadeSection className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sage-100 text-sage-600 text-sm font-medium mb-4">
            Häufige Fragen
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-sage-900 mb-4">
            Noch Fragen?
          </h2>
        </FadeSection>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <FadeSection key={i} delay={i * 80}>
              <div className="bg-white rounded-2xl border border-sage-100 overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-sage-50/50 transition-colors"
                >
                  <span className="font-medium text-sage-800 pr-4">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-sage-400 flex-shrink-0 transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openIndex === i ? 'max-h-40' : 'max-h-0'}`}>
                  <p className="px-6 pb-5 text-sage-500 leading-relaxed">{faq.a}</p>
                </div>
              </div>
            </FadeSection>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── CTA ─── */
function CTA() {
  return (
    <section id="cta" className="py-24 md:py-32 bg-moss-600 relative overflow-hidden">
      {/* Decorative blurs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-moss-500/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-moss-700/40 rounded-full blur-3xl" />

      <FadeSection className="relative max-w-3xl mx-auto px-6 text-center">
        <h2 className="font-display text-4xl md:text-5xl text-white mb-6">
          Bereit, deinen Pflanzen<br />
          <span className="italic text-moss-200">den besten Plan</span> zu geben?
        </h2>
        <p className="text-lg text-moss-200 mb-10 max-w-lg mx-auto">
          Starte heute mit 20 QR-Code Stickern und der smartesten Pflanzenpflege-App. Einmalkauf, keine versteckten Kosten.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://amazon.de"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-10 py-4 bg-white text-moss-700 font-semibold rounded-full hover:bg-cream-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
          >
            <ShoppingBagIcon className="w-5 h-5 mr-2" />
            Auf Amazon kaufen – 19,99€
          </a>
        </div>
        <p className="text-moss-300 text-sm mt-6">
          Kostenloser Versand mit Amazon Prime
        </p>
      </FadeSection>
    </section>
  )
}

/* ─── Footer ─── */
function Footer() {
  return (
    <footer className="bg-sage-900 text-sage-300 py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-moss-600 flex items-center justify-center">
                <LeafIcon className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-xl text-white">Planum</span>
            </div>
            <p className="text-sage-400 leading-relaxed max-w-sm">
              Intelligentes Pflanzen-Tracking mit QR-Codes und KI. Weil jede Pflanze einen Plan verdient.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Produkt</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pakete & Preise</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Rechtliches</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Impressum</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Datenschutz</a></li>
              <li><a href="#" className="hover:text-white transition-colors">AGB</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-sage-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-sage-500">
            &copy; {new Date().getFullYear()} Planum. Alle Rechte vorbehalten.
          </p>
          <p className="text-xs text-sage-600">
            Made with care for plants and their people.
          </p>
        </div>
      </div>
    </footer>
  )
}

/* ─── App ─── */
export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <SocialProof />
      <Features />
      <HowItWorks />
      <AmpelDemo />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  )
}
