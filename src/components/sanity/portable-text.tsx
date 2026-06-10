import type { PortableTextJsonBlock } from '@/lib/queries/sanity/about'
import type { PortableTextComponents } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'

import { PortableText } from '@portabletext/react'

const portableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-base font-medium text-balance">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="pt-4 text-2xl font-semibold tracking-tight text-black">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="pt-3 text-xl font-semibold tracking-tight text-black">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-neutral-300 pl-5 text-neutral-600 italic">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc space-y-2 pl-6">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal space-y-2 pl-6">{children}</ol>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      const href = typeof value?.href === 'string' ? value.href : ''
      const isExternal = href.startsWith('http')

      return (
        <a
          href={href}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noreferrer' : undefined}
          className="font-medium text-black underline underline-offset-4"
        >
          {children}
        </a>
      )
    },
  },
} satisfies PortableTextComponents

type SanityPortableTextProps = {
  value: Array<PortableTextJsonBlock>
}

export function SanityPortableText({ value }: SanityPortableTextProps) {
  return (
    <PortableText
      value={value as unknown as Array<PortableTextBlock>}
      components={portableTextComponents}
    />
  )
}
