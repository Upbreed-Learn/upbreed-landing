'use client';

import Link from 'next/link';
import Image from 'next/image';
import StarIcon from '@/components/jsx-icons/star';
// import { ChevronLeftCircle, ChevronRightCircle } from 'lucide-react';
import { useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queries/query-keys';
import { QUERIES } from '@/lib/queries';
import { Category, CourseData, Instructor } from '@/lib/constants';
import Basketball from '@/components/jsx-icons/basketball';
import Star1 from '@/components/jsx-icons/star-1';
import TrendingUp from '@/components/jsx-icons/trending-up';
import UsersMore from '@/components/jsx-icons/users-more';
import ImageIcon from '@/components/jsx-icons/image';
import Sound from '@/components/jsx-icons/sound';
import Dna from '@/components/jsx-icons/dna';
import Screen from '@/components/jsx-icons/screen';
import Globe from '@/components/jsx-icons/globe';
import { cn, formatDuration } from '@/lib/utils';
import { useGetCategories, useGetCoursesBySearch } from '@/lib/queries/hooks';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/all';

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ScrollTrigger);

const Elevate = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);

  const { data, isPending, isError } = useGetCoursesBySearch(
    1,
    5,
    undefined,
    'homepage',
  );

  const homepageCourses: CourseData[] = data?.data.data;

  const {
    data: categoryData,
    isPending: categoryDataIsPending,
    isError: categoryIsError,
  } = useGetCategories();
  const categories: Omit<
    Category['category'],
    'createdAt' | 'updatedAt' | 'deletedAt'
  >[] = categoryData?.data.data;

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
            stagger: 0.2,
            ease: 'power2.out',
          });
        },
      });
    }
  });

  return (
    <section className="flex min-h-[calc((100vh-89px)/var(--site-zoom,1))] justify-center px-8 md:py-7">
      <div
        ref={revealRef}
        className="flex w-full max-w-7xl flex-col items-center gap-6 pt-11 pb-8 md:gap-10"
      >
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
              <li key={category.id} className="reveal translate-y-96 opacity-0">
                <Link
                  href={`/student/home?allCourses=${category.id}`}
                  className="flex items-center gap-2"
                >
                  {category.name}
                  {category.icon ? (
                    <Image
                      src={category.icon}
                      alt="icon"
                      width={16}
                      height={16}
                    />
                  ) : (
                    <CategoryIcon name={category.name} />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
        <div
          className={cn(
            'flex w-full flex-col gap-4 max-md:pt-14',
            isError && 'hidden',
          )}
        >
          <div className="flex items-center gap-2.5 px-9 text-sm/[100%] font-bold md:pl-12 lg:pl-18">
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
              className="scrollbar-hidden flex w-full gap-[1.38875rem] overflow-auto lg:justify-center"
            >
              {isPending ? (
                Array(5)
                  .fill(0)
                  .map((_, index) => <InstructorCardLoading key={index} />)
              ) : homepageCourses.length > 0 ? (
                <>
                  {/* <button
                    onClick={handleScrollLeft}
                    className="-transition-y-1/2 absolute top-1/2 -left-6 z-10 cursor-pointer transition-transform active:scale-95"
                  >
                    <ChevronLeftCircle className="size-10 text-[#FFFFFF]" />
                  </button> */}
                  <div className="grid-cols-5 gap-5 max-lg:flex lg:grid">
                    {homepageCourses.slice(0, 5).map(course => (
                      <InstructorCard key={course.id} course={course} />
                    ))}
                  </div>
                  {/* <button
                    onClick={handleScrollRight}
                    className="-transition-y-1/2 absolute top-1/2 -right-6 z-10 cursor-pointer transition-transform active:scale-95"
                  >
                    <ChevronRightCircle className="size-10 text-[#FFFFFF]" />
                  </button> */}
                </>
              ) : (
                <div className="grid-cols-5 gap-5 max-lg:flex lg:grid">
                  {SAMPLE_CARDS.map(card => (
                    <SampleCard key={card.name} {...card} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Elevate;

/** Default icons for the standard categories (used when no icon was uploaded in admin). */
function CategoryIcon({ name }: { name: string }) {
  const n = name.toLowerCase();
  const Icon = n.includes('sport')
    ? Basketball
    : n.includes('trend')
      ? Star1
      : n.includes('business')
        ? TrendingUp
        : n.includes('community')
          ? UsersMore
          : n.includes('art')
            ? ImageIcon
            : n.includes('music')
              ? Sound
              : n.includes('health')
                ? Dna
                : n.includes('film')
                  ? Screen
                  : n.includes('science')
                    ? Globe
                    : null;
  return Icon ? <Icon /> : null;
}

/**
 * Sample cards from the design, shown until real courses are set to "show on homepage" in admin.
 * Photos live in public/img/featured/ (missing ones show a dark card with the name).
 */
const SAMPLE_CARDS = [
  { name: 'TUBO BERENI', tagline: 'Selling to the world', duration: '1H 32mins', photo: '/img/featured/tubo.jpg' },
  { name: 'CHEF FREGZ', tagline: 'Cooking for stars', duration: '1H 32mins', photo: '/img/featured/fregz.jpg', isNew: true },
  { name: 'DJ SPINALL', tagline: 'Spinning around the world', duration: '52mins', photo: '/img/featured/spinall.jpg' },
  { name: 'TOPE ADENOLA', tagline: 'How I Photographed all the presidents', duration: '1H 32mins', photo: '/img/featured/tope.jpg' },
  { name: 'JENNIFER OKHORI', tagline: 'Selling anything, anytime anywhere', duration: '1H 32mins', photo: '/img/featured/jennifer.jpg' },
];

function SampleCard(props: (typeof SAMPLE_CARDS)[number] & { isNew?: boolean }) {
  const [broken, setBroken] = useState(false);
  return (
    <div className="relative h-79 w-50.5 shrink-0 overflow-hidden rounded-lg bg-[#303030] ease-in-out hover:brightness-125">
      {props.isNew && (
        <span className="absolute top-4 right-4 z-10 rounded-lg border border-[#D0EA50] px-2 py-1 text-[8px]/[100%] font-semibold text-white">
          New
        </span>
      )}
      {!broken && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={props.photo} alt={props.name} onError={() => setBroken(true)} className="absolute inset-0 size-full object-cover" />
      )}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      <div className="absolute bottom-5 left-1/2 flex w-[85%] -translate-x-1/2 flex-col gap-4">
        <div>
          <p className="text-[2rem]/[100%] font-extrabold text-white">{props.name}</p>
          <p className="pt-1 text-[10.67px]/[110%] text-[#D0EA50]">{props.tagline}</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-[8px]/[100%] font-semibold text-white">{props.duration}</p>
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
}

const InstructorCard = (props: { course: CourseData }) => {
  const { course } = props;
  return (
    <div className="relative size-max h-87.5 w-50 shrink-0 overflow-hidden rounded-lg ease-in-out hover:brightness-125">
      <span className="absolute top-4 right-5 z-10 rounded-lg border border-[#D0EA50] px-2 py-1 text-[8px]/[100%] font-semibold text-white">
        New
      </span>
      <Image
        src={course.thumbnail}
        alt={course.title}
        unoptimized
        fill
        sizes="(max-width: 1200px) 100vw, 1200px"
        className="object-cover"
      />
      <div className="absolute bottom-5 left-1/2 flex w-11/12 -translate-x-1/2 flex-col gap-4">
        <div>
          <p className="text-[2rem]/[100%] font-extrabold text-white">
            {course.instructor.fname} {course.instructor.lname}
          </p>
          <p className="text-[10.67px]/[100%] text-[#D0EA50]">
            {course.instructor.fname}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-[8px]/[100%] font-semibold text-white">
            {formatDuration(course.preview.durationInMinutes)}
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
