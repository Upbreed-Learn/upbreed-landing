'use client';

import play from '@/public/gifs/play.gif';
import { PlayIcon } from 'lucide-react';
import StarIcon from '@/components/jsx-icons/star';
import Image from 'next/image';
import { useQueryClient } from '@tanstack/react-query';
import { useGetCourseAndInstructor } from './hero';
import { CourseDetailsData, Instructor } from '@/lib/constants';
import { queryKeys } from '@/lib/queries/query-keys';
import ErrorCard from '@/components/error-card';
import { cn, formatDuration } from '@/lib/utils';
import VideoPlayer from '@/components/video-player';
import { Activity, useEffect, useRef, useState } from 'react';
import { useGetToken } from '@/lib/queries/hooks';
import { useQueryState } from 'nuqs';
import SuspenseLoader from '@/components/suspense-loader';
import ProgressTrackingVideoPlayer from '@/components/progress-tracking-video-player';

const libraryId = process.env.NEXT_PUBLIC_LIBRARY_ID;
const bunnyToken = process.env.NEXT_PUBLIC_BUNNY_TOKEN;
const videoId = 'b42c8ac6-8576-49b6-a2f3-b0f13dcb3f95';
const pullZone = 4672058;

const About = (props: { id: string }) => {
  const { id } = props;
  const [__, setAuth] = useQueryState('auth');
  const [height, setHeight] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const height = containerRef.current.clientHeight;
      setHeight(height);
    }
  }, [containerRef]);

  const queryClient = useQueryClient();
  const [playVideo, setPlayVideo] = useState(false);
  const { data: tokenData } = useGetToken();
  const token = tokenData?.data.token;

  // const videoUrl = `https://${pullZone}.b-cdn.net/${videoId}/playlist.m3u8?token=${BUNNY_TOKEN}&expires=1893456000`;

  const [course] = useGetCourseAndInstructor(Number(id), undefined);
  const courseDetailsData: CourseDetailsData = course?.data?.data.data;

  const [_, instructor] = useGetCourseAndInstructor(
    undefined,
    courseDetailsData?.instructor.id,
  );
  const instructorDetailsData: Instructor = instructor?.data?.data.data;

  const isAnyPending = course.isPending || instructor.isPending;
  const isAnyError = course.isError || instructor.isError;

  const categoriesList = courseDetailsData?.categories?.map(
    category => category?.name,
  );

  const categories = categoriesList?.join(', ');

  const handleRetry = () => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.courses.byId(id),
    });
    queryClient.invalidateQueries({
      queryKey: queryKeys.instructors.byId(`${instructorDetailsData?.id}`),
    });
  };

  const handleSafePlayVideo = () => {
    if (!token) {
      setAuth('login');
      return;
    }
    setPlayVideo(true);
  };

  return (
    <section className="flex justify-center pt-11 pb-[12.6675rem] md:pt-20.5">
      <div className="flex w-full flex-col items-center gap-5 max-md:px-9">
        <div className="w-full max-w-7xl">
          <h2 className="text-start text-xl/6 font-semibold max-md:hidden md:pl-12 lg:px-20 lg:pl-27.25">
            About this Class
          </h2>
        </div>
        {isAnyError ? (
          <ErrorCard handleRetry={handleRetry} />
        ) : isAnyPending ? (
          <AboutLoader />
        ) : (
          <>
            <div className="flex w-full flex-col gap-11 md:gap-6">
              <div className="flex items-center max-md:flex-col max-md:gap-4 md:h-max md:bg-[#00230F]">
                <div className="_md:h-full relative max-md:w-full max-md:overflow-hidden max-md:rounded-[10px] md:flex md:h-[37.96875rem] md:flex-2/3 lg:flex-3/4">
                  <div className="absolute top-1/2 left-1/2 size-full -translate-1/2">
                    <SuspenseLoader />
                  </div>
                  <Activity mode={playVideo ? 'hidden' : 'visible'}>
                    <Image
                      src={courseDetailsData.thumbnail}
                      fill
                      sizes="(max-width: 1200px) 100vw, 1200px"
                      alt={courseDetailsData.title}
                      className="size-full object-cover"
                    />
                    <button
                      onClick={() => setPlayVideo(true)}
                      className="cursor-pointer"
                    >
                      <Image
                        src={play}
                        alt="play"
                        className="absolute top-1/2 left-1/2 -translate-1/2"
                      />
                    </button>
                  </Activity>
                  <Activity mode={playVideo ? 'visible' : 'hidden'}>
                    <VideoPlayer
                      videoId={courseDetailsData.videos[0]?.id}
                      bunnyVideoId={courseDetailsData.videos[0]?.bunnyVideoId}
                      enableProgressTracking={true} // Now works with string videoIds directly
                      bunnyPullZone={pullZone.toString()}
                      bunnyToken={bunnyToken}
                      className="self-center"
                    />
                  </Activity>
                </div>
                <div className="scrollbar-custom flex flex-col gap-6 overflow-auto max-md:w-full max-md:px-5 md:max-h-[37.96875rem] md:flex-1/3 md:gap-11 md:p-7.5 md:py-11 lg:flex-1/4">
                  <div className="flex flex-col gap-2">
                    <span className="text-xs/6 font-semibold text-[#7D1E1E] md:hidden">
                      {courseDetailsData.preview.lessonCount} Lessons
                    </span>
                    <button
                      onClick={() => setPlayVideo(true)}
                      className="flex cursor-pointer items-center justify-between rounded-[10px] bg-[#305B43] px-9 py-3.5 text-start text-[#D0EA50]"
                    >
                      <p className="text-xs/6 font-semibold">
                        {courseDetailsData.videos[0]?.title}
                      </p>
                      <PlayIcon size={24} />
                    </button>
                  </div>
                  <div className="flex flex-col gap-4">
                    {courseDetailsData.videos.slice(1).map(video => (
                      <button
                        key={video.id}
                        onClick={handleSafePlayVideo}
                        className="flex cursor-pointer justify-between gap-3 rounded-[10px] bg-[#305B43] px-9 py-3.5 text-start text-white"
                      >
                        <p className="line-clamp-1 text-xs/6 font-semibold text-ellipsis">
                          {video.title}
                        </p>
                        <PlayIcon size={24} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full max-w-7xl">
              <div className="flex flex-col gap-3 md:gap-8 md:pl-12 lg:pl-27.25">
                <p className="w-full max-w-201.75 text-sm/5 tracking-[0.14px] text-black max-md:border-b max-md:border-[#0000000D] max-md:pb-2.5">
                  {courseDetailsData.description}
                </p>
                <div className="flex flex-col gap-2">
                  <ul className="flex flex-col gap-2 text-xs text-[#6F6F6F] md:text-sm/6 [&_span]:font-bold">
                    <li>
                      Instructor(s):{' '}
                      <span>
                        {instructorDetailsData.fname}{' '}
                        {instructorDetailsData.lname}
                      </span>
                    </li>
                    <li>
                      Class Length:{' '}
                      <span>
                        {courseDetailsData.videos.length} Video Lessons (
                        {formatDuration(
                          courseDetailsData.preview.durationInMinutes,
                        )}
                        )
                      </span>
                    </li>
                    <li>
                      Category: <span>{categories}</span>
                    </li>
                  </ul>
                  <div className="flex items-center gap-0.5 max-md:hidden">
                    <StarIcon fill="#FFC700" />
                    <StarIcon fill="#FFC700" />
                    <StarIcon fill="#FFC700" />
                    <StarIcon fill="#FFC700" />
                    <StarIcon />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default About;

const AboutLoader = () => {
  return (
    <>
      <div className="flex w-full animate-pulse flex-col gap-11 md:gap-6">
        {/* MAIN SECTION */}
        <div className="flex items-center max-md:flex-col max-md:gap-4 md:h-126 md:bg-[#00230F]">
          {/* LEFT: VIDEO PREVIEW SKELETON */}
          <div className="relative h-45.25 bg-[#d9d9d9] max-md:w-full max-md:overflow-hidden max-md:rounded-[10px] sm:h-80 md:h-full md:flex-2/3 lg:flex-3/4">
            {/* Dummy Play Icon Placeholder */}
            <div className="absolute top-1/2 left-1/2 h-10 w-10 -translate-1/2 rounded-full bg-[#bfbfbf]"></div>
          </div>

          {/* RIGHT: LESSON LIST */}
          <div className="scrollbar-custom flex h-97.25 flex-col gap-6 overflow-auto max-md:w-full max-md:px-5 md:h-full md:flex-1/3 md:gap-11 md:p-7.5 md:py-11 lg:flex-1/4">
            {/* Top Box */}
            <div className="flex flex-col gap-2">
              <span className="text-xs/6 font-semibold text-transparent md:hidden">
                65 Lessons
              </span>

              <div className="h-11 rounded-[10px] bg-[#3d7457] px-9 py-3.5"></div>
            </div>

            {/* Lesson Repeater Skeleton */}
            <div className="flex flex-col gap-4">
              {Array(10)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className="h-11 rounded-[10px] bg-[#3d7457] px-9 py-3.5"
                  ></div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* DETAILS SECTION */}
      <div className="w-full max-w-7xl animate-pulse">
        <div className="flex flex-col gap-3 md:gap-8 md:pl-12 lg:pl-27.25">
          {/* Description Skeleton */}
          <div className="flex w-full max-w-201.75 flex-col gap-2">
            <div className="h-3 w-full rounded bg-[#e5e5e5]"></div>
            <div className="h-3 w-11/12 rounded bg-[#e0e0e0]"></div>
            <div className="h-3 w-10/12 rounded bg-[#dcdcdc]"></div>
            <div className="h-3 w-9/12 rounded bg-[#e2e2e2]"></div>
          </div>

          {/* List Section */}
          <div className="flex flex-col gap-2">
            <div className="h-3 w-40 rounded bg-[#e5e5e5]"></div>
            <div className="h-3 w-52 rounded bg-[#e0e0e0]"></div>
            <div className="h-3 w-32 rounded bg-[#dcdcdc]"></div>

            {/* Stars — hide on mobile just like real version */}
            <div className="mt-2 hidden items-center gap-0.5 md:flex">
              <div className="h-4 w-4 rounded bg-[#e5e5e5]"></div>
              <div className="h-4 w-4 rounded bg-[#e5e5e5]"></div>
              <div className="h-4 w-4 rounded bg-[#e5e5e5]"></div>
              <div className="h-4 w-4 rounded bg-[#e5e5e5]"></div>
              <div className="h-4 w-4 rounded bg-[#e5e5e5]"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
