'use client';

import { PaymentAssurance, PaymentMethod } from '@/components/how-to-pay';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Subscription, UserProfileType } from '@/lib/constants';
import { https } from '@/lib/https';
import { formatPrice, type Period } from '@/lib/pricing';
import { useGetSubscriptions, useGetToken, useGetUserProfile } from '@/lib/queries/hooks';
import { queryKeys } from '@/lib/queries/query-keys';
import { apiError } from '@/lib/sessions';
import { cn } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Check, Minus } from 'lucide-react';
import Link from 'next/link';
import { useQueryState } from 'nuqs';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

type Tab = Extract<Period, 'biannually' | 'annually'>;
const TABS: { id: Tab; label: string }[] = [
  { id: 'biannually', label: '6 Months' },
  { id: 'annually', label: 'Annually' },
];
const PERIOD_TEXT: Record<Tab, string> = { biannually: 'every 6 months', annually: 'every year' };

type Row = { label: React.ReactNode; value: (p: Subscription, tab: Tab) => React.ReactNode };
const ROWS: Row[] = [
  {
    label: 'Monthly Price ( billed half-year and annually)',
    value: (p, tab) => {
      const price = p.periods?.[tab];
      if (!price) return '—';
      return (
        <span className="flex flex-col items-center gap-1">
          <span className="text-base font-semibold">{formatPrice({ currency: price.currency, amount: price.perMonth })}</span>
          <span className="text-[10px] font-normal opacity-70">
            {formatPrice(price)} {PERIOD_TEXT[tab]}
          </span>
        </span>
      );
    },
  },
  { label: 'Download for Offline viewing', value: p => (p.offline ? 'Yes' : 'No') },
  { label: 'All 200+ classes across 11 categories', value: () => <Check className="size-4" /> },
  {
    label: (
      <>
        Access to Sessions by UPBREED
        <br />
        Learn by doing in just 30 days.
      </>
    ),
    value: () => <Check className="size-4" />,
  },
  { label: 'Watch on your computer, TV, Phone or tablet', value: () => <Check className="size-4" /> },
  { label: 'Bonus class guides & content', value: p => (p.offline ? <Check className="size-4" /> : <Minus className="size-4 opacity-40" />) },
];

