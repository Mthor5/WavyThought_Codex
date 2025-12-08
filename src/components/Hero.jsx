import EggCanvas from './EggCanvas'

const Hero = ({ pointer, isDark = false }) => {
  const baseText = isDark ? 'text-white' : 'text-[#1b1a1e]'
  const bodyText = isDark ? 'text-white/80' : 'text-[#3c3c3c]'
  return (
    <section className={`relative overflow-visible px-4 pb-10 pt-20 ${baseText} sm:pb-10 sm:pt-16`}>
      <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center">
        <div className="relative h-72 w-[760px] max-w-full -translate-y-6">
          <div className="absolute inset-x-0 top-2 mx-auto h-64 rounded-[999px] bg-[radial-gradient(circle_at_15%_30%,rgba(255,205,133,0.7),rgba(255,205,133,0))] blur-[55px]" />
          <div className="absolute inset-x-[-20%] top-6 mx-auto h-60 rotate-[12deg] rounded-[999px] bg-[radial-gradient(circle_at_80%_30%,rgba(255,115,201,0.85),rgba(255,115,201,0))] blur-[85px]" />
          <div className="absolute inset-x-[-25%] top-0 mx-auto h-64 rotate-[-6deg] rounded-[999px] bg-[radial-gradient(circle_at_30%_70%,rgba(255,165,0,0.45),rgba(255,165,0,0))] blur-[95px]" />
        </div>
      </div>
      <div className="pointer-events-none absolute -left-16 top-1/3 hidden h-64 w-56 rotate-[12deg] rounded-full bg-[radial-gradient(circle_at_20%_20%,rgba(255,223,148,0.8),rgba(255,173,238,0.5),rgba(255,223,148,0))] opacity-80 blur-[55px] sm:block" />
      <div className="pointer-events-none absolute -right-10 top-6 hidden h-56 w-52 rotate-[-18deg] rounded-full bg-[radial-gradient(circle_at_70%_30%,rgba(255,103,180,0.85),rgba(255,178,120,0.6),rgba(255,103,180,0))] opacity-80 blur-[55px] sm:block" />

      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12">
        <div className="relative z-10 flex min-h-[220px] flex-col items-center gap-4 text-center sm:min-h-[260px] sm:gap-6">
          <img
            src="/Wavythought Logo main-01.png"
            alt="WavyThought primary wordmark"
            className="w-full max-w-[820px]"
          />
          <div
            className={`rounded-[40px] border border-white/70 bg-white/20 px-6 py-4 text-[1.4rem] font-bold uppercase tracking-[0.2em] sm:rounded-[48px] sm:px-10 sm:py-5 sm:text-[2.1rem] sm:tracking-[0.3em] ${
              isDark ? 'text-[#1b1a1e]' : 'text-[#1b1a1e]'
            } shadow-[0_20px_60px_rgba(0,0,0,0.08)] backdrop-blur-md`}
          >
            WavyThought Creative Studio
            <div className="mt-2 text-xs font-semibold tracking-[0.2em] text-[#ff67c4] sm:text-sm sm:tracking-[0.25em]">
              Playful minds - wavy ideas - dancing shadows
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-10 lg:flex-row lg:items-center">
          <div className="flex w-full items-center justify-center lg:w-2/5">
            <div className="relative h-[340px] w-[240px] overflow-visible sm:h-[520px] sm:w-[380px]">
              <EggCanvas pointer={pointer} />
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
