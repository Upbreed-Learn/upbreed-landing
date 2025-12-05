import { https } from '../https';

export const QUERIES = {
  getBlogs: async (
    type?: string,
    isPublished?: boolean,
    page?: number,
    limit?: number,
    category?: string,
  ) => {
    const params = new URLSearchParams();

    if (type) params.append('type', type);
    if (isPublished) params.append('isPublished', isPublished.toString());
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    if (category && category !== 'all')
      params.append('categoryId', category.toString());

    const queryString = params.toString();
    const url = queryString ? `/blog?${queryString}` : '/blog';

    return await https.get(url);
  },
  getBlogById: async (id: string) => {
    const url = `/blog/${id}`;

    return await https.get(url);
  },
  getCategories: async () => {
    const url = '/category';

    return await https.get(url);
  },
  getInstructors: async () => {
    const url = '/instructor';

    return await https.get(url);
  },
  getCourses: async (page: number, limit: number) => {
    const params = new URLSearchParams();

    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());

    const queryString = params.toString();
    const url = queryString ? `/course?${queryString}` : '/course';

    return await https.get(url);
  },
};
