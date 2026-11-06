import { CreditCard, Landmark, Lock, Phone, ShieldCheck } from 'lucide-react';

export const SUPPORT_PHONE = '+2348092714000';

/** How the visitor will pay: Paystack (card, bank, transfer) or Stripe (card). */
export function PaymentMethod({ provider }: { provider?: 'PAYSTACK' | 'STRIPE' | null }) {
  const paystack = provider !== 'STRIPE';
  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-[13px] font-semibold text-[#00230F]">Choose how to pay</p>
      <div className="flex items-center gap-3 rounded-xl border-2 border-[#34A853] bg-[#34A853]/5 p-3">
        {paystack ? <Landmark className="size-5 shrink-0 text-[#305B43]" /> : <CreditCard className="size-5 shrink-0 text-[#305B43]" />}
        <div className="flex-1 text-left">
          <p className="text-sm font-medium text-[#00230F]">{paystack ? 'Card, bank or transfer' : 'Debit or credit card'}</p>
          <p className="text-xs text-[#737373]">
            {paystack ? 'You choose on the next screen, powered by Paystack' : 'Visa, Mastercard, Amex, Apple Pay, powered by Stripe'}
          </p>
        </div>
        <span className="grid size-4 place-items-center rounded-full border-2 border-[#34A853]">
          <span className="size-2 rounded-full bg-[#34A853]" />
        </span>
      </div>
    </div>
  );
}

/** Reassurance shown before checkout: guarantee, security, and a number to call. */
export function PaymentAssurance({ guarantee = true }: { guarantee?: boolean }) {
  return (
    <div className="flex flex-col gap-4 text-left">
      {guarantee && (
        <div className="flex items-start gap-3 rounded-xl bg-[#D0EA50]/25 p-3">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-[#305B43]" />
          <div>
            <p className="text-xs font-bold tracking-wide text-[#00230F]">100% GUARANTEED</p>
            <p className="text-xs/relaxed text-[#474747]">
              Upbreed offers a 30-day money-back guarantee. If you don&apos;t love your membership, we&apos;ll give you a full refund.
            </p>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between gap-3 text-xs text-[#737373]">
        <span className="flex items-center gap-1.5">
          <Lock className="size-3.5 text-[#34A853]" /> Your payment is 100% secure and encrypted.
        </span>
        <span className="shrink-0 rounded-full border border-[#34A853] px-2 py-0.5 text-[11px] font-medium text-[#34A853]">Secured with SSL</span>
      </div>
      <a href={`tel:${SUPPORT_PHONE}`} className="flex items-center gap-1.5 text-xs text-[#737373]">
        <Phone className="size-3.5" /> Have a Question? <span className="font-medium text-[#00230F]">{SUPPORT_PHONE}</span>
      </a>
    </div>
  );
}
