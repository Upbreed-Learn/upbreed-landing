'use client';

import Facebook from '@/components/jsx-icons/facebook';
import Twitter from '@/components/jsx-icons/twitter';
import { BlogDetailsData } from '@/lib/constants';
import { useGetBlogById } from '@/lib/queries/hooks';
import { queryKeys } from '@/lib/queries/query-keys';
import {
  formatPrettyDate,
  handleShareToFacebook,
  handleShareToTwitter,
} from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';

const PressHeader = (props: { id: string }) => {
  const queryClient = useQueryClient();
  const { id } = props;
  const { data, isPending, isError } = useGetBlogById(id);

  const blog: BlogDetailsData = data?.data;

  if (isPending) {
    return <HeaderLoader />;
  }

  if (isError) {
    return (
      <HeaderError
        onRetry={() =>
          queryClient.invalidateQueries({ queryKey: queryKeys.blogs.byId(id) })
        }
      />
    );
  }

  return (
    <section className="flex flex-col gap-6 border-b-[0.88px] border-[#00000033] pb-4">
      <div className="relative h-79 w-full overflow-hidden rounded-[10px]">
        <Image
          src={blog.previewImage}
          alt={blog.title}
          fill
          sizes="100vw"
          className="size-full object-cover"
        />
      </div>
      <p className="text-xs/[100%] font-bold text-[#9C9C9C]">
        {formatPrettyDate(blog.createdAt)}
      </p>

      <h2 className="text-xl leading-[100%] font-extrabold text-[#305B43] md:text-[2rem]">
        {blog.title}
      </h2>
      <div className="flex items-center gap-4.5">
        <p className="text-xs/[100%] font-bold text-[#9B9B9B] uppercase">
          Share
        </p>
        <div className="flex items-center gap-1">
          <button onClick={handleShareToTwitter} className="cursor-pointer p-2">
            <Twitter fill="#9C9C9C" width="19" height="17.61" />
          </button>
          <button
            onClick={handleShareToFacebook}
            className="cursor-pointer p-2"
          >
            <Facebook fill="#9C9C9C" width="8.86" height="16.9" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default PressHeader;

const HeaderLoader = () => {
  return (
    <section className="flex w-full animate-pulse flex-col gap-6 border-b-[0.88px] border-[#00000033] pb-4">
      <div className="h-79 w-full overflow-hidden rounded-[10px] bg-gray-300" />
      <div className="h-3 w-24 rounded bg-gray-300" />
      <div className="h-8 w-3/4 rounded bg-gray-300" />
      <div className="flex items-center gap-4.5">
        <div className="h-3 w-12 rounded bg-gray-300" />
        <div className="flex items-center gap-1">
          <div className="h-9 w-9 rounded bg-gray-300" />
          <div className="h-9 w-9 rounded bg-gray-300" />
        </div>
      </div>
    </section>
  );
};

const HeaderError = (props: { onRetry: () => void }) => {
  const { onRetry } = props;

  return (
    <section className="hidden flex-col gap-6 border-b-[0.88px] border-[#00000033] pb-4">
      <div className="rounded-lg border border-red-300 bg-red-50 px-6 py-8 text-center">
        <h3 className="mb-2 text-lg font-semibold text-red-700">
          Unable to load article
        </h3>
        <p className="mb-4 text-sm text-red-600">
          Something went wrong while fetching the article details. Please try
          again.
        </p>
        <button
          onClick={onRetry}
          className="rounded bg-red-700 px-4 py-2 font-semibold text-white hover:bg-red-800"
        >
          Retry
        </button>
      </div>
    </section>
  );
};
