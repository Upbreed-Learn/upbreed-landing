'use client';

import { Button } from '@/components/ui/button';
import { https } from '@/lib/https';
import { formatPrice } from '@/lib/pricing';
import { MyBooking, STATUS_TEXT, apiError, fullDate } from '@/lib/sessions';
import { cn } from '@/lib/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Star } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const MySessions = () => {
  const qc = useQueryClient();
  const router = useRouter();
  const params = useSearchParams();
  const bookings = useQuery({
    queryKey: ['my-session-bookings'],
    queryFn: () => https.get('/sessions/my-bookings', { params: { limit: 50 } }).then(r => r.data.data as MyBooking[]),
  });

  // Back from checkout: confirm the payment straight away (webhooks also do this).
  const reference = params.get('reference');
  useEffect(() => {
    if (!reference) return;
    https
      .get('/payment/verify', { params: { reference } })
      .then(r => {
        if (r.data.status === 'success') toast.success('Payment received — your session is confirmed. Check your email for the video link.');
        else if (r.data.status === 'failed') toast.error('Payment did not go through. Please try again.');
      })
      .catch(() => undefined)
      .finally(() => {
        qc.invalidateQueries({ queryKey: ['my-session-bookings'] });
        router.replace('/student/sessions');
      });
  }, [reference, qc, router]);

  const pay = useMutation({
    mutationFn: (id: number) =>
      https.post(`/sessions/bookings/${id}/pay`, { callbackUrl: `${window.location.origin}/student/sessions` }).then(r => r.data.authorizationUrl as string),
    onSuccess: url => {
      window.location.href = url;
    },
    onError: e => toast.error('Could not start payment', { description: apiError(e) }),
  });
  const cancel = useMutation({
    mutationFn: (id: number) => https.post(`/sessions/bookings/${id}/cancel`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['my-session-bookings'] }),
    onError: e => toast.error('Could not cancel', { description: apiError(e) }),
  });

  const highlight = Number(params.get('booking')) || null;

  return (
    <section className="flex min-h-[60vh] justify-center bg-[#00230F] text-white">
      <div className="flex w-full max-w-4xl flex-col gap-8 px-9 py-14 md:px-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">My 1-on-1 sessions</h1>
            <p className="text-sm text-white/70">Requests, payments and video links in one place.</p>
          </div>
          <Button asChild>
            <Link href="/sessions">Book a session</Link>
          </Button>
        </div>
        {bookings.isPending ? (
          <div className="h-40 animate-pulse rounded-2xl bg-white/10" />
        ) : bookings.isError ? (
          <p className="text-white/70">Couldn&apos;t load your sessions. Please refresh.</p>
        ) : !bookings.data.length ? (
          <p className="text-white/70">No sessions yet.</p>
        ) : (
          <ul className="flex flex-col gap-4">
            {bookings.data.map(b => (
              <li key={b.id} className={cn('flex flex-col gap-3 rounded-2xl bg-[#305B43] p-5', highlight === b.id && 'ring-2 ring-[#D0EA50]')}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-lg font-semibold">
                    {b.sessionType?.name} <span className="font-normal text-white/70">with {b.instructor?.name}</span>
                  </p>
                  <span className={cn('rounded-full px-3 py-1 text-xs', b.status === 'ACCEPTED' || b.status === 'CONFIRMED' ? 'bg-[#D0EA50] text-black' : 'bg-white/10')}>
                    {STATUS_TEXT[b.status]}
                  </span>
                </div>
                <p className="text-sm text-white/80">
                  {fullDate(b.startsAt)} · {b.sessionType?.durationMinutes} min · {formatPrice(b.price)}
                </p>
                {b.declineReason && <p className="text-sm text-white/70">Instructor&apos;s note: “{b.declineReason}”</p>}
                <div className="flex flex-wrap gap-3">
                  {b.status === 'ACCEPTED' && (
                    <Button disabled={pay.isPending} onClick={() => pay.mutate(b.id)}>
                      Pay {formatPrice(b.price)}
                    </Button>
                  )}
                  {b.status === 'CONFIRMED' &&
                    (b.meetingUrl ? (
                      <Button asChild>
                        <a href={b.meetingUrl} target="_blank" rel="noreferrer">
                          Join video call
                        </a>
                      </Button>
                    ) : (
                      <p className="text-sm text-white/70">The video link will be emailed to you before the session.</p>
                    ))}
                  {(b.status === 'REQUESTED' || b.status === 'ACCEPTED') && (
                    <Button variant="outline" className="bg-transparent text-white" disabled={cancel.isPending} onClick={() => window.confirm('Cancel this request?') && cancel.mutate(b.id)}>
                      Cancel request
                    </Button>
                  )}
                </div>
                {b.status === 'COMPLETED' && <Review booking={b} />}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

function Review({ booking }: { booking: MyBooking }) {
  const qc = useQueryClient();
  const [rating, setRating] = useState(booking.review?.rating ?? 0);
  const [comment, setComment] = useState(booking.review?.comment ?? '');
  const save = useMutation({
    mutationFn: () => https.post(`/sessions/bookings/${booking.id}/review`, { rating, comment: comment || undefined }),
    onSuccess: () => {
      toast.success('Thanks for your review');
      qc.invalidateQueries({ queryKey: ['my-session-bookings'] });
    },
    onError: e => toast.error('Could not save review', { description: apiError(e) }),
  });
  return (
    <div className="flex flex-col gap-2 rounded-xl bg-[#00230F]/50 p-3">
      <p className="text-sm">{booking.review ? 'Your review' : 'How was it?'}</p>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(n => (
          <button key={n} aria-label={`${n} stars`} onClick={() => setRating(n)} className="cursor-pointer">
            <Star className={cn('size-5', n <= rating ? 'fill-[#D0EA50] text-[#D0EA50]' : 'text-white/40')} />
          </button>
        ))}
      </div>
      <textarea value={comment} onChange={e => setComment(e.target.value)} maxLength={2000} placeholder="Optional comment" className="h-16 rounded-lg bg-white/10 p-2 text-sm outline-none" />
      <Button className="w-max" disabled={!rating || save.isPending} onClick={() => save.mutate()}>
        {booking.review ? 'Update review' : 'Submit review'}
      </Button>
    </div>
  );
}

export default MySessions;
