import { useEffect, useState } from 'react'

const HOME_HERO_SOLID_THRESHOLD_RATIO = 0.5

export function useHomeHeroThreshold(pathname: string) {
  const [hasPassedThreshold, setHasPassedThreshold] = useState(false)

  useEffect(() => {
    const isHomeRoute = pathname === '/'
    let frameId: number | undefined
    let isDisposed = false

    if (!isHomeRoute) {
      setHasPassedThreshold(false)
      return
    }

    function updateHeaderState() {
      frameId = undefined
      if (isDisposed) return

      const hero = document.querySelector<HTMLElement>('[data-home-hero]')
      if (!hero) {
        setHasPassedThreshold(false)
        queueHeaderStateUpdate()
        return
      }

      setHasPassedThreshold(hasHeroPassedThreshold(hero))
    }

    function queueHeaderStateUpdate() {
      if (frameId !== undefined) return
      frameId = window.requestAnimationFrame(updateHeaderState)
    }

    queueHeaderStateUpdate()
    window.addEventListener('scroll', queueHeaderStateUpdate, { passive: true })
    window.addEventListener('resize', queueHeaderStateUpdate)

    return () => {
      isDisposed = true
      if (frameId !== undefined) window.cancelAnimationFrame(frameId)
      window.removeEventListener('scroll', queueHeaderStateUpdate)
      window.removeEventListener('resize', queueHeaderStateUpdate)
    }
  }, [pathname])

  return hasPassedThreshold
}

function hasHeroPassedThreshold(hero: HTMLElement) {
  const rect = hero.getBoundingClientRect()
  const visibleTop = Math.max(rect.top, 0)
  const visibleBottom = Math.min(rect.bottom, window.innerHeight)
  const visibleHeight = Math.max(visibleBottom - visibleTop, 0)
  const visibleRatio = visibleHeight / rect.height
  const hasScrolledIntoHero = rect.top < 0
  const isPastHalfVisible = visibleRatio <= HOME_HERO_SOLID_THRESHOLD_RATIO

  return hasScrolledIntoHero && isPastHalfVisible
}
