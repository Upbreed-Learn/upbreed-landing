'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { https } from '@/lib/https';
import { formatPrice } from '@/lib/pricing';
import { MyBooking, STATUS_TEXT, apiError, shortDate, timeLabel } from '@/lib/sessions';
import { cn } from '@/lib/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Star, Video } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Avatar, SessionsTabs } from '../../(landing-page)/sessions/parts';

const JOIN_EARLY_MS = 15 * 60_000;
type Tab = 'upcoming' | 'completed' | 'other';

const isUpcoming = (b: MyBooking) => ['REQUESTED', 'ACCEPTED', 'CONFIRMED'].includes(b.status) && new Date(b.endsAt).getTime() > Date.now();
const canJoin = (b: MyBooking, now = Date.now()) =>
  b.status === 'CONFIRMED' && now >= new Date(b.startsAt).getTime() - JOIN_EARLY_MS && now <= new Date(b.endsAt).getTime();

function statusChip(b: MyBooking) {
  if (b.status === 'REQUESTED') return { text: 'Request Pending', cls: 'bg-[#F5C451]/15 text-[#F5C451]' };
  if (b.status === 'ACCEPTED') return { text: 'Pay to Confirm', cls: 'bg-[#D0EA50] text-[#00230F]' };
  if (b.status === 'CONFIRMED') return canJoin(b) ? { text: 'Join Session', cls: 'bg-[#34A853] text-white' } : { text: 'Confirmed', cls: 'bg-[#34A853]/15 text-[#34A853]' };
  if (b.status === 'COMPLETED') return { text: 'Completed Session', cls: 'bg-white/10 text-white' };
  return { text: STATUS_TEXT[b.status], cls: 'bg-white/5 text-white/60' };
}

