type FooterSectionProps = {
  title: string
  children: React.ReactNode
}

export function FooterSection({ title, children }: FooterSectionProps) {
  return (
    <section className="w-fit sm:mx-auto">
      <h3 className="font-manrope font-semibold text-black">{title}</h3>
      <div className="mt-3">{children}</div>
    </section>
  )
}
