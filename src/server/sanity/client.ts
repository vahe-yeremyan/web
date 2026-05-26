import { createClient } from '@sanity/client'

export const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  apiVersion: process.env.SANITY_API_VERSION ?? '2026-05-26',
  useCdn: true,
  token: process.env.SANITY_READ_TOKEN,
})
