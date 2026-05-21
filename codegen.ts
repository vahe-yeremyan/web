import type { CodegenConfig } from '@graphql-codegen/cli'

import { existsSync } from 'node:fs'

import {
  ApiType,
  pluckConfig,
  shopifyApiTypes,
} from '@shopify/api-codegen-preset'

const SHOPIFY_STOREFRONT_API_VERSION =
  process.env.SHOPIFY_STOREFRONT_API_VERSION ?? '2026-01'
const SHOPIFY_GENERATED_DIR = './src/lib/shopify/generated'
const SHOPIFY_SCHEMA_FILE = `${SHOPIFY_GENERATED_DIR}/storefront-${SHOPIFY_STOREFRONT_API_VERSION}.schema.json`
const SHOPIFY_SCHEMA_SOURCE = existsSync(SHOPIFY_SCHEMA_FILE)
  ? SHOPIFY_SCHEMA_FILE
  : `https://shopify.dev/storefront-graphql-direct-proxy/${SHOPIFY_STOREFRONT_API_VERSION}`

const SHOPIFY_DOCUMENTS = [
  './src/lib/shopify/queries.ts',
  './src/lib/shopify/queries/**/*.{graphql,gql,ts,tsx}',
]

const shopifyPluckConfig = pluckConfig as unknown as NonNullable<
  CodegenConfig['pluckConfig']
>

const config = {
  schema: SHOPIFY_SCHEMA_SOURCE,
  documents: SHOPIFY_DOCUMENTS,
  pluckConfig: shopifyPluckConfig,
  generates: shopifyApiTypes({
    apiType: ApiType.Storefront,
    apiVersion: SHOPIFY_STOREFRONT_API_VERSION,
    documents: SHOPIFY_DOCUMENTS,
    outputDir: SHOPIFY_GENERATED_DIR,
    enumsAsConst: true,
  }),
} satisfies CodegenConfig

export default config
