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
