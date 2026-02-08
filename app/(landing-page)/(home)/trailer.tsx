'use client';

import Image from 'next/image';
import { Play } from 'lucide-react';
import { CourseData } from '@/lib/constants';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useGetCourses, useGetCoursesBySearch } from '@/lib/queries/hooks';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Activity, useRef, useState } from 'react';
import { ScrollTrigger } from 'gsap/all';
import SuspenseLoader from '@/components/suspense-loader';

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ScrollTrigger);

const Trailer = () => {
  const [play, setPlay] = useState(false);
  const { data, isPending, isError } = useGetCoursesBySearch(
    1,
    1,
    undefined,
    'homepage',
  );

  // const handleSafePlayVideo = (videoId: number) => {
  //   if (!token) {
  //     setAuth('login');
  //     return;
  //   }
  //   if (subscriptions.length === 0 || subscriptions[0].status === 'CANCELLED') {
  //     setOpen(true);
  //     return;
  //   }
  //   setPlayVideo(true);
  //   setSelectedVideoId(videoId);
  // };

  const courses: CourseData[] = data?.data.data;

  const revealRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (revealRef.current) {
      ScrollTrigger.create({
        trigger: revealRef.current,
        start: 'top center',
        onEnter: () => {
          gsap.to('.reveal', {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'power2.out',
          });
        },
      });
    }
  });

  return (
    <section
      ref={revealRef}
      className={cn(
        'flex h-[calc(100vh-89px)] justify-center',
        (isError || courses?.length < 1) && 'hidden',
      )}
    >
      <div className="reveal flex w-full max-w-7xl translate-y-240 items-center justify-center px-9 py-7 opacity-0 md:px-12 md:py-10 lg:px-18">
        {isPending ? (
          <TrailerLoading />
        ) : (
          <div className="_size-max relative h-max w-full">
            <Activity mode={play ? 'hidden' : 'visible'}>
              <div className="_lg:w-[calc(100vw-9rem)] _max-w-[66.38875rem] _w-[calc(100vw-4.5rem)] _md:w-[calc(100vw-6rem)] relative h-123 overflow-hidden rounded-2xl md:h-140 lg:w-full">
                <Image
                  src={courses?.[0].thumbnail}
                  alt={courses?.[0].title}
                  fill
                  sizes="(max-width: 1200px) 100vw, 1200px"
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
                      {courses?.[0].instructor.fname} <br />{' '}
                      {courses?.[0].instructor.lname}
                    </p>
                  </div>
                  <Link
                    href={'/'}
                    className="text-sm/[100%] font-bold text-[#D0EA50]"
                  >
                    <span className="absolute inset-0"></span>
                    {courses?.[0].title}
                  </Link>
                </div>
                <button className="custom-gradient flex w-max cursor-pointer items-center gap-1 rounded-lg border-[1.78px] border-white px-3.5 py-2 text-sm/[100%] font-semibold text-white transition-transform active:scale-95">
                  Watch Trailer
                  <Play />
                </button>
              </div>
            </Activity>
            {/* <Activity mode={play ? 'visible' : 'hidden'}>
              <iframe
                src={`https://iframe.mediadelivery.net/embed/${libraryId}/${courses?.[0].bunnyVideoId}`}
                loading="lazy"
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0"
              />
            </Activity> */}
            <div className="absolute top-1/2 left-1/2 size-full -translate-1/2">
              <SuspenseLoader />
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
