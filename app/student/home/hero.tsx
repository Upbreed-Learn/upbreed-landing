'use client';

import { Button } from '@/components/ui/button';
import { CourseData, UserProfileType } from '@/lib/constants';
import {
  useGetCourses,
  useGetToken,
  useGetUserProfile,
} from '@/lib/queries/hooks';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const Hero = () => {
  const progressLevel = 50;

  const { data, isPending, isError } = useGetCourses(1, 1);
  const { data: tokenData } = useGetToken();
  const token = tokenData?.data.token;

  const {
    data: userData,
    isPending: isUserPending,
    isError: isUserError,
  } = useGetUserProfile(token);
  const userProfile: UserProfileType = userData?.data.data;

  const courses: CourseData[] = data?.data.data;

  return (
    <section className="flex items-end gap-7 bg-[#305B43] pt-10 pb-8 max-lg:hidden">
      {isUserPending ? (
        <DesktopNameLoader />
      ) : (
        <h1
          className={cn(
            'flex-1/3 pb-7 text-end text-4xl/[100%] font-bold text-white',
            isUserError && 'hidden',
          )}
        >
          Welcome <br /> Back <br /> {userProfile.fname} {userProfile.lname[0]},
        </h1>
      )}
      <div
        className={cn(
          'flex flex-2/3 flex-col gap-6 rounded-l-lg bg-white pt-12 pb-10 pl-12',
          (isError || courses?.length < 1) && 'hidden',
        )}
      >
        <div className="flex flex-col gap-3">
          <p className="text-2xl/[100%] font-semibold">Slow and Steady</p>
          <p className="text-xs/5 font-semibold text-[#6F6F6F]">
            Try read for about 5 - 10mins a day, to track your progress to
            success
          </p>
        </div>
        {isPending ? (
          <HeroLoader />
        ) : (
          <div className="flex items-center gap-6">
            <div className="relative h-41.5 w-76.5 overflow-hidden rounded-l-lg">
              <Image
                src={courses[0].thumbnail}
                alt={courses[0].title}
                fill
                sizes="(max-width: 1200px) 100vw, 1200px"
                className="size-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-1.5">
                  <p className="leading-[100%] font-semibold text-[#110000]">
                    {courses[0].title}
                  </p>
                  <p className="text-xs/[100%] font-semibold text-[#949494]">
                    {courses[0].instructor.fname} {courses[0].instructor.lname}
                  </p>
                </div>
                <span className="relative block h-2.5 w-70.25 rounded-l-lg bg-[#D9D9D9]">
                  <span
                    style={{
                      width: `${progressLevel}%`,
                    }}
                    className="absolute top-0 left-0 h-full rounded-l-lg bg-[#305B43] transition-[width]"
                  ></span>
                  <span className="sr-only">Progress Level</span>
                </span>
              </div>
              <Button asChild className="w-max">
                <Link href={`/student/courses/${courses[0].id}`}>
                  Continue
                  <ChevronRight />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;

export const MobileHero = () => {
  const progressLevel = 50;

  const { data, isPending, isError } = useGetCourses(1, 1);
  const { data: tokenData } = useGetToken();
  const token = tokenData?.data.token;

  const {
    data: userData,
    isPending: isUserPending,
    isError: isUserError,
  } = useGetUserProfile(token);
  const userProfile: UserProfileType = userData?.data.data;

  const courses: CourseData[] = data?.data.data;

  return (
    <section className="flex items-end gap-7 bg-white lg:hidden">
      <div className="flex w-full flex-col gap-4 pt-6 pb-4 text-center">
        {isUserPending ? (
          <MobileNameLoader />
        ) : (
          <h1
            className={cn(
              'text-xl/[100%] font-bold text-[#00230F]',
              isUserError && 'hidden',
            )}
          >
            Welcome Back <br /> {userProfile.fname} {userProfile.lname[0]},
          </h1>
        )}
        <p className="text-xs/[10px] font-semibold text-[#9B9B9B]">
          Try read for about 5 - 10mins a day, to track your progress to success
        </p>
        {isPending ? (
          <MobileLoader />
        ) : (
          <div
            className={cn(
              'flex justify-center bg-[#305B43] px-9 py-6',
              (isError || courses?.length < 1) && 'hidden',
            )}
          >
            <div className="flex w-full max-w-84 flex-col gap-2 rounded bg-white p-5">
              <p className="text-start text-xs/5 text-[#737373]">
                Latest course
              </p>
              <div className="flex items-center gap-1.5">
                <div className="relative h-[4.563125rem] w-33.5 shrink-0 overflow-hidden rounded">
                  <Image
                    src={courses[0].thumbnail}
                    alt={courses[0].title}
                    fill
                    sizes="(max-width: 1200px) 100vw, 1200px"
                    className="size-full object-cover"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-1">
                    <p className="text-start text-[10px]/3 font-bold">
                      {courses[0].title}
                    </p>
                    <p className="text-start text-[8px]/[100%] font-semibold text-[#949494]">
                      {courses[0].instructor.fname}{' '}
                      {courses[0].instructor.lname}
                    </p>
                  </div>
                  <span className="relative block h-1 w-full rounded-lg bg-[#D9D9D9]">
                    <span
                      style={{
                        width: `${progressLevel}%`,
                      }}
                      className="absolute top-0 left-0 h-full rounded-lg bg-[#305B43] transition-[width]"
                    ></span>
                    <span className="sr-only">Progress Level</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

const HeroLoader = () => {
  return (
    <div className="flex animate-pulse items-center gap-6">
      {/* Image placeholder */}
      <div className="relative h-41.5 w-76.5 overflow-hidden rounded-l-lg bg-[#e5e5e5]"></div>

      {/* Right Section */}
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            {/* Title */}
            <div className="h-4 w-40 rounded bg-[#e5e5e5]"></div>
            {/* Subtitle */}
            <div className="h-3 w-24 rounded bg-[#e5e5e5]"></div>
          </div>

          {/* Progress Bar Skeleton */}
          <div className="block h-2.5 w-70.25 rounded-l-lg bg-[#e5e5e5]"></div>
        </div>

        {/* Button Skeleton */}
        <div className="h-9 w-24 rounded-lg bg-[#e5e5e5]"></div>
      </div>
    </div>
  );
};

const MobileLoader = () => {
  return (
    <div className="flex justify-center bg-[#305B43] px-9 py-6">
      <div className="flex w-full max-w-84 animate-pulse flex-col gap-2 rounded bg-white p-5">
        {/* Latest course label */}
        <div className="h-3 w-20 rounded bg-[#e5e5e5]"></div>

        <div className="flex items-center gap-1.5">
          {/* Image placeholder */}
          <div className="relative h-[4.563125rem] w-33.5 shrink-0 overflow-hidden rounded bg-[#e5e5e5]"></div>

          {/* Right side content */}
          <div className="flex w-full flex-col gap-2">
            {/* Title + Author */}
            <div className="flex flex-col gap-1">
              <div className="h-3 w-40 rounded bg-[#e5e5e5]"></div>
              <div className="h-2.5 w-20 rounded bg-[#e5e5e5]"></div>
            </div>

            {/* Progress bar */}
            <div className="block h-1 w-full rounded-lg bg-[#e5e5e5]"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DesktopNameLoader = () => {
  return (
    <h1 className="flex-1/3 pb-7 text-end text-4xl/[100%] font-bold text-white">
      <span className="inline-block h-10 w-40 animate-pulse rounded bg-white/30" />
      <br />
      <span className="mt-2 inline-block h-10 w-32 animate-pulse rounded bg-white/30" />
      <br />
      <span className="mt-2 inline-block h-10 w-52 animate-pulse rounded bg-white/30" />
    </h1>
  );
};

const MobileNameLoader = () => {
  return (
    <h1 className="text-xl/[100%] font-bold text-[#00230F]">
      <span className="inline-block h-5 w-32 animate-pulse rounded bg-[#00230F]/20" />
      <br />
      <span className="mt-2 inline-block h-5 w-24 animate-pulse rounded bg-[#00230F]/20" />
    </h1>
  );
};
