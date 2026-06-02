import { useState } from 'react'

import { Link } from '@tanstack/react-router'

import { ChevronsUpDown, Search } from 'lucide-react'

import { useCart } from '@/hooks/use-cart'
import { ARTWORK_CATEGORIES } from '@/lib/artwork-categories'
import { cn } from '@/lib/utils'

const NAV_LINK_CLASS_NAME = cn(
  'relative text-[1.05rem] font-semibold transition-all duration-200 after:absolute after:-bottom-0.5 after:left-0 after:h-[1.5px] after:w-full after:origin-left after:scale-x-0 after:bg-linear-to-r after:transition-transform after:duration-200 hover:after:scale-x-100',
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

export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white/90 text-black backdrop-blur-xl">
      <nav
        aria-label="Primary"
        className="site-frame relative z-10 flex h-23 items-center justify-between"
      >
        <Logo />
        <DesktopNav />
        <HeaderActions />
      </nav>
    </header>
  )
}

function Logo() {
  return (
    <Link to="/" aria-label="Home">
      <img
        src="/logo.png"
        alt="Vahe Yeremyan Art"
        width="160"
        height="80"
        className="h-20 w-40 object-cover"
      />
    </Link>
  )
}

function DesktopNav() {
  return (
    <div className="font-manrope flex items-center">
      <ul className="hidden items-center tracking-wide lg:flex lg:gap-6 xl:gap-10">
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
          className="text-gray mt-0.5 size-4"
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
        'pointer-events-none absolute top-full left-1/2 z-20 w-3xl -translate-x-1/2 pt-5 opacity-0 transition duration-150',
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
  children: React.ReactNode
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

function HeaderActions() {
  const { totalQuantity } = useCart()

  return (
    <div className="flex items-center">
      <div className="ml-10 flex items-center gap-4">
        <Link
          to="/shop/search"
          search={{ q: '' }}
          aria-label="Search"
          className="p-2"
        >
          <Search className="size-5" />
        </Link>

        <CartLink totalQuantity={totalQuantity} />
      </div>
    </div>
  )
}

function CartLink({ totalQuantity }: { totalQuantity: number }) {
  return (
    <Link
      to="/shop/cart"
      className="relative p-2"
      aria-label={`Bag, ${totalQuantity} item${totalQuantity === 1 ? '' : 's'}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.75"
        stroke="currentColor"
        className="size-5"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
        />
      </svg>
      {totalQuantity > 0 && (
        <span
          className={cn(
            'absolute -top-0.5 -right-1.5 flex size-4.5 items-center justify-center rounded-full text-xs font-medium',
            'bg-black text-white',
          )}
        >
          {totalQuantity}
        </span>
      )}
    </Link>
  )
}
