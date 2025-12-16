import { Category } from '@/lib/constants';
import { useGetCategories } from '@/lib/queries/hooks';
import { queryKeys } from '@/lib/queries/query-keys';
import { useQueryClient } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '../ui/hover-card';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import ErrorCard from '../error-card';
import EmptyState from '../empty-state';
import { CoursesLoading } from '.';

export const COURSE_BUNDLES = [
  {
    id: 1,
    name: 'New Courses',
  },
  {
    id: 2,
    name: 'Top Rated',
  },
  {
    id: 3,
    name: 'Popular Courses',
  },
  {
    id: 4,
    name: 'Gifts',
  },
];

const ClassesHover = (props: { children: React.ReactNode }) => {
  const { children } = props;
  const pathname = usePathname();

  const queryClient = useQueryClient();

  const { data, isPending, isError } = useGetCategories();
  const categories: Omit<
    Category['category'],
    'createdAt' | 'updatedAt' | 'deletedAt'
  >[] = data?.data.data;

  const handleRetry = () => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.categories.all,
    });
  };

  return (
    <HoverCard>
      <HoverCardTrigger
        className={cn(
          'flex cursor-pointer items-center gap-1 hover:text-[#D0EA50]',
          pathname.includes('/student/home') &&
            'relative before:absolute before:-bottom-6.25 before:h-1 before:w-full before:bg-[#D0EA50]',
        )}
      >
        {children}
      </HoverCardTrigger>
      <HoverCardContent
        sideOffset={26}
        className="flex w-auto gap-36.5 border-transparent bg-[#305B43] pt-11.5 pr-33.5 pb-20 pl-14"
      >
        <div className="flex flex-col gap-6 text-sm/4 font-semibold text-white">
          <Link
            href={'/student/home'}
            className="flex items-center gap-1 text-[#D0EA50]"
          >
            All Courses <ChevronRight />
          </Link>
          {isError ? (
            <ErrorCard handleRetry={handleRetry} />
          ) : (
            <ul className="flex flex-col gap-3">
              {isPending ? (
                <CoursesLoading />
              ) : categories.length > 0 ? (
                categories.map(category => (
                  <li key={category.id}>
                    <Link
                      href={`/student/home?allCourses=${category.name.trim()}`}
                      className="hover:text-[#D0EA50]"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))
              ) : (
                <EmptyState
                  title="No Categories Found"
                  description="When we have categories, it will be listed here."
                />
              )}
            </ul>
          )}
        </div>
        <div className="flex flex-col gap-6 text-sm/6 font-semibold text-white">
          <h4 className="text-[#34A853]">Course Bundles</h4>
          <ul className="flex flex-col gap-2">
            {COURSE_BUNDLES.map(courseBundle => (
              <li key={courseBundle.id}>
                <Link
                  href={`/student/home?courseBundles=${courseBundle.name.trim()}`}
                  className="hover:text-[#D0EA50]"
                >
                  {courseBundle.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default ClassesHover;
