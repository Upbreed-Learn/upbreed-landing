'use client';

import { useQueryState } from 'nuqs';
import CourseCard, { CourseCardLoading } from '@/components/course-card';
import Image from 'next/image';
import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';
import { useGetCourses } from '@/lib/queries/hooks';
import { CourseData } from '@/lib/constants';
import { queryKeys } from '@/lib/queries/query-keys';
import EmptyState from '@/components/empty-state';
import { useState } from 'react';
import { Pagination } from '@/components/ui/custom/pagination';
import ErrorCard from '@/components/error-card';

const CourseList = () => {
  const [tab, _] = useQueryState('category', {
    defaultValue: 'my-courses',
  });
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isPending, isError } = useGetCourses(page, 10);
  const courses: CourseData[] = data?.data.data;

  const handleRetry = () => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.courses.paginated(page, 10),
    });
  };

  return (
    <section className="flex justify-center overflow-hidden bg-white pb-40">
      <div className="flex w-full max-w-7xl flex-col gap-5 px-9 pt-8 md:gap-10 md:px-12 md:pt-19.25 lg:px-18">
        <h2 className="text-sm/6 font-semibold">
          {tab === 'my-courses'
            ? 'My Courses'
            : tab === 'saved'
              ? 'Saved Courses'
              : 'History'}
        </h2>
        {tab === 'my-courses' && (
          <div className="-mx-40">
            <div className="w-full">
              {isError ? (
                <ErrorCard handleRetry={handleRetry} />
              ) : (
                <div className="scrollbar flex items-center gap-13 overflow-auto px-40">
                  {isPending ? (
                    Array(10)
                      .fill(0)
                      .map((_, index) => <MyCoursesLoader key={index} />)
                  ) : courses.length > 0 ? (
                    courses.map(course => (
                      <MyCoursesCard key={course.id} course={course} />
                    ))
                  ) : (
                    <EmptyState
                      title="No Courses Found"
                      description="When we have courses, it will be listed here."
                      className="col-span-full"
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        {(tab === 'saved' || tab === 'history') &&
          (isError ? (
            <ErrorCard handleRetry={handleRetry} />
          ) : (
            <div className="flex flex-col gap-10">
              <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {isPending ? (
                  Array(6)
                    .fill(0)
                    .map((_, index) => <CourseCardLoading key={index} />)
                ) : courses.length > 0 ? (
                  courses.map(course => (
                    <CourseCard key={course.id} course={course} />
                  ))
                ) : (
                  <EmptyState
                    title="No Courses Found"
                    description="When we have courses, it will be listed here."
                    className="col-span-full"
                  />
                )}
              </div>
              {data && (
                <Pagination
                  currentPage={page}
                  totalPages={data?.data.metadata.total}
                  onPageChange={setPage}
                />
              )}
            </div>
          ))}
      </div>
    </section>
  );
};

export default CourseList;

const MyCoursesCard = (props: { course: CourseData }) => {
  const { course } = props;
  const progressLevel = 50;

  return (
    <div className="relative flex flex-col gap-4 rounded-[10px] bg-[#305B43] p-8">
      <div className="flex items-center gap-3.5">
        <div className="relative h-23.5 w-35.75">
          <Image
            src={course.thumbnail}
            fill
            sizes="(max-width: 1200px) 100vw, 1200px"
            alt={course.title}
            className="size-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-2 text-white">
          <div className="flex flex-col gap-1">
            <p className="text-sm/[100%] font-bold">
              {course.instructor.fname} {course.instructor.lname}
            </p>
            <p className="text-[8.5px]/[100%] font-bold text-[#C8C8C8]">
              MD/CEO UBA Africa
            </p>
          </div>
          <Link href={`/student/courses/${course.id}`} className="font-medium">
            <span className="absolute inset-0"></span>
            {course.title}
          </Link>
        </div>
      </div>
      <span className="relative block h-3 w-full bg-[#D9D9D9]">
        <span
          style={{
            width: `${progressLevel}%`,
          }}
          className="absolute top-0 left-0 h-full bg-[#34A853] transition-[width]"
        ></span>
        <span className="sr-only">Progress Level</span>
      </span>
    </div>
  );
};

const MyCoursesLoader = () => {
  return (
    <div className="relative flex animate-pulse flex-col gap-4 rounded-[10px] bg-[#305B43] p-8">
      <div className="flex items-center gap-3.5">
        {/* Image Skeleton */}
        <div className="h-23.5 w-35.75 rounded bg-[#3f6f55]"></div>

        {/* Right Text Section */}
        <div className="flex w-full flex-col gap-2">
          <div className="flex flex-col gap-1">
            <div className="h-3 w-28 rounded bg-[#3f6f55]"></div>
            <div className="h-2.5 w-20 rounded bg-[#4c7f62]"></div>
          </div>
          <div className="h-3 w-32 rounded bg-[#3f6f55]"></div>
        </div>
      </div>

      {/* Progress bar skeleton */}
      <div className="block h-3 w-full rounded bg-[#3f6f55]"></div>
    </div>
  );
};
