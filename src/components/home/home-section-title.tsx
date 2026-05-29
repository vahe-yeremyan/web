type HomeSectionTitleProps = {
  children: string
}

export function HomeSectionTitle({ children }: HomeSectionTitleProps) {
  return (
    <h2 className="mb-4 text-2xl font-semibold tracking-tight md:mb-6">
      {children}
    </h2>
  )
}
