import { Bookmark, Play } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { CourseData } from '@/lib/constants';
import { formatMinutes } from '@/lib/utils';

const CourseCard = (props: { course: CourseData }) => {
  const { course } = props;
  return (
    <div className="group relative overflow-hidden rounded-lg bg-[#F2F2F2]">
      <div className="relative h-46 md:h-38">
        <span className="custom-gradient absolute inset-0 md:hidden"></span>
        <button className="absolute top-4 right-5 z-10 cursor-pointer p-1 transition-transform active:scale-95 md:hidden">
          <Bookmark size={22} className="text-white" />
        </button>
        <Image
          src={course.thumbnail}
          alt={course.title}
          fill
          sizes="(max-width: 1200px) 100vw, 1200px"
          className="size-full object-cover"
        />
        <span className="absolute top-3 right-7 rounded-lg bg-[#D0EA50] px-[6.5px] py-[5.9px] text-[6.5px]/[100%] font-semibold text-black max-md:hidden">
          New
        </span>
        <Play
          size={36}
          className="absolute top-1/2 left-1/2 -translate-1/2 text-white opacity-0 transition-opacity group-hover:opacity-100"
        />
        <div className="absolute bottom-2 flex flex-col gap-1.5 px-6 md:hidden">
          <div className="flex flex-col gap-1.5">
            <span className="w-max rounded-[6.75px] bg-[#D0EA50] px-2 py-1 text-[6.84px]/[100%] font-semibold">
              New
            </span>
            <Link
              href={`/student/courses/${course.id}`}
              className="text-xs/3.5 font-bold text-[#D0EA50] uppercase"
            >
              <span className="absolute inset-0"></span>
              {course.title}
            </Link>
          </div>
          <div>
            <p className="text-xs/6 font-medium text-[#BEBEBE]">
              {course.preview.lessonCount} Lessons
            </p>
            <div className="flex items-center justify-between text-sm/6 font-medium text-white capitalize">
              <p>
                {course.instructor.fname} {course.instructor.lname}
              </p>
              <p>{formatMinutes(course.preview.durationInMinutes)}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-7 px-6 pt-2.5 pb-3.5 max-md:hidden">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-sm/6 font-medium text-[#34A853]">
            <p>{course.preview.lessonCount} Lessons</p>
            <p>{formatMinutes(course.preview.durationInMinutes)}</p>
          </div>
          <Link
            href={`/student/courses/${course.id}`}
            className="text-sm/5 font-bold uppercase"
          >
            <span className="absolute inset-0"></span>
            {course.title}
          </Link>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm/6 font-medium text-[#6F6F6F] capitalize">
            {course.instructor.fname} {course.instructor.lname}
          </p>
          <button className="z-10 cursor-pointer p-1 transition-transform active:scale-95">
            <Bookmark size={24} className="text-[#34A853]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;

export const CourseCardLoading = () => {
  return (
    <div className="group relative animate-pulse overflow-hidden rounded-lg bg-[#F2F2F2]">
      {/* Image Skeleton */}
      <div className="relative h-46 bg-gray-300 md:h-38" />

      {/* Mobile content */}
      <div className="absolute bottom-2 flex w-full flex-col gap-1.5 px-6 md:hidden">
        <div className="flex flex-col gap-1.5">
          <div className="h-4 w-10 rounded bg-gray-400"></div>
          <div className="h-3 w-44 rounded bg-gray-400"></div>
        </div>

        <div className="space-y-1.5">
          <div className="h-3 w-20 rounded bg-gray-400"></div>
          <div className="flex items-center justify-between">
            <div className="h-3 w-20 rounded bg-gray-400"></div>
            <div className="h-3 w-10 rounded bg-gray-400"></div>
          </div>
        </div>
      </div>

      {/* Desktop content */}
      <div className="hidden flex-col gap-7 px-6 pt-2.5 pb-3.5 max-md:hidden md:flex">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <div className="h-3 w-20 rounded bg-gray-400"></div>
            <div className="h-3 w-14 rounded bg-gray-400"></div>
          </div>

          <div className="h-4 w-56 rounded bg-gray-400"></div>
        </div>

        <div className="flex items-center justify-between">
          <div className="h-3 w-28 rounded bg-gray-400"></div>
          <div className="h-6 w-6 rounded bg-gray-400"></div>
        </div>
      </div>
    </div>
  );
};
