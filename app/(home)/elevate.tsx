'use client';

import Link from 'next/link';
import Image from 'next/image';
import StarIcon from '@/components/jsx-icons/star';
import { ChevronLeftCircle, ChevronRightCircle } from 'lucide-react';
import { useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queries/query-keys';
import { QUERIES } from '@/lib/queries';
import { Category, Instructor } from '@/lib/constants';
import EmptyState from '@/components/empty-state';
import { cn } from '@/lib/utils';
import { useGetCategories } from '@/lib/queries/hooks';

const useGetInstructors = () => {
  return useQuery({
    queryKey: queryKeys.instructors.all,
    queryFn: () => QUERIES.getInstructors(),
  });
};

const Elevate = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data, isPending, isError } = useGetInstructors();
  const {
    data: categoryData,
    isPending: categoryDataIsPending,
    isError: categoryIsError,
  } = useGetCategories();
  const categories: Omit<
    Category['category'],
    'createdAt' | 'updatedAt' | 'deletedAt'
  >[] = categoryData?.data.data;

  const instructors: Instructor[] = data?.data.data;

  const handleRetry = () => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.instructors.all,
    });
  };

  const handleScrollLeft = () => {
    scrollRef.current?.scrollTo({
      left: scrollRef.current?.scrollLeft - 100,
      behavior: 'smooth',
    });
  };

  const handleScrollRight = () => {
    scrollRef.current?.scrollTo({
      left: scrollRef.current?.scrollLeft + 100,
      behavior: 'smooth',
    });
  };

  return (
    <section className="flex justify-center px-8 md:py-7">
      <div className="flex w-full max-w-7xl flex-col items-center gap-6 pt-11 pb-8 md:gap-10">
        <h2 className="text-center text-2xl leading-[100%] font-extrabold text-[#D0EA50] md:text-4xl">
          Elevate Your Skills
        </h2>
        {categoryDataIsPending ? (
          <TagsLoading />
        ) : (
          <ul
            className={cn(
              'flex w-full max-w-[60.819375rem] flex-wrap items-center justify-center gap-3 text-xs leading-[100%] font-semibold text-white md:gap-[18px] md:text-sm [&_a]:flex [&_a]:size-full [&_a]:items-center [&_a]:gap-2 [&_a]:px-3.5 [&_a]:py-3 [&_a]:md:px-6 [&>li]:rounded-lg [&>li]:border-[1.78px] [&>li]:border-[#474747] [&>li]:transition-colors [&>li]:hover:bg-slate-100 [&>li]:hover:text-black',
              (categoryIsError || categories?.length < 1) && 'hidden',
            )}
          >
            {categories?.map(category => (
              <li key={category.id}>
                <Link href={'#'}>{category.name}</Link>
              </li>
            ))}
          </ul>
        )}
        <div
          className={cn(
            'flex w-full flex-col gap-4 max-md:pt-14',
            (isError || instructors?.length < 1) && 'hidden',
          )}
        >
          <div className="flex items-center gap-2.5 text-sm/[100%] font-bold">
            <p className="text-[#D0EA50]">Trending Courses</p>
            <Link
              href={'#'}
              className="text-[#6C724F] transition-colors hover:text-[#D0EA50]"
            >
              See all
            </Link>
          </div>
          <div className="relative">
            <div
              ref={scrollRef}
              className="scrollbar-hidden flex w-full gap-[1.38875rem] overflow-auto"
            >
              {isPending ? (
                Array(8)
                  .fill(0)
                  .map((_, index) => <InstructorCardLoading key={index} />)
              ) : instructors.length > 0 ? (
                <>
                  <button
                    onClick={handleScrollLeft}
                    className="-transition-y-1/2 absolute top-1/2 -left-6 z-10 cursor-pointer transition-transform active:scale-95"
                  >
                    <ChevronLeftCircle className="size-10 text-[#FFFFFF]" />
                  </button>
                  {instructors.map(instructor => (
                    <InstructorCard
                      key={instructor.id}
                      instructor={instructor}
                    />
                  ))}
                  <button
                    onClick={handleScrollRight}
                    className="-transition-y-1/2 absolute top-1/2 -right-6 z-10 cursor-pointer transition-transform active:scale-95"
                  >
                    <ChevronRightCircle className="size-10 text-[#FFFFFF]" />
                  </button>
                </>
              ) : (
                <EmptyState
                  title="No Active Instructors Found"
                  description="When we have instructors, it will be listed here."
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Elevate;

const InstructorCard = (props: { instructor: Instructor }) => {
  const { instructor } = props;
  return (
    <div className="relative size-max h-[19.7775rem] w-[12.916875rem] shrink-0 overflow-hidden rounded-lg ease-in-out hover:brightness-125">
      <span className="absolute top-4 right-5 z-10 rounded-lg border border-[#D0EA50] px-2 py-1 text-[8px]/[100%] font-semibold text-white">
        New
      </span>
      <Image
        src={instructor.instructorProfile.profilePictureUrl}
        alt={instructor.fname}
        unoptimized
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute bottom-5 left-1/2 flex w-11/12 -translate-x-1/2 flex-col gap-4">
        <div>
          <p className="text-[2rem]/[100%] font-extrabold text-white">
            {instructor.fname} {instructor.lname}
          </p>
          <p className="text-[10.67px]/[100%] text-[#D0EA50]">
            {instructor.instructorProfile.title}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-[8px]/[100%] font-semibold text-white">
            1H 32mins
          </p>
          <div className="flex items-center gap-0.5">
            <StarIcon fill="#FFC700" />
            <StarIcon fill="#FFC700" />
            <StarIcon fill="#FFC700" />
            <StarIcon fill="#FFC700" />
            <StarIcon />
          </div>
        </div>
      </div>
    </div>
  );
};

export const InstructorCardLoading = () => {
  return (
    <div className="relative size-max h-[19.7775rem] w-[12.916875rem] shrink-0 animate-pulse overflow-hidden rounded-lg bg-gray-200">
      {/* "New" Badge Skeleton */}
      <span className="absolute top-4 right-5 z-10 h-4 w-10 rounded bg-gray-300"></span>

      {/* Bottom content skeleton */}
      <div className="absolute bottom-5 left-1/2 w-11/12 -translate-x-1/2 space-y-4">
        {/* Title */}
        <div className="space-y-2">
          <div className="h-6 w-32 rounded bg-gray-300"></div>
          <div className="h-3 w-20 rounded bg-gray-300"></div>
        </div>

        {/* Duration + Stars */}
        <div className="flex items-center justify-between">
          <div className="h-3 w-10 rounded bg-gray-300"></div>

          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-3 w-3 rounded bg-gray-300"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const TagsLoading = () => {
  return (
    <ul className="flex w-full max-w-[60.819375rem] flex-wrap items-center justify-center gap-3 md:gap-[18px]">
      {[...Array(6)].map((_, i) => (
        <li
          key={i}
          className="animate-pulse rounded-lg border-[1.78px] border-[#474747] px-3.5 py-3 md:px-6"
        >
          <div className="h-3 w-24 rounded bg-gray-300"></div>
        </li>
      ))}
    </ul>
  );
};
