export const queryKeys = {
  blogs: {
    all: ['blogs'],
    isPublished: (
      page?: number,
      limit?: number,
      isPublished?: boolean,
      type?: string,
      category?: string,
    ) => [
      ...queryKeys.blogs.all,
      'isPublished',
      { page, limit, isPublished, type, category },
    ],
    byId: (id: string) => [...queryKeys.blogs.all, 'byId', id],
  },
  categories: {
    all: ['categories'],
  },
};
