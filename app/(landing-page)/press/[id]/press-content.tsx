'use client';

import { Button } from '@/components/ui/button';
import { BlogDetailsData } from '@/lib/constants';
import { useGetBlogById } from '@/lib/queries/hooks';
import { queryKeys } from '@/lib/queries/query-keys';
import { useQueryClient } from '@tanstack/react-query';
import DOMPurify from 'dompurify';

const PressContent = (props: { id: string }) => {
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
    <div
      className="flex flex-col gap-9"
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.content) }}
    />
  );
};

export default PressContent;

export const ContentLoader = () => {
  return (
    <div className="animate-pulse space-y-6">
      <div className="space-y-4">
        <div className="h-4 rounded bg-gray-200"></div>
        <div className="h-4 w-5/6 rounded bg-gray-200"></div>
        <div className="h-4 w-4/6 rounded bg-gray-200"></div>
        <div className="h-4 w-3/6 rounded bg-gray-200"></div>
      </div>

      <div className="space-y-4">
        <div className="h-4 w-4/5 rounded bg-gray-200"></div>
        <div className="h-4 w-full rounded bg-gray-200"></div>
        <div className="h-4 w-3/5 rounded bg-gray-200"></div>
      </div>

      <div className="space-y-4">
        <div className="h-4 rounded bg-gray-200"></div>
        <div className="h-4 w-5/6 rounded bg-gray-200"></div>
        <div className="h-4 w-4/6 rounded bg-gray-200"></div>
        <div className="h-4 w-3/6 rounded bg-gray-200"></div>
      </div>

      <div className="space-y-4">
        <div className="h-4 w-4/5 rounded bg-gray-200"></div>
        <div className="h-4 w-full rounded bg-gray-200"></div>
        <div className="h-4 w-3/5 rounded bg-gray-200"></div>
      </div>

      <div className="space-y-4">
        <div className="h-4 rounded bg-gray-200"></div>
        <div className="h-4 w-5/6 rounded bg-gray-200"></div>
        <div className="h-4 w-4/6 rounded bg-gray-200"></div>
        <div className="h-4 w-3/6 rounded bg-gray-200"></div>
      </div>

      <div className="space-y-4">
        <div className="h-4 w-4/5 rounded bg-gray-200"></div>
        <div className="h-4 w-full rounded bg-gray-200"></div>
        <div className="h-4 w-3/5 rounded bg-gray-200"></div>
      </div>
    </div>
  );
};

export const ContentError = (props: { onRetry: () => void }) => {
  const { onRetry } = props;

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="rounded-lg border border-red-300 bg-red-50 px-6 py-8 text-center">
        <h3 className="mb-2 text-lg font-semibold text-red-700">
          Unable to load article
        </h3>
        <p className="mb-4 text-sm text-red-600">
          Something went wrong while fetching the article details. Please try
          again.
        </p>
        <Button onClick={onRetry}>Retry</Button>
      </div>
    </div>
  );
};
