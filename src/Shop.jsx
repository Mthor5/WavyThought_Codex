import { useEffect, useMemo, useState } from 'react'
import './index.css'

const getSystemPrefersDark = () => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return true
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

const conceptCatalog = [
  {
    id: 'concept-01',
    label: 'Concept 01',
    title: 'Generative Texture Study',
    price: 480,
    blurb: 'Material and lighting explorations currently in fabrication. Email us if one speaks to you.',
  },
  {
    id: 'concept-02',
    label: 'Concept 02',
    title: 'Layered Wave Grid',
    price: 520,
    blurb: 'Stacked acrylic gradients shaped by generative wave equations.',
  },
  {
    id: 'concept-03',
    label: 'Concept 03',
    title: 'Chromatic Bloom Lamp',
    price: 640,
    blurb: 'Blooming light sculpture with programmable gradients.',
  },
  {
    id: 'concept-04',
    label: 'Concept 04',
    title: 'Tactile Foam Relief',
    price: 390,
    blurb: 'Hand-finished relief capturing simulated foam turbulence.',
  },
  {
    id: 'concept-05',
    label: 'Concept 05',
    title: 'Mirror Wave Cabinet',
    price: 1200,
    blurb: 'Furniture study bending reflective planes through CNC carving.',
  },
  {
    id: 'concept-06',
    label: 'Concept 06',
    title: 'Sound Reactive Wall',
    price: 950,
    blurb: 'LED tessellation that responds to real-time ambient sound.',
  },
]

