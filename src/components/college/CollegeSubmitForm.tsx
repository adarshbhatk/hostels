
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
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const collegeSchema = z.object({
  name: z.string().min(2, 'College name must be at least 2 characters'),
  location: z.string().min(2, 'Location must be at least 2 characters'),
});

type CollegeFormValues = z.infer<typeof collegeSchema>;

const CollegeSubmitForm = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CollegeFormValues>({
    resolver: zodResolver(collegeSchema),
    defaultValues: {
      name: '',
      location: '',
    },
  });

  const onSubmit = async (data: CollegeFormValues) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to submit a college',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('colleges').insert({
        name: data.name,
        location: data.location,
        status: 'pending',
      });

      if (error) throw error;

      toast({
        title: 'College submitted',
        description: 'Your college has been submitted for review and will be published once approved.',
      });

      form.reset();
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ['colleges'] });
    } catch (error) {
      console.error('Error submitting college:', error);
      toast({
        title: 'Submission failed',
        description: error instanceof Error ? error.message : 'Failed to submit college',
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
          Can't find your college? Submit a new one
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Submit a New College</DialogTitle>
          <DialogDescription>
            Fill in the details below to submit a new college. It will be published after review.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>College Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter college name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="City, State" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit College'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CollegeSubmitForm;
