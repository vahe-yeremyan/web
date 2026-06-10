import { MobileNav } from '@/components/header/Navigation'
import { BagSheet } from '@/components/shop/bag-sheet'
import { SearchDialog } from '@/components/shop/search-dialog'
import { cn } from '@/lib/utils'

const HEADER_TEXT_TRANSITION_CLASS =
  'transition-colors duration-100 ease-in-out'

export function HeaderActions() {
  return (
    <div className="flex items-center">
      <div
        className={cn(
          'flex items-center gap-4 md:ml-10',
          HEADER_TEXT_TRANSITION_CLASS,
        )}
      >
        <SearchDialog />

        <BagSheet />

        <MobileNav />
      </div>
    </div>
  )
}
