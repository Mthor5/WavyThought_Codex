import { useState } from 'react'
import Hero from './components/Hero'
import WorkSamples from './components/WorkSamples'
import ContactForm from './components/ContactForm'

const App = () => {
  const [pointer, setPointer] = useState({ x: 0, y: 0 })

  const handleMove = (event) => {
    const x = (event.clientX / window.innerWidth) * 2 - 1
    const y = (event.clientY / window.innerHeight) * 2 - 1
    setPointer({ x, y })
  }

  return (
    <div
      className="min-h-screen bg-[#fdfcfc] text-[#1f1b1f]"
      onPointerMove={handleMove}
      onPointerLeave={() => setPointer({ x: 0, y: 0 })}
    >
      <Hero pointer={pointer} />
      <WorkSamples />
      <ContactForm />
      <footer className="px-6 pb-16 pt-8 text-center text-xs uppercase tracking-[0.3em] text-[#3c3c3c]">
        ©2025 WavyThought LLC. All rights reserved.
      </footer>
    </div>
  )
}

export default App
