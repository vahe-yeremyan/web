import type { SocialIconName } from '@/components/icons/social-icons'

import { SocialIcon } from '@/components/icons/social-icons'
import { cn } from '@/lib/utils'

const SOCIAL_LINKS = [
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/vahe.yeremyan.71',
    icon: 'facebook',
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/vaheyeremyan?igsh=NTc4MTIwNjQ2YQ%3D%3D&utm_source=qr',
    icon: 'instagram',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/vahe-yeremyan-26559b43/',
    icon: 'linkedin',
  },
  {
    label: 'Pinterest',
    href: 'https://www.pinterest.com/vaheyeremyan/',
    icon: 'pinterest',
  },
  {
    label: 'X',
    href: 'https://x.com/yeremyan_vahe',
    icon: 'x',
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@vaheyeremyanart',
    icon: 'youtube',
  },
] satisfies Array<{
  label: string
  href: string
  icon: SocialIconName
}>

type SocialLinksProps = {
  layout?: 'grid' | 'row'
  className?: string
  iconClassName?: string
}

export function SocialLinks({
  layout = 'row',
  className,
  iconClassName,
}: SocialLinksProps) {
  return (
    <ul
      className={cn(
        layout === 'grid' &&
          'mx-auto grid w-fit grid-cols-3 gap-2 sm:grid-cols-2',
        layout === 'row' && 'flex flex-wrap items-center gap-2',
        className,
      )}
    >
      {SOCIAL_LINKS.map(({ label, href, icon }) => (
        <li key={href}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View Vahe Yeremyan on ${label}`}
            className="hover:bg-primary-accent-soft hover:text-primary-accent focus-visible:bg-primary-accent-soft focus-visible:text-primary-accent focus-visible:ring-primary-accent/20 flex size-9 items-center justify-center rounded-full text-neutral-700 transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            <SocialIcon name={icon} className={cn('size-8', iconClassName)} />
          </a>
        </li>
      ))}
    </ul>
  )
}
