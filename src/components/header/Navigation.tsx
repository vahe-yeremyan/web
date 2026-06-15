import type { ReactNode } from 'react'

import { useState } from 'react'

import { Link } from '@tanstack/react-router'

import { ChevronsUpDown } from 'lucide-react'

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { ARTWORK_CATEGORIES } from '@/lib/artwork-categories'
import { cn } from '@/lib/utils'

const NAV_LINK_CLASS_NAME = cn(
  'relative text-[1.05rem] font-semibold transition-colors duration-100 ease-in-out after:absolute after:-bottom-0.5 after:left-0 after:h-[1.5px] after:w-full after:origin-left after:scale-x-0 after:bg-linear-to-r after:transition-transform after:duration-300 after:ease-in-out hover:after:scale-x-100',
  'after:from-current after:to-current',
)

const DROPDOWN_LINK_CLASS_NAME =
  'block rounded-sm px-4 py-2 text-sm font-semibold text-black hover:bg-primary-accent-soft focus-visible:bg-primary-accent-soft focus-visible:ring-2 focus-visible:ring-primary-accent/20 focus-visible:ring-inset focus-visible:outline-none'

const DROPDOWN_TITLE_CLASS_NAME =
  'px-4 pt-2 pb-2 text-sm font-bold text-secondary'

const NAV_ITEMS = [
  { type: 'route', label: 'Home', to: '/' },
  { type: 'artworks', label: 'Artworks' },
  { type: 'route', label: 'Books', to: '/books' },
  { type: 'route', label: 'Sold', to: '/sold' },
  { type: 'route', label: 'About', to: '/about' },
  { type: 'route', label: 'Studio & Show', to: '/studio-show' },
] as const

const MEDIUM_FILTERS = [
  'Acrylic on Canvas',
  'Acrylic on Linen',
  'Acrylic on Plexiglass',
  'Oil on Canvas',
  'Oil on Cardboard',
  'Oil on Panel',
] as const

const ORIENTATION_FILTERS = ['Horizontal', 'Square', 'Vertical'] as const

const MOBILE_PRIMARY_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Artworks', to: '/shop' },
  { label: 'Books', to: '/books' },
  { label: 'Sold', to: '/sold' },
  { label: 'About', to: '/about' },
  { label: 'Studio & Show', to: '/studio-show' },
] as const

