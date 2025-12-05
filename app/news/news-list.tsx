'use client';

import { cn, formatPrettyDate } from '@/lib/utils';
// import { ArrowRightCircleIcon } from 'lucide-react';
import Image from 'next/image';
import { useQueryState } from 'nuqs';
import { useEffect, useRef, useState } from 'react';
// import tubo from '@/public/img/tubo.jpg';
import Link from 'next/link';
import { Pagination } from '@/components/ui/custom/pagination';
import { useGetAllPublishedBlogs, useGetCategories } from '@/lib/queries/hooks';
import { BlogsData, BlogsResponse, Category } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queries/query-keys';
import EmptyState from '@/components/empty-state';

const NewsList = () => {
  const [category, _] = useQueryState('category', {
    defaultValue: 'all',
  });
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  const { data, isPending, isError } = useGetAllPublishedBlogs(
    page,
    10,
    true,
    'news',
    category,
  );
  const blogsResponse: BlogsResponse = data?.data;

  const handleRetry = () => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.blogs.isPublished(page, 10, true, 'news', category),
    });
  };

  return (
    <section className="flex justify-center bg-white pt-5 pb-36 md:pt-10">
      <div className="flex w-full max-w-7xl flex-col gap-14 px-9 md:px-12 lg:px-18">
        <Categories />
        <div className="flex flex-col gap-20">
          {isError ? (
            <NewsCardError onRetry={handleRetry} />
          ) : (
            <>
              <div className="grid gap-x-9 gap-y-7 sm:grid-cols-2 md:grid-cols-3">
                {isPending ? (
                  Array(9)
                    .fill(0)
                    .map((_, index) => <NewsCardLoading key={index} />)
                ) : blogsResponse.data.length > 0 ? (
                  blogsResponse?.data.map(blog => (
                    <NewsCard key={blog.id} blog={blog} />
                  ))
                ) : (
                  <EmptyState
                    title="No News Release Found"
                    description="When we have published news, it will be listed here."
                  />
                )}
              </div>
              {blogsResponse && blogsResponse.totalPages > 0 && (
                <Pagination
                  currentPage={page}
                  totalPages={blogsResponse.totalPages}
                  onPageChange={setPage}
                />
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsList;

export const NewsCard = (props: { blog: BlogsData }) => {
  const { blog } = props;
  return (
    <div className="relative flex flex-col gap-2.5">
      <div className="relative h-[10.661875rem] w-full overflow-hidden rounded-lg">
        <Image
          src={blog.previewImage}
          alt={blog.title}
          fill
          sizes="100vw"
          className="size-full object-cover"
        />
      </div>
      <div className="flex flex-col gap-2 border-b-[0.88px] border-[#00000033] pb-3">
        <p className="text-xs/[100%] font-bold text-[#9C9C9C]">
          {formatPrettyDate(blog.createdAt)}
        </p>
        <Link
          href={`/news/${blog.id}`}
          className="line-clamp-2 leading-[100%] font-extrabold text-ellipsis text-[#305B43]"
        >
          <span className="absolute inset-0"></span>
          {blog.title}
        </Link>
        <p className="text-sm/[100%] font-medium text-[#949494]">
          {blog.description}
        </p>
      </div>
    </div>
  );
};

export const NewsCardLoading = () => {
  return (
    <div className="relative flex w-full animate-pulse flex-col gap-2.5">
      {/* Image Skeleton */}
      <div className="relative h-[10.661875rem] w-full overflow-hidden rounded-lg bg-gray-200" />

      {/* Content Skeleton */}
      <div className="flex flex-col gap-2 border-b-[0.88px] border-[#00000033] pb-3">
        <div className="h-3 w-20 rounded bg-gray-200" />
        <div className="h-4 w-full rounded bg-gray-200" />
        <div className="h-3 w-5/6 rounded bg-gray-200" />
      </div>
    </div>
  );
};

export const NewsCardError = (props: { onRetry: () => void }) => {
  const { onRetry } = props;
  return (
    <div className="relative flex flex-col gap-2.5">
      <div className="rounded-lg border border-red-300 bg-red-50 px-6 py-8 text-center">
        <h3 className="mb-2 text-lg font-semibold text-red-700">
          Unable to load news
        </h3>
        <p className="mb-4 text-sm text-red-600">
          Something went wrong while fetching the news list. Please try again.
        </p>
        <div className="flex justify-center gap-2">
          <Button onClick={onRetry}>Retry</Button>
        </div>
      </div>
    </div>
  );
};

const Categories = () => {
  const [category, setCategory] = useQueryState('category', {
    defaultValue: 'all',
  });
  const queryClient = useQueryClient();

  const { data, isPending, isError } = useGetCategories();
  const categories: Omit<
    Category['category'],
    'createdAt' | 'updatedAt' | 'deletedAt'
  >[] = data?.data.data;

  const handleSetCategory = (category: string) => {
    setCategory(category.toLowerCase());
  };

  const handleRetry = () => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.categories.all,
    });
  };

  return (
    <div className="relative">
      {isError ? (
        <CategoryError handleRetry={handleRetry} />
      ) : isPending ? (
        <CategoryLoader />
      ) : (
        <div className="flex w-full overflow-auto xl:justify-center">
          <div
            className={cn(
              'flex gap-5 border-b border-[#9B9B9B7A] py-3 md:items-center',
              categories.length > 12 && 'pl-18',
            )}
          >
            <button
              onClick={() => handleSetCategory(`all`)}
              className={cn(
                'cursor-pointer text-xs/[100%] font-bold text-[#9C9C9C] uppercase',
                category === 'all' && 'text-black',
              )}
            >
              All
              <span className="sr-only">Select all Category</span>
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => handleSetCategory(`${cat.id}`)}
                className={cn(
                  'cursor-pointer text-xs/[100%] font-bold text-[#9C9C9C] uppercase',
                  cat.id.toString() === category && 'text-black',
                )}
              >
                {cat.name}
                <span className="sr-only">Select {cat.name} Category</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const CategoryLoader = () => {
  return (
    <div className="scrollbar-hidden flex w-full overflow-auto">
      <div className="flex gap-11 border-b border-[#9B9B9B7A] py-3 md:items-center">
        {/* Skeleton items */}
        {[...Array(10)].map((_, i) => (
          <div key={i} className="h-4 w-20 animate-pulse rounded bg-gray-200" />
        ))}

        {/* Fake Arrow (disabled look) */}
        <div className="h-6 w-6 animate-pulse rounded-full bg-gray-200" />
      </div>
    </div>
  );
};

const CategoryError = (props: { handleRetry: () => void }) => {
  const { handleRetry } = props;
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="rounded-lg border border-red-300 bg-red-50 px-6 py-8 text-center">
        <h3 className="mb-2 text-lg font-semibold text-red-700">
          Unable to load category
        </h3>
        <p className="mb-4 text-sm text-red-600">
          Something went wrong while fetching the category list. Please try
          again.
        </p>
        <div className="flex justify-center gap-2">
          <Button onClick={handleRetry}>Retry</Button>
        </div>
      </div>
    </div>
  );
};
