import {
  AmexIcon,
  ApplePayIcon,
  GooglePayIcon,
  MastercardIcon,
  PaypalIcon,
  VisaIcon,
} from '@/components/icons/payment-icons'

export function SecurePaymentOptionsSection() {
  return (
    <section className="my-6 md:my-10">
      <h3 className="featured-headline text-center md:text-2xl!">
        Secure Payment Options
      </h3>
      <div className="flex items-center justify-center gap-4">
        <VisaIcon />
        <AmexIcon />
        <PaypalIcon />
        <MastercardIcon />
        <ApplePayIcon />
        <GooglePayIcon />
      </div>
    </section>
  )
}
