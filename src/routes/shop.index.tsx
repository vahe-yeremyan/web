import { createFileRoute } from '@tanstack/react-router'

import { ProductGrid } from '@/components/shop/product-grid'
import { getProducts } from '@/server/shopify/catalog.functions'

export const Route = createFileRoute('/shop/')({
  loader: async () => {
    const page = await getProducts({
      data: {
        first: 24,
        sortKey: 'BEST_SELLING',
        query: 'available_for_sale:true',
      },
    })

    return { products: page.nodes }
  },
  component: ShopIndex,
})

function ShopIndex() {
  const { products } = Route.useLoaderData()

  return <ProductGrid products={products} />
}
