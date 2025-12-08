import { useState } from 'react'
import Hero from './components/Hero'
import WorkSamples from './components/WorkSamples'
import ContactForm from './components/ContactForm'

const App = () => {
  const [pointer, setPointer] = useState({ x: 0, y: 0 })
  const [lightsOff, setLightsOff] = useState(false)

  const handleMove = (event) => {
    const x = (event.clientX / window.innerWidth) * 2 - 1
    const y = (event.clientY / window.innerHeight) * 2 - 1
    setPointer({ x, y })
  }

  return (
    <div
      className={`min-h-screen ${lightsOff ? 'bg-[#1b1a20] text-white transition-colors' : 'bg-[#fdfcfc] text-[#1f1b1f]'} `}
      onPointerMove={handleMove}
      onPointerLeave={() => setPointer({ x: 0, y: 0 })}
    >
      <div className="flex justify-end px-6 pt-6">
        <button
          type="button"
          onClick={() => setLightsOff((prev) => !prev)}
          className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition ${
            lightsOff
              ? 'border-white/60 bg-white/10 text-white hover:bg-white/20'
              : 'border-[#1f1b1f] text-[#1f1b1f] hover:bg-[#1f1b1f] hover:text-white'
          }`}
        >
          {lightsOff ? 'Lights On' : 'Lights Off'}
        </button>
      </div>
      <Hero pointer={pointer} isDark={lightsOff} />
      <WorkSamples isDark={lightsOff} />
      <ContactForm isDark={lightsOff} />
      <footer className={`px-6 pb-16 pt-12 text-xs ${lightsOff ? 'text-white/70' : 'text-[#3c3c3c]'}`}>
        <div className="mx-auto flex max-w-5xl flex-col gap-4 text-center uppercase tracking-[0.35em] sm:flex-row sm:items-start sm:justify-between sm:text-left">
          <p>&copy; 2025 WAVYTHOUGHT LLC. ALL RIGHTS RESERVED.</p>
          <div className={`text-center ${lightsOff ? 'text-white' : 'text-[#1f1b1f]'} sm:text-right`}>
            <p>Stop by and give us a wave</p>
            <p className={`mt-2 ${lightsOff ? 'text-white/80' : 'text-[#3c3c3c]'}`}>
              <a
                href="https://www.instagram.com/wavythought/"
                target="_blank"
                rel="noreferrer"
                className="underline decoration-dotted underline-offset-4 transition hover:text-[#ff7bd5]"
              >
                Instagram
              </a>{' '}
              |{' '}
              <a
                href="mailto:hello@wavythought.com"
                className="underline decoration-dotted underline-offset-4 transition hover:text-[#ff7bd5]"
              >
                Hello@wavythought.com
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
