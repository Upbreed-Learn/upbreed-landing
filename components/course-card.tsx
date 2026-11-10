import { Bookmark, Play } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { CourseData } from '@/lib/constants';
import { courseCover, courseSeconds, formatHMS } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import useSendRequest from '@/lib/hooks/useSendRequest';
import { MUTATIONS } from '@/lib/queries';
import { queryKeys } from '@/lib/queries/query-keys';

const CourseCard = (props: {
  course: CourseData;
  page: number;
  mePage?: boolean;
}) => {
  const { course, page, mePage } = props;
  const queryClient = useQueryClient();

  const { mutate: mutateRemoveBookmark, isPending: isPendingRemoveBookmark } =
    useSendRequest<{ courseId: number }, any>({
      mutationFn: (data: { courseId: number }) => {
        return MUTATIONS.removeBookmark(data);
      },
      successToast: {
        title: 'Success',
        description: 'Course bookmark removed successfully.',
      },
      errorToast: {
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
      },
      onSuccessCallback: () => {
        queryClient.invalidateQueries({
          queryKey: queryKeys.courses.bookmarked(page, 10),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.courses.paginated(page, 9),
        });
      },
    });

  const { mutate, isPending } = useSendRequest<
    {
      courseId: number;
    },
    any
  >({
    mutationFn: (data: { courseId: number }) => {
      return MUTATIONS.bookmarkCourse(data);
    },
    successToast: {
      title: 'Success',
      description: 'Course bookmarked successfully.',
    },
    errorToast: {
      title: 'Error',
      description: 'An unexpected error occurred. Please try again.',
    },
    onSuccessCallback: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.courses.bookmarked(1, 10),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.courses.paginated(page, 9),
      });
    },
  });

  const handleBookmark = () => {
    if (course.isBookmark) {
      mutateRemoveBookmark({ courseId: Number(course.id) });
    } else {
      mutate({ courseId: Number(course.id) });
    }
  };


  const busy = isPending || isPendingRemoveBookmark;
  const marked = busy ? !course.isBookmark : course.isBookmark;
  const seconds = courseSeconds(course);
  const lessons = course.preview?.lessonCount ?? course.totalVideos ?? 0;

  return (
    <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-black text-white">
      {courseCover(course) && (
        <Image
          src={courseCover(course)}
          alt={course.title}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className="size-full object-cover grayscale transition-all duration-300 group-hover:scale-105 group-hover:grayscale-0"
        />
      )}
      <span className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      {/* The whole card opens the class and starts playing. */}
      <Link href={`/student/courses/${course.id}?play=1`} aria-label={`Play ${course.title}`} className="absolute inset-0 z-[1]" />
      <Play
        size={40}
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-1/2 text-white opacity-0 transition-opacity group-hover:opacity-100"
      />
      {!mePage && (
        <button
          onClick={handleBookmark}
          aria-label={marked ? 'Remove bookmark' : 'Bookmark this course'}
          className="absolute top-4 right-4 z-10 cursor-pointer p-1 transition-transform active:scale-95"
        >
          <Bookmark size={22} className={marked ? 'text-[#E5484D]' : 'text-white'} fill={marked ? '#E5484D' : 'transparent'} />
        </button>
      )}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 px-5 pb-4">
        <div className="flex min-w-0 flex-col gap-1">
          <p className="line-clamp-3 text-lg/[1.05] font-extrabold uppercase md:text-xl/[1.05]">{course.title}</p>
          <p className="truncate text-xs text-[#D0EA50] capitalize">
            {course.instructor?.fname} {course.instructor?.lname}
          </p>
          <p className="text-xs text-white/90">{lessons} Lessons</p>
        </div>
        {seconds > 0 && <p className="shrink-0 text-xs font-medium tabular-nums">{formatHMS(seconds)}</p>}
      </div>
    </div>
  );
};

export default CourseCard;

export const CourseCardLoading = () => (
  <div className="aspect-[4/3] animate-pulse rounded-2xl bg-gray-300" />
);
