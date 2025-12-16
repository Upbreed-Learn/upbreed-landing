'use client';

import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { Menu, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import MobileNav from './mobile-nav';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queries/query-keys';
import { QUERIES } from '@/lib/queries';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { CourseData } from '@/lib/constants';
import ErrorCard from '../error-card';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

const useGetSearchCourses = (search: string) => {
  return useQuery({
    queryKey: queryKeys.courses.search(1, 10, search),
    queryFn: () => QUERIES.getCoursesBySearch(1, 10, search),
    enabled: search !== '',
  });
};

function SearchInput(props: {
  mobileSearch: boolean;
  setMobileSearch: Dispatch<SetStateAction<boolean>>;
}) {
  const { mobileSearch, setMobileSearch } = props;
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery.trim(), 500);
  const [isOpen, setIsOpen] = useState(false);
  const [filteredResults, setFilteredResults] = useState<CourseData[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const progressLevel = 50;
  const queryClient = useQueryClient();
  const router = useRouter();

  const handleRetry = () => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.courses.search(1, 10, searchQuery),
    });
  };

  const { data, isPending, isError } =
    useGetSearchCourses(debouncedSearchQuery);

  const coursesData: CourseData[] = data?.data.data;

  useEffect(() => {
    if (debouncedSearchQuery.length > 0) {
      setFilteredResults(coursesData);
    } else {
      setFilteredResults([]);
    }

    setIsOpen(searchQuery.trim().length > 0);
  }, [debouncedSearchQuery, coursesData, searchQuery]);

  const handleSelectResult = (result: number) => {
    router.push(`/student/courses/${result}`);
    setSearchQuery('');
    setIsOpen(false);
  };

  const handleSearchMobile = () => {
    setMobileSearch(!mobileSearch);
  };

  return (
    <div
      className={
        'relative w-full max-lg:flex max-lg:justify-center lg:max-w-2xl'
      }
    >
      <div className="relative max-lg:w-full">
        <Input
          ref={inputRef}
          placeholder="Search"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          onFocus={() => searchQuery && setIsOpen(true)}
          type="search"
          className={cn(
            'z-110 rounded-[2.75rem] bg-white pl-11 text-xs/[100%] font-medium text-black placeholder:text-[#C8C8C8]',
            mobileSearch ? 'block w-full' : 'w-[16.775rem] max-lg:hidden',
          )}
        />
        <div className="flex items-center gap-7">
          <button onClick={handleSearchMobile}>
            <Search
              className={cn(
                'text-white lg:absolute lg:top-1/2 lg:left-3 lg:-translate-y-1/2 lg:text-[#001A72]',
                mobileSearch
                  ? 'absolute top-1/2 left-3 -translate-y-1/2 text-[#001A72]'
                  : 'lg:absolute lg:top-1/2 lg:left-3 lg:-translate-y-1/2 lg:text-[#001A72]',
              )}
            />
          </button>
          {!mobileSearch && (
            <MobileNav>
              <Menu className="text-[#D0EA50]" />
            </MobileNav>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="bg-popover absolute top-full left-1/2 z-50 mt-2 w-107.25 -translate-x-1/2 rounded-md border p-1 shadow-md">
          <div className="max-h-80 overflow-y-auto p-6">
            {isError ? (
              <ErrorCard handleRetry={handleRetry} />
            ) : isPending ? (
              Array(5)
                .fill(0)
                .map((_, i) => <CoursesLoading key={i} />)
            ) : (
              filteredResults?.map(result => (
                <button
                  key={result.id}
                  onClick={() => handleSelectResult(result.id)}
                  className="flex w-full cursor-pointer items-center gap-3 rounded-sm p-4 text-left text-sm hover:bg-[#E0E0E0] focus:outline-none"
                >
                  <div className="relative h-15.25 w-27.25 bg-[#34A853]">
                    <Image
                      src={result.thumbnail}
                      alt={result.title}
                      fill
                      sizes="(max-width: 1200px) 100vw, 1200px"
                      className="size-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <p className="text-sm/[100%] font-semibold text-black">
                      {result.instructor.fname} {result.instructor.lname}
                    </p>
                    <p className="text-[8.5px]/[100%] font-bold text-[#474747]">
                      {result.description}
                    </p>
                    <p className="leading-[100%] font-medium text-[#6F6F6F]">
                      {result.title}
                    </p>
                    <span className="relative block h-2 w-full bg-[#D9D9D9]">
                      <span
                        style={{
                          width: `${progressLevel}%`,
                        }}
                        className="absolute top-0 left-0 h-full bg-[#34A853] transition-[width]"
                      ></span>
                      <span className="sr-only">Progress Level</span>
                    </span>
                  </div>
                  <span className="sr-only">Link to {result.title} course</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {isOpen && searchQuery && filteredResults?.length === 0 && (
        <div className="bg-popover absolute top-full z-50 mt-2 w-full p-4 text-center">
          <p className="text-muted-foreground text-sm">
            No results found for "{searchQuery}"
          </p>
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
}

export default SearchInput;

const CoursesLoading = () => {
  return (
    <button
      disabled
      className="flex w-full items-center gap-3 rounded-sm p-4 text-left text-sm"
    >
      {/* Thumbnail */}
      <div className="h-15.25 w-27.25 animate-pulse rounded-sm bg-[#E0E0E0]" />

      <div className="flex flex-1 flex-col gap-2">
        {/* Instructor name */}
        <div className="h-3 w-40 animate-pulse rounded bg-[#E0E0E0]" />

        {/* Description */}
        <div className="h-2 w-full animate-pulse rounded bg-[#E0E0E0]" />

        {/* Title */}
        <div className="h-2.5 w-28 animate-pulse rounded bg-[#E0E0E0]" />

        {/* Progress bar */}
        <div className="relative h-2 w-full overflow-hidden rounded bg-[#D9D9D9]">
          <div className="h-full w-1/3 animate-pulse bg-[#BDBDBD]" />
        </div>
      </div>
    </button>
  );
};
