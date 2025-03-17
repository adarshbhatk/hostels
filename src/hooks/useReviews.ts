
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Review } from '@/types';

interface ProfileData {
  full_name?: string;
  alias_name?: string;
  use_alias_for_reviews?: boolean;
}

export const useReviews = (hostelId: string, includeNotApproved: boolean = false) => {
  return useQuery({
    queryKey: ['reviews', hostelId, includeNotApproved],
    queryFn: async (): Promise<Review[]> => {
      // If we're including not approved reviews, we're likely an admin
      // The RLS policies will handle access control
      const statusCondition = includeNotApproved ? {} : { status: 'approved' };
      
      const query = supabase
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
      
      // Add status filter if needed
      if (!includeNotApproved) {
        query.eq('status', 'approved');
      }
      
      const { data, error } = await query;
      
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
          : {};
          
        // Create a properly typed user object from the profile data
        const user = {
          full_name: profileData.full_name || '',
          alias_name: profileData.alias_name || null,
          use_alias_for_reviews: profileData.use_alias_for_reviews || false
        };
        
        // Ensure photos are properly handled
        const photos = Array.isArray(review.photos) ? review.photos : [];
        console.log(`Review ${review.id} has ${photos.length} photos:`, photos);
        
        return {
          ...review,
          photos,
          user,
          status: review.status as "approved" | "pending"
        } as Review;
      });
      
      return reviews;
    },
    enabled: !!hostelId,
  });
};

// Add a new hook to fetch pending reviews for admin
export const usePendingReviews = () => {
  return useQuery({
    queryKey: ['pendingReviews'],
    queryFn: async (): Promise<Review[]> => {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          hostels (name),
          profiles:user_id (
            full_name,
            alias_name,
            use_alias_for_reviews
          )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching pending reviews:', error);
        throw error;
      }
      
      // Map the data to include the user information from profiles
      const reviews = data.map(review => {
        // Safely handle profiles data
        const profileData = review.profiles && typeof review.profiles === 'object' 
          ? review.profiles as ProfileData
          : {};
          
        // Create a properly typed user object from the profile data
        const user = {
          full_name: profileData.full_name || '',
          alias_name: profileData.alias_name || null,
          use_alias_for_reviews: profileData.use_alias_for_reviews || false
        };
        
        // Ensure photos are properly handled
        const photos = Array.isArray(review.photos) ? review.photos : [];
        
        // Include hostel name if available
        const hostelName = review.hostels?.name || '';
        
        return {
          ...review,
          photos,
          user,
          hostelName,
          status: review.status as "approved" | "pending"
        } as Review;
      });
      
      return reviews;
    }
  });
};

// Add a mutation hook to update review status
export const useUpdateReviewStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ reviewId, status }: { reviewId: string, status: 'approved' | 'rejected' }) => {
      if (status === 'rejected') {
        // Delete the review if rejected
        const { error } = await supabase
          .from('reviews')
          .delete()
          .eq('id', reviewId);
          
        if (error) throw error;
        return { id: reviewId, status };
      } else {
        // Update the status if approved
        const { data, error } = await supabase
          .from('reviews')
          .update({ status })
          .eq('id', reviewId)
          .select();
          
        if (error) throw error;
        return data[0];
      }
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['pendingReviews'] });
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    }
  });
};
