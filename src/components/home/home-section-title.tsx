type HomeSectionTitleProps = {
  children: string
}

export function HomeSectionTitle({ children }: HomeSectionTitleProps) {
  return (
    <h2 className="mb-5 text-2xl font-semibold tracking-tight">{children}</h2>
  )
}
