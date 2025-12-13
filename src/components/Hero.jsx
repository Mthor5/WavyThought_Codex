import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react'

const EggCanvas = lazy(() => import('./EggCanvas'))

const Hero = ({ pointer, isDark = false, reduceEffects = false }) => {
  const baseText = isDark ? 'text-white' : 'text-[#1b1a1e]'
  const bodyText = isDark ? 'text-white/80' : 'text-[#3c3c3c]'
  const heroGlassClass = reduceEffects
    ? isDark
      ? 'border-white/50 bg-white/10 backdrop-blur-md'
      : 'border-[#1b1a1e]/20 bg-white/80 backdrop-blur-md'
    : isDark
      ? 'glass-panel-dark'
      : 'glass-panel-light'
  const eggAreaRef = useRef(null)
  const promptTimers = useRef([])
  const idlePromptTimer = useRef(null)
  const hasShownInitialPrompt = useRef(false)
  const [isEggCentered, setIsEggCentered] = useState(false)
  const [showScrubPrompt, setShowScrubPrompt] = useState(false)
  const [isBlinkingPrompt, setIsBlinkingPrompt] = useState(false)

  const clearPromptTimers = useCallback(() => {
    promptTimers.current.forEach((timerId) => clearTimeout(timerId))
    promptTimers.current = []
  }, [])

  const clearIdlePromptTimer = useCallback(() => {
    if (idlePromptTimer.current) {
      clearTimeout(idlePromptTimer.current)
      idlePromptTimer.current = null
    }
  }, [])

  const runPromptSequence = useCallback(
    (mode) => {
      clearPromptTimers()
      if (mode === 'initial') {
        setIsBlinkingPrompt(false)
        setShowScrubPrompt(true)
        const hideTimer = setTimeout(() => {
          setShowScrubPrompt(false)
        }, 1000)
        promptTimers.current.push(hideTimer)
        return
      }
      if (mode === 'blink') {
        setIsBlinkingPrompt(true)
        setShowScrubPrompt(true)
        const hideTimer = setTimeout(() => {
          setShowScrubPrompt(false)
          setIsBlinkingPrompt(false)
        }, 1200)
        promptTimers.current.push(hideTimer)
      }
    },
    [clearPromptTimers]
  )

  const startIdlePromptCountdown = useCallback(
    function schedule(contextCentered) {
      clearIdlePromptTimer()
      const shouldCheck = typeof contextCentered === 'boolean' ? contextCentered : isEggCentered
      if (!hasShownInitialPrompt.current || !shouldCheck) return
      idlePromptTimer.current = setTimeout(() => {
        if (!hasShownInitialPrompt.current) return
        runPromptSequence('blink')
        schedule()
      }, 5000)
    },
    [clearIdlePromptTimer, isEggCentered, runPromptSequence]
  )

  useEffect(() => {
    const evaluateEggPosition = () => {
      if (window.innerWidth >= 640) {
        setIsEggCentered(false)
        return
      }
      const eggAreaEl = eggAreaRef.current
      if (!eggAreaEl) return
      const rect = eggAreaEl.getBoundingClientRect()
      const viewportMiddle = window.innerHeight / 2
      const centered = rect.top <= viewportMiddle && rect.bottom >= viewportMiddle
      setIsEggCentered(centered)
      if (centered && hasShownInitialPrompt.current) {
        startIdlePromptCountdown(true)
      }
    }
    evaluateEggPosition()
    window.addEventListener('scroll', evaluateEggPosition, { passive: true })
    window.addEventListener('resize', evaluateEggPosition)
    return () => {
      window.removeEventListener('scroll', evaluateEggPosition)
      window.removeEventListener('resize', evaluateEggPosition)
    }
  }, [startIdlePromptCountdown])

  useEffect(() => {
    let animationFrame
    if (isEggCentered) {
      if (!hasShownInitialPrompt.current) {
        animationFrame = requestAnimationFrame(() => runPromptSequence('initial'))
        hasShownInitialPrompt.current = true
      }
      startIdlePromptCountdown()
    } else {
      hasShownInitialPrompt.current = false
      setShowScrubPrompt(false)
      setIsBlinkingPrompt(false)
      clearPromptTimers()
      clearIdlePromptTimer()
    }
    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame)
    }
  }, [clearIdlePromptTimer, clearPromptTimers, isEggCentered, runPromptSequence, startIdlePromptCountdown])

  useEffect(() => {
    return () => {
      clearPromptTimers()
      clearIdlePromptTimer()
    }
  }, [clearIdlePromptTimer, clearPromptTimers])

  return (
    <section className={`relative overflow-visible px-4 pb-10 pt-20 ${baseText} sm:pb-10 sm:pt-16`}>
          {!reduceEffects && (
            <>
              <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center sm:hidden">
                <div className="relative h-[260px] w-[420px] max-w-none -translate-y-12 scale-x-[0.92] scale-y-[0.65]">
                  <div className="absolute inset-x-[-18%] top-6 mx-auto h-[190px] rotate-[-6deg] rounded-[999px] bg-[radial-gradient(circle_at_26%_35%,rgba(255,205,70,0.76),rgba(255,135,20,0.56),rgba(255,205,70,0))] blur-[65px]" />
                  <div className="absolute inset-x-[-6%] top-26 mx-auto h-[185px] rotate-[4deg] rounded-[999px] bg-[radial-gradient(circle_at_52%_72%,rgba(255,115,35,0.72),rgba(255,85,20,0.56),rgba(255,115,35,0))] blur-[60px]" />
                  <div className="absolute inset-x-[8%] top-30 mx-auto h-[185px] rotate-[16deg] rounded-[999px] bg-[radial-gradient(circle_at_80%_32%,rgba(255,100,210,0.76),rgba(255,60,160,0.6),rgba(255,100,210,0))] blur-[70px]" />
                </div>
              </div>
              <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center max-sm:hidden">
            <div className="relative h-72 w-[760px] max-w-full -translate-y-6">
              <div className="absolute inset-x-0 top-2 mx-auto h-64 rounded-[999px] bg-[radial-gradient(circle_at_15%_30%,rgba(255,205,133,0.7),rgba(255,205,133,0))] blur-[55px]" />
              <div className="absolute inset-x-[-20%] top-6 mx-auto h-60 rotate-[12deg] rounded-[999px] bg-[radial-gradient(circle_at_80%_30%,rgba(255,115,201,0.85),rgba(255,115,201,0))] blur-[85px]" />
              <div className="absolute inset-x-[-25%] top-0 mx-auto h-64 rotate-[-6deg] rounded-[999px] bg-[radial-gradient(circle_at_30%_70%,rgba(255,165,0,0.45),rgba(255,165,0,0))] blur-[95px]" />
            </div>
          </div>
          <div className="pointer-events-none absolute -left-16 top-1/3 hidden h-64 w-56 rotate-[12deg] rounded-full bg-[radial-gradient(circle_at_20%_20%,rgba(255,223,148,0.8),rgba(255,173,238,0.5),rgba(255,223,148,0))] opacity-80 blur-[55px] sm:block" />
          <div className="pointer-events-none absolute -right-10 top-6 hidden h-56 w-52 rotate-[-18deg] rounded-full bg-[radial-gradient(circle_at_70%_30%,rgba(255,103,180,0.85),rgba(255,178,120,0.6),rgba(255,103,180,0))] opacity-80 blur-[55px] sm:block" />
        </>
      )}

      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12">
        <div className="relative z-10 flex min-h-[220px] flex-col items-center gap-4 text-center sm:min-h-[260px] sm:gap-6">
          <img
            src={isDark ? '/Wavythought Logo main invert-01.png' : '/Wavythought Logo main-01.png'}
            alt="WavyThought primary wordmark"
            className="w-full max-w-[820px]"
          />
          <div
            className={`rounded-[40px] border px-6 py-4 text-[clamp(1.05rem,4vw,1.4rem)] font-bold uppercase tracking-[0.15em] sm:rounded-[48px] sm:px-10 sm:py-5 sm:text-[2.1rem] sm:tracking-[0.3em] ${
              isDark ? 'text-white' : 'text-[#1b1a1e]'
            } ${heroGlassClass}`}
          >
            WavyThought Creative Studio
            <div
              className={`mt-2 text-[clamp(0.65rem,3.2vw,0.85rem)] font-semibold tracking-[0.18em] sm:text-sm sm:tracking-[0.25em] ${
                isDark ? 'text-white' : 'text-[#1b1a1e]'
              }`}
            >
              Playful minds - wavy ideas - dancing shadows
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-10 lg:flex-row lg:items-center">
          <div className="pointer-events-none absolute left-0 top-[32%] h-20 w-20 rounded-full bg-[radial-gradient(circle_at_40%_40%,rgba(255,200,90,0.85),rgba(255,200,90,0))] blur-[35px] sm:hidden" />
          <div className="pointer-events-none absolute left-10 top-[33%] h-16 w-16 rounded-full bg-[radial-gradient(circle_at_50%_40%,rgba(255,120,210,0.9),rgba(255,120,210,0))] blur-[28px] sm:hidden" />
          <div className="pointer-events-none absolute right-[6%] top-[20%] h-16 w-16 rounded-full bg-[radial-gradient(circle_at_40%_40%,rgba(255,180,210,0.75),rgba(255,120,210,0.4),rgba(255,180,210,0))] blur-[45px]" />
          <div className="pointer-events-none absolute right-6 top-[52%] hidden h-32 w-32 translate-x-1/4 rounded-full bg-[radial-gradient(circle_at_50%_40%,rgba(255,215,190,0.65),rgba(255,160,220,0.35),rgba(255,215,190,0))] blur-[55px] sm:block" />
          <div className="pointer-events-none absolute right-4 top-[55%] h-24 w-24 rounded-full bg-[radial-gradient(circle_at_40%_40%,rgba(255,220,200,0.6),rgba(255,140,210,0.35),rgba(255,220,200,0))] blur-[45px] sm:hidden" />
          <div className="flex w-full items-center justify-center lg:w-2/5">
            <div
              ref={eggAreaRef}
              className="relative h-[360px] w-full max-w-[360px] overflow-visible sm:h-[520px] sm:w-[380px] sm:max-w-none"
            >
              <Suspense
                fallback={
                  <div
                    className={`flex h-full w-full items-center justify-center rounded-[36px] border ${
                      isDark ? 'border-white/20 bg-black/20 text-white/60' : 'border-black/10 bg-white text-[#8b7b95]'
                    } ${reduceEffects ? '' : 'backdrop-blur-sm shadow-[0_10px_35px_rgba(0,0,0,0.15)]'}`}
                    aria-label="Loading sculpture"
                  >
                    <span className="text-[0.65rem] uppercase tracking-[0.4em]">Loading</span>
                  </div>
                }
              >
                <EggCanvas pointer={pointer} />
              </Suspense>
              <p
                className={`mt-3 text-center text-[0.58rem] uppercase tracking-[0.32em] sm:mt-4 ${
                  isDark ? 'text-white/70' : 'text-[#1b1a1e]/60'
                }`}
              >
                Sample of generative texture
              </p>
              {showScrubPrompt && (
                <div
                  className={`pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full border px-3 py-1.5 text-[0.58rem] font-semibold uppercase tracking-[0.25em] sm:hidden ${
                    isBlinkingPrompt ? 'animate-pulse' : ''
                  } ${
                    isDark
                      ? 'border-white/40 bg-[#0f0f0f]/80 text-white'
                      : 'border-[#1b1a1e]/15 bg-white/80 text-[#1b1a1e]'
                  } ${reduceEffects ? '' : 'shadow-[0_10px_25px_rgba(0,0,0,0.35)] backdrop-blur-lg'}`}
                >
                  <span className="text-base leading-none">↔</span> Move
                </div>
              )}
            </div>
          </div>
          <div className={`w-full space-y-6 text-base leading-7 ${bodyText} sm:text-lg sm:leading-8 lg:w-3/5`}>
            <p>
              WavyThought is a creative studio built on curiosity, play, and the joy of making. We
              blend digital techniques with machines and materials to pull hidden patterns to the
              surface - revealing more than meets the eye. Every piece carries layers, texture, and a
              bit of the wobbling ideas that live in our heads until we carve, print, cut, or build
              them into the world.
            </p>
            <p>
              We create one-of-a-kind custom work, from small personal pieces to full room
              installations, lighting, wall art, furniture, and beyond. You can commission something
              entirely new or explore our existing Waves, already captured and ready for a new home.
              Whatever form it takes, if it bends technology, craft, and imagination, it lives here
              at WavyThought.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
