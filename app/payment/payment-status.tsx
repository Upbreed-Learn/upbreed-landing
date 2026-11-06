'use client';

import { Button } from '@/components/ui/button';
import { https } from '@/lib/https';
import { useGetToken } from '@/lib/queries/hooks';
import { queryKeys } from '@/lib/queries/query-keys';
import { useQueryClient } from '@tanstack/react-query';
import { Check, LoaderCircle, X } from 'lucide-react';
import Link from 'next/link';
import { useQueryState } from 'nuqs';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type Status = 'processing' | 'success' | 'failed';
type PaymentType = 'SUBSCRIPTION' | 'GIFT' | 'SESSION' | string;

const NEXT: Record<string, { done: string; retry: string; message: string }> = {
  SUBSCRIPTION: {
    done: '/student/courses',
    retry: '/pricing',
    message: 'Yaay! Congratulations, you are now an Upbreed member. Check your email for your receipt.',
  },
  GIFT: {
    done: '/',
    retry: '/pricing',
    message: 'Yaay! Your gift is on its way. We have emailed the recipient, and your receipt is in your inbox.',
  },
  SESSION: {
    done: '/student/sessions',
    retry: '/student/sessions',
    message: 'Yaay! Your 1-on-1 session is confirmed. Check your email for the video link and your receipt.',
  },
};

// Checks the payment a few times: the provider can take a moment to confirm it.
const TRIES = 8;
const WAIT_MS = 2500;

const PaymentStatus = () => {
  const params = useSearchParams();
  // Paystack sends ?reference= (and ?trxref=); our own callback always adds ?reference=.
  const reference = params.get('reference') ?? params.get('trxref');
  const { data: tokenData, isPending: tokenPending } = useGetToken();
  const loggedIn = Boolean(tokenData?.data.token);
  const [, setAuth] = useQueryState('auth');
  const qc = useQueryClient();
  const [status, setStatus] = useState<Status>('processing');
  const [type, setType] = useState<PaymentType>(params.get('type')?.toUpperCase() ?? 'SUBSCRIPTION');

  useEffect(() => {
    if (!reference || !loggedIn) return;
    let stopped = false;
    let tries = 0;
    const check = async () => {
      tries += 1;
      try {
        const r = await https.get('/payment/verify', { params: { reference } });
        if (stopped) return;
        if (r.data.payment?.paymentType) setType(r.data.payment.paymentType);
        if (r.data.status === 'success') {
          setStatus('success');
          qc.invalidateQueries({ queryKey: queryKeys.subscriptions.current() });
          qc.invalidateQueries({ queryKey: ['my-session-bookings'] });
          return;
        }
        if (r.data.status === 'failed') {
          setStatus('failed');
          return;
        }
      } catch {
        // network or server hiccup: try again below
      }
      if (stopped) return;
      if (tries >= TRIES) setStatus('failed');
      else setTimeout(check, WAIT_MS);
    };
    check();
    return () => {
      stopped = true;
    };
  }, [reference, loggedIn, qc]);

  const next = NEXT[type] ?? NEXT.SUBSCRIPTION;

  return (
    <section className="flex min-h-[calc(100vh/var(--site-zoom,1)-89px)] items-center justify-center bg-[#00230F] px-4 py-14">
      <div className="flex w-full max-w-sm flex-col items-center gap-5 rounded-2xl bg-white px-8 py-12 text-center text-[#00230F] shadow-xl">
        {!reference ? (
          <>
            <Badge kind="failed" />
            <h1 className="text-lg font-semibold">No payment to check</h1>
            <p className="text-sm text-[#737373]">This page opens after you pay. Head back and try again.</p>
            <Button asChild className="w-full">
              <Link href="/pricing">Go to pricing</Link>
            </Button>
          </>
        ) : !tokenPending && !loggedIn ? (
          <>
            <Badge kind="processing" spin={false} />
            <h1 className="text-lg font-semibold">Log in to see your payment</h1>
            <p className="text-sm text-[#737373]">Log in with the account you paid from and we&apos;ll confirm it.</p>
            <Button className="w-full" onClick={() => setAuth('login')}>
              Log in
            </Button>
          </>
        ) : status === 'processing' ? (
          <>
            <Badge kind="processing" />
            <h1 className="text-lg font-semibold">Payment is Processing ...</h1>
            <p className="text-sm text-[#737373]">Please wait, do not close this screen</p>
          </>
        ) : status === 'success' ? (
          <>
            <Badge kind="success" />
            <p className="text-xs font-semibold tracking-wide text-[#34A853] uppercase">Payment Successful</p>
            <h1 className="text-lg/snug font-semibold">{next.message}</h1>
            <Button asChild className="w-full">
              <Link href={next.done}>Continue</Link>
            </Button>
          </>
        ) : (
          <>
            <Badge kind="failed" />
            <p className="text-xs font-semibold tracking-wide text-[#E5484D] uppercase">Payment Failed</p>
            <h1 className="text-lg font-semibold">Oops! Payment Declined</h1>
            <p className="text-sm text-[#737373]">
              You have not been charged. If money left your account, it will be returned, or contact us and we&apos;ll sort it out.
            </p>
            <Button asChild className="w-full">
              <Link href={next.retry}>Try Again</Link>
            </Button>
          </>
        )}
      </div>
    </section>
  );
};

function Badge({ kind, spin = true }: { kind: 'processing' | 'success' | 'failed'; spin?: boolean }) {
  if (kind === 'processing')
    return (
      <div className="grid size-16 place-items-center rounded-full bg-[#D0EA50]/30">
        <LoaderCircle className={spin ? 'size-8 animate-spin text-[#305B43]' : 'size-8 text-[#305B43]'} />
      </div>
    );
  if (kind === 'success')
    return (
      <div className="grid size-16 place-items-center rounded-full bg-[#34A853]">
        <Check className="size-8 text-white" strokeWidth={3} />
      </div>
    );
  return (
    <div className="grid size-16 place-items-center rounded-full bg-[#E5484D]">
      <X className="size-8 text-white" strokeWidth={3} />
    </div>
  );
}

export default PaymentStatus;
