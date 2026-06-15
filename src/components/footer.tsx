import { Link } from '@tanstack/react-router'

import { FooterSection } from '@/components/footer-section'
import { NewsletterSignup } from '@/components/newsletter-signup'
import { SocialLinks } from '@/components/social-links'
import {
  resolveStorefrontRootDomain,
  showShopifyPrivacyPreferences,
} from '@/lib/shopify-privacy'

const FOOTER_NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Artworks', to: '/shop' },
  { label: 'Books', to: '/books' },
  { label: 'Sold', to: '/sold' },
  { label: 'About', to: '/about' },
  { label: 'Studio & Show', to: '/studio-show' },
] as const

const LEGAL_LINKS = [
  { label: 'Privacy Policy', to: '/legal/privacy-policy' },
  { label: 'Terms of Service', to: '/legal/terms-of-service' },
] as const

const FOOTER_LINK_CLASS_NAME =
  'text-sm font-medium tracking-wide text-neutral-700 transition-colors hover:text-primary-accent focus-visible:text-primary-accent focus-visible:outline-none'

function openCookiePreferences() {
  const SF_API_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_PUBLIC_TOKEN
  const CHECKOUT_DOMAIN = import.meta.env.VITE_SHOPIFY_CHECKOUT_DOMAIN
  const BASE_URL = import.meta.env.VITE_BASE_URL

  if (!SF_API_TOKEN || !CHECKOUT_DOMAIN) return

  const storefrontRootDomain = resolveStorefrontRootDomain(
    BASE_URL,
    window.location.hostname,
  )
  const locale = document.documentElement.lang || undefined

  void showShopifyPrivacyPreferences({
    storefrontAccessToken: SF_API_TOKEN,
    checkoutRootDomain: CHECKOUT_DOMAIN,
    storefrontRootDomain,
    locale,
  }).catch((error) => {
    console.warn('Failed to open Shopify privacy preferences', error)
  })
}

export function Footer() {
  const CHECKOUT_DOMAIN = import.meta.env.VITE_SHOPIFY_CHECKOUT_DOMAIN
  const dataSharingUrl = CHECKOUT_DOMAIN
    ? `https://${CHECKOUT_DOMAIN}/pages/data-sharing-opt-out`
    : null

  return (
    <footer className="bg-neutral-100/70 pt-7 md:pt-14">
      <div className="site-frame flex min-h-80 flex-col">
        <div className="mx-auto grid w-full max-w-2xl grid-cols-1 gap-9 sm:grid-cols-3 md:gap-8">
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
            <li>
              <button
                type="button"
                className={FOOTER_LINK_CLASS_NAME}
                onClick={openCookiePreferences}
              >
                Cookie Preferences
              </button>
            </li>
            {dataSharingUrl && (
              <li>
                <a href={dataSharingUrl} className={FOOTER_LINK_CLASS_NAME}>
                  Data Sharing
                </a>
              </li>
            )}
          </FooterSection>
        </div>

        <NewsletterSignup />

        <p className="font-manrope mt-auto pt-10 pb-4 text-left text-sm font-medium text-neutral-500 sm:text-center">
          Copyright © 2026 Vahe Yeremyan. All Rights Reserved.
        </p>
      </div>
    </footer>
  )
}
