type FooterSectionProps = {
  title: string
  children: React.ReactNode
}

export function FooterSection({ title, children }: FooterSectionProps) {
  return (
    <section className="w-fit sm:mx-auto">
      <h3 className="font-manrope font-semibold text-black">{title}</h3>
      <ul className="mt-3 space-y-2 font-medium">{children}</ul>
    </section>
  )
}
