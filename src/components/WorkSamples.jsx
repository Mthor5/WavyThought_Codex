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
  return (
    <section className="px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-5xl text-center text-[#1f1b1f]">
        <h2 className="font-display text-3xl">Work from us</h2>
        <p className="mt-2 text-base text-[#5c5a60]">
          A few waves we&apos;ve already carved, printed, and coaxed into reality.
        </p>
        <div className="mt-10 grid gap-8 sm:grid-cols-3 lg:grid-cols-4">
          {workSamples.map((sample) => (
            <div
              key={sample}
              className="group relative flex h-40 w-full items-center justify-center overflow-visible rounded-[38px] border border-[#d8dbe6] bg-white shadow-[0_25px_60px_rgba(31,27,31,0.08)]"
            >
              <div className="absolute inset-0 rounded-[38px] bg-white/80 backdrop-blur transition duration-500 group-hover:opacity-0" />
              <img
                src={`/Work Samples/${sample}`}
                alt={`Work sample ${sample}`}
                className="relative z-10 h-32 w-32 rounded-[32px] object-cover transition duration-500 group-hover:z-20 group-hover:scale-[3]"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WorkSamples
