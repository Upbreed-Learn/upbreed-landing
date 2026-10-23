import type { PlanPrice, Subscription } from './constants';

export type Period = 'monthly' | 'biannually' | 'annually';

/** "₦15,000", "GH₵120", "$10" — in the visitor's locale. */
export function formatPrice(price: Pick<PlanPrice, 'currency' | 'amount'> | null | undefined) {
  if (!price) return '—';
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: price.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(Number(price.amount));
  } catch {
    return `${price.currency} ${Number(price.amount).toLocaleString()}`;
  }
}

/**
 * The price to show/charge for a plan. The API already picked the visitor's country price (`price`)
 * and the default price they may switch to (`prices`); `currency` is the visitor's choice, if any.
 */
export function pickPrice(plan: Subscription | null | undefined, currency?: string | null) {
  if (!plan) return null;
  return plan.prices?.find(p => p.currency === currency) ?? plan.price ?? null;
}

/** Currencies the visitor can choose between, across the plans shown (usually local + USD). */
export function currencyChoices(plans: Subscription[] | undefined) {
  const seen: string[] = [];
  for (const plan of plans ?? []) for (const p of plan.prices ?? []) if (!seen.includes(p.currency)) seen.push(p.currency);
  return seen;
}
