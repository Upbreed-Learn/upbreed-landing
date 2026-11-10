'use client';

import { Button } from '@/components/ui/button';
import { CourseData } from '@/lib/constants';
import { https } from '@/lib/https';
import { formatPrice } from '@/lib/pricing';
import { useGetToken } from '@/lib/queries/hooks';
import { SessionInstructor, initials, priceLabel } from '@/lib/sessions';
import { courseCover, courseSeconds, formatHMS } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { Star } from 'lucide-react';
import Link from 'next/link';
import { useQueryState } from 'nuqs';
import { useState } from 'react';
import { AvailabilityPill, BookingDialog, SessionsTabs, SubjectTag, subjectOf } from '../parts';

const NEW_DAYS = 30;

const InstructorProfile = ({ id }: { id: number }) => {
  const { data: tokenData, isPending: tokenPending } = useGetToken();
  const loggedIn = Boolean(tokenData?.data.token);
  const [, setAuth] = useQueryState('auth');
  const [booking, setBooking] = useState(false);
  const instructor = useQuery({
    queryKey: ['session-instructor', id],
    queryFn: () => https.get(`/sessions/instructors/${id}`).then(r => r.data.data as SessionInstructor),
    retry: false,
  });
  const courses = useQuery({
    queryKey: ['instructor-courses', id],
    queryFn: () => https.get('/course', { params: { instructorId: id, limit: 6, type: 'new' } }).then(r => r.data.data as CourseData[]),
  });
  const ins = instructor.data;

  return (
    <section className="flex justify-center bg-[#00230F] text-white">
      <div className="flex w-full max-w-7xl flex-col gap-10 px-5 py-10 sm:px-9 md:px-12 md:py-14 lg:px-18">
        {loggedIn && <SessionsTabs />}
        {instructor.isPending ? (
          <div className="h-72 animate-pulse rounded-2xl bg-white/10" />
        ) : !ins ? (
          <div className="flex flex-col items-start gap-4">
            <p className="text-white/70">This instructor isn&apos;t taking 1-on-1 sessions right now.</p>
            <Button asChild>
              <Link href="/sessions">See all instructors</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-8 md:flex-row">
              <div className="aspect-square w-full shrink-0 overflow-hidden rounded-2xl bg-[#305B43] md:w-72">
                {ins.profilePictureUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={ins.profilePictureUrl} alt={ins.name} className="size-full object-cover" />
                ) : (
                  <div className="grid size-full place-items-center text-6xl font-semibold text-[#D0EA50]">{initials(ins.name)}</div>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <SubjectTag>{subjectOf(ins)}</SubjectTag>
                  <h1 className="text-2xl font-semibold md:text-[28px]">{ins.name}</h1>
                  {ins.title && <p className="text-sm text-white/70">{ins.title}</p>}
                  {ins.rating && (
                    <p className="flex items-center gap-1 text-xs text-white/70">
                      <Star className="size-3.5 fill-[#D0EA50] text-[#D0EA50]" /> {ins.rating} · {ins.reviews} review{ins.reviews === 1 ? '' : 's'}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <p className="text-lg font-semibold text-[#D0EA50]">{priceLabel(ins.sessionTypes[0], formatPrice)}</p>
                  <AvailabilityPill instructor={ins} />
                </div>
                <Button
                  className="w-max px-8"
                  disabled={!ins.nextAvailable}
                  onClick={() => (loggedIn ? setBooking(true) : !tokenPending && setAuth('login'))}
                >
                  {!ins.nextAvailable ? 'Not Available' : loggedIn ? 'Book Now' : 'Log in to book'}
                </Button>
                {ins.about && (
                  <div className="flex flex-col gap-2 pt-2">
                    <h2 className="text-base font-semibold">About the Instructor</h2>
                    <p className="text-sm/relaxed break-words whitespace-pre-line text-white/80 [overflow-wrap:anywhere]">{ins.about}</p>
                  </div>
                )}
              </div>
            </div>

            {Boolean(courses.data?.length) && (
              <div className="flex flex-col gap-5">
                <h2 className="text-lg font-semibold">{ins.name.split(' ')[0]}&apos;s Courses</h2>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {courses.data!.map(c => {
                    const isNew = Boolean(c.createdAt) && Date.now() - new Date(c.createdAt!).getTime() < NEW_DAYS * 86_400_000;
                    return (
                      <Link key={c.id} href={`/student/courses/${c.id}`} className="group flex flex-col overflow-hidden rounded-2xl bg-[#0B3A20]">
                        <div className="relative aspect-video bg-[#305B43]">
                          {courseCover(c) && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={courseCover(c)} alt="" className="size-full object-cover transition-transform group-hover:scale-105" />
                          )}
                          {isNew && <span className="absolute top-3 left-3 rounded bg-[#D0EA50] px-1.5 py-0.5 text-[10px] font-bold text-[#00230F]">NEW</span>}
                        </div>
                        <div className="flex flex-col gap-2 p-4">
                          <p className="text-xs text-white/60">{ins.name}</p>
                          <p className="line-clamp-2 text-sm font-semibold">{c.title}</p>
                          <p className="flex gap-3 text-xs text-white/60">
                            {courseSeconds(c) ? <span>{formatHMS(courseSeconds(c))}</span> : null}
                            {c.preview?.lessonCount ? <span>{c.preview.lessonCount} Lessons</span> : null}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <BookingDialog instructor={booking && ins ? ins : null} onClose={() => setBooking(false)} />
    </section>
  );
};

export default InstructorProfile;
