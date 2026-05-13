import * as v from 'valibot'

/**
 * Note: we don't rely on Vite's .env loading reaching `process.env` at runtime
 * — different runtimes handle that differently. Reading .env.local through
 * `process.env` works on most adapters.
 */
const StorefrontEnvSchema = v.object({
  SHOPIFY_STORE_DOMAIN: v.pipe(v.string(), v.minLength(1)),
  SHOPIFY_STOREFRONT_API_VERSION: v.pipe(v.string(), v.minLength(1)),
  SHOPIFY_PUBLIC_STOREFRONT_TOKEN: v.optional(v.string()),
  SHOPIFY_PRIVATE_STOREFRONT_TOKEN: v.optional(v.string()),
})

let cachedStorefront: v.InferOutput<typeof StorefrontEnvSchema> | null = null

function readEnv(name: string): string | undefined {
  // process.env on most server runtimes; falls back to undefined on edge
  // workers where process.env doesn't exist.
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (typeof process !== 'undefined' && process.env) {
    const value = process.env[name]
    if (value && value.length > 0) return value
  }
  return undefined
}

export function getStorefrontEnv() {
  if (cachedStorefront) return cachedStorefront
  cachedStorefront = v.parse(StorefrontEnvSchema, {
    SHOPIFY_STORE_DOMAIN: readEnv('SHOPIFY_STORE_DOMAIN'),
    SHOPIFY_STOREFRONT_API_VERSION: readEnv('SHOPIFY_STOREFRONT_API_VERSION'),
    SHOPIFY_PUBLIC_STOREFRONT_TOKEN: readEnv('SHOPIFY_PUBLIC_STOREFRONT_TOKEN'),
    SHOPIFY_PRIVATE_STOREFRONT_TOKEN: readEnv(
      'SHOPIFY_PRIVATE_STOREFRONT_TOKEN',
    ),
  })
  return cachedStorefront
}
