
export interface College {
  id: string;
  name: string;
  location: string;
  created_at: string;
  updated_at: string;
  status: 'pending' | 'approved';
  hostelCount?: number;
}

export interface Hostel {
  id: string;
  name: string;
  college_id: string;
  type: string;
  capacity: number;
  rent: string;
  description: string;
  amenities: string[];
  photos: string[];
  location: string;
  distance: string;
  rating: number | null;
  mess_food: string;
  warden_name: string;
  warden_phone: string;
  warden_email: string;
  status: 'pending' | 'approved';
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  hostel_id: string;
  user_id: string;
  rating: number;
  food_rating: number;
  content: string;
  photos: string[] | null;
  upvotes: number | null;
  created_at: string;
  updated_at: string;
  status: 'pending' | 'approved';
  user?: {
    full_name: string;
    alias_name: string | null;
    use_alias_for_reviews: boolean | null;
  };
  hostels?: {
    name: string;
  };
  hostelName?: string;
}

export interface UserProfile {
  id: string;
  full_name: string;
  alias_name: string | null;
  use_alias_for_reviews: boolean | null;
  role: string;
}
