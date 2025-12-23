export interface StoreTokenRequest {
  token: string;
}

export type Category = {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  category: {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  };
};

export interface BlogsData {
  id: number;
  title: string;
  description: string;
  previewImage: string;
  content: string;
  isPublished: boolean;
  type: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  categories: Category[];
}

export interface BlogsResponse {
  data: BlogsData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BlogDetailsData {
  id: number;
  title: string;
  description: string;
  previewImage: string;
  content: string;
  isPublished: boolean;
  type: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  categories: Category[];
  nextId: number;
  previousId: number;
}

type InstructorProfile = {
  id: number;
  linkedInUrl: string;
  about: string;
  description: string;
  profilePictureUrl: string;
  expertise: string;
  title: string;
};

export interface Instructor {
  id: number;
  fname: string;
  lname: string;
  email: string;
  isActive: boolean;
  instructorProfile: InstructorProfile;
}

type Tag = {
  id: number;
  name: string;
};

export interface CourseData {
  id: number;
  thumbnail: string;
  title: string;
  description: string;
  instructor: Omit<Instructor, 'email' | 'isActive' | 'instructorProfile'>;
  categories: Category[];
  tags: Tag[];
  preview: {
    lessonCount: number;
    durationInMinutes: number;
  };
}
export interface CourseDetailsData extends Omit<CourseData, 'categories'> {
  videos: {
    id: number;
    title: string;
    position: number;
    durationInSeconds: number;
    isTrailer: boolean;
    isPublic: boolean;
  }[];
  categories: Omit<
    Category['category'][],
    'createdAt' | 'updatedAt' | 'deletedAt'
  >;
}

type Role = {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  role: {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  };
};

export interface UserProfileType {
  id: string;
  fname: string;
  lname: string;
  phone: string;
  email: string;
  isActive: boolean;
  googleId: string | null;
  avatarUrl: string | null;
  authProvider: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  userProfile: null;
  instructorProfile: InstructorProfile;
  role: Role[];
}
