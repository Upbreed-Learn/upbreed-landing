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
