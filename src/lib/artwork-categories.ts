export const ARTWORK_CATEGORIES = [
  { label: 'Abstract', handle: 'abstract' },
  { label: 'Cityscape', handle: 'cityscape' },
  { label: 'Figurative', handle: 'figurative' },
  { label: 'Flowers', handle: 'flowers' },
  { label: 'Landscape', handle: 'landscape' },
  { label: 'Seascape', handle: 'seascape' },
  { label: 'Still Life', handle: 'still-life' },
] as const

export type ArtworkCategoryHandle =
  (typeof ARTWORK_CATEGORIES)[number]['handle']

export function isArtworkCategoryHandle(
  handle: string,
): handle is ArtworkCategoryHandle {
  return ARTWORK_CATEGORIES.some((category) => category.handle === handle)
}
