'use client';

import { Button } from '@/components/ui/button';
import { https } from '@/lib/https';
import { formatPrice } from '@/lib/pricing';
import { useGetToken } from '@/lib/queries/hooks';
import { SessionInstructor, SessionTypeView, apiError, dayLabel, timeLabel } from '@/lib/sessions';
import { cn } from '@/lib/utils';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useQueryState } from 'nuqs';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

const BookSession = () => {
  const { data: tokenData, isPending: tokenPending } = useGetToken();
  const loggedIn = Boolean(tokenData?.data.token);
  const [, setAuthQ] = useQueryState('auth');
  const instructors = useQuery({
    enabled: loggedIn,
    queryKey: ['session-instructors'],
    queryFn: () => https.get('/sessions/instructors', { params: { limit: 50 } }).then(r => r.data.data as SessionInstructor[]),
  });
  const [chosen, setChosen] = useState<{ instructor: SessionInstructor; type: SessionTypeView } | null>(null);

  return (
    <section className="flex justify-center bg-[#00230F] text-white">
      <div className="flex w-full max-w-7xl flex-col gap-10 px-9 py-14 md:px-12 lg:px-18">
        <div className="flex max-w-2xl flex-col gap-3">
          <h1 className="text-3xl font-bold md:text-4xl">1-on-1 Sessions</h1>
          <p className="text-sm text-white/80">
            Book private video time with an industry expert. Pick a session and a time; the instructor confirms within 48 hours,
            then you pay and get a Google Meet link by email.
          </p>
        </div>

        {!tokenPending && !loggedIn ? (
          <div className="flex flex-col items-start gap-4">
            <p className="text-white/80">Log in to see instructors and book a session.</p>
            <Button onClick={() => setAuthQ('login')}>Log in</Button>
          </div>
        ) : instructors.isPending ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[0, 1].map(i => (
              <div key={i} className="h-48 animate-pulse rounded-2xl bg-white/10" />
            ))}
          </div>
        ) : instructors.isError ? (
          <p className="text-white/70">Couldn&apos;t load sessions. Please refresh the page.</p>
        ) : !instructors.data.length ? (
          <p className="text-white/70">No instructors are taking 1-on-1 sessions yet. Check back soon.</p>
        ) : chosen ? (
          <PickTime instructor={chosen.instructor} type={chosen.type} onBack={() => setChosen(null)} />
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {instructors.data.map(ins => (
              <div key={ins.id} className="flex flex-col gap-4 rounded-2xl bg-[#305B43] p-6">
                <div className="flex items-center gap-4">
                  {ins.profilePictureUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={ins.profilePictureUrl} alt="" className="size-14 rounded-full object-cover" />
                  ) : (
                    <div className="grid size-14 place-items-center rounded-full bg-[#D0EA50] text-lg font-bold text-[#00230F]">{ins.name.charAt(0)}</div>
                  )}
                  <div>
                    <p className="text-lg font-semibold">{ins.name}</p>
                    {ins.title && <p className="text-sm text-white/70">{ins.title}</p>}
                    {ins.rating && (
                      <p className="flex items-center gap-1 text-xs text-[#D0EA50]">
                        <Star className="size-3 fill-current" /> {ins.rating} ({ins.reviews})
                      </p>
                    )}
                  </div>
                </div>
                <ul className="flex flex-col gap-2">
                  {ins.sessionTypes.map(t => (
                    <li key={t.id} className="flex items-center justify-between gap-3 rounded-xl bg-[#00230F]/60 p-3">
                      <div>
                        <p className="font-semibold">{t.name}</p>
                        <p className="text-xs text-white/70">
                          {t.durationMinutes} min · {formatPrice(t.price)}
                        </p>
                      </div>
                      <Button className="shrink-0" onClick={() => setChosen({ instructor: ins, type: t })}>
                        Choose time
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

function PickTime({ instructor, type, onBack }: { instructor: SessionInstructor; type: SessionTypeView; onBack: () => void }) {
  const router = useRouter();
  const [, setAuth] = useQueryState('auth');
  const { data: tokenData } = useGetToken();
  const token = tokenData?.data.token;
  const [currency, setCurrency] = useState(type.price?.currency);
  const [slot, setSlot] = useState<string | null>(null);
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
  const [day, setDay] = useState(0);

  const book = useMutation({
    mutationFn: () => https.post('/sessions/book', { sessionTypeId: type.id, startsAt: slot, note: note || undefined, currency }),
    onSuccess: () => {
      toast.success('Request sent', { description: `${instructor.name} has 48 hours to accept. We'll email you.` });
      router.push('/student/sessions');
    },
    onError: e => {
      toast.error('Could not send request', { description: apiError(e) });
      slots.refetch();
    },
  });
  const price = type.prices.find(p => p.currency === currency) ?? type.price;

  return (
    <div className="flex flex-col gap-6">
      <button onClick={onBack} className="cursor-pointer self-start text-sm text-[#D0EA50]">
        ← All sessions
      </button>
      <div>
        <h2 className="text-2xl font-semibold">{type.name}</h2>
        <p className="text-white/70">
          with {instructor.name} · {type.durationMinutes} min · {formatPrice(price)}
        </p>
        {type.description && <p className="mt-2 max-w-2xl text-sm text-white/80">{type.description}</p>}
      </div>

      {slots.isPending ? (
        <div className="h-32 animate-pulse rounded-2xl bg-white/10" />
      ) : !byDay.length ? (
        <p className="text-white/70">No open times right now. Please check back later.</p>
      ) : (
        <div className="flex flex-col gap-4">
          <p className="text-xs text-white/60">Times are shown in your time zone ({Intl.DateTimeFormat().resolvedOptions().timeZone}).</p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {byDay.map(([label], i) => (
              <button
                key={label}
                onClick={() => {
                  setDay(i);
                  setSlot(null);
                }}
                className={cn('shrink-0 cursor-pointer rounded-xl px-4 py-2 text-sm', day === i ? 'bg-[#D0EA50] text-black' : 'bg-white/10')}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {byDay[day]?.[1].map(d => (
              <button
                key={d.toISOString()}
                onClick={() => setSlot(d.toISOString())}
                className={cn('cursor-pointer rounded-lg border px-3 py-2 text-sm', slot === d.toISOString() ? 'border-[#D0EA50] bg-[#D0EA50] text-black' : 'border-white/30')}
              >
                {timeLabel(d)}
              </button>
            ))}
          </div>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            maxLength={1000}
            placeholder="What would you like to cover? (optional)"
            className="h-24 max-w-xl rounded-xl bg-white/10 p-3 text-sm outline-none placeholder:text-white/50"
          />
          <Button
            className="w-max"
            disabled={!slot || book.isPending}
            onClick={() => {
              if (!token) {
                setAuth('login');
                return;
              }
              book.mutate();
            }}
          >
            {book.isPending ? 'Sending…' : token ? 'Request this time' : 'Log in to request'}
          </Button>
          <p className="text-xs text-white/60">You won&apos;t be charged until the instructor accepts.</p>
        </div>
      )}
    </div>
  );
}

export default BookSession;
