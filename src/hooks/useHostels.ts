
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Hostel } from '@/types';

export const useHostels = (collegeId: string, searchTerm: string = '', filterType: string = 'all') => {
  return useQuery({
    queryKey: ['hostels', collegeId, searchTerm, filterType],
    queryFn: async (): Promise<Hostel[]> => {
      let query = supabase
        .from('hostels')
        .select('*')
        .eq('college_id', collegeId);
      
      if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`);
      }
      
      if (filterType !== 'all') {
        query = query.eq('type', filterType);
      }
      
      const { data, error } = await query.order('name');
      
      if (error) {
        console.error('Error fetching hostels:', error);
        throw error;
      }
      
      // Cast the result to the correct Hostel[] type
      return data as Hostel[];
    },
    enabled: !!collegeId,
  });
};
