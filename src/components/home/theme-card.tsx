import type { HomeTheme } from '@/lib/queries/sanity/home-themes'

import { Link } from '@tanstack/react-router'

type StaticThemePath =
  | '/'
  | '/about'
  | '/books'
  | '/contact'
  | '/shop'
  | '/sold'
  | '/studio-show'

const STATIC_THEME_PATHS = new Set<string>([
  '/',
  '/about',
  '/books',
  '/contact',
  '/shop',
  '/sold',
  '/studio-show',
])

type ThemeRoute =
  | {
      type: 'product-category'
      handle: string
    }
  | {
      type: 'product'
      handle: string
    }
  | {
      type: 'static'
      path: StaticThemePath
    }

const THEME_CARD_CLASS_NAME =
  'group focus-visible:ring-primary-accent/20 relative rounded block aspect-2.25/1 overflow-hidden bg-neutral-100 focus-visible:ring-2 focus-visible:outline-none'

function getThemeRoute(path: string): ThemeRoute | null {
  if (STATIC_THEME_PATHS.has(path)) {
    return { type: 'static', path: path as StaticThemePath }
  }

  const productCategoryMatch = path.match(/^\/product-category\/([^/]+)$/)
  if (productCategoryMatch?.[1]) {
    return { type: 'product-category', handle: productCategoryMatch[1] }
  }

  const productMatch = path.match(/^\/product\/([^/]+)$/)
  if (productMatch?.[1]) {
    return { type: 'product', handle: productMatch[1] }
  }

  return null
}

export function ThemeCard({ theme }: { theme: HomeTheme }) {
  const route = getThemeRoute(theme.path)
  const content = (
    <>
      <img
        src={theme.imageSrc}
        srcSet={theme.imageSrcSet}
        alt={theme.imageAlt}
        loading="lazy"
        decoding="async"
        sizes={theme.imageSizes}
        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
      />

      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/55 via-black/20 to-transparent p-3 pt-12 md:p-4 md:pt-16">
        <h3 className="text-lg font-semibold text-white md:text-xl">
          {theme.title}
        </h3>
      </div>
    </>
  )

  if (!route) {
    return null
  }

  if (route.type === 'product-category') {
    return (
      <article className="min-w-0">
        <Link
          to="/product-category/$handle"
          params={{ handle: route.handle }}
          className={THEME_CARD_CLASS_NAME}
        >
          {content}
        </Link>
      </article>
    )
  }

  if (route.type === 'product') {
    return (
      <article className="min-w-0">
        <Link
          to="/product/$handle"
          params={{ handle: route.handle }}
          className={THEME_CARD_CLASS_NAME}
        >
          {content}
        </Link>
      </article>
    )
  }

  return (
    <article className="min-w-0">
      <Link to={route.path} className={THEME_CARD_CLASS_NAME}>
        {content}
      </Link>
    </article>
  )
}
