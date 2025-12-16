import { useEffect } from 'react'
import { SHOPIFY_BUY_BUTTON_CONFIG, SHOPIFY_PRODUCT_OPTIONS } from '../config/shopify'

const ShopifyCartGhost = () => {
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return undefined
    const mountId = SHOPIFY_BUY_BUTTON_CONFIG.hostIds?.ghost
    if (!mountId) return undefined
    let isCancelled = false
    const scriptId = 'wavythought-shopify-buy-sdk'
    const { scriptUrl, domain, storefrontAccessToken, productId, moneyFormat } = SHOPIFY_BUY_BUTTON_CONFIG

    const initialize = () => {
      if (isCancelled) return
      const ShopifyBuy = window.ShopifyBuy
      if (!ShopifyBuy || !ShopifyBuy.UI) return
      const mountNode = document.getElementById(mountId)
      if (!mountNode || mountNode.dataset.shopifyMounted === 'true') return
      const client = ShopifyBuy.buildClient({
        domain,
        storefrontAccessToken,
      })
      ShopifyBuy.UI.onReady(client).then((ui) => {
        if (isCancelled) return
        const node = document.getElementById(mountId)
        if (!node || node.dataset.shopifyMounted === 'true') return
        ui.createComponent('product', {
          id: productId,
          node,
          moneyFormat,
          options: SHOPIFY_PRODUCT_OPTIONS,
        })
        node.dataset.shopifyMounted = 'true'
      })
    }

    const attachScript = () => {
      let script = document.getElementById(scriptId)
      if (!script) {
        script = document.createElement('script')
        script.id = scriptId
        script.async = true
        script.src = scriptUrl
        document.head.appendChild(script)
      }
      if (script.dataset.shopifyLoaded === 'true') {
        initialize()
      } else {
        const handleLoad = () => {
          script.dataset.shopifyLoaded = 'true'
          initialize()
        }
        script.addEventListener('load', handleLoad, { once: true })
      }
    }

    attachScript()

    return () => {
      isCancelled = true
    }
  }, [])

  return <div id={SHOPIFY_BUY_BUTTON_CONFIG.hostIds?.ghost} style={{ display: 'none' }} />
}

export default ShopifyCartGhost
