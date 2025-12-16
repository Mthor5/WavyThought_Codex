import { useCallback, useEffect, useState } from 'react'

const getSystemPrefersDark = (fallback = false) => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return fallback
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

const useLights = ({ defaultDark, bodyClass = 'lights-off', syncBodyClass = true } = {}) => {
  const [lightsOff, setLightsOff] = useState(() => {
    if (typeof defaultDark === 'boolean') {
      return defaultDark
    }
    return getSystemPrefersDark()
  })
  useEffect(() => {
    if (!syncBodyClass || typeof document === 'undefined' || !bodyClass) return undefined
    const { body } = document
    if (!body) return undefined
    body.classList.toggle(bodyClass, lightsOff)
    return () => {
      body.classList.remove(bodyClass)
    }
  }, [lightsOff, syncBodyClass, bodyClass])

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return undefined
    const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleColorSchemeChange = (event) => {
      setLightsOff(event.matches)
    }
    handleColorSchemeChange(colorSchemeQuery)
    if (typeof colorSchemeQuery.addEventListener === 'function') {
      colorSchemeQuery.addEventListener('change', handleColorSchemeChange)
      return () => colorSchemeQuery.removeEventListener('change', handleColorSchemeChange)
    }
    colorSchemeQuery.addListener(handleColorSchemeChange)
    return () => {
      colorSchemeQuery.removeListener(handleColorSchemeChange)
    }
  }, [])

  const toggleLights = useCallback(() => {
    setLightsOff((prev) => !prev)
  }, [])

  return {
    lightsOff,
    setLightsOff,
    toggleLights,
  }
}

export default useLights
