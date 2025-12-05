import { useQuery } from '@tanstack/react-query';
import { queryKeys } from './query-keys';
import { QUERIES } from '.';

export const useGetAllPublishedBlogs = (
  page: number,
  limit: number,
  isPublished: boolean,
  type: string,
  category?: string,
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
  });
};

export const useGetBlogById = (id: string) => {
  return useQuery({
    queryKey: queryKeys.blogs.byId(id),
    queryFn: () => QUERIES.getBlogById(id),
    enabled: !!id,
  });
};

export const useGetCategories = () => {
  return useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: () => QUERIES.getCategories(),
  });
};
