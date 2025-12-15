import { useEffect, useMemo, useRef, useState } from 'react'
import './index.css'
import ModelViewerSlide from './components/ModelViewerSlide'

const getSystemPrefersDark = () => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return true
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

const conceptCatalog = [
  {
    id: 'concept-01',
    label: 'Concept 01',
    title: '6" WavyThought Sticker',
    price: 6,
    blurb: '6" matte vinyl sticker, perfect for giving your objects some wavy vibes.',
    imageFolder: 'concept-01',
  },
  {
    id: 'concept-02',
    label: 'Concept 02',
    title: 'Layered Wave Grid',
    price: 520,
    blurb: 'Stacked acrylic gradients shaped by generative wave equations.',
    imageFolder: 'concept-02',
  },
  {
    id: 'concept-03',
    label: 'Concept 03',
    title: 'Chromatic Bloom Lamp',
    price: 640,
    blurb: 'Blooming light sculpture with programmable gradients.',
    imageFolder: 'concept-03',
  },
  {
    id: 'concept-04',
    label: 'Concept 04',
    title: 'Tactile Foam Relief',
    price: 390,
    blurb: 'Hand-finished relief capturing simulated foam turbulence.',
    imageFolder: 'concept-04',
  },
  {
    id: 'concept-05',
    label: 'Concept 05',
    title: 'Mirror Wave Cabinet',
    price: 1200,
    blurb: 'Furniture study bending reflective planes through CNC carving.',
    imageFolder: 'concept-05',
  },
  {
    id: 'concept-06',
    label: 'Concept 06',
    title: 'Sound Reactive Wall',
    price: 950,
    blurb: 'LED tessellation that responds to real-time ambient sound.',
    imageFolder: 'concept-06',
  },
]

const productAssetModules = import.meta.glob('./assets/products/*/*', {
  eager: true,
  import: 'default',
})

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif']
const MODEL_EXTENSIONS = ['.usdz', '.glb', '.gltf']

