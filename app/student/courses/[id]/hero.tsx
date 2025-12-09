'use client';

import ErrorCard from '@/components/error-card';
import { CourseDetailsData, Instructor } from '@/lib/constants';
import { QUERIES } from '@/lib/queries';
import { queryKeys } from '@/lib/queries/query-keys';
import { useQueries, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';

export const useGetCourseAndInstructor = (
  courseId?: number,
  instructorId?: number,
) => {
  return useQueries({
    queries: [
      {
        queryKey: queryKeys.courses.byId(`${courseId}`),
        queryFn: () => QUERIES.getCourseById(`${courseId}`),
        enabled: !!courseId,
      },
      {
        queryKey: queryKeys.instructors.byId(`${instructorId}`),
        queryFn: () => QUERIES.getInstructorsById(`${instructorId}`),
        enabled: !!instructorId,
      },
    ],
  });
};

const Hero = (props: { id: string }) => {
  const { id } = props;
  const queryClient = useQueryClient();

  const [course] = useGetCourseAndInstructor(Number(id));
  const courseDetailsData: CourseDetailsData = course?.data?.data.data;

  const [_, instructor] = useGetCourseAndInstructor(
    undefined,
    courseDetailsData?.instructor.id,
  );
  const instructorDetailsData: Instructor = instructor?.data?.data.data;

  const handleRetry = () => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.courses.byId(id),
    });
    queryClient.invalidateQueries({
      queryKey: queryKeys.instructors.byId(`${instructorDetailsData?.id}`),
    });
  };

  return (
    <section className="flex justify-center bg-[#305B43]">
      <div className="w-full max-w-7xl md:px-12 md:pt-21.75 md:pb-7 lg:pl-27.25">
        {instructor.isError ? (
          <ErrorCard handleRetry={handleRetry} />
        ) : instructor.isPending ? (
          <HeroLoader />
        ) : (
          <div className="items-center gap-12 max-md:relative max-md:h-max md:flex">
            <div className="relative h-123.75 w-full shrink-0 md:h-67.25 md:w-40.5 md:overflow-hidden md:rounded-[10px]">
              <Image
                src={instructorDetailsData.instructorProfile.profilePictureUrl}
                fill
                sizes="(max-width: 1200px) 100vw, 1200px"
                unoptimized
                alt={instructorDetailsData.fname}
                className="size-full object-cover"
              />
            </div>
            <div className="bottom-7 flex flex-col gap-4 text-white max-md:absolute max-md:w-full max-md:items-center max-md:text-center md:gap-9">
              <h1 className="text-xl/6 font-semibold max-md:hidden">
                About the Instructor
              </h1>
              <div className="flex flex-col gap-3 md:hidden">
                <h1 className="text-[2.5rem]/9 font-semibold text-[#D0EA50] max-md:w-full max-md:max-w-42.75">
                  {instructorDetailsData.fname} {instructorDetailsData.lname}
                </h1>
                <p className="leading-4 font-semibold">
                  {instructorDetailsData.instructorProfile.expertise}
                </p>
              </div>
              <div className="flex flex-col gap-1.5">
                <p className="w-full max-w-79 leading-6 max-md:line-clamp-3 max-md:text-center max-md:text-[10px] max-md:leading-4 max-md:text-ellipsis md:max-w-218.25">
                  {instructorDetailsData.instructorProfile.description}
                </p>
                <button className="text-[7px]/4 md:hidden">Read more...</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;

const HeroLoader = () => {
  return (
    <div className="w-full animate-pulse items-center gap-12 max-md:relative max-md:h-max md:flex">
      {/* Image Skeleton */}
      <div className="relative h-123.75 w-full shrink-0 md:h-67.25 md:w-40.5 md:overflow-hidden md:rounded-[10px]">
        <div className="size-full bg-[#e5e5e5] md:rounded-[10px]"></div>
      </div>

      {/* Text Section */}
      <div className="bottom-7 flex flex-1 flex-col gap-4 max-md:absolute max-md:w-full max-md:items-center max-md:text-center md:gap-9">
        {/* Desktop Heading */}
        <div className="hidden h-5 w-40 rounded bg-[#d1d1d1] md:block"></div>

        {/* Mobile Name + Role */}
        <div className="flex w-full max-w-42.75 flex-col gap-3 md:hidden">
          <div className="h-7 w-full rounded bg-[#d1d1d1]"></div>
          <div className="h-3 w-28 rounded bg-[#e0e0e0]"></div>
        </div>

        {/* Description Skeleton */}
        <div className="flex w-full flex-col gap-1.5">
          <div className="h-3 w-full max-w-79 rounded bg-[#d1d1d1] md:max-w-218.25"></div>
          <div className="h-3 w-11/12 rounded bg-[#e0e0e0]"></div>
          <div className="h-3 w-10/12 rounded bg-[#dcdcdc]"></div>
          <div className="h-3 w-9/12 rounded bg-[#e5e5e5]"></div>

          {/* Mobile Read More */}
          <div className="h-2 w-12 rounded bg-[#e0e0e0] md:hidden"></div>
        </div>
      </div>
    </div>
  );
};
