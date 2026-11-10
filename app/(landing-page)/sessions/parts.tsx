'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { https } from '@/lib/https';
import { formatPrice } from '@/lib/pricing';
import { useGetToken } from '@/lib/queries/hooks';
import {
  SessionInstructor,
  SessionTypeView,
  apiError,
  availableSoon,
  initials,
  priceLabel,
  timeLabel,
} from '@/lib/sessions';
import { cn } from '@/lib/utils';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useQueryState } from 'nuqs';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

/** Tabs at the top of every 1-on-1 page. */
export function SessionsTabs() {
  const path = usePathname();
  const tabs = [
    { href: '/sessions', label: 'Find an Instructor', on: path === '/sessions' || path.startsWith('/sessions/') },
    { href: '/student/sessions', label: 'My Sessions', on: path.startsWith('/student/sessions') },
    { href: '/student/courses', label: 'My Courses', on: false },
  ];
  return (
    <div className="flex gap-6 overflow-x-auto border-b border-white/10 text-[13px] font-medium">
      {tabs.map(t => (
        <Link
          key={t.href}
          href={t.href}
          className={cn('shrink-0 border-b-2 pb-3 transition-colors', t.on ? 'border-[#D0EA50] text-[#D0EA50]' : 'border-transparent text-white/70 hover:text-white')}
        >
          {t.label}
        </Link>
      ))}
    </div>
  );
}

export function Avatar({ name, src, className }: { name?: string | null; src?: string | null; className?: string }) {
  return src ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" className={cn('rounded-full object-cover', className)} />
  ) : (
    <div className={cn('grid place-items-center rounded-full bg-[#D0EA50] font-semibold text-[#00230F]', className)}>{initials(name)}</div>
  );
}

export function SubjectTag({ children, className }: { children: React.ReactNode; className?: string }) {
  if (!children) return null;
  return (
    <span className={cn('w-max rounded-md bg-[#D0EA50]/15 px-2 py-1 text-[10px] font-semibold tracking-wider text-[#D0EA50] uppercase', className)}>
      {children}
    </span>
  );
}

export function AvailabilityPill({ instructor }: { instructor: SessionInstructor }) {
  const on = availableSoon(instructor);
  return (
    <span className={cn('flex w-max items-center gap-1.5 text-xs', on ? 'text-[#34A853]' : 'text-white/50')}>
      <span className={cn('size-1.5 rounded-full', on ? 'bg-[#34A853]' : 'bg-white/40')} />
      {on ? 'Available' : 'Not available'}
    </span>
  );
}

export const subjectOf = (i: Pick<SessionInstructor, 'expertise' | 'title'>) => i.expertise?.split(/[,/|]/)[0]?.trim() || null;

