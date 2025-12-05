'use client';

import { Button } from '@/components/ui/button';
import { NewsCard, NewsCardLoading } from '../news-list';
import { useGetBlogById } from '@/lib/queries/hooks';
import { BlogDetailsData, BlogsResponse } from '@/lib/constants';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queries/query-keys';
import { QUERIES } from '@/lib/queries';
import { cn } from '@/lib/utils';

export const useGetSimilarBlogs = (
  page: number,
  limit: number,
  isPublished: boolean,
  type: string,
  category: string,
) => {
  return useQuery({
    queryKey: queryKeys.blogs.isPublished(
      page,
      limit,
      isPublished,
      type,
      category,
    ),
    queryFn: () => QUERIES.getBlogs(type, isPublished, page, limit, category),
    enabled: !!category,
  });
};

const More = (props: { id: string }) => {
  const { id } = props;
  const { data } = useGetBlogById(id);
  const blog: BlogDetailsData = data?.data;
  const {
    data: similarBlogs,
    isPending: blogsIsPending,
    isError: blogsError,
  } = useGetSimilarBlogs(
    1,
    4,
    true,
    'news',
    `${blog?.categories[0].category.id}`,
  );
  const blogsResponse: BlogsResponse = similarBlogs?.data;

  const filteredBlogs = blogsResponse?.data.filter(
    blog => blog.id.toString() !== id,
  );

  return (
    <section
      className={cn(
        'flex w-full flex-1/4 flex-col gap-6',
        (blogsError || filteredBlogs?.length === 0) && 'hidden',
      )}
    >
      <h3 className="text-xs/[100%] font-semibold lg:text-end">
        MORE AMAZING ARTICLES
      </h3>
      <div className="scrollbar-hidden flex flex-col gap-8 overflow-auto max-lg:w-full lg:gap-32">
        <div className="flex gap-8 max-lg:w-140 lg:flex-col">
          {blogsIsPending
            ? Array(3)
                .fill(0)
                .map((_, index) => <NewsCardLoading key={index} />)
            : filteredBlogs?.map(blog => (
                <NewsCard key={blog.id} blog={blog} />
              ))}
        </div>
        <Button className="max-lg:hidden">Sign Up</Button>
      </div>
    </section>
  );
};

export default More;
