import type { HomeTheme } from '@/lib/queries/sanity/home-themes'

import { Link } from '@tanstack/react-router'

import { HomeSectionTitle } from './home-section-title'
import { ThemeCard } from './theme-card'

type ThemesSectionProps = {
  themes: Array<HomeTheme>
}

export function ThemesSection({ themes }: ThemesSectionProps) {
  return (
    <section className="my-6 md:my-10">
      <HomeSectionTitle
        action={
          <Link
            to="/shop"
            className="font-manrope text-secondary hover:text-primary-accent focus-visible:text-primary-accent text-sm font-semibold transition-colors focus-visible:outline-none"
          >
            View all
          </Link>
        }
      >
        Explore Themes
      </HomeSectionTitle>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {themes.map((theme) => (
          <ThemeCard key={theme.id} theme={theme} />
        ))}
      </div>
    </section>
  )
}