/** One instructor in the "Find the Perfect Instructor" grid. */
export function InstructorCard({ instructor, onBook }: { instructor: SessionInstructor; onBook: () => void }) {
  const cheapest = instructor.sessionTypes[0];
  const open = Boolean(instructor.nextAvailable);
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-[#0B3A20]">
      <Link href={`/sessions/${instructor.id}`} className="relative block aspect-[3/4] bg-[#305B43]">
        {instructor.profilePictureUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={instructor.profilePictureUrl} alt={instructor.name} className="size-full object-cover object-top" />
        ) : (
          <div className="grid size-full place-items-center text-4xl font-semibold text-[#D0EA50]">{initials(instructor.name)}</div>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/sessions/${instructor.id}`} className="text-base font-semibold hover:text-[#D0EA50]">
            {instructor.name}
          </Link>
          <AvailabilityPill instructor={instructor} />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <SubjectTag>{subjectOf(instructor)}</SubjectTag>
          {instructor.rating && (
            <span className="flex items-center gap-1 text-xs text-white/70">
              <Star className="size-3 fill-[#D0EA50] text-[#D0EA50]" /> {instructor.rating} ({instructor.reviews})
            </span>
          )}
        </div>
        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <p className="text-sm font-semibold text-[#D0EA50]">{priceLabel(cheapest, formatPrice)}</p>
          <Button size="sm" disabled={!open} onClick={onBook} className="h-8 px-4 text-xs">
            {open ? 'Book Now' : 'Not Available'}
          </Button>
        </div>
      </div>
    </div>
  );
}

/** One screen, no scrolling on a laptop: who and what on the left, a calendar in the middle, times and send on the right. */
export function BookingDialog({ instructor, onClose }: { instructor: SessionInstructor | null; onClose: () => void }) {
  return (
    <Dialog open={Boolean(instructor)} onOpenChange={o => !o && onClose()}>
      <DialogContent className="custom-font max-h-[calc(100dvh/var(--site-zoom,1)-2rem)] w-[calc(100vw-2rem)] max-w-[1040px] gap-0 overflow-y-auto p-0 text-[#00230F] sm:max-w-[1040px] lg:overflow-hidden">
        {instructor && <BookingSteps key={instructor.id} instructor={instructor} onClose={onClose} />}
      </DialogContent>
    </Dialog>
  );
}

const WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

function BookingSteps({ instructor, onClose }: { instructor: SessionInstructor; onClose: () => void }) {
  const router = useRouter();
  const [, setAuth] = useQueryState('auth');
  const { data: tokenData } = useGetToken();
  const token = tokenData?.data.token;
  const [type, setType] = useState<SessionTypeView>(instructor.sessionTypes[0]!);
  const [slot, setSlot] = useState<string | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const [month, setMonth] = useState<Date | null>(null);
  const [note, setNote] = useState('');

  const slots = useQuery({
    queryKey: ['session-slots', type.id],
    queryFn: () => https.get(`/sessions/types/${type.id}/slots`).then(r => r.data.data as string[]),
  });
  // Open times grouped by the visitor's local day.
  const byDay = useMemo(() => {
    const m = new Map<string, Date[]>();
    for (const s of slots.data ?? []) {
      const d = new Date(s);
      m.set(dayKey(d), [...(m.get(dayKey(d)) ?? []), d]);
    }
    return m;
  }, [slots.data]);
  const first = slots.data?.[0] ? new Date(slots.data[0]) : null;
  const last = slots.data?.length ? new Date(slots.data[slots.data.length - 1]) : null;
  const dayOn = picked ?? (first ? dayKey(first) : null);
  const shownMonth = month ?? (first ? new Date(first.getFullYear(), first.getMonth(), 1) : new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const times = dayOn ? byDay.get(dayOn) ?? [] : [];

  // The month grid (weeks start on Monday).
  const monthStart = shownMonth.getTime();
  const cells = useMemo(() => {
    const m0 = new Date(monthStart);
    const y = m0.getFullYear();
    const mo = m0.getMonth();
    const lead = (new Date(y, mo, 1).getDay() + 6) % 7;
    const days = new Date(y, mo + 1, 0).getDate();
    return [...Array.from({ length: lead }, () => null), ...Array.from({ length: days }, (_, i) => new Date(y, mo, i + 1))];
  }, [monthStart]);
  const canPrev = first ? shownMonth > new Date(first.getFullYear(), first.getMonth(), 1) : false;
  const canNext = last ? shownMonth < new Date(last.getFullYear(), last.getMonth(), 1) : false;
  const moveMonth = (n: number) => setMonth(new Date(shownMonth.getFullYear(), shownMonth.getMonth() + n, 1));

  const book = useMutation({
    mutationFn: () => https.post('/sessions/book', { sessionTypeId: type.id, startsAt: slot, note: note || undefined }),
    onSuccess: r => {
      toast.success('Request sent', { description: `${instructor.name} has 48 hours to accept. You'll pay once they do.` });
      onClose();
      router.push(`/student/sessions?booking=${r.data.data.id}`);
    },
    onError: e => {
      toast.error('Could not send request', { description: apiError(e) });
      setSlot(null);
      slots.refetch();
    },
  });

  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const chosen = slot ? new Date(slot) : null;
  const firstName = instructor.name.split(' ')[0];

  return (
    <div className="grid lg:h-[min(620px,calc(100dvh/var(--site-zoom,1)-2rem))] lg:grid-cols-[290px_minmax(0,1fr)_300px]">
      <DialogHeader className="sr-only">
        <DialogTitle>Book a 1-on-1 with {instructor.name}</DialogTitle>
        <DialogDescription>Pick a day and a time, then send your request.</DialogDescription>
      </DialogHeader>

      {/* Who and what */}
      <aside className="flex flex-col gap-4 bg-[#00230F] p-6 text-white">
        <div className="flex items-center gap-3.5">
          {instructor.profilePictureUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={instructor.profilePictureUrl} alt="" className="h-20 w-16 shrink-0 rounded-xl object-cover object-top" />
          ) : (
            <span className="grid h-20 w-16 shrink-0 place-items-center rounded-xl bg-[#305B43] text-lg font-bold text-[#D0EA50]">{initials(instructor.name)}</span>
          )}
          <div className="flex min-w-0 flex-col gap-1">
            <p className="text-lg/tight font-bold">{instructor.name}</p>
            {(instructor.title || subjectOf(instructor)) && <p className="line-clamp-2 text-xs text-[#B9C7BE]">{instructor.title || subjectOf(instructor)}</p>}
            {instructor.rating ? (
              <p className="flex items-center gap-1 text-xs text-[#E8F0E4]">
                <Star className="size-3.5 fill-[#FFC700] text-[#FFC700]" /> {instructor.rating.toFixed(1)} · {instructor.reviews} review{instructor.reviews === 1 ? '' : 's'}
              </p>
            ) : null}
          </div>
        </div>

        {instructor.sessionTypes.length > 1 ? (
          <div role="radiogroup" aria-label="Session" className="flex flex-col gap-2">
            {instructor.sessionTypes.slice(0, 3).map(t => (
              <button
                key={t.id}
                role="radio"
                aria-checked={t.id === type.id}
                onClick={() => {
                  setType(t);
                  setSlot(null);
                  setPicked(null);
                  setMonth(null);
                }}
                className={cn(
                  'flex cursor-pointer items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-left text-xs',
                  t.id === type.id ? 'border-[#D0EA50] bg-[#D0EA50]/10' : 'border-white/15 hover:border-white/40',
                )}
              >
                <span>
                  <span className="block font-semibold text-white">{t.name}</span>
                  <span className="text-[#B9C7BE]">{t.durationMinutes} min</span>
                </span>
                <span className="font-bold text-[#D0EA50]">{formatPrice(t.price)}</span>
              </button>
            ))}
          </div>
        ) : null}

        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 rounded-xl bg-white/[0.06] p-3.5 text-[13px]">
          <dt className="text-[#B9C7BE]">Session</dt>
          <dd className="text-right font-semibold">{type.name}</dd>
          <dt className="text-[#B9C7BE]">Length</dt>
          <dd className="text-right font-semibold">{type.durationMinutes} minutes</dd>
          <dt className="text-[#B9C7BE]">Price</dt>
          <dd className="text-right text-base font-bold text-[#D0EA50]">{formatPrice(type.price)}</dd>
          <dt className="text-[#B9C7BE]">Where</dt>
          <dd className="text-right font-semibold">Google Meet</dd>
        </dl>
        {type.description && <p className="line-clamp-3 text-xs/relaxed text-[#E8F0E4]">{type.description}</p>}

        <ol className="mt-auto flex flex-col gap-2 text-xs text-[#E8F0E4]">
          {[`Send your request (no charge yet)`, `${firstName} accepts within 48 hours`, 'Pay to confirm and get your Meet link'].map((t, i) => (
            <li key={t} className="flex items-center gap-2.5">
              <span className="grid size-5 shrink-0 place-items-center rounded-full bg-[#D0EA50] text-[10px] font-bold text-[#00230F]">{i + 1}</span>
              {t}
            </li>
          ))}
        </ol>
      </aside>

      {/* Calendar */}
      <section className="flex flex-col gap-4 border-[#EEF2EC] p-6 lg:border-r">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold">Pick a day</h3>
            <p className="text-xs text-[#5E6B63]">Times are in your time zone ({zone})</p>
          </div>
          <div className="flex items-center gap-1">
            <button type="button" aria-label="Previous month" disabled={!canPrev} onClick={() => moveMonth(-1)} className="grid size-9 cursor-pointer place-items-center rounded-lg hover:bg-[#F0F4EE] disabled:cursor-default disabled:opacity-30">
              <ChevronLeft className="size-4" />
            </button>
            <span className="w-28 text-center text-sm font-semibold">{shownMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
            <button type="button" aria-label="Next month" disabled={!canNext} onClick={() => moveMonth(1)} className="grid size-9 cursor-pointer place-items-center rounded-lg hover:bg-[#F0F4EE] disabled:cursor-default disabled:opacity-30">
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
        {slots.isPending ? (
          <div className="flex-1 animate-pulse rounded-xl bg-[#F4F7F4]" />
        ) : !byDay.size ? (
          <p className="grid flex-1 place-items-center rounded-xl bg-[#F4F7F4] p-6 text-center text-sm text-[#5E6B63]">
            {firstName} has no open times right now. Please check back soon.
          </p>
        ) : (
          <div className="grid flex-1 grid-cols-7 content-start gap-1.5">
            {WEEK.map(w => (
              <span key={w} className="pb-1 text-center text-[11px] font-semibold text-[#5E6B63]">
                {w}
              </span>
            ))}
            {cells.map((d, i) => {
              if (!d) return <span key={i} />;
              const k = dayKey(d);
              const open = byDay.has(k);
              const on = k === dayOn;
              return (
                <button
                  key={i}
                  type="button"
                  disabled={!open}
                  aria-pressed={on}
                  aria-label={`${d.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}${open ? `, ${byDay.get(k)!.length} times` : ', not available'}`}
                  onClick={() => {
                    setPicked(k);
                    setSlot(null);
                  }}
                  className={cn(
                    'relative grid aspect-square max-h-14 place-items-center rounded-xl text-sm font-semibold tabular-nums transition-colors',
                    on ? 'bg-[#00230F] text-[#D0EA50]' : open ? 'cursor-pointer bg-[#E8F0E4] text-[#00230F] hover:bg-[#D0EA50]' : 'text-[#B5BDB8]',
                  )}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>
        )}
        <p className="flex items-center gap-3 text-[11px] text-[#5E6B63]">
          <span className="flex items-center gap-1.5">
            <span className="size-3 rounded bg-[#E8F0E4]" /> Open
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-3 rounded bg-[#00230F]" /> Chosen
          </span>
        </p>
      </section>

      {/* Times + send */}
      <section className="flex flex-col gap-4 p-6">
        <div>
          <h3 className="text-lg font-bold">Pick a time</h3>
          <p className="text-xs text-[#5E6B63]">{dayOn && times[0] ? times[0].toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' }) : 'Choose a day first'}</p>
        </div>
        <div className="grid grid-cols-3 content-start gap-2">
          {times.slice(0, 15).map(d => (
            <button
              key={d.toISOString()}
              type="button"
              aria-pressed={slot === d.toISOString()}
              onClick={() => setSlot(d.toISOString())}
              className={cn(
                'cursor-pointer rounded-lg border py-2 text-xs font-semibold tabular-nums',
                slot === d.toISOString() ? 'border-[#34A853] bg-[#34A853] text-white' : 'border-[#DDE5DB] hover:border-[#305B43]',
              )}
            >
              {timeLabel(d)}
            </button>
          ))}
        </div>
        <label className="flex flex-col gap-1.5 text-xs font-semibold">
          What would you like to cover? (optional)
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            maxLength={1000}
            rows={2}
            placeholder={`Tell ${firstName} what you need help with`}
            className="resize-none rounded-xl border border-[#DDE5DB] p-2.5 text-[13px] font-normal outline-none focus:border-[#34A853]"
          />
        </label>
        <div className="mt-auto flex flex-col gap-2.5">
          <p className="rounded-xl bg-[#F4F7F4] px-3.5 py-2.5 text-[13px]">
            {chosen ? (
              <>
                <b>{chosen.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}</b> at <b>{timeLabel(chosen)}</b> · {type.durationMinutes} min · <b>{formatPrice(type.price)}</b>
              </>
            ) : (
              <span className="text-[#5E6B63]">No time chosen yet</span>
            )}
          </p>
          <Button
            className="h-12 w-full text-sm font-bold"
            disabled={!slot || book.isPending}
            onClick={() => {
              if (!token) return setAuth('login');
              book.mutate();
            }}
          >
            {book.isPending ? 'Sending…' : token ? 'Send request' : 'Log in to send request'}
          </Button>
          <p className="text-center text-[11px] text-[#5E6B63]">You won&apos;t be charged until {firstName} accepts.</p>
        </div>
      </section>
    </div>
  );
}
