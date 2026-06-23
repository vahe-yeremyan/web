import type { QueryClient } from '@tanstack/react-query'

import { useEffect } from 'react'

import { TanStackDevtools } from '@tanstack/react-devtools'
import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'

import { Footer } from '@/components/footer'
import Header from '@/components/header'
import { Toaster } from '@/components/ui/sonner'
import {
  loadShopifyPrivacyBanner,
  resolveStorefrontRootDomain,
} from '@/lib/shopify-privacy'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'
import appCss from '../styles.css?url'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Vahe Yeremyan',
      },
    ],
    links: [
      { rel: 'preconnect', href: 'https://cdn.shopify.com' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&family=Playfair+Display:wght@600&family=Raleway:ital,wght@0,100..900;1,100..900&display=swap',
      },
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const SF_API_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_PUBLIC_TOKEN
    const CHECKOUT_DOMAIN = import.meta.env.VITE_SHOPIFY_CHECKOUT_DOMAIN
    const BASE_URL = import.meta.env.VITE_BASE_URL

    if (!SF_API_TOKEN || !CHECKOUT_DOMAIN) return

    const storefrontRootDomain = resolveStorefrontRootDomain(
      BASE_URL,
      window.location.hostname,
    )
    const locale = document.documentElement.lang || undefined

    void loadShopifyPrivacyBanner({
      storefrontAccessToken: SF_API_TOKEN,
      checkoutRootDomain: CHECKOUT_DOMAIN,
      storefrontRootDomain,
      locale,
    }).catch((error) => {
      console.warn('Failed to load Shopify privacy banner', error)
    })
  }, [])

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="flex min-h-screen flex-col">
        <Header />
        <div className="site-content flex flex-1 flex-col">{children}</div>
        <Footer />
        <Toaster position="bottom-right" />
        {import.meta.env.DEV && <Devtools />}
        <Scripts />
      </body>
    </html>
  )
}

function Devtools() {
  return (
    <TanStackDevtools
      config={{
        position: 'bottom-right',
      }}
      plugins={[
        {
          name: 'Tanstack Router',
          render: <TanStackRouterDevtoolsPanel />,
        },
        TanStackQueryDevtools,
      ]}
    />
  )
}