export function DesktopNav() {
  return (
    <div className="font-manrope flex items-center">
      <ul className="hidden items-center tracking-wide md:flex md:gap-4 lg:gap-6 xl:gap-10">
        {NAV_ITEMS.map((item) => {
          if (item.type === 'artworks') {
            return <ArtworksNavItem key={item.label} label={item.label} />
          }

          return (
            <li key={item.label}>
              <Link to={item.to} className={NAV_LINK_CLASS_NAME}>
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function ArtworksNavItem({ label }: { label: string }) {
  const [isOpen, setIsOpen] = useState(false)

  function closeMenu() {
    setIsOpen(false)
  }

  return (
    <li
      className="relative"
      onMouseEnter={() => {
        setIsOpen(true)
      }}
      onMouseLeave={closeMenu}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          closeMenu()
        }
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          closeMenu()
        }
      }}
    >
      <Link
        to="/shop"
        aria-controls="artworks-navigation"
        aria-haspopup="true"
        aria-expanded={isOpen}
        className={cn(NAV_LINK_CLASS_NAME, 'inline-flex items-center gap-1.5')}
        onClick={closeMenu}
        onFocus={() => {
          setIsOpen(true)
        }}
      >
        {label}
        <ChevronsUpDown
          className="mt-0.5 size-4 opacity-75"
          aria-hidden="true"
        />
      </Link>

      <ArtworksDropdown isOpen={isOpen} onLinkClick={closeMenu} />
    </li>
  )
}

function ArtworksDropdown({
  isOpen,
  onLinkClick,
}: {
  isOpen: boolean
  onLinkClick: () => void
}) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute top-full left-1/2 z-20 w-[min(48rem,calc(100vw-1.5rem))] -translate-x-1/2 pt-5 opacity-0 transition duration-150',
        isOpen && 'pointer-events-auto opacity-100',
      )}
    >
      <div
        id="artworks-navigation"
        aria-label="Artwork navigation"
        className="rounded-md border border-neutral-200 bg-neutral-50 p-3 shadow-[0_18px_40px_rgba(0,0,0,0.08)]"
      >
        <div className="grid grid-cols-3 divide-x divide-neutral-100 overflow-hidden rounded-sm border border-neutral-200 bg-white">
          <DropdownSection
            title="Category"
            headingId="artworks-category-heading"
            className="p-2"
          >
            <li>
              <Link
                to="/shop"
                className={DROPDOWN_LINK_CLASS_NAME}
                onClick={onLinkClick}
              >
                All Artworks
              </Link>
            </li>
            {ARTWORK_CATEGORIES.map((category) => (
              <li key={category.handle}>
                <Link
                  to="/product-category/$handle"
                  params={{ handle: category.handle }}
                  className={DROPDOWN_LINK_CLASS_NAME}
                  onClick={onLinkClick}
                >
                  {category.label}
                </Link>
              </li>
            ))}
          </DropdownSection>

          <DropdownSection
            title="Medium"
            headingId="artworks-medium-heading"
            className="p-2"
          >
            {MEDIUM_FILTERS.map((medium) => (
              <li key={medium}>
                <Link
                  to="/shop"
                  search={{ medium: [medium] }}
                  className={DROPDOWN_LINK_CLASS_NAME}
                  onClick={onLinkClick}
                >
                  {medium}
                </Link>
              </li>
            ))}
          </DropdownSection>

          <DropdownSection
            title="Orientation"
            headingId="artworks-orientation-heading"
            className="p-2"
          >
            {ORIENTATION_FILTERS.map((orientation) => (
              <li key={orientation}>
                <Link
                  to="/shop"
                  search={{ orientation: [orientation] }}
                  className={DROPDOWN_LINK_CLASS_NAME}
                  onClick={onLinkClick}
                >
                  {orientation}
                </Link>
              </li>
            ))}
          </DropdownSection>
        </div>
      </div>
    </div>
  )
}

function DropdownSection({
  title,
  headingId,
  className,
  children,
}: {
  title: string
  headingId: string
  className?: string
  children: ReactNode
}) {
  return (
    <section aria-labelledby={headingId} className={className}>
      <h2 id={headingId} className={DROPDOWN_TITLE_CLASS_NAME}>
        {title}
      </h2>
      <ul>{children}</ul>
    </section>
  )
}

export function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          className="font-manrope text-[1.05rem] font-semibold md:hidden"
        >
          Menu
        </button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-full gap-0 border-l-0 bg-white text-black sm:max-w-none md:hidden"
      >
        <SheetHeader className="h-23 flex-row items-center px-(--content-px)">
          <div>
            <SheetTitle className="font-manrope text-lg font-semibold">
              Menu
            </SheetTitle>
            <SheetDescription className="sr-only">
              Site navigation and artwork category links.
            </SheetDescription>
          </div>
        </SheetHeader>

        <nav
          aria-label="Mobile"
          className="flex-1 overflow-y-auto px-(--content-px) pb-12"
        >
          <ul className="flex flex-col">
            {MOBILE_PRIMARY_LINKS.map((link) => (
              <li key={link.to}>
                <SheetClose asChild>
                  <Link
                    to={link.to}
                    className="hover:text-primary-accent block border-b border-neutral-100 py-3 text-lg font-semibold transition-colors"
                  >
                    {link.label}
                  </Link>
                </SheetClose>
              </li>
            ))}
          </ul>

          <p className="font-manrope text-secondary mt-8 mb-3 text-sm font-bold tracking-wide">
            Shop by category
          </p>
          <ul className="flex flex-col">
            {ARTWORK_CATEGORIES.map((category) => (
              <li key={category.handle}>
                <SheetClose asChild>
                  <Link
                    to="/product-category/$handle"
                    params={{ handle: category.handle }}
                    className="hover:text-primary-accent block py-2 text-base font-medium transition-colors"
                  >
                    {category.label}
                  </Link>
                </SheetClose>
              </li>
            ))}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
