export const queryKeys = {
  blogs: {
    all: ['blogs'],
    isPublished: (
      page?: number,
      limit?: number,
      isPublished?: boolean,
      type?: string,
    ) => [
      ...queryKeys.blogs.all,
      'isPublished',
      { page, limit, isPublished, type },
    ],
    byId: (id: string) => [...queryKeys.blogs.all, 'byId', id],
  },
};
