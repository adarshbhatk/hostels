
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const hostelSchema = z.object({
  name: z.string().min(2, 'Hostel name must be at least 2 characters'),
  type: z.string().min(1, 'Hostel type is required'),
  location: z.string().min(2, 'Location must be at least 2 characters'),
  distance: z.string().min(1, 'Distance is required'),
  capacity: z.coerce.number().min(1, 'Capacity must be at least 1'),
  rent: z.string().min(1, 'Rent information is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  amenities: z.string().transform(val => 
    val.split(',').map(item => item.trim()).filter(Boolean)
  ),
  mess_food: z.enum(['Veg', 'Non-veg', 'Both'], {
    required_error: 'Mess food option is required',
  }),
  warden_name: z.string().min(2, 'Warden name is required'),
  warden_phone: z.string().min(10, 'Valid phone number is required'),
  warden_email: z.string().email('Valid email is required'),
});

type HostelFormValues = z.infer<typeof hostelSchema>;

interface HostelSubmitFormProps {
  collegeId: string;
}

const HostelSubmitForm = ({ collegeId }: HostelSubmitFormProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<HostelFormValues>({
    resolver: zodResolver(hostelSchema),
    defaultValues: {
      name: '',
      type: '',
      location: '',
      distance: '',
      capacity: 0,
      rent: '',
      description: '',
      amenities: '',
      mess_food: 'Veg' as const,
      warden_name: '',
      warden_phone: '',
      warden_email: '',
    },
  });

  const onSubmit = async (data: HostelFormValues) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to submit a hostel',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('hostels').insert({
        college_id: collegeId,
        name: data.name,
        type: data.type,
        location: data.location,
        distance: data.distance,
        capacity: data.capacity,
        rent: data.rent,
        description: data.description,
        amenities: data.amenities,
        photos: [],
        mess_food: data.mess_food,
        warden_name: data.warden_name,
        warden_phone: data.warden_phone,
        warden_email: data.warden_email,
        status: 'pending',
      });

      if (error) throw error;

      toast({
        title: 'Hostel submitted for approval',
        description: 'Thank you! Your hostel has been submitted and will be visible after admin approval.',
      });

      form.reset();
      setIsOpen(false);
      // Still invalidate the query to ensure lists are refreshed for admins
      queryClient.invalidateQueries({ queryKey: ['hostels', collegeId] });
    } catch (error) {
      console.error('Error submitting hostel:', error);
      toast({
        title: 'Submission failed',
        description: error instanceof Error ? error.message : 'Failed to submit hostel',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full mt-8">
          Can't find your hostel? Submit a new one
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submit a New Hostel</DialogTitle>
          <DialogDescription>
            Fill in the details below to submit a new hostel. It will be published after admin review.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hostel Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter hostel name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hostel Type</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Boys">Boys</SelectItem>
                      <SelectItem value="Girls">Girls</SelectItem>
                      <SelectItem value="Co-ed">Co-ed</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Area, Landmark" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="distance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Distance from College</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 500m, 2km" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacity</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Number of beds" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="rent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rent</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., ₹5000-8000 per month" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the hostel facilities, rules, etc." 
                      rows={4}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="amenities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amenities</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="WiFi, AC, Laundry, etc. (comma separated)" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Enter amenities separated by commas
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="mess_food"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mess Food</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select mess food option" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Veg">Veg</SelectItem>
                      <SelectItem value="Non-veg">Non-veg</SelectItem>
                      <SelectItem value="Both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="border-t pt-4 mt-4">
              <h3 className="font-medium mb-2">Warden Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="warden_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Warden Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="warden_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Warden Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="Phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="warden_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Warden Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email address" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Hostel'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default HostelSubmitForm;
