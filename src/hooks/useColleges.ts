
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { College } from '@/types';

export const useColleges = (searchTerm: string = '') => {
  return useQuery({
    queryKey: ['colleges', searchTerm],
    queryFn: async (): Promise<College[]> => {
      let query = supabase.from('colleges').select('*');
      
      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%`);
      }
      
      const { data, error } = await query.order('name');
      
      if (error) {
        console.error('Error fetching colleges:', error);
        throw error;
      }
      
      // If we have no colleges, return an empty array
      if (!data || data.length === 0) {
        return [];
      }
      
      // For each college, get the hostel count
      const collegesWithCounts = await Promise.all(
        data.map(async (college) => {
          try {
            const { data: countData, error: countError } = await supabase
              .rpc('get_hostel_count', { college_id: college.id });
            
            if (countError) {
              console.error('Error fetching hostel count:', countError);
              return { ...college, hostelCount: 0 };
            }
            
            return { ...college, hostelCount: countData || 0 };
          } catch (err) {
            console.error('Exception in hostel count fetch:', err);
            return { ...college, hostelCount: 0 };
          }
        })
      );
      
      console.log('Fetched colleges with counts:', collegesWithCounts);
      return collegesWithCounts as College[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
