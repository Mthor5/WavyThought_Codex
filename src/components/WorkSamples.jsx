import { useMemo } from 'react'

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
  const visibleCount = 4
  const totalSamples = workSamples.length
  const shouldAnimate = totalSamples > visibleCount

  const sliderSamples = useMemo(
    () => (shouldAnimate ? [...workSamples, ...workSamples] : workSamples),
    [shouldAnimate]
  )

  const trackStyle = shouldAnimate
    ? {
        '--carousel-distance': `${(totalSamples * 100) / visibleCount}%`,
        animationDuration: `${totalSamples * 3}s`,
      }
    : undefined
  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-5xl text-center text-[#1f1b1f]">
        <h2 className="font-rounded text-[2rem] font-semibold uppercase tracking-[0.175em] text-[#1b1a1e]">
          Work from us
        </h2>
        <p className="mt-3 text-base text-[#5c5a60]">
          A few Waves we&apos;ve already carved, printed, and coaxed into reality.
        </p>
        <div className="mt-12 overflow-hidden">
          <div
            className={`flex -mx-3 ${shouldAnimate ? 'animate-work-carousel' : ''}`}
            style={trackStyle}
          >
            {sliderSamples.map((sample, index) => (
              <div
                key={`${sample}-${index}`}
                className="w-full flex-shrink-0 px-3"
                style={{ flex: '0 0 25%' }}
              >
                <div className="group flex h-full flex-col items-center justify-center rounded-[36px] border border-[#d5d9e1] bg-gradient-to-b from-[#f8f8fb] to-[#eef0f4] p-4 shadow-[0_30px_70px_rgba(31,27,31,0.08)] transition hover:-translate-y-1">
                  <div className="relative w-full overflow-hidden rounded-[28px] bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                    <img
                      src={`/Work Samples/${sample}`}
                      alt={`Work sample ${sample}`}
                      className="h-40 w-full rounded-[26px] object-cover"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default WorkSamples
