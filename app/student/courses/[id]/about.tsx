'use client';

import play from '@/public/gifs/play.gif';
import { Lock, PlayIcon } from 'lucide-react';
import StarIcon from '@/components/jsx-icons/star';
import Image from 'next/image';
import { useQueryClient } from '@tanstack/react-query';
import { useGetCourseAndInstructor } from './hero';
import { CourseDetailsData, Instructor } from '@/lib/constants';
import { queryKeys } from '@/lib/queries/query-keys';
import ErrorCard from '@/components/error-card';
import { cn, formatClock, formatLength } from '@/lib/utils';
import BunnyPlayerWithTracking from '@/components/bunny-player-with-tracking';
import { useState } from 'react';
import { useGetToken } from '@/lib/queries/hooks';
import { useQueryState } from 'nuqs';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

type Lesson = CourseDetailsData['videos'][number];

const About = (props: { id: string }) => {
  const { id } = props;
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [, setAuth] = useQueryState('auth');
  const [notice, setNotice] = useState(false);
  const queryClient = useQueryClient();
  const { data: tokenData } = useGetToken();
  const token = tokenData?.data.token;

  const [course] = useGetCourseAndInstructor(Number(id), undefined);
  const details: CourseDetailsData | undefined = course?.data?.data.data;
  const [, instructor] = useGetCourseAndInstructor(undefined, details?.instructor?.id);
  const instructorData: Instructor | undefined = instructor?.data?.data.data;

  const videos = details?.videos ?? [];
  const active: Lesson | undefined = videos.find(v => v.id === selectedId) ?? videos[0];
  const totalSeconds =
    details?.preview?.durationInSeconds ??
    videos.reduce((sum, v) => sum + (v.durationInSeconds || 0), 0);
  const categories = details?.categories?.map(c => c?.name).filter(Boolean).join(', ');
  const rating = Math.round(Number((details as { avgRatings?: number } | undefined)?.avgRatings ?? 0));

  const handleRetry = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.courses.byId(id) });
  };

  // The API only sends a player link for lessons this person may watch.
  const choose = (lesson: Lesson) => {
    if (!lesson.embedUrl) {
      if (!token) setAuth('login');
      else setNotice(true);
      return;
    }
    setSelectedId(lesson.id);
    setPlaying(true);
  };

  return (
    <>
      <SubscriptionNotice open={notice} setOpen={setNotice} />
      <section className="flex justify-center pt-11 pb-20 md:pt-16">
        <div className="flex w-full max-w-7xl flex-col gap-6 px-6 md:px-12 lg:px-27.25">
          <h2 className="text-xl/6 font-semibold">About this Class</h2>
          {course.isError ? (
            <ErrorCard handleRetry={handleRetry} />
          ) : course.isPending || !details ? (
            <AboutLoader />
          ) : (
            <>
              <div className="grid overflow-hidden bg-[#00230F] max-lg:rounded-[10px] lg:grid-cols-[minmax(0,1fr)_20rem]">
                {/* Player */}
                <div className="relative aspect-video w-full bg-black">
                  {playing && active?.embedUrl ? (
                    <BunnyPlayerWithTracking
                      key={active.id}
                      videoId={active.id}
                      src={active.embedUrl}
                      token={token}
                      className="rounded-none"
                    />
                  ) : (
                    <button
                      onClick={() => active && choose(active)}
                      className="group absolute inset-0 cursor-pointer"
                      aria-label={`Play ${active?.title ?? 'lesson'}`}
                    >
                      {(active?.thumbnailUrl || details.thumbnail) && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={active?.thumbnailUrl || details.thumbnail}
                          alt={details.title}
                          className="absolute inset-0 size-full object-cover"
                        />
                      )}
                      <span className="absolute inset-0 bg-black/15 transition-colors group-hover:bg-black/25" />
                      <Image
                        src={play}
                        alt=""
                        className="absolute top-1/2 left-1/2 size-16 -translate-1/2 md:size-20"
                      />
                    </button>
                  )}
                </div>

                {/* Lessons */}
                <div className="relative max-lg:max-h-96">
                  <ol className="scrollbar-custom flex flex-col gap-3 overflow-auto p-5 max-lg:max-h-96 lg:absolute lg:inset-0 lg:p-6">
                    {videos.map((v, i) => {
                      const isActive = v.id === active?.id;
                      const locked = !v.embedUrl;
                      return (
                        <li key={v.id}>
                          <button
                            onClick={() => choose(v)}
                            className={cn(
                              'flex w-full cursor-pointer flex-col gap-2 rounded-[10px] border border-transparent bg-[#305B43] px-5 py-3 text-start text-white transition-colors hover:border-[#D0EA50]/40',
                              isActive && 'border-[#D0EA50]/60 text-[#D0EA50]',
                              locked && 'opacity-60',
                            )}
                          >
                            <span className="flex items-center justify-between gap-3">
                              <span className="line-clamp-1 text-xs/6 font-semibold">
                                {i === 0 && v.isTrailer ? 'Trailer' : v.title}
                              </span>
                              <span className="flex shrink-0 items-center gap-2 text-[11px] font-medium text-white/70">
                                {v.durationInSeconds > 0 && formatClock(v.durationInSeconds)}
                                {locked ? <Lock size={18} /> : <PlayIcon size={20} />}
                              </span>
                            </span>
                            {!!token && (
                              <span className="relative block h-1 w-full overflow-hidden rounded-full bg-white/25">
                                <span
                                  style={{ width: `${v.percentageCompleted ?? 0}%` }}
                                  className="absolute inset-y-0 left-0 bg-[#34A853] transition-[width]"
                                />
                                <span className="sr-only">{v.percentageCompleted ?? 0}% watched</span>
                              </span>
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              </div>

              <div className="flex flex-col gap-6 md:gap-8">
                {details.description && (
                  <p className="w-full max-w-201.75 text-sm/6 whitespace-pre-line text-black">
                    {details.description}
                  </p>
                )}
                <div className="flex flex-col gap-2">
                  <ul className="flex flex-col gap-1.5 text-xs text-[#6F6F6F] md:text-sm/6 [&_span]:font-bold [&_span]:text-[#3A3A3A]">
                    <li>
                      Instructor(s):{' '}
                      <span>
                        {instructorData?.fname ?? details.instructor?.fname}{' '}
                        {instructorData?.lname ?? details.instructor?.lname}
                      </span>
                    </li>
                    <li>
                      Class Length:{' '}
                      <span>
                        {videos.length} Video Lesson{videos.length === 1 ? '' : 's'} ({formatLength(totalSeconds)})
                      </span>
                    </li>
                    {categories && (
                      <li>
                        Category: <span>{categories}</span>
                      </li>
                    )}
                  </ul>
                  {rating > 0 && (
                    <div className="flex items-center gap-0.5" aria-label={`Rated ${rating} out of 5`}>
                      {[1, 2, 3, 4, 5].map(n => (
                        <StarIcon key={n} fill={n <= rating ? '#FFC700' : undefined} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default About;

const AboutLoader = () => (
  <div className="flex animate-pulse flex-col gap-6">
    <div className="grid overflow-hidden bg-[#00230F] lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="aspect-video w-full bg-[#1d3a2a]" />
      <div className="flex flex-col gap-3 p-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 rounded-[10px] bg-[#305B43]" />
        ))}
      </div>
    </div>
    <div className="flex max-w-201.75 flex-col gap-2">
      <div className="h-3 w-full rounded bg-[#e5e5e5]" />
      <div className="h-3 w-11/12 rounded bg-[#e5e5e5]" />
      <div className="h-3 w-9/12 rounded bg-[#e5e5e5]" />
    </div>
  </div>
);

const SubscriptionNotice = (props: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { open, setOpen } = props;
  const router = useRouter();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="custom-font text-[#00230F]">
        <DialogHeader>
          <DialogTitle>This lesson is for members</DialogTitle>
          <DialogDescription>
            Become a member to watch every lesson in every class.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={'outline'}>Not now</Button>
          </DialogClose>
          <Button onClick={() => router.push('/pricing')}>See membership plans</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
