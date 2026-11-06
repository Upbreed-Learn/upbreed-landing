'use client';

import ErrorCard from '@/components/error-card';
import { CourseDetailsData, Instructor } from '@/lib/constants';
import { QUERIES } from '@/lib/queries';
import { queryKeys } from '@/lib/queries/query-keys';
import { useQueries, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

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

/** Instructor photo, or their initials on brand green when no photo has been added (or it fails to load). */
export const InstructorPhoto = ({
  src,
  name,
  className,
}: {
  src?: string | null;
  name: string;
  className?: string;
}) => {
  const [failed, setFailed] = useState(false);
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase())
    .join('');
  return (
    <div className={`relative overflow-hidden bg-[#00230F] ${className ?? ''}`}>
      {src && !failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name}
          onError={() => setFailed(true)}
          className="absolute inset-0 size-full object-cover"
        />
      ) : (
        <span className="absolute inset-0 grid place-items-center text-4xl font-bold text-[#D0EA50]">
          {initials}
        </span>
      )}
    </div>
  );
};

const Hero = (props: { id: string }) => {
  const { id } = props;
  const queryClient = useQueryClient();
  const [expanded, setExpanded] = useState(false);

  const [course] = useGetCourseAndInstructor(Number(id));
  const courseDetailsData: CourseDetailsData = course?.data?.data.data;

  const [, instructor] = useGetCourseAndInstructor(
    undefined,
    courseDetailsData?.instructor?.id,
  );
  const data: Instructor | undefined = instructor?.data?.data.data;
  const name = data
    ? `${data.fname} ${data.lname}`.trim()
    : `${courseDetailsData?.instructor?.fname ?? ''} ${courseDetailsData?.instructor?.lname ?? ''}`.trim();
  const photo =
    data?.instructorProfile?.profilePictureUrl ??
    (courseDetailsData?.instructor as { profilePictureUrl?: string } | undefined)?.profilePictureUrl;
  const bio = data?.instructorProfile?.description || data?.instructorProfile?.about;

  const handleRetry = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.courses.byId(id) });
    queryClient.invalidateQueries({ queryKey: queryKeys.instructors.byId(`${data?.id}`) });
  };

  return (
    <section className="flex justify-center bg-[#305B43]">
      <div className="w-full max-w-7xl px-6 py-10 md:px-12 md:py-16 lg:px-27.25">
        {course.isError || instructor.isError ? (
          <ErrorCard handleRetry={handleRetry} />
        ) : course.isPending || (instructor.isPending && !!courseDetailsData?.instructor?.id) ? (
          <HeroLoader />
        ) : (
          <div className="flex flex-col items-center gap-6 text-white md:flex-row md:items-start md:gap-10">
            <InstructorPhoto
              src={photo}
              name={name}
              className="h-60 w-44 shrink-0 rounded-[10px] md:h-67.25 md:w-40.5"
            />
            <div className="flex flex-col gap-4 max-md:items-center max-md:text-center md:pt-2">
              <h1 className="text-xl/6 font-semibold">About the Instructor</h1>
              <div className="flex flex-col gap-1">
                <p className="text-2xl font-bold text-[#D0EA50]">{name}</p>
                {(data?.instructorProfile?.title || data?.instructorProfile?.expertise) && (
                  <p className="text-sm font-semibold text-[#E8F0E4]">
                    {data?.instructorProfile?.title || data?.instructorProfile?.expertise}
                  </p>
                )}
              </div>
              {bio && (
                <div className="flex flex-col gap-1.5 max-md:items-center">
                  <p
                    className={`w-full max-w-218.25 text-sm/6 whitespace-pre-line text-white/90 ${expanded ? '' : 'line-clamp-5'}`}
                  >
                    {bio}
                  </p>
                  {bio.length > 400 && (
                    <button
                      onClick={() => setExpanded(e => !e)}
                      className="w-max cursor-pointer text-xs font-semibold text-[#D0EA50] underline"
                    >
                      {expanded ? 'Show less' : 'Read more'}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;

const HeroLoader = () => (
  <div className="flex w-full animate-pulse flex-col items-center gap-6 md:flex-row md:items-start md:gap-10">
    <div className="h-60 w-44 shrink-0 rounded-[10px] bg-white/15 md:h-67.25 md:w-40.5" />
    <div className="flex w-full flex-col gap-3 md:pt-2">
      <div className="h-5 w-40 rounded bg-white/20" />
      <div className="h-7 w-56 rounded bg-white/20" />
      <div className="h-3 w-full max-w-218.25 rounded bg-white/15" />
      <div className="h-3 w-11/12 rounded bg-white/15" />
      <div className="h-3 w-10/12 rounded bg-white/15" />
    </div>
  </div>
);
