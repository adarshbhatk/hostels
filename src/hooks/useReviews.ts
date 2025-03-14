
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
      return data.map(review => ({
        ...review,
        user: review.profiles ? {
          full_name: review.profiles.full_name,
          alias_name: review.profiles.alias_name,
          use_alias_for_reviews: review.profiles.use_alias_for_reviews
        } : undefined
      })) as Review[];
    },
    enabled: !!hostelId,
  });
};
