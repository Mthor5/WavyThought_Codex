import { useEffect, useMemo, useRef, useState } from 'react'

const workSamples = [
  'airtag keychain.JPEG',
  'blazers 00.JPEG',
  'blazers 01.JPEG',
  'blazers 02.JPEG',
  'blazers 03.JPG',
  'blazers cutting.JPEG',
  'blazers wave 1.JPEG',
  'blazers wave 2.JPEG',
  'blazers wave 3.JPEG',
  'card holder.JPEG',
  'disk 1.JPEG',
  'disk 1a.JPEG',
  'disk 2.JPEG',
  'disk 3.JPEG',
  'disk 4.JPEG',
  'facet tray.JPEG',
  'Gengar 01.JPG',
  'Gengar 02.JPG',
  'Gengar 03.JPEG',
  'isla 0.JPEG',
  'isla 2.JPEG',
  'isla 3.JPEG',
  'lamp 01.JPEG',
  'mountain 01.JPEG',
  'mountain 03.JPEG',
  'plank 01.JPEG',
  'Plank 04.JPEG',
  'Plank 05.JPEG',
  'shoe 01.JPEG',
  'shoe 02.JPEG',
  'shoe 03.JPEG',
]

const getVisibleCount = () => {
  if (typeof window === 'undefined') return 4
  if (window.innerWidth < 640) return 1
  if (window.innerWidth < 1024) return 2
  return 4
}

