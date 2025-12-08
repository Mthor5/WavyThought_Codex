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

const WorkSamples = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeImage, setActiveImage] = useState(null)
  const visibleCount = 4
  const totalSamples = workSamples.length
  const shouldAnimate = totalSamples > visibleCount

  const sliderRef = useRef(null)
  const isHoveredRef = useRef(false)
  const targetDriftRef = useRef(0)
  const currentDriftRef = useRef(0)

  const sliderSamples = useMemo(
    () => (shouldAnimate ? [...workSamples, ...workSamples] : workSamples),
    [shouldAnimate]
  )

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

    let offset = 0
    let lastTime
    let animationFrame

    const percentPerCard = 100 / visibleCount
    const loopDistance = totalSamples * percentPerCard
    const baseSpeedPerMs = percentPerCard / 3000
    const hoverSpeedPerMs = baseSpeedPerMs * 0.2

    const animate = (time) => {
      if (lastTime == null) {
        lastTime = time
      }
      const delta = time - lastTime
      lastTime = time

      const speedPerMs = isHoveredRef.current ? hoverSpeedPerMs : baseSpeedPerMs
      offset += delta * speedPerMs
      if (offset >= loopDistance) {
        offset -= loopDistance
      }

      currentDriftRef.current += (targetDriftRef.current - currentDriftRef.current) * 0.08
      const displayOffset = offset + currentDriftRef.current
      slider.style.transform = `translateX(-${displayOffset}%)`

      animationFrame = requestAnimationFrame(animate)
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [shouldAnimate, totalSamples])

  const handlePointerEnter = () => {
    if (!shouldAnimate) return
    isHoveredRef.current = true
  }

  const handlePointerLeave = () => {
    if (!shouldAnimate) return
    isHoveredRef.current = false
    targetDriftRef.current = 0
  }

  const handlePointerMove = (event) => {
    if (!shouldAnimate) return
    const slider = sliderRef.current
    if (!slider) return
    const rect = slider.getBoundingClientRect()
    const relativeX = (event.clientX - rect.left) / rect.width
    const driftRange = (100 / visibleCount) * 0.4
    targetDriftRef.current = (relativeX - 0.5) * driftRange
  }
  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-5xl text-center text-[#1f1b1f]">
        <h2 className="font-rounded text-[2rem] font-semibold uppercase tracking-[0.175em] text-[#1b1a1e]">
          Work from us
        </h2>
        <p className="mt-3 text-base text-[#5c5a60]">
          A few Waves we&apos;ve already carved, printed, and coaxed into reality.
        </p>
        <div
          className="mt-6 overflow-hidden"
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          onPointerMove={handlePointerMove}
        >
          <div className="flex -mx-3" ref={sliderRef}>
            {sliderSamples.map((sample, index) => (
              <div
                key={`${sample}-${index}`}
                className="w-full flex-shrink-0 px-3"
                style={{ flex: '0 0 25%' }}
              >
                <div className="group flex h-full flex-col items-center justify-center rounded-[32px] bg-transparent transition hover:-translate-y-1">
                  <div
                    className="relative w-full overflow-hidden rounded-[26px] border-[3px] border-white bg-white cursor-pointer"
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
            className="rounded-full border border-[#1f1b1f] px-8 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#1f1b1f] transition hover:bg-[#1f1b1f] hover:text-white"
          >
            See all
          </button>
        </div>
      </div>
      {isModalOpen && (
        <div
          className="fixed inset-0 z-40 bg-white/92 px-4 py-10 backdrop-blur"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative mx-auto flex h-full max-w-6xl flex-col rounded-[42px] bg-white p-8 shadow-[0_40px_120px_rgba(31,27,31,0.25)]"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close gallery"
              onClick={() => setIsModalOpen(false)}
              className="absolute right-6 top-6 h-10 w-10 rounded-full border border-[#e0d7f5] text-xl font-semibold text-[#5c5a60] transition hover:bg-[#f7f4ff]"
            >
              ×
            </button>
            <h3 className="text-center font-rounded text-xl uppercase tracking-[0.3em] text-[#1b1a1e]">
              WavyThoughts
            </h3>
            <p className="mt-2 text-center text-sm text-[#5c5a60]">
              A glimpse at the latest pieces.
            </p>
            <div className="mt-8 flex-1 overflow-y-auto rounded-[32px] bg-[#f8f8fb] p-6">
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
                {workSamples.map((sample) => (
                  <div
                    key={`grid-${sample}`}
                    className="group overflow-hidden rounded-[24px] border border-white/60 bg-white shadow-[0_25px_60px_rgba(31,27,31,0.12)] cursor-pointer transition duration-300 hover:-translate-y-2 hover:shadow-[0_35px_80px_rgba(31,27,31,0.2)]"
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
            className="relative w-full max-w-4xl rounded-[36px] bg-white p-4 shadow-[0_40px_120px_rgba(0,0,0,0.3)]"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close image"
              onClick={() => setActiveImage(null)}
              className="absolute right-4 top-4 h-9 w-9 rounded-full border border-[#e0d7f5] text-lg font-semibold text-[#5c5a60] transition hover:bg-[#f7f4ff]"
            >
              ×
            </button>
            <div className="flex items-center justify-center rounded-[32px] bg-[#f8f8fb] p-4">
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
