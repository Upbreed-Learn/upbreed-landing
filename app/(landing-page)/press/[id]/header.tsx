'use client';

import ErrorCard from '@/components/error-card';
import Facebook from '@/components/jsx-icons/facebook';
import Twitter from '@/components/jsx-icons/twitter';
import { Button } from '@/components/ui/button';
import { BlogDetailsData } from '@/lib/constants';
import { useGetBlogById } from '@/lib/queries/hooks';
import { queryKeys } from '@/lib/queries/query-keys';
import {
  formatPrettyDate,
  handleShareToFacebook,
  handleShareToTwitter,
} from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Copy } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const PressHeader = (props: { id: string }) => {
  const queryClient = useQueryClient();
  const { id } = props;
  const { data, isPending, isError } = useGetBlogById(id);
  const router = useRouter();

  const blog: BlogDetailsData = data?.data;

  const handleBack = () => {
    router.back();
  };

  const handleCopy = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success('Copied to clipboard');
  };

  if (isPending) {
    return <HeaderLoader />;
  }

  if (isError) {
    return (
      <ErrorCard
        handleRetry={() =>
          queryClient.invalidateQueries({ queryKey: queryKeys.blogs.byId(id) })
        }
      />
    );
  }

  return (
    <section className="flex flex-col gap-6 border-b-[0.88px] border-[#00000033] pb-4">
      <Button onClick={handleBack} className="w-max">
        <ArrowLeft />
        Back
      </Button>
      <div className="relative h-79 w-full overflow-hidden rounded-[10px]">
        <Image
          src={blog.previewImage}
          alt={blog.title}
          fill
          sizes="(max-width: 1200px) 100vw, 1200px"
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
          <button className="cursor-pointer p-2" onClick={handleCopy}>
            <Copy className="size-5 text-[#9C9C9C]" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default PressHeader;

export const HeaderLoader = () => {
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
