export interface Restaurant {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  password?: string;
  credentialsChangedAt?: string | null;
  isActive: boolean;
  deletedBy?: string | null;
  profileImage_public_id?: string | null;
}

export interface Cafe {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  password?: string;
  credentialsChangedAt?: string | null;
  isActive: boolean;
  deletedBy?: string | null;
  profileImage_public_id?: string | null;
}

export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface RestaurantsResponse {
  status: number;
  message: string;
  data: {
    restaurants: Restaurant[];
  };
}

export interface CafesResponse {
  status: number;
  message: string;
  data: {
    cafes: Cafe[];
  };
}

export interface CategoriesResponse {
  status: number;
  message: string;
  data: {
    categories: Category[];
  };
}
