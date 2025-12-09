import { Suspense, lazy, useEffect, useState } from 'react'
import Hero from './components/Hero'

const WorkSamples = lazy(() => import('./components/WorkSamples'))
const ContactForm = lazy(() => import('./components/ContactForm'))

const App = () => {
  const [pointer, setPointer] = useState({ x: 0, y: 0 })
  const [lightsOff, setLightsOff] = useState(false)
  const [showScrollToTop, setShowScrollToTop] = useState(false)
  const [reduceEffects, setReduceEffects] = useState(false)

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
    if (typeof window === 'undefined') return undefined
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    const evaluateDeviceCapabilities = () => {
      const prefersReducedMotion = mediaQuery.matches
      const lowCores = typeof navigator !== 'undefined' && navigator.hardwareConcurrency
        ? navigator.hardwareConcurrency <= 4
        : false
      const lowMemory = typeof navigator !== 'undefined' && navigator.deviceMemory
        ? navigator.deviceMemory <= 4
        : false
      setReduceEffects(prefersReducedMotion || lowCores || lowMemory)
    }

    evaluateDeviceCapabilities()
    const listener = () => evaluateDeviceCapabilities()
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', listener)
    } else {
      mediaQuery.addListener(listener)
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', listener)
      } else {
        mediaQuery.removeListener(listener)
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
      <div className="fixed right-4 top-4 z-50 hidden justify-end px-6 sm:flex sm:right-6">
        <button
          type="button"
          onClick={toggleLights}
          aria-pressed={lightsOff}
          className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition ${lightToggleStyles}`}
        >
          {lightsOff ? 'Lights On' : 'Lights Off'}
        </button>
      </div>
      <div className="fixed right-0 top-4 z-50 flex items-center justify-end sm:hidden">
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
      <Hero pointer={pointer} isDark={lightsOff} reduceEffects={reduceEffects} />
      <Suspense fallback={renderSectionFallback('h-[360px]')}>
        <WorkSamples isDark={lightsOff} reduceEffects={reduceEffects} />
      </Suspense>
      <Suspense fallback={renderSectionFallback('h-[520px]')}>
        <ContactForm isDark={lightsOff} reduceEffects={reduceEffects} />
      </Suspense>
      <footer className={`px-6 pb-16 pt-12 text-xs ${lightsOff ? 'text-white/70' : 'text-[#3c3c3c]'}`}>
        <div className="mx-auto flex max-w-5xl flex-col gap-4 text-center uppercase tracking-[0.35em] sm:flex-row sm:items-start sm:justify-between sm:text-left">
          <p>&copy; 2025 WAVYTHOUGHT LLC. ALL RIGHTS RESERVED.</p>
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
