'use client';

import { https } from '@/lib/https';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card';

export type MyCourse = {
  id: number;
  title: string;
  thumbnail: string | null;
  instructor: { fname: string; lname: string; title?: string | null } | null;
  percentageCompletion: number;
  lastActivityAt: string | null;
};

export const useRecentCourses = (enabled: boolean, limit = 4) =>
  useQuery({
    enabled,
    queryKey: ['my-courses-recent', limit],
    queryFn: () => https.get('/course/me', { params: { type: 'all', limit } }).then(r => r.data.data as MyCourse[]),
    staleTime: 60_000,
  });

/** "My Courses" in the navbar: hover to see the courses you're watching (or finished) with progress. */
const MyCoursesHover = () => {
  const pathname = usePathname();
  const courses = useRecentCourses(true);
  return (
    <HoverCard openDelay={80} closeDelay={120}>
      <HoverCardTrigger asChild>
        <Link
          href="/student/courses"
          className={cn('hover:text-[#D0EA50]', pathname.startsWith('/student/courses') && 'text-[#D0EA50]')}
        >
          My Courses
        </Link>
      </HoverCardTrigger>
      <HoverCardContent align="center" sideOffset={22} className="z-[100] w-[26rem] rounded-none border-none bg-[#F2F2F2] p-4 shadow-xl">
        {courses.isPending ? (
          <div className="flex flex-col gap-3">
            {[0, 1].map(i => (
              <div key={i} className="h-20 animate-pulse rounded bg-[#E2E2E2]" />
            ))}
          </div>
        ) : !courses.data?.length ? (
          <div className="flex flex-col items-start gap-2 p-2 text-sm text-[#474747]">
            <p>You haven&apos;t started a course yet.</p>
            <Link href="/student/home" className="flex items-center gap-1 font-semibold text-[#305B43]">
              Browse classes <ChevronRight className="size-4" />
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {courses.data.map(c => (
              <Link key={c.id} href={`/student/courses/${c.id}`} className="flex gap-4 rounded p-3 transition-colors hover:bg-[#E2E2E2]">
                <div className="h-16 w-28 shrink-0 overflow-hidden bg-[#305B43]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {c.thumbnail && <img src={c.thumbnail} alt="" className="size-full object-cover" />}
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5">
                  <p className="truncate text-sm font-semibold text-black">
                    {c.instructor ? `${c.instructor.fname} ${c.instructor.lname}` : 'Upbreed'}
                  </p>
                  {c.instructor?.title && <p className="truncate text-[10px] text-[#474747]">{c.instructor.title}</p>}
                  <p className="truncate text-sm text-[#737373]">{c.title}</p>
                  <div className="mt-1 h-1.5 w-full bg-[#DADADA]">
                    <div className="h-full bg-[#4CAF50]" style={{ width: `${Math.max(3, c.percentageCompletion)}%` }} />
                  </div>
                </div>
              </Link>
            ))}
            <Link href="/student/courses" className="flex items-center justify-end gap-1 px-3 pt-2 text-xs font-semibold text-[#305B43]">
              All my courses <ChevronRight className="size-3.5" />
            </Link>
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
};

export default MyCoursesHover;
