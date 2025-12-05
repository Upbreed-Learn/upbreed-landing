'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pagination } from '@/components/ui/custom/pagination';
import { useState } from 'react';
import { useGetAllPublishedBlogs } from '@/lib/queries/hooks';
import { BlogsData, BlogsResponse } from '@/lib/constants';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queries/query-keys';
import EmptyState from '@/components/empty-state';

const PressList = () => {
  const [page, setPage] = useState(1);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isPending, isError } = useGetAllPublishedBlogs(
    page,
    10,
    true,
    'press',
  );

  const blogsResponse: BlogsResponse = data?.data;

  const handleBack = () => {
    router.back();
  };

  const handleRetry = () => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.blogs.isPublished(page, 10, true, 'press'),
    });
  };

  return (
    <section className="flex justify-center bg-white">
      <div className="flex w-full max-w-7xl flex-col gap-10 px-9 py-6 md:gap-20 md:p-12 lg:px-18 lg:py-12">
        <Button onClick={handleBack} className="w-max">
          <ArrowLeft />
          Back
        </Button>
        <div className="flex flex-col gap-10 md:gap-20">
          {isError ? (
            <ErrorCard handleRetry={handleRetry} />
          ) : (
            <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
              {isPending ? (
                Array(9)
                  .fill(0)
                  .map((_, index) => <LoadingCard key={index} />)
              ) : blogsResponse.data.length > 0 ? (
                blogsResponse?.data.map(blog => (
                  <PressCard key={blog.id} blog={blog} />
                ))
              ) : (
                <EmptyState
                  title="No Press Release Found"
                  description="When we publish a press release, it will be listed here."
                />
              )}
            </div>
          )}
          {blogsResponse && (
            <Pagination
              currentPage={page}
              totalPages={blogsResponse.totalPages}
              onPageChange={setPage}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default PressList;

const PressCard = (props: { blog: BlogsData }) => {
  const { blog } = props;

  return (
    <div className="relative flex flex-col gap-2.5 rounded-[10px] bg-[#00230F] px-6 pt-4 pb-14">
      <div className="relative h-[8.105625rem] w-full overflow-hidden rounded-[6px]">
        <Image
          src={blog.previewImage}
          alt={blog.title}
          fill
          sizes="100vw"
          className="size-full object-cover"
        />
      </div>
      <Link
        href={`/press/${blog.id}`}
        className="line-clamp-2 text-sm/[100%] font-semibold text-ellipsis text-white"
      >
        <span className="absolute inset-0"></span>
        {blog.title}
      </Link>
      <Link
        href={`/press/${blog.id}`}
        className="flex items-center gap-2 border-b-[0.88px] border-white pb-2.5 text-xs/[100%] font-semibold text-[#D0EA50]"
      >
        Read More on FORBES
      </Link>
    </div>
  );
};

const LoadingCard = () => {
  return (
    <div className="relative flex animate-pulse flex-col gap-2.5 rounded-[10px] bg-[#0b3920] px-6 pt-4 pb-14">
      <div className="h-[8.105625rem] w-full overflow-hidden rounded-[6px] bg-gray-700" />
      <div className="h-4 w-3/4 rounded bg-gray-700" />
      <div className="mt-2 h-3 w-1/2 rounded bg-gray-700" />
    </div>
  );
};

const ErrorCard = (props: { handleRetry: () => void }) => {
  const { handleRetry } = props;
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="rounded-lg border border-red-300 bg-red-50 px-6 py-8 text-center">
        <h3 className="mb-2 text-lg font-semibold text-red-700">
          Unable to load press articles
        </h3>
        <p className="mb-4 text-sm text-red-600">
          Something went wrong while fetching the press list. Please try again.
        </p>
        <div className="flex justify-center gap-2">
          <Button onClick={handleRetry}>Retry</Button>
        </div>
      </div>
    </div>
  );
};
