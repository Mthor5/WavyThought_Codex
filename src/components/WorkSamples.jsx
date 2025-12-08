import { useEffect, useMemo, useRef, useState } from 'react'

const workSamples = [
  'IMG_5858.JPEG',
  'IMG_5860.JPEG',
  'IMG_5862.JPEG',
  'IMG_5977.JPEG',
  'IMG_5978.JPEG',
  'IMG_5979.JPEG',
  'IMG_5985.JPEG',
  'IMG_6948(2).JPEG',
  '_MG_7318 copy.JPG',
  '_MG_7324 copy.JPG',
]

const getVisibleCount = () => {
  if (typeof window === 'undefined') return 4
  if (window.innerWidth < 640) return 1
  if (window.innerWidth < 1024) return 2
  return 4
}

const WorkSamples = ({ isDark = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeImage, setActiveImage] = useState(null)
  const [visibleCount, setVisibleCount] = useState(getVisibleCount)
  const totalSamples = workSamples.length
  const shouldAnimate = totalSamples > visibleCount

  const sliderRef = useRef(null)
  const isHoveredRef = useRef(false)
  const isDraggingRef = useRef(false)
  const targetDriftRef = useRef(0)
  const currentDriftRef = useRef(0)
  const dragStartXRef = useRef(0)
  const dragStartOffsetRef = useRef(0)
  const manualOffsetRef = useRef(0)
  const offsetRef = useRef(0)
  const loopDistanceRef = useRef(0)

  const sliderSamples = useMemo(
    () => (shouldAnimate ? [...workSamples, ...workSamples] : workSamples),
    [shouldAnimate]
  )

  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    const handleResize = () => {
      setVisibleCount(getVisibleCount())
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!isModalOpen && !activeImage) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isModalOpen, activeImage])

  useEffect(() => {
    if (!shouldAnimate && sliderRef.current) {
      sliderRef.current.style.transform = 'translateX(0%)'
    }
  }, [shouldAnimate])

  useEffect(() => {
    if (!shouldAnimate) return
    const slider = sliderRef.current
    if (!slider) return

    let offset = offsetRef.current || 0
    let lastTime
    let animationFrame

    const percentPerCard = 100 / visibleCount
    const loopDistance = totalSamples * percentPerCard
    loopDistanceRef.current = loopDistance
    const baseSpeedPerMs = percentPerCard / 3000
    const hoverSpeedPerMs = baseSpeedPerMs * 0.2

    const animate = (time) => {
      if (lastTime == null) {
        lastTime = time
      }

      const delta = time - lastTime
      lastTime = time

      if (isDraggingRef.current) {
        animationFrame = requestAnimationFrame(animate)
        return
      }

      const speedPerMs = isHoveredRef.current ? hoverSpeedPerMs : baseSpeedPerMs
      offset += delta * speedPerMs
      if (offset >= loopDistance) {
        offset -= loopDistance
      }

      currentDriftRef.current += (targetDriftRef.current - currentDriftRef.current) * 0.08
      const displayOffset = offset + currentDriftRef.current
      slider.style.transform = `translateX(-${displayOffset}%)`
      offsetRef.current = offset

      animationFrame = requestAnimationFrame(animate)
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [shouldAnimate, totalSamples])

  const handlePointerEnter = () => {
    if (!shouldAnimate) return
    isHoveredRef.current = true
  }

  const handlePointerLeave = (event) => {
    if (!shouldAnimate) return
    isHoveredRef.current = false
    targetDriftRef.current = 0
    if (isDraggingRef.current) {
      handleDragEnd(event)
    }
  }

  const handlePointerMove = (event) => {
    if (!shouldAnimate) return
    if (isDraggingRef.current) return
    const slider = sliderRef.current
    if (!slider) return
    const rect = slider.getBoundingClientRect()
    const relativeX = (event.clientX - rect.left) / rect.width
    const driftRange = (100 / visibleCount) * 0.4
    targetDriftRef.current = (relativeX - 0.5) * driftRange
  }

  const handleDragStart = (event) => {
    if (!shouldAnimate) return
    const slider = sliderRef.current
    if (!slider) return
    slider.setPointerCapture?.(event.pointerId)
    isDraggingRef.current = true
    isHoveredRef.current = true
    const startOffset = offsetRef.current + currentDriftRef.current
    targetDriftRef.current = 0
    currentDriftRef.current = 0
    dragStartXRef.current = event.clientX
    dragStartOffsetRef.current = startOffset
    manualOffsetRef.current = dragStartOffsetRef.current
    slider.style.cursor = 'grabbing'
    event.preventDefault()
  }

  const handleDragMove = (event) => {
    if (!shouldAnimate || !isDraggingRef.current) return
    const slider = sliderRef.current
    if (!slider) return
    const rect = slider.getBoundingClientRect()
    if (rect.width === 0) return
    const deltaPx = event.clientX - dragStartXRef.current
    const percentDelta = (deltaPx / rect.width) * 100
    const manualOffset = dragStartOffsetRef.current - percentDelta
    manualOffsetRef.current = manualOffset
    slider.style.transform = `translateX(-${manualOffset}%)`
    event.preventDefault()
  }

  const handleDragEnd = (event) => {
    if (!isDraggingRef.current) return
    const slider = sliderRef.current
    if (slider && event?.pointerId != null) {
      slider.releasePointerCapture?.(event.pointerId)
      slider.style.cursor = ''
    } else if (slider) {
      slider.style.cursor = ''
    }
    isDraggingRef.current = false
    isHoveredRef.current = false
    targetDriftRef.current = 0
    currentDriftRef.current = 0
    let normalizedOffset = manualOffsetRef.current
    const loopDistance = loopDistanceRef.current || 0
    if (loopDistance > 0) {
      normalizedOffset %= loopDistance
      if (normalizedOffset < 0) normalizedOffset += loopDistance
    } else {
      normalizedOffset = 0
    }
    offsetRef.current = normalizedOffset
    if (slider) {
      slider.style.transform = `translateX(-${normalizedOffset}%)`
    }
  }

  const modalOverlayClasses = isDark ? 'bg-[#050308]/65' : 'bg-white/40'
  const modalPanelClasses = isDark
    ? 'bg-white/5 text-white shadow-[0_50px_140px_rgba(0,0,0,0.65)] border border-white/20 backdrop-blur-2xl'
    : 'bg-white/50 text-[#1b1a1e] shadow-[0_40px_120px_rgba(31,27,31,0.2)] border border-white/40 backdrop-blur-2xl'
  const modalCloseButtonClasses = isDark
    ? 'border-white/40 text-white hover:bg-white/10 bg-black/30'
    : 'border-white/60 text-[#1b1a1e] hover:bg-white/40 bg-white/30'
  const modalGalleryWrapperClasses = isDark ? 'bg-white/5' : 'bg-white/40'
  const modalGridCardClasses = isDark
    ? 'border-white/15 bg-white/5 shadow-[0_25px_60px_rgba(0,0,0,0.4)] hover:shadow-[0_35px_80px_rgba(0,0,0,0.55)]'
    : 'border-white/60 bg-white/20 shadow-[0_25px_60px_rgba(31,27,31,0.12)] hover:shadow-[0_35px_80px_rgba(31,27,31,0.2)]'

  return (
    <section className="px-4 py-16">
      <div className={`mx-auto max-w-5xl text-center ${isDark ? 'text-white' : 'text-[#1f1b1f]'}`}>
        <h2 className="font-rounded text-[2rem] font-semibold uppercase tracking-[0.175em]">
          Work from us
        </h2>
        <p className={`mt-3 text-base ${isDark ? 'text-white/70' : 'text-[#5c5a60]'}`}>
          A few Waves we&apos;ve already carved, printed, and coaxed into reality.
        </p>
        <div
          className="mt-6 overflow-hidden"
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          onPointerMove={handlePointerMove}
          style={{ touchAction: 'pan-y' }}
        >
          <div
            className="flex -mx-2 py-4 sm:-mx-3 sm:py-5 cursor-grab active:cursor-grabbing select-none"
            ref={sliderRef}
            onPointerDown={handleDragStart}
            onPointerMove={handleDragMove}
            onPointerUp={handleDragEnd}
            onPointerCancel={handleDragEnd}
            onPointerLeave={handleDragEnd}
          >
            {sliderSamples.map((sample, index) => (
              <div
                key={`${sample}-${index}`}
                className="w-full flex-shrink-0 px-2 sm:px-3"
                style={{ flex: `0 0 ${100 / visibleCount}%` }}
              >
                <div className="group flex h-full flex-col items-center justify-center rounded-[32px] bg-transparent transition hover:-translate-y-1">
                  <div
                    className="relative w-full overflow-hidden rounded-[26px] border border-white/60 bg-white/20 backdrop-blur-sm transition hover:border-white cursor-pointer"
                    onClick={() => setActiveImage(sample)}
                  >
                    <img
                      src={`/Work Samples/${sample}`}
                      alt={`Work sample ${sample}`}
                      className="aspect-square w-full object-cover"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className={`rounded-full border px-8 py-3 text-sm font-semibold uppercase tracking-[0.3em] transition ${
              isDark
                ? 'border-white/70 text-white hover:bg-white/10'
                : 'border-[#1f1b1f] text-[#1f1b1f] hover:bg-[#1f1b1f] hover:text-white'
            }`}
          >
            See all
          </button>
        </div>
      </div>
      {isModalOpen && (
        <div
          className={`fixed inset-0 z-40 flex items-center justify-center px-3 py-6 backdrop-blur transition sm:px-4 sm:py-10 ${modalOverlayClasses}`}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className={`relative mx-auto flex h-full w-full max-w-6xl flex-col rounded-[28px] p-4 transition-colors sm:rounded-[42px] sm:p-8 ${modalPanelClasses}`}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close gallery"
              onClick={() => setIsModalOpen(false)}
              className={`absolute right-4 top-4 h-10 w-10 rounded-full text-xl font-semibold transition sm:right-6 sm:top-6 ${modalCloseButtonClasses}`}
            >
              ×
            </button>
            <h3
              className={`text-center font-rounded text-xl uppercase tracking-[0.3em] ${
                isDark ? 'text-white' : 'text-[#1b1a1e]'
              }`}
            >
              WavyThoughts
            </h3>
            <p className={`mt-2 text-center text-sm ${isDark ? 'text-white/70' : 'text-[#5c5a60]'}`}>
              A glimpse at the latest pieces.
            </p>
            <div
              className={`glass-scroll mt-6 flex-1 overflow-y-auto rounded-[28px] p-4 sm:mt-8 sm:rounded-[32px] sm:p-6 ${
                isDark ? 'text-white' : 'text-[#1f1b1f]'
              } ${modalGalleryWrapperClasses}`}
            >
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
                {workSamples.map((sample) => (
                  <div
                    key={`grid-${sample}`}
                    className={`group overflow-hidden rounded-[24px] backdrop-blur-sm cursor-pointer transition duration-300 hover:-translate-y-2 ${modalGridCardClasses}`}
                    onClick={() => setActiveImage(sample)}
                  >
                    <img
                      src={`/Work Samples/${sample}`}
                      alt={`Work sample ${sample}`}
                      className="aspect-square w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {activeImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-10 backdrop-blur-sm"
          onClick={() => setActiveImage(null)}
        >
          <div
            className="relative w-full max-w-4xl rounded-[36px] bg-white/10 p-2 shadow-[0_40px_120px_rgba(0,0,0,0.3)] backdrop-blur-lg border border-white/30"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close image"
              onClick={() => setActiveImage(null)}
              className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/80 bg-black/40 text-lg font-semibold text-white transition hover:bg-black/60"
            >
              ×
            </button>
            <div className="flex items-center justify-center rounded-[28px] bg-transparent p-2">
              <img
                src={`/Work Samples/${activeImage}`}
                alt={`Work sample ${activeImage}`}
                className="max-h-[75vh] w-full rounded-[32px] object-cover"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default WorkSamples
