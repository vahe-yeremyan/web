import { formatMoney } from '@/lib/queries/shopify/format'

type MoneyProps = {
  amount: string | number
  currencyCode: string
  className?: string
}

export function Money({ amount, currencyCode, className }: MoneyProps) {
  return <span className={className}>{formatMoney(amount, currencyCode)}</span>
}
