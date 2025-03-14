
export interface College {
  id: string;
  name: string;
  location: string;
  created_at?: string;
  updated_at?: string;
}

export interface Hostel {
  id: string;
  college_id: string;
  name: string;
  type: 'Boys' | 'Girls' | 'Co-ed';
  distance: string;
  capacity: number;
  rating: number;
  amenities: string[];
  description: string;
  rent: string;
  location: string;
  mess_food: 'Veg' | 'Non-veg' | 'Both';
  warden_name: string;
  warden_phone: string;
  warden_email: string;
  photos: string[];
  created_at?: string;
  updated_at?: string;
}

export interface Review {
  id: string;
  hostel_id: string;
  user_id: string;
  rating: number;
  food_rating: number;
  content: string;
  photos: string[];
  upvotes: number;
  created_at: string;
  updated_at?: string;
  // Additional fields from join query
  user?: {
    full_name?: string;
    alias_name?: string;
    use_alias_for_reviews?: boolean;
  };
}
