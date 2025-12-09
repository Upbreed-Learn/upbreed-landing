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
  instructors: {
    all: ['instructors'],
    byId: (id: string) => [...queryKeys.instructors.all, 'byId', id],
  },
  courses: {
    all: ['courses'],
    paginated: (page: number, limit: number) => [
      ...queryKeys.courses.all,
      'paginated',
      page,
      limit,
    ],
    category: (page: number, limit: number, category: string) => [
      ...queryKeys.courses.paginated(page, limit),
      'category',
      category,
    ],
    byId: (id: string) => [...queryKeys.courses.all, 'byId', id],
  },
};
