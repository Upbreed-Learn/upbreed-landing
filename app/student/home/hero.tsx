'use client';

import { courseCover } from '@/lib/utils';

import { useRecentCourses } from '@/components/navbar/my-courses-hover';
import { Button } from '@/components/ui/button';
import { UserProfileType } from '@/lib/constants';
import { useGetToken, useGetUserProfile } from '@/lib/queries/hooks';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

/** "Welcome back" + the course they were last watching, with progress and Continue. */
const Hero = () => {
  const { data: tokenData } = useGetToken();
  const token = tokenData?.data.token;
  const { data: userData, isPending: userPending } = useGetUserProfile(token);
  const me: UserProfileType | undefined = userData?.data.data;
  const recent = useRecentCourses(Boolean(token), 4);
  const course = recent.data?.find(c => c.percentageCompletion < 100) ?? recent.data?.[0];
  const name = me ? `${me.fname} ${me.lname?.[0] ?? ''}`.trim() : '';

  // Only for signed-in people who have started a class. Everyone else goes straight to the classes.
  if (!token || (!recent.isPending && !course)) return null;

  return (
    <section className="flex justify-center bg-[#305B43]">
      <div className="flex w-full max-w-7xl flex-col items-stretch gap-6 pt-8 md:flex-row md:items-center md:gap-10 md:py-8">
        <div className="px-6 text-center text-white md:w-2/5 md:pl-18 md:text-right">
          {userPending ? (
            <div className="mx-auto h-24 w-48 animate-pulse rounded bg-white/10 md:mr-0 md:ml-auto" />
          ) : (
            <h1 className="text-2xl font-semibold md:text-4xl/[115%]">
              Welcome <br className="max-md:hidden" />
              Back <br />
              {name},
            </h1>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-6 bg-white px-6 py-8 md:rounded-l-lg md:px-11 md:py-10">
          <div className="flex flex-col gap-2">
            <p className="text-xl font-semibold text-[#00230F] md:text-2xl">{course ? 'Slow and Steady' : 'Start learning'}</p>
            <p className="text-xs text-[#6F6F6F]">
              {course ? 'Try watching for about 5 - 10 mins a day, to track your progress to success' : 'Pick a class below and press play — we’ll keep your place here.'}
            </p>
          </div>
          {recent.isPending ? (
            <div className="h-36 animate-pulse rounded bg-[#F2F2F2]" />
          ) : course ? (
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-7">
              <Link href={`/student/courses/${course.id}?play=1`} className="relative aspect-video w-full shrink-0 overflow-hidden rounded-lg bg-[#305B43] sm:w-72">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {courseCover(course) && <img src={courseCover(course)} alt={course.title} className="size-full object-cover" />}
              </Link>
              <div className="flex min-w-0 flex-1 flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <p className="font-semibold text-[#110000]">{course.title}</p>
                  {course.instructor && (
                    <p className="text-xs text-[#949494]">
                      {course.instructor.fname} {course.instructor.lname}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="h-2.5 w-full max-w-72 rounded-full bg-[#D9D9D9]">
                    <div className="h-full rounded-full bg-[#305B43] transition-[width]" style={{ width: `${Math.max(3, course.percentageCompletion)}%` }} />
                  </div>
                  <p className="text-[11px] text-[#949494]">{course.percentageCompletion}% complete</p>
                </div>
                <Button asChild className="w-max">
                  <Link href={`/student/courses/${course.id}?play=1`}>
                    {course.percentageCompletion >= 100 ? 'Watch again' : 'Continue'} <ChevronRight />
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <Button asChild className="w-max">
              <a href="#courses">
                Browse classes <ChevronRight />
              </a>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
