import { Outlet, createFileRoute } from '@tanstack/react-router'

import '@/components/shop/shop.css'

export const Route = createFileRoute('/shop')({
  component: ShopLayout,
})

function ShopLayout() {
  return <Outlet />
}
