import { useEffect, useMemo, useRef, useState } from 'react'
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
    images: [
      '/Work Samples/disk 1.JPEG',
      '/Work Samples/disk 2.JPEG',
      '/Work Samples/disk 3.JPEG',
    ],
  },
  {
    id: 'concept-02',
    label: 'Concept 02',
    title: 'Layered Wave Grid',
    price: 520,
    blurb: 'Stacked acrylic gradients shaped by generative wave equations.',
    images: [
      '/Work Samples/blazers 00.JPEG',
      '/Work Samples/blazers 01.JPEG',
      '/Work Samples/blazers 02.JPEG',
    ],
  },
  {
    id: 'concept-03',
    label: 'Concept 03',
    title: 'Chromatic Bloom Lamp',
    price: 640,
    blurb: 'Blooming light sculpture with programmable gradients.',
    images: [
      '/Work Samples/mountain 01.JPEG',
      '/Work Samples/mountain 03.JPEG',
      '/Work Samples/lamp 01.JPEG',
    ],
  },
  {
    id: 'concept-04',
    label: 'Concept 04',
    title: 'Tactile Foam Relief',
    price: 390,
    blurb: 'Hand-finished relief capturing simulated foam turbulence.',
    images: [
      '/Work Samples/card holder.JPEG',
      '/Work Samples/facet tray.JPEG',
      '/Work Samples/airtag keychain.JPEG',
    ],
  },
  {
    id: 'concept-05',
    label: 'Concept 05',
    title: 'Mirror Wave Cabinet',
    price: 1200,
    blurb: 'Furniture study bending reflective planes through CNC carving.',
    images: [
      '/Work Samples/Plank 04.JPEG',
      '/Work Samples/Plank 05.JPEG',
      '/Work Samples/plank 01.JPEG',
    ],
  },
  {
    id: 'concept-06',
    label: 'Concept 06',
    title: 'Sound Reactive Wall',
    price: 950,
    blurb: 'LED tessellation that responds to real-time ambient sound.',
    images: [
      '/Work Samples/shoe 01.JPEG',
      '/Work Samples/shoe 02.JPEG',
      '/Work Samples/shoe 03.JPEG',
    ],
  },
]

const sortOptions = [
  { value: 'relevant', label: 'Most Relevant' },
  { value: 'price-low-high', label: 'Price: Low to High' },
  { value: 'price-high-low', label: 'Price: High to Low' },
]

