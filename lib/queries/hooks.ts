import { useQuery } from '@tanstack/react-query';
import { queryKeys } from './query-keys';
import { QUERIES } from '.';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

export const useDeviceFingerprint = () => {
  return useQuery({
    queryKey: ['deviceFingerprint'],
    queryFn: async () => {
      const fp = await FingerprintJS.load();
      const { visitorId } = await fp.get();
      return visitorId;
    },
    staleTime: Infinity,
  });
};

export const useGetUserProfile = (token: string) => {
  return useQuery({
    queryKey: queryKeys.userProfile.all,
    queryFn: () => QUERIES.getUserProfile(),
    enabled: !!token,
  });
};

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

export const useGetCourses = (page: number, limit: number) => {
  return useQuery({
    queryKey: queryKeys.courses.paginated(page, limit),
    queryFn: () => QUERIES.getCourses(page, limit),
  });
};

export const useGetCoursesByCategory = (
  page: number,
  limit: number,
  category: string,
) => {
  return useQuery({
    queryKey: queryKeys.courses.category(page, limit, category),
    queryFn: () => QUERIES.getCoursesByCategory(page, limit, category),
    enabled: category !== 'all' && category !== 'undefined',
  });
};

export const useGetToken = () => {
  return useQuery({
    queryKey: queryKeys.token,
    queryFn: () => QUERIES.getToken(),
  });
};

export const useGetBookmarkedCourses = (page: number, limit: number) => {
  return useQuery({
    queryKey: queryKeys.courses.bookmarked(page, limit),
    queryFn: () => QUERIES.getBookmarkedCourses(),
  });
};

export const useGetSubscriptions = () => {
  return useQuery({
    queryKey: queryKeys.subscriptions.all,
    queryFn: () => QUERIES.getSubscriptions(),
  });
};

export const useGetCurrentSubscription = () => {
  return useQuery({
    queryKey: queryKeys.subscriptions.current(),
    queryFn: () => QUERIES.getCurrentSubscription(),
  });
};

export const useGetCoursesBySearch = (
  page: number,
  limit: number,
  search?: string,
  type?: string,
) => {
  return useQuery({
    queryKey: queryKeys.courses.search(page, limit, search!!, type),
    queryFn: () => QUERIES.getCoursesBySearch(page, limit, search!!, type),
  });
};
