import { Link } from '@tanstack/react-router'

import { Search } from 'lucide-react'

import { useCart } from '@/hooks/use-cart'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'Prints', href: '/prints' },
  { label: 'Books', href: '/books' },
  { label: 'Sold', href: '/sold' },
  { label: 'About', href: '/about' },
] as const

export default function Header() {
  const { totalQuantity } = useCart()
  const navLinkClassName = cn(
    'relative text-[1.05rem] font-semibold transition-all duration-200 after:absolute after:-bottom-0.5 after:left-0 after:h-[1.5px] after:w-full after:origin-left after:scale-x-0 after:bg-linear-to-r after:transition-transform after:duration-200 hover:after:scale-x-100',
    'after:from-black after:to-black',
  )

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white/95 text-black backdrop-blur-md">
      <nav className="site-frame relative z-10 flex h-23 items-center justify-between">
        {/* Logo Section */}
        <Link to="/" aria-label="Home">
          <img
            src="/logo.png"
            alt="Vahe Yeremyan Art"
            width="160"
            height="80"
            className="h-20 w-40 object-cover"
          />
        </Link>

        <div className="flex items-center">
          {/* Route Section */}
          <ul className="hidden items-center tracking-wide lg:flex lg:gap-6 xl:gap-10">
            {NAV_LINKS.map((link) => (
              <li key={'to' in link ? link.to : link.href}>
                {'to' in link ? (
                  <Link to={link.to} className={navLinkClassName}>
                    {link.label}
                  </Link>
                ) : (
                  <a href={link.href} className={navLinkClassName}>
                    {link.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center">
          {/* Icon Section */}
          <div className="ml-10 flex items-center gap-4">
            {/* Search Icon */}
            <button type="button" aria-label="Search" className="p-2">
              <Search className="size-5" />
            </button>

            {/* Bag Icon */}
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
          </div>
        </div>
      </nav>
    </header>
  )
}
