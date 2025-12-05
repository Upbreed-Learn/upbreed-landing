'use client';

import { ContentError, ContentLoader } from '@/app/press/[id]/press-content';
import { BlogDetailsData } from '@/lib/constants';
import { useGetBlogById } from '@/lib/queries/hooks';
import { queryKeys } from '@/lib/queries/query-keys';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import DOMPurify from 'dompurify';

const NewsContent = (props: { id: string }) => {
  const queryClient = useQueryClient();
  const { id } = props;
  const { data, isPending, isError } = useGetBlogById(id);

  const blog: BlogDetailsData = data?.data;

  if (isPending) {
    return <ContentLoader />;
  }

  if (isError) {
    return (
      <ContentError
        onRetry={() =>
          queryClient.invalidateQueries({ queryKey: queryKeys.blogs.byId(id) })
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-9">
      <div
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.content) }}
      ></div>
      <div className="flex items-center justify-between text-[#305B43] [&_p]:text-xs/[100%] [&_p]:font-medium">
        <Link href={'/news'} className="flex items-center gap-2">
          <ArrowLeft />
          <p>Previous Post</p>
        </Link>
        <Link href={'/news'} className="flex items-center gap-2">
          <p>Next Post</p>
          <ArrowRight />
        </Link>
      </div>
    </div>
  );
};

export default NewsContent;
