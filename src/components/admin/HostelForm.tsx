
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { College, Hostel } from '@/types';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const hostelSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  college_id: z.string().min(1, 'College is required'),
  type: z.string().min(1, 'Type is required'),
  distance: z.string().min(1, 'Distance is required'),
  location: z.string().min(1, 'Location is required'),
  capacity: z.coerce.number().min(1, 'Capacity is required'),
  rent: z.string().min(1, 'Rent is required'),
  description: z.string().min(10, 'Description is required'),
  mess_food: z.string().min(1, 'Mess food is required'),
  warden_name: z.string().min(1, 'Warden name is required'),
  warden_phone: z.string().min(1, 'Warden phone is required'),
  warden_email: z.string().email('Valid email is required'),
  amenities: z.array(z.string()).min(1, 'At least one amenity is required'),
  photos: z.array(z.string()).optional(),
});

type HostelFormValues = z.infer<typeof hostelSchema>;

interface HostelFormProps {
  initialData?: Hostel;
  colleges: College[];
  onSubmit: (data: HostelFormValues) => void;
  isLoading: boolean;
}

const HostelForm = ({ initialData, colleges, onSubmit, isLoading }: HostelFormProps) => {
  const [amenityInput, setAmenityInput] = useState('');
  const [photoInput, setPhotoInput] = useState('');

  const form = useForm<HostelFormValues>({
    resolver: zodResolver(hostelSchema),
    defaultValues: {
      name: initialData?.name || '',
      college_id: initialData?.college_id || '',
      type: initialData?.type || '',
      distance: initialData?.distance || '',
      location: initialData?.location || '',
      capacity: initialData?.capacity || 0,
      rent: initialData?.rent || '',
      description: initialData?.description || '',
      mess_food: initialData?.mess_food || '',
      warden_name: initialData?.warden_name || '',
      warden_phone: initialData?.warden_phone || '',
      warden_email: initialData?.warden_email || '',
      amenities: initialData?.amenities || [],
      photos: initialData?.photos || [],
    },
  });

  const amenities = form.watch('amenities');
  const photos = form.watch('photos');

  const addAmenity = () => {
    if (amenityInput.trim() && !amenities.includes(amenityInput.trim())) {
      form.setValue('amenities', [...amenities, amenityInput.trim()]);
      setAmenityInput('');
    }
  };

  const removeAmenity = (amenity: string) => {
    form.setValue('amenities', amenities.filter(a => a !== amenity));
  };

  const addPhoto = () => {
    if (photoInput.trim() && !photos?.includes(photoInput.trim())) {
      form.setValue('photos', [...(photos || []), photoInput.trim()]);
      setPhotoInput('');
    }
  };

  const removePhoto = (photo: string) => {
    form.setValue('photos', photos?.filter(p => p !== photo) || []);
  };

  const handleSubmit = (data: HostelFormValues) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            name="college_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>College</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a college" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {colleges.map(college => (
                      <SelectItem key={college.id} value={college.id}>
                        {college.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a type" />
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

          <FormField
            control={form.control}
            name="distance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Distance</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., On Campus - Main Area" {...field} />
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
                  <Input placeholder="Full address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Capacity</FormLabel>
                <FormControl>
                  <Input type="number" min="1" {...field} />
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
                  <Input placeholder="e.g., Rs. 10000 per semester" {...field} />
                </FormControl>
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
                  defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select food type" />
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

          <FormField
            control={form.control}
            name="warden_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Warden Name</FormLabel>
                <FormControl>
                  <Input placeholder="Warden full name" {...field} />
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
                  <Input placeholder="Contact number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="warden_email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Warden Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email address" {...field} />
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
                  placeholder="Enter hostel description"
                  className="min-h-[100px]"
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
          render={() => (
            <FormItem>
              <FormLabel>Amenities</FormLabel>
              <div className="flex flex-wrap gap-2 mb-2">
                {amenities.map((amenity, index) => (
                  <div 
                    key={index} 
                    className="bg-hostel-100 text-hostel-800 px-3 py-1 rounded-full flex items-center gap-1"
                  >
                    <span>{amenity}</span>
                    <button 
                      type="button" 
                      onClick={() => removeAmenity(amenity)}
                      className="text-hostel-600 hover:text-hostel-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={amenityInput}
                  onChange={(e) => setAmenityInput(e.target.value)}
                  placeholder="Add an amenity (e.g., Wi-Fi, Laundry)"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addAmenity();
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={addAmenity}>
                  Add
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="photos"
          render={() => (
            <FormItem>
              <FormLabel>Photos</FormLabel>
              <FormDescription>
                Enter URLs for hostel photos
              </FormDescription>
              <div className="flex flex-wrap gap-2 mb-2">
                {photos?.map((photo, index) => (
                  <div 
                    key={index} 
                    className="bg-hostel-100 text-hostel-800 px-3 py-1 rounded-full flex items-center gap-1"
                  >
                    <span className="truncate max-w-[200px]">{photo}</span>
                    <button 
                      type="button" 
                      onClick={() => removePhoto(photo)}
                      className="text-hostel-600 hover:text-hostel-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={photoInput}
                  onChange={(e) => setPhotoInput(e.target.value)}
                  placeholder="Add a photo URL"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addPhoto();
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={addPhoto}>
                  Add
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : initialData ? 'Update Hostel' : 'Add Hostel'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default HostelForm;
