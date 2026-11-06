'use client';

import { Button } from '@/components/ui/button';
import { https } from '@/lib/https';
import { useGetToken } from '@/lib/queries/hooks';
import { SessionInstructor, availableSoon, hourlyRate } from '@/lib/sessions';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { useQueryState } from 'nuqs';
import { useMemo, useState } from 'react';
import { BookingDialog, InstructorCard, SessionsTabs, subjectOf } from './parts';

type Filters = { when: 'any' | 'today' | 'week'; price: 'none' | 'low' | 'high'; rating: 'any' | '4' ; subject: string };
const NO_FILTERS: Filters = { when: 'any', price: 'none', rating: 'any', subject: '' };

const BookSession = () => {
  const { data: tokenData, isPending: tokenPending } = useGetToken();
  const loggedIn = Boolean(tokenData?.data.token);
  const [, setAuthQ] = useQueryState('auth');
  const [q, setQ] = useState('');
  const [f, setF] = useState<Filters>(NO_FILTERS);
  const [booking, setBooking] = useState<SessionInstructor | null>(null);
  const instructors = useQuery({
    enabled: loggedIn,
    queryKey: ['session-instructors'],
    queryFn: () => https.get('/sessions/instructors', { params: { limit: 50 } }).then(r => r.data.data as SessionInstructor[]),
  });

  const subjects = useMemo(
    () => [...new Set((instructors.data ?? []).map(subjectOf).filter((s): s is string => Boolean(s)))].sort(),
    [instructors.data],
  );
  const shown = useMemo(() => {
    const term = q.trim().toLowerCase();
    let list = (instructors.data ?? []).filter(i => {
      if (term && ![i.name, i.title, i.expertise, ...i.sessionTypes.map(t => t.name)].some(v => v?.toLowerCase().includes(term))) return false;
      if (f.when === 'today' && !availableSoon(i, 1)) return false;
      if (f.when === 'week' && !availableSoon(i, 7)) return false;
      if (f.rating === '4' && (i.rating ?? 0) < 4) return false;
      if (f.subject && subjectOf(i) !== f.subject) return false;
      return true;
    });
    if (f.price !== 'none') {
      const rate = (i: SessionInstructor) => Math.min(...i.sessionTypes.map(hourlyRate));
      list = [...list].sort((a, b) => (f.price === 'low' ? rate(a) - rate(b) : rate(b) - rate(a)));
    }
    return list;
  }, [instructors.data, q, f]);
  const filtered = q.trim() !== '' || JSON.stringify(f) !== JSON.stringify(NO_FILTERS);

  return (
    <section className="flex justify-center bg-[#00230F] text-white">
      <div className="flex w-full max-w-7xl flex-col gap-8 px-5 py-10 sm:px-9 md:px-12 md:py-14 lg:px-18">
        {loggedIn && <SessionsTabs />}
        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="text-2xl font-semibold md:text-[32px]">Find the Perfect Instructor For You</h1>
          <p className="text-sm text-white/70">Learn at your pace, on your schedule.</p>
          {loggedIn && (
            <label className="mt-3 flex w-full max-w-xl items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4">
              <Search className="size-4 shrink-0 text-white/60" />
              <input
                value={q}
                onChange={e => setQ(e.target.value)}
                placeholder="Search by Subject or Instructor"
                className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-white/50"
              />
            </label>
          )}
        </div>

        {!tokenPending && !loggedIn ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="max-w-md text-sm text-white/80">
              Book private video time with an industry expert. The instructor confirms within 48 hours, then you pay and get a Google Meet link by email.
            </p>
            <Button onClick={() => setAuthQ('login')}>Log in to book</Button>
          </div>
        ) : instructors.isPending ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map(i => (
              <div key={i} className="h-80 animate-pulse rounded-2xl bg-white/10" />
            ))}
          </div>
        ) : instructors.isError ? (
          <p className="text-center text-white/70">Couldn&apos;t load instructors. Please refresh the page.</p>
        ) : !instructors.data.length ? (
          <p className="text-center text-white/70">No instructors are taking 1-on-1 sessions yet. Check back soon.</p>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="mr-1 text-sm font-medium">Filter By :</span>
              <FilterSelect value={f.when} onChange={v => setF({ ...f, when: v as Filters['when'] })}>
                <option value="any">Date Availability</option>
                <option value="today">Available today</option>
                <option value="week">Available this week</option>
              </FilterSelect>
              <FilterSelect value={f.price} onChange={v => setF({ ...f, price: v as Filters['price'] })}>
                <option value="none">Price Per Hour</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
              </FilterSelect>
              <FilterSelect value={f.rating} onChange={v => setF({ ...f, rating: v as Filters['rating'] })}>
                <option value="any">Ratings</option>
                <option value="4">4 stars &amp; up</option>
              </FilterSelect>
              {subjects.length > 0 && (
                <FilterSelect value={f.subject} onChange={v => setF({ ...f, subject: v })}>
                  <option value="">Subject</option>
                  {subjects.map(s => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </FilterSelect>
              )}
              {filtered && (
                <button
                  onClick={() => {
                    setF(NO_FILTERS);
                    setQ('');
                  }}
                  className="cursor-pointer px-2 text-[#D0EA50]"
                >
                  Clear
                </button>
              )}
            </div>
            {shown.length ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {shown.map(ins => (
                  <InstructorCard key={ins.id} instructor={ins} onBook={() => setBooking(ins)} />
                ))}
              </div>
            ) : (
              <p className="py-10 text-center text-sm text-white/70">No instructors match. Try a different search or clear the filters.</p>
            )}
          </>
        )}
      </div>
      <BookingDialog instructor={booking} onClose={() => setBooking(null)} />
    </section>
  );
};

function FilterSelect({ value, onChange, children }: { value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="h-9 cursor-pointer rounded-full border border-white/20 bg-[#00230F] px-3 text-xs text-white outline-none focus:border-[#D0EA50]"
    >
      {children}
    </select>
  );
}

export default BookSession;
