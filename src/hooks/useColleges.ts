
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
      
      // For each college, get the hostel count
      const collegesWithCounts = await Promise.all(
        data.map(async (college) => {
          const { data: countData, error: countError } = await supabase.rpc(
            'get_hostel_count',
            { college_id: college.id }
          );
          
          if (countError) {
            console.error('Error fetching hostel count:', countError);
            return { ...college, hostelCount: 0 };
          }
          
          return { ...college, hostelCount: countData || 0 };
        })
      );
      
      return collegesWithCounts;
    },
  });
};
