'use client';

import Image from 'next/image';
import { Play } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queries/query-keys';
import { QUERIES } from '@/lib/queries';
import { CourseData } from '@/lib/constants';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const useGetCourses = (page: number, limit: number) => {
  return useQuery({
    queryKey: queryKeys.courses.paginated(page, limit),
    queryFn: () => QUERIES.getCourses(page, limit),
  });
};

const Trailer = () => {
  const { data, isPending, isError } = useGetCourses(1, 1);
  const courses: CourseData[] = data?.data.data;

  return (
    <section
      className={cn(
        'flex justify-center',
        (isError || courses?.length < 1) && 'hidden',
      )}
    >
      <div className="w-full max-w-7xl px-9 py-7 md:px-12 md:py-10 lg:px-18">
        {isPending ? (
          <TrailerLoading />
        ) : (
          <div className="relative size-max">
            <div className="relative h-123 w-[calc(100vw-4.5rem)] max-w-[66.38875rem] overflow-hidden rounded-2xl md:h-132 md:w-[calc(100vw-6rem)] lg:md:w-[calc(100vw-9rem)]">
              <Image
                src={courses[0].thumbnail}
                alt={courses[0].title}
                fill
                sizes="100vw"
                className="size-full object-cover"
              />
            </div>
            <div className="absolute flex flex-col gap-4 max-md:bottom-9 max-md:left-9 md:top-1/2 md:right-22.5 md:-translate-y-1/2">
              <div>
                <div className="flex flex-col gap-3">
                  <span className="w-max rounded-[8.89px] border-[1.78px] border-[#D0EA50] px-2 py-1.5 text-[8.89px]/[100%] font-semibold text-white">
                    New
                  </span>
                  <p className="text-[2.666875rem]/[100%] font-extrabold text-white">
                    {courses[0].instructor.fname} <br />{' '}
                    {courses[0].instructor.lname}
                  </p>
                </div>
                <Link
                  href={'/'}
                  className="text-sm/[100%] font-bold text-[#D0EA50]"
                >
                  <span className="absolute inset-0"></span>
                  {courses[0].title}
                </Link>
              </div>
              <button className="custom-gradient flex w-max cursor-pointer items-center gap-1 rounded-lg border-[1.78px] border-white px-3.5 py-2 text-sm/[100%] font-semibold text-white transition-transform active:scale-95">
                Watch Trailer
                <Play />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Trailer;

export const TrailerLoading = () => {
  return (
    <div className="relative size-max animate-pulse">
      {/* Image Skeleton */}
      <div className="relative h-123 w-[calc(100vw-4.5rem)] max-w-[66.38875rem] overflow-hidden rounded-2xl bg-gray-200 md:h-132 md:w-[calc(100vw-6rem)] lg:md:w-[calc(100vw-9rem)]" />

      {/* Content Skeleton */}
      <div className="absolute flex flex-col gap-4 max-md:bottom-9 max-md:left-9 md:top-1/2 md:right-22.5 md:-translate-y-1/2">
        <div className="space-y-3">
          <div className="h-5 w-12 rounded bg-gray-300"></div>

          <div className="space-y-2">
            <div className="h-9 w-40 rounded bg-gray-300"></div>
            <div className="h-9 w-32 rounded bg-gray-300"></div>
          </div>

          <div className="h-3 w-28 rounded bg-gray-300"></div>
        </div>

        {/* Button Skeleton */}
        <div className="h-8 w-32 rounded-lg bg-gray-300"></div>
      </div>
    </div>
  );
};
