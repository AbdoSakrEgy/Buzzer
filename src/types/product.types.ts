export interface ProductImage {
  public_id: string;
  secure_url: string;
}

export interface Product {
  id: number;
  category_id: number;
  cafe_id: number | null;
  restaurant_id: number | null;
  name: string; // "name" from JSON, mapping to something displayable
  description: string;
  price: string;
  isAvailable: boolean;
  availableQuantity: number;
  images: ProductImage[];
}

export interface ProductsResponse {
  status: number;
  message: string;
  data: {
    products: Product[];
  };
}
