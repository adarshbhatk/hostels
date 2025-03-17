
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Hostel } from '@/types';
import { useAuth } from '@/context/AuthContext';

export const useHostels = (collegeId: string, searchTerm: string = '', filterType: string = 'all') => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['hostels', collegeId, searchTerm, filterType, !!user],
    queryFn: async (): Promise<Hostel[]> => {
      let query = supabase
        .from('hostels')
        .select('*')
        .eq('college_id', collegeId);
      
      // Only show approved hostels for regular users
      if (!user) {
        query = query.eq('status', 'approved');
      }
      
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