/** "Choose your plan": used on /pricing and on the welcome page after sign-in. */
const ChooseYourPlan = ({ skipHref }: { skipHref?: string }) => {
  const [tab, setTab] = useQueryState('plan', { defaultValue: 'biannually' });
  const period: Tab = tab === 'annually' ? 'annually' : 'biannually';
  const { data, isPending, isError } = useGetSubscriptions();
  const plans: Subscription[] = (data?.data.data ?? []).filter((p: Subscription) => p.periods?.[period]);
  const [selected, setSelected] = useState<Subscription | null>(null);
  const [confirm, setConfirm] = useState(false);
  useEffect(() => {
    if (!selected && plans.length) setSelected(plans[0]);
  }, [plans, selected]);

  return (
    <section className="flex justify-center bg-[#00230F] pb-16 text-white">
      <div className="flex w-full max-w-5xl flex-col gap-10 px-6 pt-12 sm:px-9">
        <div className="flex flex-col gap-6 max-md:items-center max-md:text-center">
          <div className="flex flex-col gap-3">
            <h2 className="text-2xl font-medium text-white/50 md:text-[28px]">Choose your plan</h2>
            <p className="text-xs font-medium">All membership plans come with a 30 day satisfaction guarantee</p>
          </div>
          <div className="flex w-max rounded-full bg-[#305B43] p-0.5">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  'h-9 cursor-pointer rounded-full px-7 text-xs font-medium transition-colors',
                  period === t.id ? 'bg-[#D0EA50] text-[#00230F]' : 'text-white',
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {isPending ? (
          <div className="h-96 animate-pulse rounded-lg bg-white/5" />
        ) : isError || !plans.length ? (
          <p className="text-sm text-white/70">Plans are not available right now. Please refresh the page.</p>
        ) : (
          <>
            {/* Desktop: feature rows on the left, one column per plan */}
            <div className="hidden md:block">
              <div className="grid" style={{ gridTemplateColumns: `minmax(0,1fr) repeat(${plans.length}, 12rem)` }}>
                <div />
                {plans.map(p => (
                  <PlanHead key={p.id} plan={p} active={selected?.id === p.id} onSelect={() => setSelected(p)} />
                ))}
                {ROWS.map((row, i) => (
                  <div key={i} className="contents">
                    <div className={cn('flex items-center border-b border-[#305B43] py-5 pl-14 text-xs font-medium', i === ROWS.length - 1 && 'border-none')}>
                      {row.label}
                    </div>
                    {plans.map(p => (
                      <div
                        key={p.id}
                        className={cn(
                          'flex items-center justify-center border-b border-[#305B43] py-5 text-xs transition-colors',
                          selected?.id === p.id && 'border-[#4A7259] bg-[#305B43]',
                          i === ROWS.length - 1 && 'border-none pb-10',
                        )}
                      >
                        {row.value(p, period)}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile: one card per plan */}
            <div className="flex flex-col gap-4 md:hidden">
              {plans.map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelected(p)}
                  className={cn(
                    'flex cursor-pointer flex-col gap-4 rounded-xl border p-5 text-left transition-colors',
                    selected?.id === p.id ? 'border-[#D0EA50] bg-[#305B43]' : 'border-[#305B43]',
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold">{p.name}</p>
                      <p className="text-xs opacity-70">
                        {p.noDevices} Device{p.noDevices > 1 ? 's' : ''} · {p.offline ? 'Offline mode' : 'No Offline mode'}
                      </p>
                    </div>
                    <div className="text-right text-[#D0EA50]">{ROWS[0].value(p, period)}</div>
                  </div>
                  <ul className="flex flex-col gap-2 text-xs">
                    {ROWS.slice(1).map((row, i) => (
                      <li key={i} className="flex items-center justify-between gap-3 border-t border-white/10 pt-2">
                        <span className="opacity-80">{row.label}</span>
                        <span className="shrink-0">{row.value(p, period)}</span>
                      </li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>

            <div className="flex items-center justify-center gap-10 md:gap-20">
              {skipHref && (
                <Link href={skipHref} className="p-2 text-xs font-semibold underline">
                  Skip
                </Link>
              )}
              <Button className="w-full max-w-72 rounded" disabled={!selected} onClick={() => setConfirm(true)}>
                Continue
              </Button>
            </div>
          </>
        )}
      </div>
      <ConfirmPayment plan={selected} period={period} open={confirm} onOpenChange={setConfirm} />
    </section>
  );
};

export default ChooseYourPlan;

function PlanHead({ plan, active, onSelect }: { plan: Subscription; active: boolean; onSelect: () => void }) {
  return (
    <div className={cn('flex flex-col items-center gap-3 rounded-t-sm px-4 pt-5 pb-8 text-center text-xs transition-colors', active && 'bg-[#305B43]')}>
      <p className="font-semibold capitalize">{plan.name}</p>
      <div className="flex flex-col gap-1">
        <p>
          {plan.noDevices} Device{plan.noDevices > 1 ? 's' : ''}
        </p>
        <p className="text-[10px] opacity-80">{plan.offline ? 'Offline mode' : 'No Offline mode'}</p>
      </div>
      <Button
        onClick={onSelect}
        className={cn(
          'mt-2 h-9 w-26 rounded-sm text-xs',
          active ? 'bg-[#D0EA50] text-black hover:bg-[#D0EA50]' : 'border border-white/60 bg-transparent text-white hover:bg-white/10',
        )}
      >
        {active ? 'Selected' : 'Select'}
      </Button>
    </div>
  );
}

function ConfirmPayment({ plan, period, open, onOpenChange }: { plan: Subscription | null; period: Tab; open: boolean; onOpenChange: (o: boolean) => void }) {
  const qc = useQueryClient();
  const [, setAuth] = useQueryState('auth');
  const { data: tokenData } = useGetToken();
  const token = tokenData?.data.token;
  const { data } = useGetUserProfile(token);
  const me: UserProfileType | undefined = data?.data.data;
  const price = plan?.periods?.[period];

  const pay = useMutation({
    mutationFn: () =>
      https
        .post('/payment/subscription/initiate', {
          planId: plan!.id,
          period,
          email: me?.email,
          callbackUrl: `${window.location.origin}/payment?type=subscription`,
        })
        .then(r => r.data as { authorizationUrl: string | null; message?: string }),
    onSuccess: r => {
      qc.invalidateQueries({ queryKey: queryKeys.subscriptions.current() });
      if (r.authorizationUrl) window.location.href = r.authorizationUrl;
      else {
        toast.success(r.message ?? 'Subscription updated');
        onOpenChange(false);
      }
    },
    onError: e => toast.error('Could not start payment', { description: apiError(e) }),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="custom-font max-h-[calc(100dvh/var(--site-zoom,1)-2rem)] gap-5 overflow-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#00230F]">Confirm your membership</DialogTitle>
          <DialogDescription>
            {plan && price ? (
              <>
                {plan.name} · billed {PERIOD_TEXT[period]} · <span className="font-semibold text-[#00230F]">{formatPrice(price)}</span>
              </>
            ) : (
              'Choose a plan first.'
            )}
          </DialogDescription>
        </DialogHeader>
        <PaymentMethod provider={price?.provider} />
        <PaymentAssurance />
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            disabled={!plan || pay.isPending}
            onClick={() => {
              if (!token) {
                onOpenChange(false);
                setAuth('login');
                return;
              }
              pay.mutate();
            }}
          >
            {pay.isPending ? 'Opening checkout…' : token ? 'Continue to payment' : 'Log in to continue'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
