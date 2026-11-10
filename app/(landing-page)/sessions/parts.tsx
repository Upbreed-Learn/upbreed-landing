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
  dayLabel,
  initials,
  priceLabel,
  timeLabel,
} from '@/lib/sessions';
import { cn } from '@/lib/utils';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Star } from 'lucide-react';
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

/** Select Date & Time → Confirm your booking → request sent. */
export function BookingDialog({ instructor, onClose }: { instructor: SessionInstructor | null; onClose: () => void }) {
  return (
    <Dialog open={Boolean(instructor)} onOpenChange={o => !o && onClose()}>
      <DialogContent className="custom-font max-h-[calc(100dvh/var(--site-zoom,1)-2rem)] overflow-auto text-[#00230F] sm:max-w-lg">
        {instructor && <BookingSteps key={instructor.id} instructor={instructor} onClose={onClose} />}
      </DialogContent>
    </Dialog>
  );
}

function BookingSteps({ instructor, onClose }: { instructor: SessionInstructor; onClose: () => void }) {
  const router = useRouter();
  const [, setAuth] = useQueryState('auth');
  const { data: tokenData } = useGetToken();
  const token = tokenData?.data.token;
  const [type, setType] = useState<SessionTypeView>(instructor.sessionTypes[0]!);
  const [slot, setSlot] = useState<string | null>(null);
  const [day, setDay] = useState(0);
  const [step, setStep] = useState<'time' | 'confirm'>('time');
  const [note, setNote] = useState('');

  const slots = useQuery({
    queryKey: ['session-slots', type.id],
    queryFn: () => https.get(`/sessions/types/${type.id}/slots`).then(r => r.data.data as string[]),
  });
  const byDay = useMemo(() => {
    const m = new Map<string, Date[]>();
    for (const s of slots.data ?? []) {
      const d = new Date(s);
      const k = dayLabel(d);
      m.set(k, [...(m.get(k) ?? []), d]);
    }
    return [...m.entries()];
  }, [slots.data]);

  const book = useMutation({
    mutationFn: () => https.post('/sessions/book', { sessionTypeId: type.id, startsAt: slot, note: note || undefined }),
    onSuccess: r => {
      toast.success('Request sent', { description: `${instructor.name} has 48 hours to accept. You'll pay once they do.` });
      onClose();
      router.push(`/student/sessions?booking=${r.data.data.id}`);
    },
    onError: e => {
      toast.error('Could not send request', { description: apiError(e) });
      setStep('time');
      setSlot(null);
      slots.refetch();
    },
  });

  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const head = (
    <div className="flex items-center gap-3">
      <Avatar name={instructor.name} src={instructor.profilePictureUrl} className="size-11 text-sm" />
      <div className="flex-1">
        <p className="text-base font-semibold">{instructor.name}</p>
        <SubjectTag className="bg-[#305B43]/10 text-[#305B43]">{subjectOf(instructor)}</SubjectTag>
      </div>
      <p className="text-lg font-semibold">{formatPrice(type.price)}</p>
    </div>
  );

  if (step === 'confirm' && slot) {
    const d = new Date(slot);
    return (
      <div className="flex flex-col gap-5">
        <DialogHeader>
          <button onClick={() => setStep('time')} className="w-max cursor-pointer text-sm text-[#305B43]">
            ← Back
          </button>
          <DialogTitle>Confirm your booking</DialogTitle>
          <DialogDescription>Review your booking summary before sending your request.</DialogDescription>
        </DialogHeader>
        {head}
        <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 rounded-xl bg-[#F4F7F4] p-4 text-sm">
          <dt className="text-[#737373]">Session:</dt>
          <dd className="font-medium">{type.name}</dd>
          <dt className="text-[#737373]">Date:</dt>
          <dd className="font-medium">{new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(d)}</dd>
          <dt className="text-[#737373]">Time:</dt>
          <dd className="font-medium">
            {timeLabel(d)} <span className="text-[#737373]">({zone})</span>
          </dd>
          <dt className="text-[#737373]">Duration:</dt>
          <dd className="font-medium">{type.durationMinutes} Mins</dd>
          <dt className="text-[#737373]">Price:</dt>
          <dd className="font-medium">{formatPrice(type.price)}</dd>
        </dl>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Additional Notes
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            maxLength={1000}
            placeholder="What would you like to cover? (optional)"
            className="h-24 rounded-xl border border-[#D4D4D4] p-3 text-sm font-normal outline-none focus:border-[#34A853]"
          />
        </label>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => setStep('time')}>
            Modify
          </Button>
          <Button
            className="flex-1"
            disabled={book.isPending}
            onClick={() => {
              if (!token) return setAuth('login');
              book.mutate();
            }}
          >
            {book.isPending ? 'Sending…' : 'Send Request'}
          </Button>
        </div>
        <p className="text-center text-xs text-[#737373]">
          You won&apos;t be charged now. Once {instructor.name.split(' ')[0]} accepts, you&apos;ll pay to confirm and get the Google Meet link.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <DialogHeader>
        <DialogTitle>Select Date &amp; Time</DialogTitle>
        <DialogDescription>Times are shown in your time zone ({zone}).</DialogDescription>
      </DialogHeader>
      {head}
      {instructor.sessionTypes.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {instructor.sessionTypes.map(t => (
            <button
              key={t.id}
              onClick={() => {
                setType(t);
                setSlot(null);
                setDay(0);
              }}
              className={cn(
                'cursor-pointer rounded-lg border px-3 py-2 text-left text-xs',
                t.id === type.id ? 'border-[#34A853] bg-[#34A853]/10' : 'border-[#D4D4D4]',
              )}
            >
              <span className="block font-semibold">{t.name}</span>
              {t.durationMinutes} min · {formatPrice(t.price)}
            </button>
          ))}
        </div>
      )}
      {type.description && <p className="text-sm text-[#474747]">{type.description}</p>}
      {slots.isPending ? (
        <div className="h-32 animate-pulse rounded-xl bg-[#F4F7F4]" />
      ) : !byDay.length ? (
        <p className="rounded-xl bg-[#F4F7F4] p-4 text-sm text-[#737373]">No open times right now. Please check back later.</p>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">Date</p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {byDay.map(([label], i) => (
                <button
                  key={label}
                  onClick={() => {
                    setDay(i);
                    setSlot(null);
                  }}
                  className={cn('shrink-0 cursor-pointer rounded-lg border px-3 py-2 text-xs', day === i ? 'border-[#00230F] bg-[#00230F] text-white' : 'border-[#D4D4D4]')}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">Time</p>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {byDay[day]?.[1].map(d => (
                <button
                  key={d.toISOString()}
                  onClick={() => setSlot(d.toISOString())}
                  className={cn(
                    'cursor-pointer rounded-lg border px-2 py-2 text-xs',
                    slot === d.toISOString() ? 'border-[#34A853] bg-[#34A853] text-white' : 'border-[#D4D4D4]',
                  )}
                >
                  {timeLabel(d)}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
      <div className="flex gap-3">
        <Button variant="outline" className="flex-1" onClick={onClose}>
          ← Back
        </Button>
        <Button className="flex-1" disabled={!slot} onClick={() => setStep('confirm')}>
          Continue
        </Button>
      </div>
    </div>
  );
}
