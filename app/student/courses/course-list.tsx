'use client';

import { useQueryState } from 'nuqs';
import preview from '@/public/img/course-preview.jpg';
import CourseCard from '@/components/course-card';
import Image from 'next/image';
import Link from 'next/link';

const CourseList = () => {
  const [tab, _] = useQueryState('category', {
    defaultValue: 'my-courses',
  });

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
              <div className="scrollbar flex items-center gap-13 overflow-auto px-40">
                {Array(10)
                  .fill(0)
                  .map((_, index) => (
                    <MyCoursesCard key={index} />
                  ))}
              </div>
            </div>
          </div>
        )}
        {(tab === 'saved' || tab === 'history') && (
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array(10)
              .fill(0)
              .map((_, index) => (
                <CourseCard key={index} />
              ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CourseList;

const MyCoursesCard = () => {
  const progressLevel = 50;

  return (
    <div className="relative flex flex-col gap-4 rounded-[10px] bg-[#305B43] p-8">
      <div className="flex items-center gap-3.5">
        <div className="relative h-23.5 w-35.75">
          <Image
            src={preview}
            fill
            sizes="(max-width: 1200px) 100vw, 1200px"
            alt="course-preview"
            className="size-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-2 text-white">
          <div className="flex flex-col gap-1">
            <p className="text-sm/[100%] font-bold">Tony Elumelu</p>
            <p className="text-[8.5px]/[100%] font-bold text-[#C8C8C8]">
              MD/CEO UBA Africa
            </p>
          </div>
          <Link href={'/student/courses/1'} className="font-medium">
            <span className="absolute inset-0"></span>
            Business Operations
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
