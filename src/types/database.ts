/** Database row types matching the Supabase schema */

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
}

export type ListingCategory =
  | "electronics"
  | "furniture"
  | "clothing"
  | "vehicles"
  | "collectibles"
  | "sports"
  | "home-garden"
  | "other";

export type ListingStatus = "active" | "sold" | "draft" | "removed";

export interface Listing {
  id: string;
  seller_id: string;
  title: string;
  description: string | null;
  price: number;
  category: ListingCategory;
  image_urls: string[];
  status: ListingStatus;
  created_at: string;
}

export interface ListingWithSeller extends Listing {
  profiles: Profile;
}

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

export interface Order {
  id: string;
  buyer_id: string;
  listing_id: string;
  status: OrderStatus;
  total: number;
  created_at: string;
}

export interface OrderWithDetails extends Order {
  listings: Listing;
  profiles: Profile;
}

export interface Review {
  id: string;
  order_id: string;
  reviewer_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

export interface ReviewWithReviewer extends Review {
  profiles: Profile;
}

export const CATEGORY_LABELS: Record<ListingCategory, string> = {
  electronics: "Electronics",
  furniture: "Furniture",
  clothing: "Clothing",
  vehicles: "Vehicles",
  collectibles: "Collectibles",
  sports: "Sports",
  "home-garden": "Home & Garden",
  other: "Other",
};
