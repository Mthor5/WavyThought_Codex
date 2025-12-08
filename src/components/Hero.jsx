import EggCanvas from './EggCanvas'

const Hero = ({ pointer }) => {
  return (
    <section className="relative overflow-hidden px-4 pb-6 pt-10 text-[#1b1a1e] sm:pb-10 sm:pt-16">
      <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center">
        <div className="relative h-72 w-[760px] max-w-full -translate-y-6">
          <div className="absolute inset-x-0 top-2 mx-auto h-64 rounded-[999px] bg-[radial-gradient(circle_at_15%_30%,rgba(255,205,133,0.7),rgba(255,205,133,0))] blur-[55px]" />
          <div className="absolute inset-x-[-20%] top-6 mx-auto h-60 rotate-[12deg] rounded-[999px] bg-[radial-gradient(circle_at_80%_30%,rgba(255,115,201,0.85),rgba(255,115,201,0))] blur-[85px]" />
          <div className="absolute inset-x-[-25%] top-0 mx-auto h-64 rotate-[-6deg] rounded-[999px] bg-[radial-gradient(circle_at_30%_70%,rgba(255,165,0,0.45),rgba(255,165,0,0))] blur-[95px]" />
        </div>
      </div>
      <div className="pointer-events-none absolute -left-10 top-1/3 hidden h-48 w-48 rotate-[18deg] rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,223,148,0.9),rgba(255,223,148,0))] opacity-80 blur-[50px] sm:block" />
      <div className="pointer-events-none absolute -right-6 top-10 hidden h-40 w-40 rotate-[-14deg] rounded-full bg-[radial-gradient(circle_at_70%_40%,rgba(255,103,180,0.8),rgba(255,103,180,0))] opacity-80 blur-[45px] sm:block" />

      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12">
        <div className="relative z-10 flex min-h-[260px] flex-col items-center gap-6 text-center">
          <img
            src="/Wavythought Logo main-01.png"
            alt="WavyThought primary wordmark"
            className="w-full max-w-[820px]"
          />
          <div className="rounded-[48px] border border-[#f4e9ff] bg-white/80 px-10 py-5 text-[2.1rem] font-bold uppercase tracking-[0.3em] text-[#1b1a1e] shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
            WavyThought Creative Studio
            <div className="mt-2 text-sm font-semibold tracking-[0.25em] text-[#ff67c4]">
              Playful minds - wavy ideas - dancing shadows
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-10 lg:flex-row lg:items-center">
          <div className="flex w-full items-center justify-center lg:w-2/5">
            <div className="relative h-[420px] w-[280px] overflow-visible sm:h-[520px] sm:w-[380px]">
              <EggCanvas pointer={pointer} />
            </div>
          </div>
          <div className="w-full space-y-6 text-lg leading-8 text-[#3c3c3c] lg:w-3/5">
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
