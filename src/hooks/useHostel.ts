
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Hostel } from '@/types';

export const useHostel = (hostelId: string) => {
  return useQuery({
    queryKey: ['hostel', hostelId],
    queryFn: async (): Promise<Hostel | null> => {
      const { data, error } = await supabase
        .from('hostels')
        .select('*')
        .eq('id', hostelId)
        .single();
      
      if (error) {
        console.error('Error fetching hostel:', error);
        throw error;
      }
      
      // Cast the result to the correct Hostel type
      return data as Hostel;
    },
    enabled: !!hostelId,
  });
};
