import { Suspense, lazy, useEffect, useState } from 'react'
import Hero from './components/Hero'

const WorkSamples = lazy(() => import('./components/WorkSamples'))
const ContactForm = lazy(() => import('./components/ContactForm'))

const App = () => {
  const [pointer, setPointer] = useState({ x: 0, y: 0 })
  const [lightsOff, setLightsOff] = useState(false)
  const [showScrollToTop, setShowScrollToTop] = useState(false)
  const [reduceEffects, setReduceEffects] = useState(false)
  const [showBazaarPoster, setShowBazaarPoster] = useState(false)

  useEffect(() => {
    const { body } = document
    if (!body) return undefined
    body.classList.toggle('lights-off', lightsOff)
    return () => {
      body.classList.remove('lights-off')
    }
  }, [lightsOff])

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 200)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    if (!showBazaarPoster) return undefined
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setShowBazaarPoster(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [showBazaarPoster])

  useEffect(() => {
    if (!showBazaarPoster) return undefined
    if (typeof document === 'undefined') return undefined
    const { body } = document
    const currentLocks = Number(body.dataset.modalLocks || '0')
    if (currentLocks === 0) {
      body.dataset.prevOverflow = body.style.overflow || ''
      body.style.overflow = 'hidden'
    }
    body.dataset.modalLocks = String(currentLocks + 1)
    body.classList.add('modal-open')
    return () => {
      const locks = Number(body.dataset.modalLocks || '1')
      const next = Math.max(0, locks - 1)
      body.dataset.modalLocks = String(next)
      if (next === 0) {
        body.style.overflow = body.dataset.prevOverflow || ''
        delete body.dataset.prevOverflow
        body.classList.remove('modal-open')
      }
    }
  }, [showBazaarPoster])

  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const connection =
      navigator.connection || navigator.mozConnection || navigator.webkitConnection || null

    const evaluateDeviceCapabilities = () => {
      const prefersReducedMotion = motionQuery.matches
      const hardwareCount =
        typeof navigator.hardwareConcurrency === 'number' ? navigator.hardwareConcurrency : undefined
      const memorySize =
        typeof navigator.deviceMemory === 'number' ? navigator.deviceMemory : undefined
      const effectiveType = connection?.effectiveType
      const saveData = Boolean(connection?.saveData)

      const slowConnection =
        saveData || (typeof effectiveType === 'string' && ['slow-2g', '2g', '3g'].includes(effectiveType))
      const lowCores = typeof hardwareCount === 'number' && hardwareCount <= 2
      const lowMemory = typeof memorySize === 'number' && memorySize <= 2

      setReduceEffects(prefersReducedMotion || slowConnection || lowCores || lowMemory)
    }

    evaluateDeviceCapabilities()
    const motionListener = () => evaluateDeviceCapabilities()
    if (motionQuery.addEventListener) {
      motionQuery.addEventListener('change', motionListener)
    } else {
      motionQuery.addListener(motionListener)
    }

    const connectionListener = connection ? () => evaluateDeviceCapabilities() : null
    if (connection && connectionListener) {
      if (typeof connection.addEventListener === 'function') {
        connection.addEventListener('change', connectionListener)
      } else if ('onchange' in connection) {
        connection.onchange = connectionListener
      }
    }

    return () => {
      if (motionQuery.removeEventListener) {
        motionQuery.removeEventListener('change', motionListener)
      } else {
        motionQuery.removeListener(motionListener)
      }
      if (connection && connectionListener) {
        if (typeof connection.removeEventListener === 'function') {
          connection.removeEventListener('change', connectionListener)
        } else if ('onchange' in connection) {
          connection.onchange = null
        }
      }
    }
  }, [])

  const updatePointer = (clientX, clientY) => {
    const x = (clientX / window.innerWidth) * 2 - 1
    const y = (clientY / window.innerHeight) * 2 - 1
    setPointer({ x, y })
  }

  const handlePointerMove = (event) => {
    updatePointer(event.clientX, event.clientY)
  }

  const handleTouchMove = (event) => {
    const touch = event.touches[0] || event.changedTouches[0]
    if (!touch) return
    updatePointer(touch.clientX, touch.clientY)
  }

  const resetPointer = () => setPointer({ x: 0, y: 0 })
  const toggleLights = () => setLightsOff((prev) => !prev)
  const lightToggleStyles = lightsOff
    ? 'border-white/60 bg-white/10 text-white hover:bg-white/20'
    : 'border-[#1f1b1f] text-[#1f1b1f] hover:bg-[#1f1b1f] hover:text-white'
  const mobileHandleStyles = lightsOff
    ? 'border-white/50 bg-white/10 text-white/80 backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.25)]'
    : 'border-[#1f1b1f]/20 bg-white/40 text-[#1f1b1f] backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.15)]'
  const scrollToTopButtonStyles = lightsOff
    ? 'border-white/40 bg-white/10 text-white backdrop-blur-lg shadow-[0_8px_30px_rgba(0,0,0,0.35)] hover:bg-white/20'
    : 'border-[#1f1b1f]/15 bg-[#fdfcfc]/40 text-[#1f1b1f] backdrop-blur-lg shadow-[0_12px_40px_rgba(31,27,31,0.2)] hover:bg-[#fdfcfc]/60'
  const scrollToTopButtonVisibility = showScrollToTop
    ? 'opacity-100 pointer-events-auto translate-y-0'
    : 'opacity-0 pointer-events-none translate-y-4'
  const bannerGlassClass = lightsOff
    ? 'glass-panel-dark text-white'
    : 'glass-panel-light text-[#1f1b1f]'

  const scrollToTop = () => {
    if (typeof window === 'undefined') return
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const renderSectionFallback = (heightClass) => (
    <section className="px-4 py-16" aria-hidden>
      <div
        className={`mx-auto max-w-5xl rounded-[32px] ${heightClass} animate-pulse ${
          lightsOff ? 'bg-white/10' : 'bg-[#1f1b1f]/10'
        }`}
      />
    </section>
  )

  return (
    <div
      className={`min-h-screen pt-24 sm:pt-20 ${lightsOff ? 'bg-[#1b1a20] text-white transition-colors' : 'bg-[#fdfcfc] text-[#1f1b1f]'} `}
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerMove}
      onPointerLeave={resetPointer}
      onPointerUp={resetPointer}
      onTouchStart={handleTouchMove}
      onTouchMove={handleTouchMove}
      onTouchEnd={resetPointer}
      onTouchCancel={resetPointer}
    >
      <div className="fixed right-4 top-24 z-50 hidden justify-end px-6 sm:flex sm:right-6">
        <button
          type="button"
          onClick={toggleLights}
          aria-pressed={lightsOff}
          className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition ${lightToggleStyles}`}
        >
          {lightsOff ? 'Lights On' : 'Lights Off'}
        </button>
      </div>
      <div className="fixed right-0 top-24 z-50 flex items-center justify-end sm:hidden">
        <button
          type="button"
          aria-label={`Toggle lights (${lightsOff ? 'turn on' : 'turn off'})`}
          onClick={toggleLights}
          aria-pressed={lightsOff}
          className={`rounded-l-full border border-r-0 px-1 py-3 text-[10px] font-semibold uppercase tracking-[0.4em] transition ${mobileHandleStyles}`}
          style={{ writingMode: 'vertical-rl' }}
        >
          {lightsOff ? 'Lights On' : 'Lights Off'}
        </button>
      </div>
      <button
        type="button"
        className={`site-top-banner fixed left-0 right-0 top-0 z-[60] w-full overflow-hidden text-xs uppercase tracking-[0.3em] ${bannerGlassClass}`}
        role="region"
        aria-label="Holiday event announcement"
        onClick={() => setShowBazaarPoster(true)}
        aria-pressed={showBazaarPoster}
      >
        <div className="banner-marquee whitespace-nowrap">
          OGC &amp; Friends Holiday Bazaar Thursday, December 11th 1PM - 4PM &nbsp; SebCo 3rd floor - Knuckle Hub &nbsp; • &nbsp;
          OGC &amp; Friends Holiday Bazaar Thursday, December 11th 1PM - 4PM &nbsp; SebCo 3rd floor - Knuckle Hub &nbsp; • &nbsp;
        </div>
      </button>
      <Hero pointer={pointer} isDark={lightsOff} reduceEffects={reduceEffects} />
      <Suspense fallback={renderSectionFallback('h-[360px]')}>
        <WorkSamples isDark={lightsOff} reduceEffects={reduceEffects} />
      </Suspense>
      <Suspense fallback={renderSectionFallback('h-[520px]')}>
        <ContactForm isDark={lightsOff} reduceEffects={reduceEffects} />
      </Suspense>
      <div
        className={`hidden flex-col items-center gap-4 px-6 text-base sm:mt-12 sm:flex ${
          lightsOff ? 'text-white' : 'text-[#c6a7d9]'
        }`}
      >
        <div className="flex items-center justify-center gap-8">
          <a
            href="https://www.instagram.com/wavythought/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center transition hover:text-[#ff7bd5]"
            aria-label="Open Instagram"
          >
            <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <rect x="2.5" y="2.5" width="19" height="19" rx="6" ry="6" />
              <circle cx="12" cy="12" r="4.8" />
              <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
            </svg>
          </a>
          <a
            href="mailto:hello@wavythought.com"
            className="inline-flex items-center justify-center transition hover:text-[#ff7bd5]"
            aria-label="Send an email"
          >
            <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <rect x="2.8" y="4.2" width="18.4" height="15.6" rx="3" />
              <path d="M3 5.5l8.2 5.8c0.9 0.65 2.3 0.65 3.2 0L22 5.5" />
            </svg>
          </a>
        </div>
      </div>
      <footer className={`px-6 pb-16 pt-12 text-xs ${lightsOff ? 'text-white/70' : 'text-[#3c3c3c]'}`}>
        <div className="mx-auto flex max-w-5xl flex-col gap-8 text-center uppercase tracking-[0.35em] sm:flex-row sm:items-start sm:justify-between sm:text-left sm:gap-4">
          <div
            className={`flex items-center justify-center gap-5 tracking-normal sm:hidden ${
              lightsOff ? 'text-white' : 'text-[#c6a7d9]'
            }`}
          >
            <a
              href="https://www.instagram.com/wavythought/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center transition hover:text-[#ff7bd5]"
              aria-label="Open Instagram"
            >
              <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <rect x="2.5" y="2.5" width="19" height="19" rx="6" ry="6" />
                <circle cx="12" cy="12" r="4.8" />
                <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a
              href="mailto:hello@wavythought.com"
              className="inline-flex items-center justify-center transition hover:text-[#ff7bd5]"
              aria-label="Send an email"
            >
              <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <rect x="2.8" y="4.2" width="18.4" height="15.6" rx="3" />
                <path d="M3 5.5l8.2 5.8c0.9 0.65 2.3 0.65 3.2 0L22 5.5" />
              </svg>
            </a>
          </div>
          <p className="sm:mt-0">&copy; 2025 WAVYTHOUGHT LLC. ALL RIGHTS RESERVED.</p>
          <div className={`text-center ${lightsOff ? 'text-white' : 'text-[#1f1b1f]'} sm:text-right`}>
            <p>Stop by and give us a wave</p>
            <p className={`mt-2 ${lightsOff ? 'text-white/80' : 'text-[#3c3c3c]'}`}>
              <a
                href="https://www.instagram.com/wavythought/"
                target="_blank"
                rel="noreferrer"
                className="underline decoration-dotted underline-offset-4 transition hover:text-[#ff7bd5]"
              >
                Instagram
              </a>{' '}
              |{' '}
              <a
                href="mailto:hello@wavythought.com"
                className="underline decoration-dotted underline-offset-4 transition hover:text-[#ff7bd5]"
              >
                Hello@wavythought.com
              </a>
            </p>
          </div>
        </div>
      </footer>
      {showBazaarPoster && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 px-4 backdrop-blur"
          role="dialog"
          aria-modal="true"
          aria-label="OGC & Friends Holiday Bazaar poster"
          onClick={() => setShowBazaarPoster(false)}
        >
          <div
            className="relative w-full max-w-4xl overflow-hidden rounded-[48px] border border-white/30 bg-white/10 backdrop-blur-2xl p-5 shadow-[0_40px_160px_rgba(0,0,0,0.6)] sm:max-w-5xl lg:max-w-6xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowBazaarPoster(false)}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-black/35 text-xl font-light text-white transition hover:bg-black/60"
              aria-label="Close poster"
            >
              ×
            </button>
            <div className="rounded-[36px] border border-white/50 bg-gradient-to-b from-white/60 via-white/40 to-white/25 p-3 shadow-[0_25px_80px_rgba(0,0,0,0.25)]">
              <img
                src="/HolidayBazaar_SaveTheDate_Updated.jpeg"
                alt="OGC & Friends Holiday Bazaar save the date"
                className="h-full w-full rounded-[28px] object-contain"
              />
            </div>
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className={`fixed bottom-6 right-6 z-40 rounded-full border p-3 shadow-lg transition-all duration-200 ${scrollToTopButtonStyles} ${scrollToTopButtonVisibility}`}
      >
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 19V5" />
          <path d="M5 12l7-7 7 7" />
        </svg>
      </button>
    </div>
  )
}

export default App
