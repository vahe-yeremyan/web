import { Link, useLocation } from '@tanstack/react-router'

import { HeaderActions } from '@/components/header/HeaderActions'
import { useHomeHeroThreshold } from '@/components/header/home-threshold'
import { DesktopNav } from '@/components/header/Navigation'
import { cn } from '@/lib/utils'

const HEADER_TRANSITION_CLASS =
  'transition-[background-color,box-shadow,backdrop-filter] duration-300 ease-in-out'
const LOGO_TRANSITION_CLASS = 'transition-opacity duration-300 ease-in-out'
const HEADER_GRADIENT_TRANSITION_CLASS =
  'transition-opacity duration-300 ease-in-out'
const HEADER_TEXT_TRANSITION_CLASS =
  'transition-colors duration-100 ease-in-out'

export default function Header() {
  const location = useLocation()
  const isHomeRoute = location.pathname === '/'
  const hasPassedHomeHeroThreshold = useHomeHeroThreshold(location.pathname)
  const isSolid = !isHomeRoute || hasPassedHomeHeroThreshold

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50',
        HEADER_TRANSITION_CLASS,
        getHeaderSurfaceClassName(isSolid),
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-x-0 top-0 h-40 bg-linear-to-b from-black/35 via-black/15 to-transparent',
          HEADER_GRADIENT_TRANSITION_CLASS,
          getHeaderGradientVisibilityClassName(isSolid),
        )}
      />
      <nav
        aria-label="Primary"
        className={cn(
          'site-frame relative z-10 flex h-16 items-center justify-between md:h-20 lg:h-23',
          HEADER_TEXT_TRANSITION_CLASS,
        )}
      >
        <Logo isSolid={isSolid} />
        <DesktopNav />
        <HeaderActions />
      </nav>
    </header>
  )
}

function getHeaderSurfaceClassName(isSolid: boolean) {
  if (isSolid) {
    return 'bg-white/80 text-black backdrop-blur-xl'
  }

  return 'bg-transparent text-white shadow-none backdrop-blur-none'
}

function getLogoVisibilityClassName(isVisible: boolean) {
  if (isVisible) return 'opacity-100'
  return 'opacity-0'
}

function getHeaderGradientVisibilityClassName(isSolid: boolean) {
  if (isSolid) return 'opacity-0'
  return 'opacity-100'
}

function Logo({ isSolid }: { isSolid: boolean }) {
  return (
    <Link
      to="/"
      aria-label="Home"
      className="relative block aspect-20/11 w-28 md:w-32 lg:w-40"
    >
      <img
        src="/logo-black.png"
        alt="Vahe Yeremyan Art"
        width="160"
        height="88"
        className={cn(
          'absolute inset-0 h-full w-full object-cover',
          LOGO_TRANSITION_CLASS,
          getLogoVisibilityClassName(isSolid),
        )}
      />
      <img
        src="/logo-white.png"
        alt=""
        width="160"
        height="88"
        aria-hidden="true"
        className={cn(
          'absolute inset-0 h-full w-full object-cover',
          LOGO_TRANSITION_CLASS,
          getLogoVisibilityClassName(!isSolid),
        )}
      />
    </Link>
  )
}
