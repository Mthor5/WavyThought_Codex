const Hero = () => {
  return (
    <header className="isolate px-4 pt-12 pb-8 sm:pt-16 lg:pt-20">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 text-center">
        <div
          className="relative w-full overflow-hidden rounded-[2.75rem] border border-white/10 bg-ink-900/60 shadow-glow"
          style={{ boxShadow: '0 0 50px rgba(255, 255, 255, 0.3)' }}
        >
          <div
            className="relative flex min-h-[360px] flex-col items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: "url('/hero-texture.png')" }}
          >
            <div
              className="absolute inset-0 bg-gradient-to-br from-black/60 via-ink-900/40 to-ink-900/80"
              aria-hidden
            />
            <img
              src="/logo-mark.svg"
              alt="WavyThought logo"
              className="relative z-10 h-32 w-32 sm:h-40 sm:w-40 drop-shadow-[0_25px_50px_rgba(0,0,0,0.65)]"
            />
            <p className="relative z-10 mt-6 max-w-2xl px-6 font-display text-2xl text-white/80 sm:text-3xl">
              We blend clean modern aesthetics with a tech-forward edge.
            </p>
          </div>
        </div>
        <div className="space-y-3 px-2">
          <p className="font-display text-xs uppercase tracking-[0.4em] text-slate-400">
            Design / Technology / Strategy
          </p>
          <h1 className="font-display text-3xl text-slate-50 sm:text-4xl">
            WavyThought Creative Studio
          </h1>
          <p className="text-base text-slate-300 sm:text-lg">
            A single landing pad for partnerships, launches, and ongoing collaboration. Reach out
            when you&apos;re ready to build something remarkable.
          </p>
        </div>
      </div>
    </header>
  )
}

export default Hero
