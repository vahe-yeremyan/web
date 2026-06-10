import { useEffect, useRef, useState } from 'react'

import { useLocation, useNavigate } from '@tanstack/react-router'

import { Search } from 'lucide-react'

import { SearchForm } from '@/components/shop/search-form'
import { normalizeShopSearchParams } from '@/lib/shop-filters'

export function SearchDialog() {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const containerRef = useRef<HTMLDivElement | null>(null)
  const navigate = useNavigate()
  const pathname = useLocation({
    select: (location) => location.pathname,
  })

  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target
      if (!(target instanceof Node)) return
      if (containerRef.current?.contains(target)) return
      setOpen(false)
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const handleSubmit = () => {
    setOpen(false)

    void navigate({
      to: '/search',
      search: normalizeShopSearchParams({ q: searchTerm }),
    })
  }

  const handleTriggerClick = () => {
    // On the search page the bar already lives in the page header, so focus
    // that input instead of opening the floating dialog.
    if (pathname === '/search') {
      const searchInput = document.getElementById('search-page-input')
      if (searchInput instanceof HTMLInputElement) {
        searchInput.focus()
        const end = searchInput.value.length
        searchInput.setSelectionRange(end, end)
      }
      setOpen(false)
      return
    }

    setOpen((current) => !current)
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-label="Search"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={handleTriggerClick}
        className="cursor-pointer p-2 transition-colors duration-200 focus:outline-none"
      >
        <Search className="size-5" />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Search"
          className="fixed top-[calc(var(--header-height,0)+0.75rem)] right-3 z-50 w-[min(32rem,calc(100vw-1.5rem))] rounded-2xl border border-neutral-300 bg-white p-1.5 px-2 text-black shadow-sm shadow-neutral-300/80 md:top-[calc(var(--header-height,0)-1.5rem)] md:right-10"
        >
          <SearchForm
            value={searchTerm}
            onChange={setSearchTerm}
            onSubmit={handleSubmit}
            autoFocus
            inputClassName="border-neutral-200 bg-white text-neutral-900"
          />
        </div>
      )}
    </div>
  )
}
