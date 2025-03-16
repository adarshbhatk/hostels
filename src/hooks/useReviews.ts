
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Review } from '@/types';

interface ProfileData {
  full_name?: string;
  alias_name?: string;
  use_alias_for_reviews?: boolean;
}

export const useReviews = (hostelId: string) => {
  return useQuery({
    queryKey: ['reviews', hostelId],
    queryFn: async (): Promise<Review[]> => {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles:user_id (
            full_name,
            alias_name,
            use_alias_for_reviews
          )
        `)
        .eq('hostel_id', hostelId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching reviews:', error);
        throw error;
      }
      
      console.log('Raw reviews data:', data);
      
      // Map the data to include the user information from profiles
      const reviews = data.map(review => {
        // Safely handle profiles data which might be null or an error object
        const profileData = review.profiles && typeof review.profiles === 'object' 
          ? review.profiles as ProfileData
          : null;
          
        // Create a properly typed user object from the profile data
        const user = profileData ? {
          full_name: profileData.full_name,
          alias_name: profileData.alias_name,
          use_alias_for_reviews: profileData.use_alias_for_reviews
        } : undefined;
        
        // Ensure photos are properly handled
        const photos = Array.isArray(review.photos) ? review.photos : [];
        console.log(`Review ${review.id} has ${photos.length} photos:`, photos);
        
        return {
          ...review,
          photos,
          user
        };
      });
      
      return reviews as Review[];
    },
    enabled: !!hostelId,
  });
};