const MySessions = () => {
  const qc = useQueryClient();
  const router = useRouter();
  const params = useSearchParams();
  const bookings = useQuery({
    queryKey: ['my-session-bookings'],
    queryFn: () => https.get('/sessions/my-bookings', { params: { limit: 50 } }).then(r => r.data.data as MyBooking[]),
    refetchInterval: 60_000,
  });

  // Older checkout links came back here with ?reference=: confirm the payment straight away.
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

  const [tab, setTab] = useState<Tab>('upcoming');
  const [openId, setOpenId] = useState<number | null>(Number(params.get('booking')) || null);
  const lists = useMemo(() => {
    const all = bookings.data ?? [];
    const upcoming = all.filter(isUpcoming).sort((a, b) => +new Date(a.startsAt) - +new Date(b.startsAt));
    return {
      upcoming,
      completed: all.filter(b => b.status === 'COMPLETED'),
      other: all.filter(b => !isUpcoming(b) && b.status !== 'COMPLETED'),
    };
  }, [bookings.data]);
  const open = bookings.data?.find(b => b.id === openId) ?? null;

  // A booking opened from a link (?booking=) may live on another tab.
  useEffect(() => {
    if (!open) return;
    setTab(isUpcoming(open) ? 'upcoming' : open.status === 'COMPLETED' ? 'completed' : 'other');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open?.id]);

  const rows = lists[tab];
  const tabs: { id: Tab; label: string }[] = [
    { id: 'upcoming', label: `Upcoming (${lists.upcoming.length})` },
    { id: 'completed', label: `Completed (${lists.completed.length})` },
    ...(lists.other.length ? [{ id: 'other' as Tab, label: `Cancelled & expired (${lists.other.length})` }] : []),
  ];

  return (
    <section className="flex min-h-[60vh] justify-center bg-[#00230F] text-white">
      <div className="flex w-full max-w-7xl flex-col gap-8 px-5 py-10 sm:px-9 md:px-12 md:py-14 lg:px-18">
        <SessionsTabs />
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold md:text-[28px]">My Sessions</h1>
            <p className="text-sm text-white/70">Learn at your pace, on your schedule.</p>
          </div>
          <Button asChild>
            <Link href="/sessions">Book a session</Link>
          </Button>
        </div>

        <div className="flex gap-2 overflow-x-auto">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn('shrink-0 cursor-pointer rounded-full px-4 py-2 text-xs', tab === t.id ? 'bg-[#D0EA50] text-[#00230F]' : 'bg-white/5 text-white/80')}
            >
              {t.label}
            </button>
          ))}
        </div>

        {bookings.isPending ? (
          <div className="h-40 animate-pulse rounded-2xl bg-white/10" />
        ) : bookings.isError ? (
          <p className="text-white/70">Couldn&apos;t load your sessions. Please refresh.</p>
        ) : !rows.length ? (
          <p className="py-8 text-sm text-white/70">
            {tab === 'upcoming' ? 'No upcoming sessions. Find an instructor and book one.' : tab === 'completed' ? 'No completed sessions yet.' : 'Nothing here.'}
          </p>
        ) : (
          <ul className="flex flex-col divide-y divide-white/10 rounded-2xl bg-[#0B3A20]">
            {rows.map(b => {
              const chip = statusChip(b);
              return (
                <li key={b.id}>
                  <button onClick={() => setOpenId(b.id)} className="flex w-full cursor-pointer items-center gap-4 px-4 py-4 text-left hover:bg-white/5 sm:px-6">
                    <Avatar name={b.instructor?.name} src={b.instructor?.profilePictureUrl} className="size-11 shrink-0 text-sm" />
                    <div className="min-w-0 flex-1 sm:grid sm:grid-cols-[1.5fr_1fr_1fr] sm:items-center sm:gap-4">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{b.instructor?.name}</p>
                        <p className="truncate text-xs text-white/60">{b.sessionType?.name}</p>
                      </div>
                      <p className="text-xs text-white/80 max-sm:mt-1 max-sm:inline">{shortDate(b.startsAt)}</p>
                      <p className="text-xs text-white/80 max-sm:ml-2 max-sm:inline">{timeLabel(new Date(b.startsAt))}</p>
                    </div>
                    <span className={cn('shrink-0 rounded-full px-3 py-1.5 text-[11px] font-medium', chip.cls)}>{chip.text}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <Dialog open={Boolean(open)} onOpenChange={o => !o && setOpenId(null)}>
        <DialogContent className="custom-font max-h-[calc(100dvh/var(--site-zoom,1)-2rem)] overflow-auto text-[#00230F] sm:max-w-md">
          {open && <BookingDetail key={open.id} booking={open} onClose={() => setOpenId(null)} />}
        </DialogContent>
      </Dialog>
    </section>
  );
};

function BookingDetail({ booking: b, onClose }: { booking: MyBooking; onClose: () => void }) {
  const qc = useQueryClient();
  const pay = useMutation({
    mutationFn: () => https.post(`/sessions/bookings/${b.id}/pay`, { callbackUrl: `${window.location.origin}/payment?type=session` }).then(r => r.data.authorizationUrl as string),
    onSuccess: url => {
      window.location.href = url;
    },
    onError: e => toast.error('Could not start payment', { description: apiError(e) }),
  });
  const cancel = useMutation({
    mutationFn: () => https.post(`/sessions/bookings/${b.id}/cancel`),
    onSuccess: () => {
      toast.success('Request cancelled');
      qc.invalidateQueries({ queryKey: ['my-session-bookings'] });
      onClose();
    },
    onError: e => toast.error('Could not cancel', { description: apiError(e) }),
  });

  if (b.status === 'CONFIRMED') return <LiveSession booking={b} onClose={onClose} />;
  if (b.status === 'COMPLETED') return <ReviewSession booking={b} />;

  const pending = b.status === 'REQUESTED' || b.status === 'ACCEPTED';
  const chip = statusChip(b);
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <DialogHeader className="items-center">
        <DialogDescription>{pending ? 'You have a pending session with' : `This session was ${b.status.toLowerCase()}`}</DialogDescription>
        <DialogTitle className="text-xl">{b.instructor?.name}</DialogTitle>
      </DialogHeader>
      <Avatar name={b.instructor?.name} src={b.instructor?.profilePictureUrl} className="size-16 text-lg" />
      <p className="text-sm text-[#474747]">
        {b.sessionType?.name} · {shortDate(b.startsAt)} · {timeLabel(new Date(b.startsAt))} · {b.sessionType?.durationMinutes} min
      </p>
      <span className={cn('rounded-full px-3 py-1.5 text-xs font-medium', b.status === 'REQUESTED' ? 'bg-[#F5C451]/20 text-[#8A6100]' : chip.cls)}>{chip.text}</span>
      {b.status === 'REQUESTED' && <p className="text-xs text-[#737373]">The instructor has 48 hours to accept. We&apos;ll email you.</p>}
      {b.declineReason && <p className="text-sm text-[#474747]">Instructor&apos;s note: “{b.declineReason}”</p>}
      <div className="flex w-full flex-col gap-2">
        {b.status === 'ACCEPTED' && (
          <Button disabled={pay.isPending} onClick={() => pay.mutate()}>
            {pay.isPending ? 'Opening checkout…' : `Pay ${formatPrice(b.price)} to confirm`}
          </Button>
        )}
        {pending && (
          <Button variant="outline" disabled={cancel.isPending} onClick={() => window.confirm('Cancel this request?') && cancel.mutate()}>
            Cancel request
          </Button>
        )}
        {!pending && (
          <Button asChild>
            <Link href={b.instructor ? `/sessions/${b.instructor.id}` : '/sessions'}>Book again</Link>
          </Button>
        )}
      </div>
    </div>
  );
}

const pad = (n: number) => String(n).padStart(2, '0');
function clock(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  return h ? `${h}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}` : `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;
}

/** Confirmed session: countdown before it starts, time left while it runs, and the Meet link. */
function LiveSession({ booking: b, onClose }: { booking: MyBooking; onClose: () => void }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const start = new Date(b.startsAt).getTime();
  const end = new Date(b.endsAt).getTime();
  const live = now >= start && now <= end;
  const joinable = canJoin(b, now);

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <DialogHeader className="items-center">
        <DialogTitle className="text-xl">{live ? 'Live Learning Session!' : 'Your session is confirmed'}</DialogTitle>
        <DialogDescription>{live ? 'Engage, Interact and Learn' : `with ${b.instructor?.name}`}</DialogDescription>
      </DialogHeader>
      <Avatar name={b.instructor?.name} src={b.instructor?.profilePictureUrl} className="size-16 text-lg" />
      <p className="text-sm text-[#474747]">
        {b.sessionType?.name} · {shortDate(b.startsAt)} · {timeLabel(new Date(b.startsAt))}
      </p>
      <div className="flex flex-col items-center">
        <span className="text-xs text-[#737373]">{live ? 'Time left' : now < start ? 'Starts in' : 'Session ended'}</span>
        <span className="font-mono text-3xl font-semibold tabular-nums">{live ? clock(end - now) : now < start ? clock(start - now) : '00:00'}</span>
      </div>
      <div className="flex w-full flex-col gap-2">
        {b.meetingUrl ? (
          <Button asChild disabled={!joinable} className={cn(!joinable && 'pointer-events-none opacity-50')}>
            <a href={b.meetingUrl} target="_blank" rel="noreferrer">
              <Video className="size-4" /> {joinable ? 'Join Google Meet' : 'Join opens 15 minutes before'}
            </a>
          </Button>
        ) : (
          <p className="text-xs text-[#737373]">The video link will be emailed to you before the session.</p>
        )}
        <Button variant="outline" onClick={onClose}>
          {live ? 'End Session' : 'Close'}
        </Button>
      </div>
      <p className="text-xs text-[#737373]">You can leave a review here once the session is over.</p>
    </div>
  );
}

function ReviewSession({ booking: b }: { booking: MyBooking }) {
  const qc = useQueryClient();
  const [rating, setRating] = useState(b.review?.rating ?? 0);
  const [comment, setComment] = useState(b.review?.comment ?? '');
  const save = useMutation({
    mutationFn: () => https.post(`/sessions/bookings/${b.id}/review`, { rating, comment: comment || undefined }),
    onSuccess: () => {
      toast.success('Thanks for your feedback');
      qc.invalidateQueries({ queryKey: ['my-session-bookings'] });
    },
    onError: e => toast.error('Could not save review', { description: apiError(e) }),
  });
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <DialogHeader className="items-center">
        <DialogDescription>You had completed a session with</DialogDescription>
        <DialogTitle className="text-xl">{b.instructor?.name}</DialogTitle>
      </DialogHeader>
      <Avatar name={b.instructor?.name} src={b.instructor?.profilePictureUrl} className="size-16 text-lg" />
      <p className="text-sm text-[#474747]">
        {b.sessionType?.name} · {shortDate(b.startsAt)} · Completed
      </p>
      <div className="flex w-full flex-col gap-3 rounded-xl bg-[#F4F7F4] p-4">
        <p className="text-base font-semibold">How Was Your Session?</p>
        <p className="-mt-2 text-xs text-[#737373]">Help Others By Sharing Your Experience</p>
        <div className="flex justify-center gap-1.5">
          {[1, 2, 3, 4, 5].map(n => (
            <button key={n} aria-label={`${n} stars`} onClick={() => setRating(n)} className="cursor-pointer">
              <Star className={cn('size-7', n <= rating ? 'fill-[#F5B301] text-[#F5B301]' : 'text-[#C4C4C4]')} />
            </button>
          ))}
        </div>
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          maxLength={2000}
          placeholder="Write a Review"
          className="h-24 rounded-xl border border-[#D4D4D4] bg-white p-3 text-sm outline-none focus:border-[#34A853]"
        />
        <Button disabled={!rating || save.isPending} onClick={() => save.mutate()}>
          {save.isPending ? 'Sending…' : b.review ? 'Update Feedback' : 'Submit Feedback'}
        </Button>
      </div>
    </div>
  );
}

export default MySessions;
