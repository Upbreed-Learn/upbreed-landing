'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useGetCourseAndInstructor } from './hero';
import { CourseData, CourseDetailsData } from '@/lib/constants';
import { useGetCoursesByCategory } from '@/lib/queries/hooks';
import { cn } from '@/lib/utils';

const Others = (props: { id: string }) => {
  const { id } = props;

  const [course] = useGetCourseAndInstructor(Number(id));
  const courseDetailsData: CourseDetailsData = course?.data?.data.data;

  const { data, isPending, isError } = useGetCoursesByCategory(
    1,
    10,
    `${courseDetailsData?.categories[0].id}`,
  );
  const courseList: CourseData[] = data?.data.data;
  const courses = courseList?.filter(course => course.id.toString() !== id);

  return (
    <section
      className={cn(
        'flex justify-center pb-20',
        (isError || courses?.length < 1) && 'hidden',
      )}
    >
      <div className="w-full max-w-7xl lg:px-27.25">
        <div className="flex flex-col gap-5.5 border-t border-[#D9D9D9] pt-17">
          <h2 className="text-center text-xl/10 font-bold text-[#0A0A0A]">
            Other Classes you might like
          </h2>
          <div className="scrollbar max-lg:flex max-lg:w-full max-lg:overflow-auto max-md:px-9 md:max-lg:px-12">
            <div className="flex grid-cols-5 max-xl:gap-6 max-lg:w-max max-lg:px-5 lg:flex-wrap xl:grid xl:px-10">
              {isPending
                ? Array(5)
                    .fill(0)
                    .map((_, index) => <OtherCardLoader key={index} />)
                : courses.slice(0, 5).map(course => (
                    <Link
                      key={course.id}
                      href={`/student/courses/${course.id}`}
                      className="relative h-69.25 w-44.25 overflow-hidden rounded-lg"
                    >
                      <Image
                        src={course.thumbnail}
                        fill
                        sizes="(max-width: 1200px) 100vw, 1200px"
                        alt={course.title}
                        className="size-full object-cover"
                      />

                      <div className="absolute bottom-6 left-5 text-white">
                        <p className="text-[1.875rem]/[100%] font-bold">
                          {course.instructor.fname} {course.instructor.lname}
                        </p>
                        <p className="text-xs/5 font-semibold text-[#D9D9D9]">
                          {course.title}
                        </p>
                      </div>
                    </Link>
                  ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Others;

const OtherCardLoader = () => {
  return (
    <div className="relative h-69.25 w-44.25 animate-pulse overflow-hidden rounded-lg bg-gray-300">
      {/* Image placeholder */}
      <div className="absolute inset-0 bg-gray-300" />

      {/* Text placeholders */}
      <div className="absolute bottom-6 left-5 space-y-2">
        <div className="h-6 w-32 rounded bg-gray-400" />
        <div className="h-3 w-24 rounded bg-gray-400" />
      </div>
    </div>
  );
};
