import { Link } from '@tanstack/react-router'

import { FooterSection } from '@/components/footer-section'
import { NewsletterSignup } from '@/components/newsletter-signup'
import { SocialLinks } from '@/components/social-links'

const FOOTER_NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Artworks', to: '/shop' },
  { label: 'Books', to: '/books' },
  { label: 'Sold', to: '/sold' },
  { label: 'About', to: '/about' },
] as const

const LEGAL_LINKS = [
  { label: 'Privacy Policy', to: '/legal/privacy-policy' },
  { label: 'Terms of Service', to: '/legal/terms-of-service' },
] as const

const FOOTER_LINK_CLASS_NAME =
  'text-sm font-medium tracking-wide text-neutral-700 transition-colors hover:text-primary-accent focus-visible:text-primary-accent focus-visible:outline-none'

export function Footer() {
  return (
    <footer className="bg-neutral-100/70 pt-7 md:pt-14">
      <div className="site-frame flex min-h-80 flex-col">
        <div className="mx-auto grid w-2xl grid-cols-3 gap-9 md:gap-8">
          <FooterSection title="The Gallery">
            {FOOTER_NAV_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className={FOOTER_LINK_CLASS_NAME}>
                  {link.label}
                </Link>
              </li>
            ))}
          </FooterSection>

          <FooterSection title="Social Media">
            <SocialLinks layout="grid" />
          </FooterSection>

          <FooterSection title="Legal">
            {LEGAL_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className={FOOTER_LINK_CLASS_NAME}>
                  {link.label}
                </Link>
              </li>
            ))}
          </FooterSection>
        </div>

        <NewsletterSignup />

        <p className="font-manrope mt-auto pt-10 pb-4 text-center text-sm font-medium text-neutral-500">
          Copyright © 2026 Vahe Yeremyan. All Rights Reserved.
        </p>
      </div>
    </footer>
  )
}