const Shop = () => {
  const [lightsOff, setLightsOff] = useState(() => getSystemPrefersDark())
  const [cartItems, setCartItems] = useState({})
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [showScrollToTop, setShowScrollToTop] = useState(false)
  const [activeGalleryConcept, setActiveGalleryConcept] = useState(null)
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0)
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false)
  const [activeSort, setActiveSort] = useState('relevant')
  const sortMenuRef = useRef(null)

  useEffect(() => {
    document.title = 'WavyThought - Shop'
  }, [])

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
    if (!isSortMenuOpen) return undefined
    const handlePointerDown = (event) => {
      if (!sortMenuRef.current) return
      if (!sortMenuRef.current.contains(event.target)) {
        setIsSortMenuOpen(false)
      }
    }
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsSortMenuOpen(false)
      }
    }
    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isSortMenuOpen])

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

  useEffect(() => {
    if (!activeGalleryConcept) return undefined
    if (typeof document === 'undefined') return undefined
    const { body } = document
    if (!body) return undefined
    const currentLocks = Number(body.dataset.modalLocks || '0')
    if (currentLocks === 0) {
      body.dataset.prevOverflow = body.style.overflow || ''
      body.style.overflow = 'hidden'
    }
    body.dataset.modalLocks = String(currentLocks + 1)
    body.classList.add('modal-open')
    return () => {
      const locks = Number(body.dataset.modalLocks || '1')
      const next = Math.max(0, locks - 1)
      body.dataset.modalLocks = String(next)
      if (next === 0) {
        body.style.overflow = body.dataset.prevOverflow || ''
        delete body.dataset.prevOverflow
        body.classList.remove('modal-open')
      }
    }
  }, [activeGalleryConcept])

  useEffect(() => {
    if (!activeGalleryConcept) return undefined
    const handleKeyDown = (event) => {
      const imageCount = activeGalleryConcept.images?.length || 0
      if (event.key === 'Escape') {
        event.preventDefault()
        setActiveGalleryConcept(null)
        setActiveGalleryIndex(0)
      } else if (event.key === 'ArrowRight' && imageCount > 1) {
        event.preventDefault()
        setActiveGalleryIndex((prev) => (prev + 1) % imageCount)
      } else if (event.key === 'ArrowLeft' && imageCount > 1) {
        event.preventDefault()
        setActiveGalleryIndex((prev) => (prev - 1 + imageCount) % imageCount)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [activeGalleryConcept])

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
  const cartCloseButtonStyles = lightsOff
    ? 'border-white/20 text-white hover:bg-white/10'
    : 'border-[#1f1b1f]/20 text-[#1f1b1f] hover:bg-[#f4eef9]'
  const sortButtonStyles = lightsOff
    ? 'border-transparent bg-white/10 text-white hover:bg-white/20'
    : 'border-transparent bg-white/80 text-[#1f1b1f] shadow-[0_10px_25px_rgba(31,27,31,0.08)] hover:bg-white'
  const sortPanelClass = lightsOff
    ? 'bg-[#0f0d16]/95 text-white border-white/15 shadow-[0_25px_70px_rgba(0,0,0,0.7)]'
    : 'bg-white text-[#1f1b1f] border-[#1f1b1f]/10 shadow-[0_20px_60px_rgba(31,27,31,0.15)]'
  const sortOptionHover = lightsOff ? 'hover:bg-white/10' : 'hover:bg-[#f7f2fb]'
  const cardActionButtonBase = 'w-full rounded-full border px-4 py-3 text-sm font-semibold uppercase tracking-[0.3em] transition text-center'
  const cardRemoveButtonStyles = lightsOff
    ? 'border-transparent bg-[linear-gradient(120deg,rgba(255,190,120,0.95),rgba(255,110,175,0.92))] text-white shadow-[0_8px_18px_rgba(255,145,130,0.32)] hover:opacity-90'
    : 'border-transparent bg-[linear-gradient(120deg,rgba(255,190,120,0.95),rgba(255,110,175,0.92))] text-[#1b1a1e] shadow-[0_8px_18px_rgba(255,145,130,0.32)] hover:opacity-90'
  const cartPanelClass = lightsOff
    ? 'border-white/15 bg-white/5 text-white/90 shadow-[0_35px_120px_rgba(0,0,0,0.65)]'
    : 'border-[#1f1b1f]/15 bg-white/95 text-[#1f1b1f]/90 shadow-[0_35px_80px_rgba(31,27,31,0.12)]'
  const cartDividerClass = lightsOff ? 'border-white/10' : 'border-[#1f1b1f]/10'
  const cartItemBorderClass = lightsOff ? 'border-white/15' : 'border-[#1f1b1f]/15'
  const cartFooterShell = lightsOff ? 'border-white/15 bg-white/5' : 'border-[#1f1b1f]/15 bg-white/95'
  const cartEmptyText = lightsOff ? 'text-white/60' : 'text-[#5a4b64]'
  const cartBadgeStyles = lightsOff
    ? 'border-transparent bg-[linear-gradient(120deg,rgba(255,190,120,0.95),rgba(255,110,175,0.92))] text-white shadow-[0_8px_18px_rgba(255,145,130,0.32)]'
    : 'border-transparent bg-[linear-gradient(120deg,rgba(255,190,120,0.95),rgba(255,110,175,0.92))] text-[#1b1a1e] shadow-[0_8px_18px_rgba(255,145,130,0.32)]'
  const floatingControlsVisibility = isCartOpen ? 'pointer-events-none opacity-0' : 'opacity-100'
  const smileyFaceSrc = '/Single smile.png'
  const scrollToTopButtonStyles = lightsOff
    ? 'border-white/40 bg-white/10 text-white backdrop-blur-lg shadow-[0_8px_30px_rgba(0,0,0,0.35)] hover:bg-white/20'
    : 'border-[#1f1b1f]/15 bg-[#fdfcfc]/40 text-[#1f1b1f] backdrop-blur-lg shadow-[0_12px_40px_rgba(31,27,31,0.2)] hover:bg-[#fdfcfc]/60'
  const scrollToTopButtonVisibility =
    showScrollToTop && !isCartOpen
      ? 'opacity-100 pointer-events-auto translate-y-0'
      : 'opacity-0 pointer-events-none translate-y-4'
  const sortPanelVisibility = isSortMenuOpen
    ? 'pointer-events-auto opacity-100 translate-y-0'
    : 'pointer-events-none opacity-0 -translate-y-2'

  const sortedConcepts = useMemo(() => {
    if (activeSort === 'price-low-high') {
      return [...conceptCatalog].sort((a, b) => a.price - b.price)
    }
    if (activeSort === 'price-high-low') {
      return [...conceptCatalog].sort((a, b) => b.price - a.price)
    }
    return conceptCatalog
  }, [activeSort])

  const currentSortLabel =
    sortOptions.find((option) => option.value === activeSort)?.label || 'Most Relevant'
  const sortMenuId = 'sort-menu'

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
  const heroLogoSrc = lightsOff ? '/Wavythought Clear Logo white-01.png' : '/Wavythought Clear Logo-01.png'
  const activeGalleryImages = activeGalleryConcept?.images || []
  const activeGalleryImageSrc = activeGalleryImages[activeGalleryIndex] || null
  const galleryOverlayClass = lightsOff
    ? 'bg-[radial-gradient(circle_at_center,rgba(8,6,18,0.95),rgba(2,1,6,0.9))] backdrop-blur'
    : 'bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.85),rgba(210,205,230,0.82))] backdrop-blur'
  const galleryPanelClass = lightsOff
    ? 'border border-white/20 bg-white/5 text-white shadow-[0_55px_160px_rgba(0,0,0,0.7)] backdrop-blur-[22px]'
    : 'border border-white/60 bg-white/30 text-[#1f1b1f] shadow-[0_45px_140px_rgba(31,27,31,0.18)] backdrop-blur-[22px]'
  const galleryCloseButtonClass = lightsOff
    ? 'border-white/35 bg-black/60 text-white hover:bg-black/75'
    : 'border-white/70 bg-white/70 text-[#1f1b1f] hover:bg-white'
  const galleryNavButtonBase = 'h-16 w-11 items-center justify-center rounded-full border text-lg transition'
  const galleryNavButtonClass = lightsOff
    ? `${galleryNavButtonBase} border-white/25 bg-black/35 text-white hover:bg-black/60 shadow-[0_6px_24px_rgba(0,0,0,0.5)]`
    : `${galleryNavButtonBase} border-white/70 bg-white/80 text-[#1f1b1f] hover:bg-white shadow-[0_6px_24px_rgba(31,27,31,0.18)]`
  const galleryThumbBaseClass = lightsOff ? 'border-white/20 bg-white/5' : 'border-[#1f1b1f]/15 bg-white'
  const galleryThumbActiveClass = lightsOff ? 'ring-2 ring-white/90' : 'ring-2 ring-[#1f1b1f]'
  const galleryImageShellClass = lightsOff
    ? 'border-white/20 bg-black/25 shadow-[0_35px_90px_rgba(0,0,0,0.55)]'
    : 'border-white/70 bg-white shadow-[0_35px_90px_rgba(31,27,31,0.18)]'

  const openConceptGallery = (concept, startIndex = 0) => {
    if (!concept?.images || concept.images.length === 0) return
    const boundedIndex = Math.min(Math.max(startIndex, 0), concept.images.length - 1)
    setActiveGalleryConcept(concept)
    setActiveGalleryIndex(boundedIndex)
  }

  const closeConceptGallery = () => {
    setActiveGalleryConcept(null)
    setActiveGalleryIndex(0)
  }

  const showGalleryNext = () => {
    if (!activeGalleryConcept?.images?.length) return
    setActiveGalleryIndex((prev) => (prev + 1) % activeGalleryConcept.images.length)
  }

  const showGalleryPrev = () => {
    if (!activeGalleryConcept?.images?.length) return
    setActiveGalleryIndex((prev) => (prev - 1 + activeGalleryConcept.images.length) % activeGalleryConcept.images.length)
  }

  const selectGalleryImage = (index) => {
    if (!activeGalleryConcept?.images?.length) return
    const imageCount = activeGalleryConcept.images.length
    const boundedIndex = Math.max(0, Math.min(index, imageCount - 1))
    setActiveGalleryIndex(boundedIndex)
  }

  const handleSortSelect = (value) => {
    setActiveSort(value)
    setIsSortMenuOpen(false)
  }

  const addToCart = (concept) => {
    setCartItems((prev) => {
      const nextQuantity = (prev[concept.id]?.quantity || 0) + 1
      return {
        ...prev,
        [concept.id]: {
          quantity: nextQuantity,
          title: concept.title,
          price: concept.price,
          label: concept.label,
          image: concept.images?.[0] || null,
        },
      }
    })
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

  const clearCart = () => {
    setCartItems({})
  }

  const renderConceptCard = (concept) => {
    const quantity = cartItems[concept.id]?.quantity || 0
    const conceptImages = concept.images || []
    const primaryImageSrc = conceptImages[0] || null
    const hasConceptImages = conceptImages.length > 0

    return (
      <article key={concept.id} className={`flex h-full flex-col rounded-[32px] p-6 backdrop-blur ${cardShellClass}`}>
        <button
          type="button"
          onClick={hasConceptImages ? () => openConceptGallery(concept) : undefined}
          disabled={!hasConceptImages}
          className={`group relative mb-4 w-full overflow-hidden rounded-[28px] border transition ${
            lightsOff
              ? 'border-white/15 bg-white/5'
              : 'border-[#1f1b1f]/10 bg-white/70'
          } ${hasConceptImages ? 'cursor-pointer hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff7bd5]' : 'cursor-not-allowed opacity-70'} aspect-square flex items-center justify-center`}
          aria-label={hasConceptImages ? `View ${concept.title} gallery` : undefined}
        >
          {primaryImageSrc ? (
            <img src={primaryImageSrc} alt={`${concept.title} preview`} className="h-full w-full object-cover" loading="lazy" />
          ) : (
            <div
              className={`h-full w-full bg-gradient-to-br ${
                lightsOff
                  ? 'from-white/15 via-[#ff7bd5]/15 to-transparent'
                  : 'from-[#f4e7ff]/80 via-[#ffe3f6]/60 to-transparent'
              }`}
            />
          )}
          {hasConceptImages && (
            <span className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/40 px-4 py-1 text-[0.55rem] uppercase tracking-[0.35em] text-white opacity-0 transition group-hover:opacity-100">
              View
            </span>
          )}
        </button>
        <div className="flex flex-1 flex-col">
          <p className={`text-[0.6rem] uppercase tracking-[0.38em] ${cardSubtleText}`}>{concept.label}</p>
          <h2 className={`mt-2 text-xl font-semibold ${lightsOff ? 'text-white' : 'text-[#1f1b1f]'}`}>
          {concept.title}
        </h2>
          <p className={`mt-3 text-sm ${cardSubtleText}`}>{concept.blurb}</p>
          <div className="mt-4 flex flex-1 flex-col">
          <div className="flex flex-col gap-1">
            <span className={`text-xs uppercase tracking-[0.4em] ${cardSubtleText}`}>Edition</span>
            <span className="text-lg font-semibold tracking-[0.1em]">
              ${concept.price.toLocaleString(undefined, { minimumFractionDigits: 0 })}
            </span>
          </div>
          <div className="mt-auto flex flex-col gap-3 pt-4">
            {quantity === 0 ? (
              <button
                type="button"
                onClick={() => addToCart(concept)}
                className={`${cardActionButtonBase} ${cartButtonStyles}`}
              >
                Add to Cart
              </button>
            ) : (
              <button
                type="button"
                onClick={() => removeItem(concept.id)}
                className={`${cardActionButtonBase} ${cardRemoveButtonStyles}`}
              >
                Remove item
              </button>
            )}
          </div>
        </div>
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
              className={`absolute left-0 top-0 z-30 inline-flex h-6 w-6 items-center justify-center rounded-full border text-[10px] font-semibold leading-none shadow-[0_8px_24px_rgba(0,0,0,0.25)] backdrop-blur-md ${cartBadgeStyles}`}
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
              className={`absolute left-0 top-0 z-30 inline-flex h-5 w-5 items-center justify-center rounded-full border text-[9px] font-semibold leading-none shadow-[0_8px_24px_rgba(0,0,0,0.25)] backdrop-blur-md ${cartBadgeStyles}`}
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
            src={heroLogoSrc}
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
          <div className="relative z-10">
            <div className="mb-4 flex justify-end">
              <div className="relative" ref={sortMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsSortMenuOpen((prev) => !prev)}
                  aria-expanded={isSortMenuOpen}
                  aria-controls={sortMenuId}
                  aria-haspopup="true"
                  className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition ${sortButtonStyles}`}
                >
                  Filter
                </button>
                <div
                  id={sortMenuId}
                  role="menu"
                  aria-label="Filter options"
                  className={`absolute right-0 top-12 w-56 origin-top-right rounded-3xl border p-4 text-left text-[0.7rem] uppercase tracking-[0.3em] transition-transform transition-opacity duration-150 ${sortPanelClass} ${sortPanelVisibility} z-30`}
                >
                  <p className={`text-[0.6rem] ${lightsOff ? 'text-white/60' : 'text-[#6f5a82]'}`}>Sort by</p>
                  <div className="mt-3 flex flex-col gap-1">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        role="menuitem"
                        onClick={() => handleSortSelect(option.value)}
                        className={`rounded-2xl px-3 py-2 text-left text-[0.65rem] font-semibold tracking-[0.25em] transition ${sortOptionHover} ${
                          option.value === activeSort
                            ? lightsOff
                              ? 'bg-white/15 text-white'
                              : 'bg-[#f4eef9] text-[#1f1b1f]'
                            : lightsOff
                            ? 'text-white/80'
                            : 'text-[#4b3a53]'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sortedConcepts.map(renderConceptCard)}
            </section>
          </div>
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
      {activeGalleryConcept && (
        <div
          className={`fixed inset-0 z-[80] flex items-center justify-center px-4 py-8 ${galleryOverlayClass}`}
          onClick={closeConceptGallery}
        >
          <section
            className={`relative w-full max-w-4xl rounded-[36px] p-5 sm:p-8 ${galleryPanelClass}`}
            role="dialog"
            aria-modal="true"
            aria-label={`${activeGalleryConcept.title} gallery`}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close gallery"
              onClick={closeConceptGallery}
              className={`absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border text-lg font-semibold transition ${galleryCloseButtonClass}`}
            >
              x
            </button>
            <div className="space-y-5 pt-6 sm:space-y-6 sm:pt-2">
              <div className="text-center">
                <p className={`text-[0.6rem] uppercase tracking-[0.35em] ${cardSubtleText}`}>{activeGalleryConcept.label}</p>
                <h2 className="mt-2 text-2xl font-semibold">{activeGalleryConcept.title}</h2>
                <p className={`mt-2 text-sm ${lightsOff ? 'text-white/70' : 'text-[#4f4656]'}`}>{activeGalleryConcept.blurb}</p>
              </div>
              <div className="relative">
                <div
                  className={`relative mx-auto w-full max-w-3xl overflow-hidden rounded-[32px] border ${galleryImageShellClass}`}
                  style={{ maxHeight: '70vh' }}
                >
                  <div className="aspect-square w-full">
                    {activeGalleryImageSrc ? (
                      <img
                        src={activeGalleryImageSrc}
                        alt={`${activeGalleryConcept.title} image ${activeGalleryIndex + 1} of ${activeGalleryImages.length}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div
                        className={`h-full w-full bg-gradient-to-br ${
                          lightsOff
                            ? 'from-white/15 via-[#ff7bd5]/15 to-transparent'
                            : 'from-[#f4e7ff]/80 via-[#ffe3f6]/60 to-transparent'
                        }`}
                      />
                    )}
                  </div>
                </div>
                {activeGalleryImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      aria-label="View previous image"
                      onClick={showGalleryPrev}
                      className={`absolute top-1/2 hidden -translate-y-1/2 sm:flex ${galleryNavButtonClass}`}
                      style={{ left: '-84px' }}
                    >
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      aria-label="View next image"
                      onClick={showGalleryNext}
                      className={`absolute top-1/2 hidden -translate-y-1/2 sm:flex ${galleryNavButtonClass}`}
                      style={{ right: '-84px' }}
                    >
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </>
                )}
              </div>
              <p className={`text-center text-[0.65rem] uppercase tracking-[0.35em] ${cardSubtleText}`}>
                Image {activeGalleryIndex + 1} of {activeGalleryImages.length || 1}
              </p>
              {activeGalleryImages.length > 1 && (
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {activeGalleryImages.map((imageSrc, index) => (
                    <button
                      key={`${activeGalleryConcept.id}-thumb-${index}`}
                      type="button"
                      onClick={() => selectGalleryImage(index)}
                      className={`h-16 w-16 overflow-hidden rounded-2xl border transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff7bd5] ${galleryThumbBaseClass} ${
                        index === activeGalleryIndex ? galleryThumbActiveClass : 'opacity-70 hover:opacity-100'
                      }`}
                      aria-label={`View ${activeGalleryConcept.title} image ${index + 1}`}
                    >
                      <img src={imageSrc} alt="" className="h-full w-full object-cover" loading="lazy" />
                    </button>
                  ))}
                </div>
              )}
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={() => addToCart(activeGalleryConcept)}
                  className={`rounded-full border px-8 py-3 text-sm font-semibold uppercase tracking-[0.3em] transition ${cartButtonStyles}`}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </section>
        </div>
      )}

      {isCartOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center sm:justify-end">
          <button
            type="button"
            aria-label="Close cart"
            onClick={() => setIsCartOpen(false)}
            className={`absolute inset-0 ${lightsOff ? 'bg-[#020103]/95' : 'bg-black/75'}`}
          />
          <aside
            className="relative z-50 flex h-full w-full justify-end pointer-events-none"
            role="dialog"
            aria-modal="true"
            aria-label="Cart"
          >
            <div className={`relative h-full w-full max-w-[420px] border-l p-5 pb-16 shadow-2xl pointer-events-auto ${cartPanelClass} sm:max-w-[460px]`}>
              <button
                type="button"
                aria-label="Close cart"
                className={`absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff7bd5] ${cartCloseButtonStyles}`}
                onClick={() => setIsCartOpen(false)}
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6 6 18" strokeLinecap="round" />
                  <path d="M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>
          <div className="mt-10 flex items-center justify-between gap-6 border-b border-white/10 pb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em]">{cartBadgeLabel}</p>
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
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-[12px] border border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={`${item.title} preview`}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div
                              className="h-full w-full"
                              style={{
                                backgroundImage: lightsOff
                                  ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 120, 210, 0.45), rgba(120, 90, 255, 0.35))'
                                  : 'linear-gradient(135deg, rgba(244, 231, 255, 0.95), rgba(255, 213, 241, 0.9), rgba(140, 89, 255, 0.75))',
                              }}
                            />
                          )}
                        </div>
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
                              <span className="text-sm uppercase tracking-[0.25em]">{item.quantity}</span>
                              <button
                                type="button"
                                className="h-8 w-8 rounded-full bg-transparent text-lg leading-none text-current transition hover:opacity-70"
                                onClick={() => incrementItem(id)}
                                aria-label="Increase quantity"
                              >
                                +
                              </button>
                            </div>
                            <div className="text-right">
                              <span className="text-sm uppercase tracking-[0.25em]">
                                ${(item.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 0 })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
              <p className={`text-center text-sm ${cartEmptyText}`}>No items yet - explore the concepts below.</p>
            )}
          </div>
              <div className="sticky bottom-6 mt-10 space-y-3 border-t border-white/10 bg-inherit/90 pt-5 backdrop-blur-sm">
            <div className="flex items-center justify-between text-sm uppercase tracking-[0.25em]">
              <span>Subtotal</span>
              <span>${cartSubtotal.toLocaleString(undefined, { minimumFractionDigits: 0 })}</span>
            </div>
            <button
              type="button"
              onClick={clearCart}
              className={`w-full rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition ${
                lightsOff
                  ? 'border-white/20 text-white hover:bg-white/10'
                  : 'border-[#1f1b1f]/20 text-[#1f1b1f] hover:bg-[#f4eef9]'
              } ${hasCartItems ? '' : 'cursor-not-allowed opacity-60'}`}
              disabled={!hasCartItems}
            >
              Clear Cart
            </button>
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