const WorkSamples = ({ isDark = false, reduceEffects = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeSampleIndex, setActiveSampleIndex] = useState(null)
  const [visibleCount, setVisibleCount] = useState(getVisibleCount)
  const totalSamples = workSamples.length
  const shouldAnimate = totalSamples > visibleCount && !reduceEffects

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
  const dragMovedRef = useRef(false)

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
    if (!isModalOpen && activeSampleIndex === null) return undefined
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
  }, [isModalOpen, activeSampleIndex])

  useEffect(() => {
    if (!shouldAnimate && sliderRef.current) {
      sliderRef.current.style.transform = 'translateX(0%)'
    }
  }, [shouldAnimate])

  useEffect(() => {
    if (!shouldAnimate) return
    const slider = sliderRef.current
    if (!slider) return

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
      let offset = offsetRef.current || 0
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
  }, [shouldAnimate, totalSamples, visibleCount])

  const handlePointerEnter = () => {
    if (!shouldAnimate) return
    isHoveredRef.current = true
  }

  const handlePointerLeave = () => {
    if (!shouldAnimate) return
    isHoveredRef.current = false
    targetDriftRef.current = 0
    currentDriftRef.current = 0
    if (isDraggingRef.current) {
      handleDragEnd()
    }
  }

  const handlePointerMove = (event) => {
    if (!shouldAnimate || isDraggingRef.current) return
    const slider = sliderRef.current
    if (!slider) return
    const rect = slider.getBoundingClientRect()
    if (!rect.width) return
    const relativeX = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width))
    const driftRange = (100 / visibleCount) * 0.12
    targetDriftRef.current = (relativeX - 0.5) * driftRange
  }

  const handleDragStart = (event) => {
    if (!shouldAnimate) return
    const slider = sliderRef.current
    if (!slider) return
    isDraggingRef.current = true
    isHoveredRef.current = true
    dragMovedRef.current = false
    const startOffset = offsetRef.current + currentDriftRef.current
    targetDriftRef.current = 0
    currentDriftRef.current = 0
    dragStartXRef.current = event.clientX
    dragStartOffsetRef.current = startOffset
    manualOffsetRef.current = dragStartOffsetRef.current
    slider.style.cursor = 'grabbing'
    event.stopPropagation()
  }

  const handleDragMove = (event) => {
    if (!shouldAnimate || !isDraggingRef.current) return
    let slider = sliderRef.current
    if (!slider) return
    const rect = slider.getBoundingClientRect()
    if (rect.width === 0) return
    const deltaPx = event.clientX - dragStartXRef.current
    if (!dragMovedRef.current && Math.abs(deltaPx) > 5) {
      dragMovedRef.current = true
    }
    const percentDelta = (deltaPx / rect.width) * 100
    const manualOffset = dragStartOffsetRef.current - percentDelta
    manualOffsetRef.current = manualOffset
    slider.style.transform = `translateX(-${manualOffset}%)`
    event.preventDefault()
  }

  const handleDragEnd = () => {
    if (!isDraggingRef.current) return
    const slider = sliderRef.current
    if (slider) {
      slider.style.cursor = ''
      slider.style.removeProperty('transform')
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

  const handleSampleClick = (sample) => {
    if (dragMovedRef.current) {
      dragMovedRef.current = false
      return
    }
    const index = workSamples.findIndex((item) => item === sample)
    if (index !== -1) {
      setActiveSampleIndex(index)
    }
  }

  const closeActiveImage = () => setActiveSampleIndex(null)
  const showNextImage = () => {
    if (activeSampleIndex === null) return
    setActiveSampleIndex((prev) => (prev + 1) % workSamples.length)
  }
  const showPrevImage = () => {
    if (activeSampleIndex === null) return
    setActiveSampleIndex((prev) => (prev - 1 + workSamples.length) % workSamples.length)
  }

  const touchStartXRef = useRef(null)
  const touchStartYRef = useRef(null)
  const isTouchSwipingRef = useRef(false)

  const handleTouchStart = (event) => {
    const touch = event.touches[0]
    if (!touch) return
    touchStartXRef.current = touch.clientX
    touchStartYRef.current = touch.clientY
    isTouchSwipingRef.current = false
  }

  const handleTouchMove = (event) => {
    if (touchStartXRef.current === null) return
    const touch = event.touches[0]
    if (!touch) return
    const deltaX = Math.abs(touch.clientX - touchStartXRef.current)
    const deltaY = Math.abs((touchStartYRef.current || 0) - touch.clientY)
    if (deltaX > 10 && deltaX > deltaY) {
      isTouchSwipingRef.current = true
      event.preventDefault()
    }
  }

  const handleTouchEnd = (event) => {
    if (touchStartXRef.current === null) return
    const touch = event.changedTouches[0]
    if (!touch) return
    const deltaX = touch.clientX - touchStartXRef.current
    const deltaY = Math.abs(touch.clientY - (touchStartYRef.current || 0))
    touchStartXRef.current = null
    touchStartYRef.current = null
    isTouchSwipingRef.current = false
    if (Math.abs(deltaX) < 40 || deltaY > 80) return
    if (deltaX > 0) {
      showPrevImage()
    } else {
      showNextImage()
    }
  }

  const modalOverlayClasses = isDark ? 'bg-[#050308]/65' : 'bg-white/40'
  const modalPanelClasses = isDark
    ? reduceEffects
      ? 'bg-[#1c1a25] text-white border border-white/15'
      : 'bg-white/5 text-white shadow-[0_50px_140px_rgba(0,0,0,0.65)] border border-white/20 backdrop-blur-2xl'
    : reduceEffects
      ? 'bg-white text-[#1b1a1e] border border-[#1b1a1e]/15'
      : 'bg-white/50 text-[#1b1a1e] shadow-[0_40px_120px_rgba(31,27,31,0.2)] border border-white/40 backdrop-blur-2xl'
  const modalCloseButtonClasses = isDark
    ? reduceEffects
      ? 'border-white/30 text-white hover:bg-white/10 bg-transparent'
      : 'border-white/40 text-white hover:bg-white/10 bg-black/30'
    : reduceEffects
      ? 'border-[#1b1a1e]/30 text-[#1b1a1e] bg-transparent hover:bg-black/5'
      : 'border-white/60 text-[#1b1a1e] hover:bg-white/40 bg-white/30'
  const modalGalleryWrapperClasses = isDark
    ? reduceEffects
      ? 'bg-transparent'
      : 'bg-white/5'
    : reduceEffects
      ? 'bg-white'
      : 'bg-white/40'
  const modalGridCardClasses = isDark
    ? reduceEffects
      ? 'border-white/10 bg-black/40'
      : 'border-white/15 bg-white/5 shadow-[0_25px_60px_rgba(0,0,0,0.4)] hover:shadow-[0_35px_80px_rgba(0,0,0,0.55)]'
    : reduceEffects
      ? 'border-[#1b1a1e]/15 bg-white'
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
        >
          <div
            className="flex -mx-2 py-4 sm:-mx-3 sm:py-5 cursor-grab active:cursor-grabbing select-none"
            ref={sliderRef}
            onPointerDown={handleDragStart}
            onPointerMove={handleDragMove}
            onPointerUp={handleDragEnd}
            onPointerCancel={handleDragEnd}
            onPointerLeave={handleDragEnd}
            style={{ touchAction: 'pan-y' }}
          >
            {sliderSamples.map((sample, index) => (
              <div
                key={`${sample}-${index}`}
                className="w-full flex-shrink-0 px-2 sm:px-3"
                style={{ flex: `0 0 ${100 / visibleCount}%` }}
              >
                <div className="group flex h-full flex-col items-center justify-center rounded-[32px] bg-transparent transition hover:-translate-y-1">
                  <div
                    className={`relative w-full overflow-hidden rounded-[26px] border transition cursor-pointer ${
                      reduceEffects
                        ? 'border-white/50 bg-white'
                        : 'border-white/60 bg-white/20 backdrop-blur-sm hover:border-white'
                    }`}
                    onClick={() => handleSampleClick(sample)}
                    onDragStart={(event) => event.preventDefault()}
                  >
                    <img
                      src={`/Work Samples/${sample}`}
                      alt={`Work sample ${sample}`}
                      className="aspect-square w-full object-cover"
                      draggable={false}
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
          className={`fixed inset-0 z-40 flex items-center justify-center px-3 py-6 transition sm:px-4 sm:py-10 ${reduceEffects ? '' : 'backdrop-blur'} ${modalOverlayClasses}`}
          onClick={() => setIsModalOpen(false)}
          style={{ touchAction: 'none' }}
        >
          <div
            className={`relative mx-auto flex h-full w-full max-w-6xl flex-col rounded-[28px] p-4 transition-colors sm:rounded-[42px] sm:p-8 ${modalPanelClasses}`}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close gallery"
              onClick={() => setIsModalOpen(false)}
              className={`absolute right-4 top-4 z-30 h-10 w-10 rounded-full text-xl font-semibold transition sm:right-6 sm:top-6 ${modalCloseButtonClasses}`}
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
                    className={`group overflow-hidden rounded-[24px] cursor-pointer transition duration-300 hover:-translate-y-2 ${
                      reduceEffects ? '' : 'backdrop-blur-sm'
                    } ${modalGridCardClasses}`}
                    onClick={() => handleSampleClick(sample)}
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
      {activeSampleIndex !== null && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-10 ${
            reduceEffects ? '' : 'backdrop-blur-sm'
          }`}
          onClick={closeActiveImage}
          style={{ touchAction: 'none' }}
        >
          <div
            className={`relative w-full max-w-4xl rounded-[36px] p-2 border ${
              reduceEffects
                ? 'bg-white text-[#1b1a1e] border-white/60'
                : 'bg-white/10 shadow-[0_40px_120px_rgba(0,0,0,0.3)] backdrop-blur-lg border-white/30'
            }`}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close image"
              onClick={closeActiveImage}
              className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/80 bg-black/40 text-lg font-semibold text-white transition hover:bg-black/60"
            >
              ×
            </button>
            <button
              type="button"
              onClick={showPrevImage}
              className={`absolute left-0 top-1/2 hidden -translate-x-[calc(100%+0.75rem)] -translate-y-1/2 rounded-full border px-3 py-2 text-2xl transition sm:flex ${
                reduceEffects
                  ? 'border-white/50 bg-white/70 text-[#1f1b1f]'
                  : 'border-white/40 bg-black/30 text-white shadow-[0_6px_25px_rgba(0,0,0,0.35)] hover:bg-black/45'
              }`}
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={showNextImage}
              className={`absolute right-0 top-1/2 hidden translate-x-[calc(100%+0.75rem)] -translate-y-1/2 rounded-full border px-3 py-2 text-2xl transition sm:flex ${
                reduceEffects
                  ? 'border-white/50 bg-white/70 text-[#1f1b1f]'
                  : 'border-white/40 bg-black/30 text-white shadow-[0_6px_25px_rgba(0,0,0,0.35)] hover:bg-black/45'
              }`}
              aria-label="Next image"
            >
              ›
            </button>
            <div
              className="flex items-center justify-center rounded-[28px] bg-transparent p-2"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onTouchCancel={handleTouchEnd}
            >
              <img
                src={`/Work Samples/${workSamples[activeSampleIndex]}`}
                alt={`Work sample ${workSamples[activeSampleIndex]}`}
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