const Shop = () => {
  const [lightsOff, setLightsOff] = useState(() => getSystemPrefersDark())
  const [cartItems, setCartItems] = useState({})
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [showScrollToTop, setShowScrollToTop] = useState(false)

  useEffect(() => {
    const { body } = document
    if (!body) return undefined
    body.classList.toggle('lights-off', lightsOff)
    return () => {
      body.classList.remove('lights-off')
    }
  }, [lightsOff])

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return undefined
    const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleColorSchemeChange = (event) => {
      setLightsOff(event.matches)
    }
    setLightsOff(colorSchemeQuery.matches)
    if (typeof colorSchemeQuery.addEventListener === 'function') {
      colorSchemeQuery.addEventListener('change', handleColorSchemeChange)
    } else if (typeof colorSchemeQuery.addListener === 'function') {
      colorSchemeQuery.addListener(handleColorSchemeChange)
    }
    return () => {
      if (typeof colorSchemeQuery.removeEventListener === 'function') {
        colorSchemeQuery.removeEventListener('change', handleColorSchemeChange)
      } else if (typeof colorSchemeQuery.removeListener === 'function') {
        colorSchemeQuery.removeListener(handleColorSchemeChange)
      }
    }
  }, [])

  useEffect(() => {
    if (!isCartOpen) return undefined
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsCartOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isCartOpen])

  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 200)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const bannerCopy =
    'Limited experiments and texture studies. Custom project requests stay open via the main form.'
  const lightToggleStyles = lightsOff
    ? 'border-white/60 bg-white/10 text-white hover:bg-white/20'
    : 'border-[#1f1b1f] text-[#1f1b1f] hover:bg-[#1f1b1f] hover:text-white'
  const mobileHandleStyles = lightsOff
    ? 'border-white/50 bg-white/10 text-white/80 backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.25)]'
    : 'border-[#1f1b1f]/20 bg-white/40 text-[#1f1b1f] backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.15)]'
  const pageBackground = lightsOff ? 'bg-[#1b1a20] text-white' : 'bg-[#fdfcfc] text-[#1f1b1f]'
  const heroMutedText = lightsOff ? 'text-white/70' : 'text-[#3c3c3c]'
  const infoPanelClass = lightsOff
    ? 'border-white/10 bg-white/5 text-white/70'
    : 'border-[#1f1b1f]/10 bg-white/80 text-[#2d2530]'
  const infoPanelBadge = lightsOff ? 'text-white/50' : 'text-[#6f5a82]'
  const cardShellClass = lightsOff
    ? 'border-white/15 bg-white/5 text-white/80'
    : 'border-[#1f1b1f]/20 bg-white/95 text-[#1f1b1f]/85 shadow-[0_18px_45px_rgba(31,27,31,0.08)]'
  const cardSubtleText = lightsOff ? 'text-white/60' : 'text-[#615167]'
  const footerText = lightsOff ? 'text-white/60' : 'text-[#5b4a63]'
  const cartButtonStyles = lightToggleStyles
  const quantityButtonStyles = lightsOff
    ? 'border-white/40 text-white hover:bg-white/10'
    : 'border-[#1f1b1f]/30 text-[#1f1b1f] hover:bg-[#f4e7ff]'
  const cartPanelClass = lightsOff
    ? 'border-white/15 bg-white/5 text-white/90 shadow-[0_35px_120px_rgba(0,0,0,0.65)]'
    : 'border-[#1f1b1f]/15 bg-white/95 text-[#1f1b1f]/90 shadow-[0_35px_80px_rgba(31,27,31,0.12)]'
  const cartDividerClass = lightsOff ? 'border-white/10' : 'border-[#1f1b1f]/10'
  const cartItemBorderClass = lightsOff ? 'border-white/15' : 'border-[#1f1b1f]/15'
  const cartFooterShell = lightsOff ? 'border-white/15 bg-white/5' : 'border-[#1f1b1f]/15 bg-white/95'
  const cartEmptyText = lightsOff ? 'text-white/60' : 'text-[#5a4b64]'
  const cartBadgeStyles = lightsOff
    ? 'border-[#ffd5fb]/60 bg-[linear-gradient(130deg,rgba(255,70,190,0.8),rgba(155,85,255,0.65),rgba(255,255,255,0.2))] text-white drop-shadow-[0_8px_30px_rgba(255,105,180,0.45)]'
    : 'border-[#ff2fa7]/60 bg-[linear-gradient(130deg,rgba(255,255,255,0.95),rgba(255,170,223,0.95),rgba(255,125,185,0.9))] text-[#1b1a1e] drop-shadow-[0_8px_30px_rgba(255,105,180,0.45)]'
  const floatingControlsVisibility = isCartOpen ? 'pointer-events-none opacity-0' : 'opacity-100'
  const smileyFaceSrc = lightsOff ? '/Single smile rotated dark.png' : '/Single smile rotated.png'
  const scrollToTopButtonStyles = lightsOff
    ? 'border-white/40 bg-white/10 text-white backdrop-blur-lg shadow-[0_8px_30px_rgba(0,0,0,0.35)] hover:bg-white/20'
    : 'border-[#1f1b1f]/15 bg-[#fdfcfc]/40 text-[#1f1b1f] backdrop-blur-lg shadow-[0_12px_40px_rgba(31,27,31,0.2)] hover:bg-[#fdfcfc]/60'
  const scrollToTopButtonVisibility =
    showScrollToTop && !isCartOpen
      ? 'opacity-100 pointer-events-auto translate-y-0'
      : 'opacity-0 pointer-events-none translate-y-4'

  const cartCount = useMemo(
    () => Object.values(cartItems).reduce((total, item) => total + item.quantity, 0),
    [cartItems],
  )
  const cartSubtotal = useMemo(
    () => Object.values(cartItems).reduce((total, item) => total + item.quantity * item.price, 0),
    [cartItems],
  )
  const hasCartItems = cartCount > 0
  const cartBadgeLabel = hasCartItems ? `${cartCount} item${cartCount === 1 ? '' : 's'} in cart` : 'Cart is empty'
  const scrollToTop = () => {
    if (typeof window === 'undefined') return
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const addToCart = (concept) => {
    setCartItems((prev) => {
      const nextQuantity = (prev[concept.id]?.quantity || 0) + 1
      return {
        ...prev,
        [concept.id]: { quantity: nextQuantity, title: concept.title, price: concept.price, label: concept.label },
      }
    })
    setIsCartOpen(true)
  }

  const incrementItem = (conceptId) => {
    setCartItems((prev) => ({
      ...prev,
      [conceptId]: {
        ...prev[conceptId],
        quantity: (prev[conceptId]?.quantity || 0) + 1,
      },
    }))
  }

  const decrementItem = (conceptId) => {
    setCartItems((prev) => {
      const current = prev[conceptId]
      if (!current) return prev
      if (current.quantity <= 1) {
        const { [conceptId]: _removed, ...rest } = prev
        return rest
      }
      return {
        ...prev,
        [conceptId]: { ...current, quantity: current.quantity - 1 },
      }
    })
  }

  const removeItem = (conceptId) => {
    setCartItems((prev) => {
      const { [conceptId]: _removed, ...rest } = prev
      return rest
    })
  }

  const renderConceptCard = (concept) => {
    const quantity = cartItems[concept.id]?.quantity || 0

    return (
      <article key={concept.id} className={`rounded-[32px] p-6 backdrop-blur ${cardShellClass}`}>
        <div
          className={`mb-4 h-48 rounded-[28px] bg-gradient-to-br ${
            lightsOff
              ? 'from-white/15 via-[#ff7bd5]/15 to-transparent'
              : 'from-[#f4e7ff]/80 via-[#ffe3f6]/60 to-transparent'
          }`}
        />
        <p className={`text-[0.6rem] uppercase tracking-[0.38em] ${cardSubtleText}`}>{concept.label}</p>
        <h2 className={`mt-2 text-xl font-semibold ${lightsOff ? 'text-white' : 'text-[#1f1b1f]'}`}>
          {concept.title}
        </h2>
        <p className={`mt-3 text-sm ${cardSubtleText}`}>{concept.blurb}</p>
        <div className="mt-4 flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <span className={`text-xs uppercase tracking-[0.4em] ${cardSubtleText}`}>Edition</span>
            <span className="text-lg font-semibold tracking-[0.1em]">
              ${concept.price.toLocaleString(undefined, { minimumFractionDigits: 0 })}
            </span>
          </div>
          {quantity === 0 ? (
            <button
              type="button"
              onClick={() => addToCart(concept)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] transition ${cartButtonStyles}`}
            >
              Add to Cart
            </button>
          ) : (
            <div className="flex flex-col gap-3">
              <div
                className={`flex items-center justify-between rounded-full border px-4 py-2 text-sm ${
                  lightsOff ? 'border-white/15' : 'border-[#1f1b1f]/10 bg-white/60'
                }`}
              >
                <span className="uppercase tracking-[0.3em]">Qty</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className={`h-8 w-8 rounded-full border text-lg leading-none transition ${quantityButtonStyles}`}
                    onClick={() => decrementItem(concept.id)}
                    aria-label="Decrease quantity"
                  >
                    –
                  </button>
                  <span className="text-base font-semibold">{quantity}</span>
                  <button
                    type="button"
                    className={`h-8 w-8 rounded-full border text-lg leading-none transition ${quantityButtonStyles}`}
                    onClick={() => incrementItem(concept.id)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeItem(concept.id)}
                className="text-xs uppercase tracking-[0.35em] text-[#ff7bd5] transition hover:opacity-80"
              >
                Remove item
              </button>
            </div>
          )}
        </div>
      </article>
    )
  }

  return (
    <div className={`relative min-h-screen overflow-hidden ${pageBackground}`}>
      <div
        className={`fixed left-4 top-24 z-30 hidden items-center px-6 transition-opacity duration-200 sm:flex sm:left-6 ${floatingControlsVisibility}`}
      >
        <a
          href="/"
          className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition ${cartButtonStyles}`}
        >
          Home
        </a>
      </div>
      <div
        className={`fixed right-4 top-24 z-30 hidden items-center gap-3 px-6 transition-opacity duration-200 sm:flex sm:right-6 ${floatingControlsVisibility}`}
      >
        <button
          type="button"
          onClick={() => setIsCartOpen((prev) => !prev)}
          aria-pressed={isCartOpen}
          aria-label="Open cart"
          className={`relative z-20 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition ${cartButtonStyles}`}
        >
          Cart
          {hasCartItems && (
            <span
              className={`absolute left-0 top-0 z-30 inline-flex h-5 min-w-[26px] items-center justify-center rounded-full border px-2 text-[11px] font-semibold leading-none shadow-[0_8px_24px_rgba(0,0,0,0.25)] backdrop-blur-md ${cartBadgeStyles}`}
              style={{ transform: 'translate(54px, -15px)' }}
            >
              {cartCount}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setLightsOff((prev) => !prev)}
          aria-pressed={lightsOff}
          className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition ${lightToggleStyles}`}
        >
          {lightsOff ? 'Lights On' : 'Lights Off'}
        </button>
      </div>
      <div
        className={`fixed right-0 top-24 z-30 flex items-center justify-end gap-2 transition-opacity duration-200 sm:hidden ${floatingControlsVisibility}`}
      >
        <button
          type="button"
          onClick={() => setIsCartOpen((prev) => !prev)}
          aria-pressed={isCartOpen}
          className={`relative z-20 rounded-full border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.4em] transition ${cartButtonStyles}`}
        >
          Cart
          {hasCartItems && (
            <span
              className={`absolute left-0 top-0 z-30 inline-flex h-4 min-w-[22px] items-center justify-center rounded-full border px-1.5 text-[10px] font-semibold leading-none shadow-[0_8px_24px_rgba(0,0,0,0.25)] backdrop-blur-md ${cartBadgeStyles}`}
              style={{ transform: 'translate(54px, -15px)' }}
            >
              {cartCount}
            </span>
          )}
        </button>
        <button
          type="button"
          aria-label={`Toggle lights (${lightsOff ? 'turn on' : 'turn off'})`}
          onClick={() => setLightsOff((prev) => !prev)}
          aria-pressed={lightsOff}
          className={`rounded-l-full border border-r-0 px-1 py-3 text-[10px] font-semibold uppercase tracking-[0.4em] transition ${mobileHandleStyles}`}
          style={{ writingMode: 'vertical-rl' }}
        >
          {lightsOff ? 'Lights On' : 'Lights Off'}
        </button>
      </div>
      <div
        className={`fixed left-3 top-24 z-30 flex items-center transition-opacity duration-200 sm:hidden ${floatingControlsVisibility}`}
      >
        <a
          href="/"
          className={`rounded-full border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.4em] transition ${cartButtonStyles}`}
        >
          Home
        </a>
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center sm:hidden">
        <div className="relative h-[260px] w-[420px] max-w-none -translate-y-12 scale-x-[0.92] scale-y-[0.65]">
          <div className="absolute inset-x-[-18%] top-6 mx-auto h-[190px] rotate-[-6deg] rounded-[999px] bg-[radial-gradient(circle_at_26%_35%,rgba(255,205,70,0.55),rgba(255,135,20,0.35),rgba(255,205,70,0))] blur-[65px]" />
          <div className="absolute inset-x-[-6%] top-26 mx-auto h-[185px] rotate-[4deg] rounded-[999px] bg-[radial-gradient(circle_at_52%_72%,rgba(255,115,35,0.55),rgba(255,85,20,0.35),rgba(255,115,35,0))] blur-[60px]" />
          <div className="absolute inset-x-[8%] top-30 mx-auto h-[185px] rotate-[16deg] rounded-[999px] bg-[radial-gradient(circle_at_80%_32%,rgba(255,100,210,0.6),rgba(255,60,160,0.4),rgba(255,100,210,0))] blur-[70px]" />
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 hidden justify-center sm:flex">
        <div className="relative h-72 w-[760px] max-w-full -translate-y-6">
          <div className="absolute inset-x-0 top-2 mx-auto h-64 rounded-[999px] bg-[radial-gradient(circle_at_15%_30%,rgba(255,205,133,0.45),rgba(255,205,133,0))] blur-[55px]" />
          <div className="absolute inset-x-[-20%] top-6 mx-auto h-60 rotate-[12deg] rounded-[999px] bg-[radial-gradient(circle_at_80%_30%,rgba(255,115,201,0.6),rgba(255,115,201,0))] blur-[85px]" />
          <div className="absolute inset-x-[-25%] top-0 mx-auto h-64 rotate-[-6deg] rounded-[999px] bg-[radial-gradient(circle_at_30%_70%,rgba(255,165,0,0.35),rgba(255,165,0,0))] blur-[95px]" />
        </div>
      </div>
      <main className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col gap-16 px-4 pb-24 pt-28 sm:pt-32">
        <header className="text-center">
          <img
            src="/Wavythought Clear Logo-01.png"
            alt="WavyThought logo"
            className="mx-auto opacity-90"
            style={{ width: '400px', maxWidth: '95vw', height: 'auto' }}
          />
          <p
            className={`text-xs uppercase tracking-[0.42em] ${heroMutedText}`}
            style={{ marginTop: '30px' }}
          >
            WavyThought Studio
          </p>
          <h1 className="mt-3 text-4xl font-semibold uppercase tracking-[0.35em] sm:text-5xl">
            Shop Experiments
          </h1>
          <p className={`mx-auto mt-5 max-w-2xl text-base sm:text-lg ${heroMutedText}`}>
            A rotating selection of generative objects, lighting concepts, and limited drops. Reach out
            for commissions while we finish wiring up the cart.
          </p>
        </header>
        <section
          className={`space-y-5 rounded-[40px] border p-6 text-center text-xs uppercase tracking-[0.38em] backdrop-blur md:flex md:items-center md:justify-between md:space-y-0 md:text-left ${infoPanelClass}`}
        >
          <p className={heroMutedText}>{bannerCopy}</p>
          <span className={`text-[0.55rem] ${infoPanelBadge}`}>Direct access via /shop only</span>
        </section>
        <div className="relative">
          <div
            className="pointer-events-none absolute top-6 hidden w-60 sm:block -z-10"
            style={{ left: '-220px' }}
          >
            <img
              src={smileyFaceSrc}
              alt="Smiley face graphic"
              className="w-full rotate-[-16deg] opacity-90 drop-shadow-[0_25px_60px_rgba(0,0,0,0.35)]"
            />
          </div>
          <section className="relative z-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {conceptCatalog.map(renderConceptCard)}
          </section>
          <div className="pointer-events-none mt-6 flex justify-center sm:hidden -z-10">
            <img
              src={smileyFaceSrc}
              alt="Smiley face graphic"
              className="h-24 w-24 rotate-[-12deg] opacity-80 drop-shadow-[0_15px_35px_rgba(0,0,0,0.25)]"
            />
          </div>
        </div>
        <div
          className={`hidden flex-col items-center gap-4 px-6 text-base sm:mt-12 sm:flex ${lightsOff ? 'text-white' : 'text-[#c6a7d9]'}`}
        >
          <div className="flex items-center justify-center gap-8">
            <a
              href="https://www.instagram.com/wavythought/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center transition hover:text-[#ff7bd5]"
              aria-label="Open Instagram"
            >
              <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <rect x="2.5" y="2.5" width="19" height="19" rx="6" ry="6" />
                <circle cx="12" cy="12" r="4.8" />
                <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a
              href="mailto:hello@wavythought.com"
              className="inline-flex items-center justify-center transition hover:text-[#ff7bd5]"
              aria-label="Send an email"
            >
              <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <rect x="2.8" y="4.2" width="18.4" height="15.6" rx="3" />
                <path d="M3 5.5l8.2 5.8c0.9 0.65 2.3 0.65 3.2 0L22 5.5" />
              </svg>
            </a>
          </div>
        </div>
        <footer className={`px-6 pb-16 pt-12 text-xs ${lightsOff ? 'text-white/70' : 'text-[#3c3c3c]'}`}>
          <div className="mx-auto flex max-w-5xl flex-col gap-8 text-center uppercase tracking-[0.35em] sm:flex-row sm:items-start sm:justify-between sm:text-left sm:gap-4">
            <div
              className={`flex items-center justify-center gap-5 tracking-normal sm:hidden ${lightsOff ? 'text-white' : 'text-[#c6a7d9]'}`}
            >
              <a
                href="https://www.instagram.com/wavythought/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center transition hover:text-[#ff7bd5]"
                aria-label="Open Instagram"
              >
                <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <rect x="2.5" y="2.5" width="19" height="19" rx="6" ry="6" />
                  <circle cx="12" cy="12" r="4.8" />
                  <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a
                href="mailto:hello@wavythought.com"
                className="inline-flex items-center justify-center transition hover:text-[#ff7bd5]"
                aria-label="Send an email"
              >
                <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <rect x="2.8" y="4.2" width="18.4" height="15.6" rx="3" />
                  <path d="M3 5.5l8.2 5.8c0.9 0.65 2.3 0.65 3.2 0L22 5.5" />
                </svg>
              </a>
            </div>
            <p className="sm:mt-0">&copy; 2025 WAVYTHOUGHT LLC. ALL RIGHTS RESERVED.</p>
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

      </main>
      {isCartOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center sm:justify-end">
          <button
            type="button"
            aria-label="Close cart"
            onClick={() => setIsCartOpen(false)}
            className={`absolute inset-0 ${lightsOff ? 'bg-[#020103]/95' : 'bg-black/75'}`}
          />
          <aside
            className="relative z-50 flex h-full w-full justify-end px-4 py-6 sm:p-10"
            role="dialog"
            aria-modal="true"
            aria-label="Cart"
          >
            <div className={`relative h-full w-[300px] border-l p-6 pb-16 shadow-2xl ${cartPanelClass}`}>
              <button
                type="button"
                aria-label="Close cart"
                className="absolute right-6 top-6 text-xs uppercase tracking-[0.35em] text-[#ff7bd5] transition hover:opacity-80"
                onClick={() => setIsCartOpen(false)}
              >
                Close
              </button>
          <div className="mt-10 flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.4em]">{cartBadgeLabel}</p>
              <p className="text-2xl font-semibold">
              ${cartSubtotal.toLocaleString(undefined, { minimumFractionDigits: 0 })}
            </p>
            </div>
          </div>
              <div className="mt-24 flex flex-col gap-4 overflow-y-auto pr-1 pt-24">
                {hasCartItems ? (
                  Object.entries(cartItems).map(([id, item]) => (
                    <div key={id} className="rounded-2xl border border-white/15 p-4">
                      <div className="flex items-start gap-3">
                        <div
                          className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-[22px] border border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
                          style={{
                            backgroundImage: lightsOff
                              ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 120, 210, 0.45), rgba(120, 90, 255, 0.35))'
                              : 'linear-gradient(135deg, rgba(244, 231, 255, 0.95), rgba(255, 213, 241, 0.9), rgba(140, 89, 255, 0.75))',
                          }}
                        />
                        <div className="flex-1">
                          <div>
                            <p className={`text-[0.55rem] uppercase tracking-[0.35em] ${cardSubtleText}`}>{item.label}</p>
                            <p className="text-base font-semibold">{item.title}</p>
                          </div>
                          <div className="mt-3 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                className="h-8 w-8 rounded-full bg-transparent text-lg leading-none text-current transition hover:opacity-70"
                                onClick={() => decrementItem(id)}
                                aria-label="Decrease quantity"
                              >
                                -
                              </button>
                              <span className="text-sm uppercase tracking-[0.35em]">{item.quantity}</span>
                              <button
                                type="button"
                                className="h-8 w-8 rounded-full bg-transparent text-lg leading-none text-current transition hover:opacity-70"
                                onClick={() => incrementItem(id)}
                                aria-label="Increase quantity"
                              >
                                +
                              </button>
                            </div>
                            <div className="flex items-center gap-3 text-right">
                              <span className="text-sm uppercase tracking-[0.35em]">
                                ${(item.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 0 })}
                              </span>
                              <button
                                type="button"
                                aria-label="Remove item"
                                className="text-xl leading-none text-[#ff7bd5] transition hover:opacity-70"
                                onClick={() => removeItem(id)}
                              >
                                ×
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
              <p className={`text-center text-sm ${cartEmptyText}`}>No items yet — explore the concepts below.</p>
            )}
          </div>
              <div className="sticky bottom-6 mt-10 space-y-3 border-t border-white/10 bg-inherit/90 pt-5 backdrop-blur-sm">
            <div className="flex items-center justify-between text-sm uppercase tracking-[0.35em]">
              <span>Subtotal</span>
              <span>${cartSubtotal.toLocaleString(undefined, { minimumFractionDigits: 0 })}</span>
            </div>
            <button
              type="button"
              className={`w-full rounded-full border px-4 py-3 text-xs font-semibold uppercase tracking-[0.35em] transition ${
                lightsOff
                  ? 'border-white/40 text-white hover:bg-white/10'
                  : 'border-[#1f1b1f] text-[#1f1b1f] hover:bg-[#1f1b1f] hover:text-white'
              } ${hasCartItems ? '' : 'cursor-not-allowed opacity-60'}`}
              disabled={!hasCartItems}
            >
              {hasCartItems ? 'Contact to Purchase' : 'Add an item to start'}
            </button>
          </div>
        </div>
      </aside>
        </div>
      )}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className={`fixed bottom-6 right-6 z-40 rounded-full border p-3 shadow-lg transition-all duration-200 ${scrollToTopButtonStyles} ${scrollToTopButtonVisibility}`}
      >
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 19V5" />
          <path d="M5 12l7-7 7 7" />
        </svg>
      </button>
    </div>
  )
}

export default Shop