const conceptAssetsByFolder = Object.entries(productAssetModules).reduce((acc, [path, url]) => {
  const match = path.match(/products\/([^/]+)\//)
  if (!match) return acc
  const conceptFolder = match[1]
  if (!acc[conceptFolder]) {
    acc[conceptFolder] = { images: [], models: [] }
  }
  const extensionMatch = path.match(/\.[^.]+$/)
  const extension = extensionMatch ? extensionMatch[0].toLowerCase() : ''
  if (IMAGE_EXTENSIONS.includes(extension)) {
    acc[conceptFolder].images.push({ path, url })
  } else if (MODEL_EXTENSIONS.includes(extension)) {
    acc[conceptFolder].models.push({ path, url })
  }
  return acc
}, {})

Object.keys(conceptAssetsByFolder).forEach((folderKey) => {
  const bucket = conceptAssetsByFolder[folderKey]
  bucket.images = bucket.images.sort((a, b) => a.path.localeCompare(b.path)).map((entry) => entry.url)
  bucket.models = bucket.models.sort((a, b) => a.path.localeCompare(b.path)).map((entry) => entry.url)
})

const getConceptAssets = (concept) => {
  if (!concept) return { images: [], models: [] }
  const folder = concept.imageFolder
  if (folder && conceptAssetsByFolder[folder]) {
    return conceptAssetsByFolder[folder]
  }
  const fallbackImages = Array.isArray(concept.images) ? concept.images : []
  return { images: fallbackImages, models: [] }
}

const getConceptImages = (concept) => getConceptAssets(concept).images
const getConceptModels = (concept) => getConceptAssets(concept).models
const getConceptSlides = (concept) => {
  if (!concept) return []
  const images = getConceptImages(concept)
  const models = getConceptModels(concept)
  const slides = []
  images.forEach((src, index) => {
    slides.push({
      type: 'image',
      src,
      key: `image-${index}`,
    })
  })
  models.forEach((src, index) => {
    const extension = src.split('?')[0].split('.').pop()?.toLowerCase() || ''
    slides.push({
      type: 'model',
      src,
      key: `model-${index}`,
      format: extension,
    })
  })
  return slides
}

const SHOPIFY_BUY_BUTTON_CONFIG = {
  scriptUrl: 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js',
  productId: '7944646787151',
  domain: 'wu3vyk-k9.myshopify.com',
  storefrontAccessToken: '6ca44531eca180e9b4594f70cc526427',
  moneyFormat: '%24%7B%7Bamount%7D%7D',
  hostIds: {
    card: 'product-component-1765833870392',
    modal: 'product-component-1765833870392-modal',
  },
}

const createShopifyProductOptions = (isDarkMode) => {
  const buttonTextColor = isDarkMode ? '#ffffff' : '#1f1b1f'
  const subtleTextColor = isDarkMode ? 'rgba(255,255,255,0.7)' : '#4b3a53'
  const gradientBackground =
    'linear-gradient(120deg, rgba(255,190,120,0.95), rgba(255,110,175,0.92))'
  const sharedButtonStyles = {
    'font-family': "Space Grotesk, 'Helvetica Neue', sans-serif",
    'font-size': '13px',
    'text-transform': 'uppercase',
    'letter-spacing': '0.35em',
    'border-radius': '999px',
    'padding-top': '14px',
    'padding-bottom': '14px',
    'padding-left': '34px',
    'padding-right': '34px',
    'border': '1px solid transparent',
    'background-color': 'transparent',
    'background-image': gradientBackground,
    'color': buttonTextColor,
    'box-shadow': 'none',
    'transition': 'transform 200ms ease, opacity 200ms ease',
    ':hover': {
      'transform': 'translateY(-1px)',
      'opacity': '0.9',
    },
    ':focus': {
      'outline': 'none',
      'box-shadow': isDarkMode
        ? '0 0 0 2px rgba(255, 190, 120, 0.45)'
        : '0 0 0 2px rgba(31, 27, 31, 0.35)',
    },
  }
  const sharedQuantityStyles = {
    'font-family': "Space Grotesk, 'Helvetica Neue', sans-serif",
    'font-size': '13px',
    'letter-spacing': '0.15em',
    'text-transform': 'uppercase',
    'border-radius': '999px',
    'padding-top': '12px',
    'padding-bottom': '12px',
    'padding-left': '18px',
    'padding-right': '18px',
    'border': `1px solid ${isDarkMode ? 'rgba(255,255,255,0.25)' : 'rgba(31,27,31,0.15)'}`,
    'color': buttonTextColor,
    'background-color': isDarkMode ? 'rgba(8,6,16,0.75)' : 'rgba(255,255,255,0.9)',
  }

  const productShellStyles = {
    'background-color': 'transparent',
    'text-align': 'center',
    'color': subtleTextColor,
  }

  return {
    product: {
      styles: {
        product: productShellStyles,
        button: sharedButtonStyles,
        quantityInput: sharedQuantityStyles,
      },
      contents: {
        img: false,
        title: false,
        price: false,
      },
      text: {
        button: 'Add to Cart',
      },
    },
    modalProduct: {
      contents: {
        img: false,
        imgWithCarousel: true,
        button: false,
        buttonWithQuantity: true,
      },
      styles: {
        product: {
          'background-color': isDarkMode ? 'rgba(5,4,10,0.6)' : 'rgba(255,255,255,0.8)',
          'border': isDarkMode ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(31,27,31,0.15)',
          'border-radius': '32px',
          'padding': '12px',
        },
        button: sharedButtonStyles,
        quantityInput: sharedQuantityStyles,
      },
      text: {
        button: 'Add to Cart',
      },
    },
    cart: {
      styles: {
        cart: {
          'background-color': isDarkMode ? 'rgba(6,5,14,0.94)' : '#ffffff',
          'border': isDarkMode ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(31,27,31,0.12)',
          'border-radius': '28px',
          'box-shadow': isDarkMode
            ? '0 35px 70px rgba(0,0,0,0.55)'
            : '0 35px 70px rgba(31,27,31,0.18)',
        },
        footer: {
          'background-color': 'transparent',
        },
        title: {
          'font-family': "Space Grotesk, 'Helvetica Neue', sans-serif",
          'letter-spacing': '0.25em',
          'text-transform': 'uppercase',
          'color': buttonTextColor,
        },
        lineItems: {
          'color': subtleTextColor,
        },
        button: sharedButtonStyles,
      },
      text: {
        total: 'Subtotal',
        button: 'Checkout',
      },
    },
    toggle: {
      styles: {
        toggle: {
          'font-family': "Space Grotesk, 'Helvetica Neue', sans-serif",
          'background-image': gradientBackground,
          'border': '1px solid transparent',
          'color': buttonTextColor,
          'text-transform': 'uppercase',
          'letter-spacing': '0.3em',
        },
        count: {
          'font-size': '13px',
          'color': buttonTextColor,
        },
      },
    },
  }
}

const sortOptions = [
  { value: 'relevant', label: 'Most Relevant' },
  { value: 'price-low-high', label: 'Price: Low to High' },
  { value: 'price-high-low', label: 'Price: High to Low' },
]

const Shop = () => {
  const [lightsOff, setLightsOff] = useState(() => getSystemPrefersDark())
  const [showScrollToTop, setShowScrollToTop] = useState(false)
  const [activeGalleryConcept, setActiveGalleryConcept] = useState(null)
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0)
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false)
  const [activeSort, setActiveSort] = useState('relevant')
  const sortMenuRef = useRef(null)
  const shopifyMountRequestRef = useRef(null)

  useEffect(() => {
    document.title = 'WavyThought - Shop'
  }, [lightsOff])

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
    if (typeof window === 'undefined' || typeof document === 'undefined') return undefined
    let isCancelled = false
    let detachScriptListener = null
    const scriptId = 'wavythought-shopify-buy-sdk'
    const { hostIds = {}, scriptUrl, domain, storefrontAccessToken, productId, moneyFormat } =
      SHOPIFY_BUY_BUTTON_CONFIG
    const hostIdList = Object.values(hostIds).filter(Boolean)
    const shopifyOptions = createShopifyProductOptions(lightsOff)

    const unmountShopifyButtons = () => {
      hostIdList.forEach((hostId) => {
        const node = document.getElementById(hostId)
        if (node) {
          delete node.dataset.shopifyMounted
          node.innerHTML = ''
        }
      })
    }

    const initializeShopifyButtons = () => {
      if (isCancelled) return
      const ShopifyBuy = window.ShopifyBuy
      if (!ShopifyBuy || !ShopifyBuy.UI) return
      const targetNodes = hostIdList
        .map((hostId) => document.getElementById(hostId))
        .filter((node) => node && node.dataset.shopifyMounted !== 'true')
      if (targetNodes.length === 0) return
      const client = ShopifyBuy.buildClient({
        domain,
        storefrontAccessToken,
      })
      ShopifyBuy.UI.onReady(client).then((ui) => {
        if (isCancelled) return
        targetNodes.forEach((node) => {
          if (!node || node.dataset.shopifyMounted === 'true') return
          ui.createComponent('product', {
            id: productId,
            node,
            moneyFormat,
            options: shopifyOptions,
          })
          node.dataset.shopifyMounted = 'true'
        })
      })
    }

    shopifyMountRequestRef.current = initializeShopifyButtons

    const attachScript = () => {
      let script = document.getElementById(scriptId)
      const handleScriptLoad = () => {
        initializeShopifyButtons()
      }
      if (!script) {
        script = document.createElement('script')
        script.id = scriptId
        script.async = true
        script.src = scriptUrl
        document.head.appendChild(script)
      }
      script.addEventListener('load', handleScriptLoad)
      detachScriptListener = () => {
        script?.removeEventListener('load', handleScriptLoad)
      }
    }

    if (window.ShopifyBuy?.UI) {
      initializeShopifyButtons()
    } else {
      attachScript()
      initializeShopifyButtons()
    }

    return () => {
      isCancelled = true
      if (typeof detachScriptListener === 'function') {
        detachScriptListener()
      }
      unmountShopifyButtons()
    }
  }, [])

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
      const slideCount = getConceptSlides(activeGalleryConcept).length
      if (event.key === 'Escape') {
        event.preventDefault()
        setActiveGalleryConcept(null)
        setActiveGalleryIndex(0)
      } else if (event.key === 'ArrowRight' && slideCount > 1) {
        event.preventDefault()
        setActiveGalleryIndex((prev) => (prev + 1) % slideCount)
      } else if (event.key === 'ArrowLeft' && slideCount > 1) {
        event.preventDefault()
        setActiveGalleryIndex((prev) => (prev - 1 + slideCount) % slideCount)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [activeGalleryConcept])

  useEffect(() => {
    if (activeGalleryConcept?.id === 'concept-01') {
      shopifyMountRequestRef.current?.()
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
  const sortButtonStyles = lightsOff
    ? 'border-transparent bg-white/10 text-white hover:bg-white/20'
    : 'border-transparent bg-white/80 text-[#1f1b1f] shadow-[0_10px_25px_rgba(31,27,31,0.08)] hover:bg-white'
  const sortPanelClass = lightsOff
    ? 'bg-[#0f0d16]/95 text-white border-white/15 shadow-[0_25px_70px_rgba(0,0,0,0.7)]'
    : 'bg-white text-[#1f1b1f] border-[#1f1b1f]/10 shadow-[0_20px_60px_rgba(31,27,31,0.15)]'
  const sortOptionHover = lightsOff ? 'hover:bg-white/10' : 'hover:bg-[#f7f2fb]'
  const smileyFaceSrc = '/Single smile.png'
  const scrollToTopButtonStyles = lightsOff
    ? 'border-white/40 bg-white/10 text-white backdrop-blur-lg shadow-[0_8px_30px_rgba(0,0,0,0.35)] hover:bg-white/20'
    : 'border-[#1f1b1f]/15 bg-[#fdfcfc]/40 text-[#1f1b1f] backdrop-blur-lg shadow-[0_12px_40px_rgba(31,27,31,0.2)] hover:bg-[#fdfcfc]/60'
  const scrollToTopButtonVisibility = showScrollToTop
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

  const scrollToTop = () => {
    if (typeof window === 'undefined') return
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const heroLogoSrc = lightsOff ? '/Wavythought Clear Logo white-01.png' : '/Wavythought Clear Logo-01.png'
  const activeGallerySlides = getConceptSlides(activeGalleryConcept)
  const activeGallerySlide = activeGallerySlides[activeGalleryIndex] || null
  const renderActiveSlideContent = () => {
    if (!activeGallerySlide) {
      return (
        <div
          className={`flex h-full w-full items-center justify-center text-[0.65rem] uppercase tracking-[0.35em] ${
            lightsOff ? 'text-white/70' : 'text-[#4f4656]'
          }`}
        >
          Loading...
        </div>
      )
    }
    if (activeGallerySlide.type === 'model') {
      const format = (activeGallerySlide.format || '').toLowerCase()
      if (['glb', 'gltf'].includes(format)) {
        return <ModelViewerSlide src={activeGallerySlide.src} isDark={lightsOff} />
      }
      const buttonClasses = `rounded-full border px-6 py-2 text-[0.6rem] font-semibold uppercase tracking-[0.35em] transition ${
        lightsOff ? 'border-white/25 text-white hover:bg-white/10' : 'border-[#1f1b1f]/20 text-[#1f1b1f] hover:bg-white'
      }`
      if (format === 'usdz') {
        return (
          <div
            className={`flex h-full w-full flex-col items-center justify-center gap-4 px-6 text-center ${
              lightsOff ? 'text-white' : 'text-[#1f1b1f]'
            }`}
          >
            <p className="text-xs uppercase tracking-[0.4em]">3D asset available</p>
            <p className="text-sm opacity-80">Open this view on an iPhone/iPad to launch the USDZ model in AR.</p>
            <a href={activeGallerySlide.src} rel="ar" className={buttonClasses}>
              Open in AR
            </a>
          </div>
        )
      }
      return (
        <div
          className={`flex h-full w-full flex-col items-center justify-center gap-4 px-6 text-center ${
            lightsOff ? 'text-white' : 'text-[#1f1b1f]'
          }`}
        >
          <p className="text-xs uppercase tracking-[0.4em]">Download 3D asset</p>
          <p className="text-sm opacity-80">This format isn&apos;t supported inline yet, but you can download it below.</p>
          <a href={activeGallerySlide.src} download className={buttonClasses}>
            Download File
          </a>
        </div>
      )
    }
    return (
      <img
        src={activeGallerySlide.src}
        alt={`${activeGalleryConcept?.title || 'Concept'} slide ${activeGalleryIndex + 1} of ${activeGallerySlides.length}`}
        className="h-full w-full object-cover"
      />
    )
  }

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
    const slides = getConceptSlides(concept)
    if (slides.length === 0) return
    const boundedIndex = Math.min(Math.max(startIndex, 0), slides.length - 1)
    setActiveGalleryConcept(concept)
    setActiveGalleryIndex(boundedIndex)
  }

  const closeConceptGallery = () => {
    setActiveGalleryConcept(null)
    setActiveGalleryIndex(0)
  }

  const showGalleryNext = () => {
    const slideCount = activeGallerySlides.length
    if (slideCount <= 1) return
    setActiveGalleryIndex((prev) => (prev + 1) % slideCount)
  }

  const showGalleryPrev = () => {
    const slideCount = activeGallerySlides.length
    if (slideCount <= 1) return
    setActiveGalleryIndex((prev) => (prev - 1 + slideCount) % slideCount)
  }

  const selectGalleryImage = (index) => {
    const slideCount = activeGallerySlides.length
    if (slideCount === 0) return
    const boundedIndex = Math.max(0, Math.min(index, slideCount - 1))
    setActiveGalleryIndex(boundedIndex)
  }

  const handleSortSelect = (value) => {
    setActiveSort(value)
    setIsSortMenuOpen(false)
  }

  const renderConceptCard = (concept) => {
    const conceptSlides = getConceptSlides(concept)
    const primaryImageSlide = conceptSlides.find((slide) => slide.type === 'image')
    const primaryImageSrc = primaryImageSlide?.src || null
    const hasGalleryContent = conceptSlides.length > 0
    const hasModelContent = conceptSlides.some((slide) => slide.type === 'model')
    const isShopifyLinkedConcept = concept.id === 'concept-01'

    const formattedPrice =
      typeof concept.price === 'number'
        ? concept.price.toLocaleString(undefined, { minimumFractionDigits: 0 })
        : concept.price

    return (
      <article key={concept.id} className={`flex h-full flex-col rounded-[32px] p-6 backdrop-blur ${cardShellClass}`}>
        <button
          type="button"
          onClick={hasGalleryContent ? () => openConceptGallery(concept) : undefined}
          disabled={!hasGalleryContent}
          className={`group relative mb-4 w-full overflow-hidden rounded-[28px] border transition ${
            lightsOff
              ? 'border-white/15 bg-white/5'
              : 'border-[#1f1b1f]/10 bg-white/70'
          } ${hasGalleryContent ? 'cursor-pointer hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff7bd5]' : 'cursor-not-allowed opacity-70'} aspect-square flex items-center justify-center`}
          aria-label={hasGalleryContent ? `View ${concept.title} gallery` : undefined}
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
          {hasModelContent && !primaryImageSrc && (
            <span
              className={`pointer-events-none absolute inset-0 flex items-center justify-center text-xs font-semibold uppercase tracking-[0.4em] ${
                lightsOff ? 'text-white' : 'text-[#1f1b1f]'
              }`}
            >
              3D View
            </span>
          )}
          {hasGalleryContent && (
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
              ${formattedPrice}
            </span>
          </div>
          <div className="mt-auto flex flex-col gap-3 pt-4">
            {isShopifyLinkedConcept ? (
              <div className="w-full" aria-live="polite">
                <div
                  id={SHOPIFY_BUY_BUTTON_CONFIG.hostIds?.card}
                  className="shopify-buy-button-host"
                  style={{ minHeight: '54px', overflow: 'visible', padding: '6px 0' }}
                />
              </div>
            ) : (
              <p className={`text-xs uppercase tracking-[0.35em] ${cardSubtleText}`}>
                Reach out via the main form to start an order.
              </p>
            )}
          </div>
        </div>
        </div>
      </article>
    )
  }

  return (
    <div className={`relative min-h-screen overflow-hidden ${pageBackground}`}>
      <div className="fixed left-4 top-24 z-30 hidden items-center px-6 transition-opacity duration-200 sm:flex sm:left-6">
        <a
          href="/"
          className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition ${lightToggleStyles}`}
        >
          Home
        </a>
      </div>
      <div className="fixed right-4 top-24 z-30 hidden items-center gap-3 px-6 transition-opacity duration-200 sm:flex sm:right-6">
        <button
          type="button"
          onClick={() => setLightsOff((prev) => !prev)}
          aria-pressed={lightsOff}
          className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition ${lightToggleStyles}`}
        >
          {lightsOff ? 'Lights On' : 'Lights Off'}
        </button>
      </div>
      <div className="fixed right-0 top-24 z-30 flex items-center justify-end gap-2 transition-opacity duration-200 sm:hidden">
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
      <div className="fixed left-3 top-24 z-30 flex items-center transition-opacity duration-200 sm:hidden">
        <a
          href="/"
          className={`rounded-full border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.4em] transition ${lightToggleStyles}`}
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
            for commissions or special runs anytime via the form.
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
                  <div className="aspect-square w-full">{renderActiveSlideContent()}</div>
                </div>
                {activeGallerySlides.length > 1 && (
                  <>
                    <button
                      type="button"
                      aria-label="View previous slide"
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
                      aria-label="View next slide"
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
                View {activeGalleryIndex + 1} of {activeGallerySlides.length || 1}
              </p>
              {activeGallerySlides.length > 1 && (
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {activeGallerySlides.map((slide, index) => (
                    <button
                      key={`${activeGalleryConcept.id}-thumb-${index}`}
                      type="button"
                      onClick={() => selectGalleryImage(index)}
                      className={`h-16 w-16 overflow-hidden rounded-2xl border transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff7bd5] ${galleryThumbBaseClass} ${
                        index === activeGalleryIndex ? galleryThumbActiveClass : 'opacity-70 hover:opacity-100'
                      }`}
                      aria-label={`View ${activeGalleryConcept.title} slide ${index + 1}`}
                    >
                      {slide.type === 'image' ? (
                        <img src={slide.src} alt="" className="h-full w-full object-cover" loading="lazy" />
                      ) : (
                        <div
                          className={`flex h-full w-full items-center justify-center text-[0.55rem] font-semibold uppercase tracking-[0.35em] ${
                            lightsOff ? 'text-white' : 'text-[#1f1b1f]'
                          }`}
                        >
                          3D
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
              {activeGalleryConcept?.id === 'concept-01' && (
                <div className="mt-6 flex justify-center" aria-live="polite">
                  <div
                    id={SHOPIFY_BUY_BUTTON_CONFIG.hostIds?.modal}
                    className="shopify-buy-button-host w-full max-w-xs"
                    style={{ minHeight: '54px', overflow: 'visible', padding: '6px 0' }}
                  />
                </div>
              )}
            </div>
          </section>
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
