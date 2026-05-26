import type { AboutCredentialSection } from '@/lib/queries/sanity/about'

type CredentialSectionsProps = {
  sections?: Array<AboutCredentialSection>
}

export function CredentialSections({ sections }: CredentialSectionsProps) {
  const visibleSections = sections?.filter((section) => section.items?.length)

  if (!visibleSections?.length) return null

  return (
    <section className="mt-20 space-y-12">
      {visibleSections.map((section) => {
        const hasDates = section.items?.some((item) => item.date)

        return (
          <div key={section.title}>
            <h2 className="mb-5 text-2xl font-semibold tracking-tight">
              {section.title}
            </h2>

            <div className="overflow-hidden border-y border-neutral-200">
              <table className="w-full border-collapse text-left">
                <tbody>
                  {section.items?.map((item, index) => (
                    <tr
                      key={`${item.date ?? section.title}-${item.description}`}
                      className={index > 0 ? 'border-t border-neutral-200' : ''}
                    >
                      {hasDates ? (
                        <>
                          <td className="w-28 py-4 pr-6 align-top text-sm font-semibold whitespace-nowrap text-neutral-500 md:w-36">
                            {item.date}
                          </td>
                          <td className="py-4 text-base leading-7 text-neutral-800">
                            {item.description}
                          </td>
                        </>
                      ) : (
                        <td className="py-4 text-base leading-7 text-neutral-800">
                          {item.description}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      })}
    </section>
  )
}
