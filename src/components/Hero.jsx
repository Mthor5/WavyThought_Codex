import EggCanvas from './EggCanvas'

const Hero = ({ pointer }) => {
  return (
    <section className="relative px-4 pt-10 pb-8 text-[#1f1b1f] sm:pt-16">
      <div className="pointer-events-none absolute inset-0 hidden sm:block">
        <img
          src="/smiley faces.png"
          alt="Smiley accents"
          className="absolute -top-4 left-6 w-40 opacity-80 drop-shadow-[0_12px_30px_rgba(0,0,0,0.2)]"
        />
        <img
          src="/smiley faces.png"
          alt="Smiley accents"
          className="absolute -top-10 right-10 w-56 opacity-70 drop-shadow-[0_20px_45px_rgba(0,0,0,0.2)]"
        />
        <img
          src="/smiley faces.png"
          alt="Smiley accents"
          className="absolute top-24 left-1/2 w-32 -translate-x-1/2 opacity-60 drop-shadow-[0_15px_40px_rgba(0,0,0,0.15)]"
        />
      </div>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
        <div className="relative flex flex-col items-center gap-4 text-center">
          <img
            src="/Wavythought Clear Logo-01.png"
            alt="WavyThought wordmark"
            className="max-w-full"
          />
          <div className="rounded-full border border-[#f0e7ff] bg-white/80 px-6 py-3 text-xs uppercase tracking-[0.6em] text-[#b688dc]">
            WavyThought Creative Studio
          </div>
          <p className="text-sm uppercase tracking-[0.4em] text-[#f06292]">
            Playful minds - wavy ideas - dancing shadows
          </p>
        </div>

        <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
          <div className="flex w-full items-center justify-center lg:w-2/5">
            <div className="relative h-[240px] w-[240px] sm:h-[300px] sm:w-[300px]">
              <EggCanvas pointer={pointer} />
            </div>
          </div>
          <div className="w-full space-y-6 text-base leading-7 text-[#3c3c3c] lg:w-3/5">
            <p>
              WavyThought is a creative studio built on curiosity, play, and the joy of making. We
              blend digital techniques with machines and materials to pull hidden patterns to the
              surface—revealing more than meets the eye. Every piece carries layers, texture, and a
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
