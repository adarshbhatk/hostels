
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Review } from '@/types';

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
      
      // Map the data to include the user information from profiles
      const reviews = data.map(review => {
        // Safely handle profiles data which might be null or an error object
        const profileData = review.profiles && typeof review.profiles === 'object' 
          ? review.profiles 
          : null;
          
        // Create a properly typed user object from the profile data
        const user = profileData ? {
          full_name: typeof profileData === 'object' && 'full_name' in profileData ? 
            profileData.full_name as string : undefined,
          alias_name: typeof profileData === 'object' && 'alias_name' in profileData ? 
            profileData.alias_name as string : undefined,
          use_alias_for_reviews: typeof profileData === 'object' && 'use_alias_for_reviews' in profileData ? 
            profileData.use_alias_for_reviews as boolean : undefined
        } : undefined;
        
        return {
          ...review,
          user
        };
      });
      
      return reviews as Review[];
    },
    enabled: !!hostelId,
  });
};
