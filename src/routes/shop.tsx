import { Outlet, createFileRoute } from '@tanstack/react-router'

import '@/components/shop/shop.css'

import { PageHeading } from '@/components/page-heading'

export const Route = createFileRoute('/shop')({
  component: ShopLayout,
})

function ShopLayout() {
  return (
    <div className="shop-root pb-20">
      <PageHeading title="Artworks" />
      <Outlet />
    </div>
  )
}
