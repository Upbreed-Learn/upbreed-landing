'use client';

import CourseCard, { CourseCardLoading } from '@/components/course-card';
import EmptyState from '@/components/empty-state';
import ErrorCard from '@/components/error-card';
import { CoursesLoading } from '@/components/navbar';
import { COURSE_BUNDLES } from '@/components/navbar/classes-hover';
import { Pagination } from '@/components/ui/custom/pagination';
import { Category, CourseData } from '@/lib/constants';
import {
  useGetCategories,
  useGetCourses,
  useGetCoursesByCategory,
} from '@/lib/queries/hooks';
import { queryKeys } from '@/lib/queries/query-keys';
import { cn, formatMinutes } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import { Bookmark, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useQueryState } from 'nuqs';
import { Suspense, useState } from 'react';

const Courses = () => {
  return (
    <section className="flex justify-center bg-white pt-5 pb-49.5 md:pt-12 lg:pt-20">
      <div className="flex w-full max-w-7xl flex-col gap-7 px-9 md:px-12 lg:px-18">
        <Suspense>
          <CourseBundles />
          <AllCourses />
        </Suspense>
      </div>
    </section>
  );
};

export default Courses;

const CourseBundles = () => {
  const [course, setCourse] = useQueryState('courseBundles', {
    defaultValue: 'all',
  });
  const queryClient = useQueryClient();

  const { data, isPending, isError } = useGetCourses(1, 1);
  const courses: CourseData[] = data?.data.data;

  const handleRetry = () => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.courses.paginated(1, 10),
    });
  };

  return (
    <div className="flex max-lg:flex-col md:gap-12 lg:items-center lg:gap-10">
      <aside className="flex flex-col gap-2 text-sm/6 font-semibold text-[#949494] lg:flex-1/6 lg:gap-6">
        <button
          onClick={() => setCourse('all')}
          className="w-max cursor-pointer text-[#34A853]"
        >
          Course Bundles
        </button>
        <ul className="flex gap-1 text-xs/[30px] md:gap-2 lg:flex-col">
          {COURSE_BUNDLES.map(bundle => (
            <li key={bundle.id}>
              <button
                className={cn(
                  'cursor-pointer capitalize',
                  course === bundle.name.trim() && 'font-bold text-black',
                )}
                onClick={() => setCourse(bundle.name.trim())}
              >
                {bundle.name} <span className="lg:hidden">.</span>
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <div className="relative flex items-center gap-7.5 rounded-[10px] bg-[#305B43] py-8.5 pr-10 pl-8 max-md:hidden lg:flex-5/6">
        {isError ? (
          <ErrorCard handleRetry={handleRetry} />
        ) : isPending ? (
          <LatestCourseLoader />
        ) : courses.length > 0 ? (
          <>
            <div className="relative h-43.25 w-68 overflow-hidden rounded-l-lg">
              <Image
                src={courses[0].thumbnail}
                alt={courses[0].title}
                fill
                sizes="(max-width: 1200px) 100vw, 1200px"
                className="size-full object-cover object-center"
              />
            </div>
            <div className="flex flex-1 justify-between">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-3.5">
                  <p className="w-max rounded-lg bg-[#D0EA50] px-[8.5px] py-[3px] text-[9px]/[100%] font-semibold">
                    Latest Course
                  </p>
                  <div className="flex flex-col gap-1">
                    <Link
                      href={`/student/courses/${courses[0].id}`}
                      className="w-full max-w-66 leading-5 font-extrabold text-white"
                    >
                      <span className="absolute inset-0"></span>
                      {courses[0].title}
                    </Link>
                    <div className="flex items-center gap-9 text-xs/6 font-medium text-[#BEBEBE]">
                      <p>{courses[0].preview.lessonCount} Lessons</p>
                      <p>
                        {formatMinutes(courses[0].preview.durationInMinutes)}
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-sm/6 font-medium text-white capitalize">
                  {courses[0].instructor.fname} {courses[0].instructor.lname}
                </p>
              </div>
              <button className="z-10 size-max cursor-pointer p-1 transition-transform active:scale-95">
                <Bookmark className="text-white" />
              </button>
            </div>
          </>
        ) : (
          <EmptyState
            title="No Courses Found"
            description="When we have courses, it will be listed here."
          />
        )}
      </div>
    </div>
  );
};

const AllCourses = () => {
  const [page, setPage] = useState(1);
  const [coursesByCategoryPage, setCoursesByCategoryPage] = useState(1);
  const queryClient = useQueryClient();
  const [course, setCourse] = useQueryState('allCourses', {
    defaultValue: 'all',
  });

  const { data, isPending, isError } = useGetCategories();
  const {
    data: coursesData,
    isPending: coursesIsPending,
    isError: coursesError,
  } = useGetCourses(page, 9);
  const {
    data: coursesDataByCategory,
    isPending: coursesIsPendingByCategory,
    isError: coursesErrorByCategory,
  } = useGetCoursesByCategory(coursesByCategoryPage, 9, course);

  const courses: CourseData[] = coursesData?.data.data;
  const coursesByCategory: CourseData[] = coursesDataByCategory?.data.data;
  const categories: Omit<
    Category['category'],
    'createdAt' | 'updatedAt' | 'deletedAt'
  >[] = data?.data.data;

  const handleRetry = () => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.categories.all,
    });
  };
  const handleRetryCourses = () => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.courses.paginated(1, 10),
    });
  };

  return (
    <div className="flex gap-10 max-md:flex-col">
      <aside className="flex flex-col gap-6 text-sm/4 font-semibold text-[#6F6F6F] md:flex-1/6">
        <button
          onClick={() => setCourse('all')}
          className="flex cursor-pointer items-center gap-1"
        >
          All Courses <ChevronRight />
        </button>
        <div className={cn(categories?.length < 1 && 'hidden')}>
          {isError ? (
            <ErrorCard handleRetry={handleRetry} />
          ) : (
            <ul className="flex gap-3 max-md:flex-wrap max-md:text-xs md:flex-col [&>li]:border-[#6F6F6F] [&>li]:last:border-none [&>li]:last:pr-0 max-md:[&>li]:border-r max-md:[&>li]:pr-3">
              {isPending ? (
                <CoursesLoading />
              ) : (
                categories.map(category => (
                  <li key={category.id}>
                    <button
                      className={cn(
                        'cursor-pointer capitalize',
                        course === category.id.toString() &&
                          'font-bold text-black',
                      )}
                      onClick={() => setCourse(category.id.toString())}
                    >
                      {category.name}
                    </button>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      </aside>
      <div className="flex flex-col gap-8 md:flex-5/6">
        <h3 className="text-xl/[100%] font-bold capitalize max-md:hidden">
          {course === 'all'
            ? 'All Courses'
            : categories?.find(c => c.id.toString() === course)?.name}
        </h3>
        {coursesError || (course !== 'all' && coursesErrorByCategory) ? (
          <ErrorCard handleRetry={handleRetryCourses} />
        ) : (
          <div className="flex flex-col gap-6">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {coursesIsPending ||
              (course !== 'all' && coursesIsPendingByCategory) ? (
                Array(6)
                  .fill(0)
                  .map((_, index) => <CourseCardLoading key={index} />)
              ) : (
                  course !== 'all'
                    ? coursesByCategory.length > 0
                    : courses.length > 0
                ) ? (
                course !== 'all' ? (
                  coursesByCategory?.map(course => (
                    <CourseCard key={course.id} course={course} />
                  ))
                ) : (
                  courses?.map(course => (
                    <CourseCard key={course.id} course={course} />
                  ))
                )
              ) : (
                <EmptyState
                  title="No Courses Found"
                  description="When we have courses, it will be listed here."
                />
              )}
            </div>
            {course === 'all' &&
              coursesData &&
              coursesData?.data.metadata.total > 0 && (
                <Pagination
                  currentPage={page}
                  totalPages={coursesData?.data.metadata.total}
                  onPageChange={setPage}
                />
              )}
            {course !== 'all' &&
              coursesDataByCategory &&
              coursesDataByCategory?.data.metadata.total > 0 && (
                <Pagination
                  currentPage={page}
                  totalPages={coursesDataByCategory?.data.metadata.total}
                  onPageChange={setCoursesByCategoryPage}
                />
              )}
          </div>
        )}
      </div>
    </div>
  );
};

const LatestCourseLoader = () => {
  return (
    <div className="relative flex animate-pulse items-center gap-7.5 rounded-[10px] bg-[#305B43] py-8.5 pr-10 pl-8 max-md:hidden lg:flex-5/6">
      {/* Image placeholder */}
      <div className="relative h-43.25 w-68 overflow-hidden rounded-l-lg bg-[#2a4d39]"></div>

      {/* Right section */}
      <div className="flex flex-1 justify-between">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3.5">
            {/* Small badge */}
            <div className="h-4 w-24 rounded-lg bg-[#2a4d39]"></div>

            <div className="flex flex-col gap-1">
              {/* Course title */}
              <div className="h-4 w-52 rounded-md bg-[#2a4d39]"></div>
              <div className="h-4 w-40 rounded-md bg-[#2a4d39]"></div>

              {/* Lessons + Duration */}
              <div className="flex items-center gap-9">
                <div className="h-3 w-16 rounded-md bg-[#2a4d39]"></div>
                <div className="h-3 w-12 rounded-md bg-[#2a4d39]"></div>
              </div>
            </div>
          </div>

          {/* Author */}
          <div className="h-4 w-28 rounded-md bg-[#2a4d39]"></div>
        </div>

        {/* Bookmark icon placeholder */}
        <div className="h-6 w-6 rounded-md bg-[#2a4d39]"></div>
      </div>
    </div>
  );
};
