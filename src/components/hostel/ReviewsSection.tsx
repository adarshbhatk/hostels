import React, { useState, useRef } from 'react';
import { ThumbsUp, Star, MessageSquare, Calendar, Image, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import type { Review } from '@/types';
import { useAuth } from '@/context/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { MAX_FILE_SIZE } from '@/integrations/supabase/client';

interface ReviewsSectionProps {
  reviews: Review[];
  isLoading?: boolean;
  hostelId: string;
}

const ReviewsSection = ({ reviews, isLoading, hostelId }: ReviewsSectionProps) => {
  const { user, displayName } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [showAddReviewDialog, setShowAddReviewDialog] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 0,
    foodRating: 0,
    content: '',
  });
  const [uploadedPhotos, setUploadedPhotos] = useState<File[]>([]);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Handle redirection to login when non-authenticated user tries to add a review
  const handleAddReviewClick = () => {
    if (!user) {
      navigate('/auth?redirect=' + encodeURIComponent(window.location.pathname));
    } else {
      setShowAddReviewDialog(true);
    }
  };
  
  // Filter reviews based on active tab
  const filteredReviews = reviews.filter(review => {
    switch (activeTab) {
      case 'positive':
        return review.rating >= 4;
      case 'negative':
        return review.rating <= 2;
      default:
        return true;
    }
  });

  // Calculate average ratings
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1) 
    : 'N/A';
  
  const avgFoodRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.food_rating, 0) / reviews.length).toFixed(1) 
    : 'N/A';
    
  // Function to render stars
  const renderStars = (rating: number) => (
    <div className="flex">
      {[1, 2, 3, 4, 5].map(star => (
        <Star 
          key={star}
          className={`h-4 w-4 ${star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
          onClick={() => setNewReview({...newReview, rating: star})}
        />
      ))}
    </div>
  );
  
  // Function to render food rating stars
  const renderFoodStars = (rating: number) => (
    <div className="flex">
      {[1, 2, 3, 4, 5].map(star => (
        <Star 
          key={star}
          className={`h-4 w-4 ${star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
          onClick={() => setNewReview({...newReview, foodRating: star})}
        />
      ))}
    </div>
  );
  
  // Handle photo upload
  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    
    const newFiles = Array.from(event.target.files);
    
    // Check for file size limit
    const oversizedFiles = newFiles.filter(file => file.size > MAX_FILE_SIZE);
    if (oversizedFiles.length > 0) {
      toast({
        title: "File size exceeded",
        description: `${oversizedFiles.length > 1 ? 'Some files exceed' : 'File exceeds'} the maximum size of 5MB.`,
        variant: "destructive",
      });
      
      // Filter out oversized files
      const validFiles = newFiles.filter(file => file.size <= MAX_FILE_SIZE);
      if (validFiles.length === 0) {
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }
      
      setUploadedPhotos(prev => [...prev, ...validFiles]);
      
      // Create temporary URL for preview
      const fileUrls = validFiles.map(file => URL.createObjectURL(file));
      setPhotoUrls(prev => [...prev, ...fileUrls]);
    } else {
      setUploadedPhotos(prev => [...prev, ...newFiles]);
      
      // Create temporary URL for preview
      const fileUrls = newFiles.map(file => URL.createObjectURL(file));
      setPhotoUrls(prev => [...prev, ...fileUrls]);
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Remove photo
  const handleRemovePhoto = (index: number) => {
    setUploadedPhotos(prev => prev.filter((_, i) => i !== index));
    
    // Revoke object URL to avoid memory leaks
    URL.revokeObjectURL(photoUrls[index]);
    setPhotoUrls(prev => prev.filter((_, i) => i !== index));
  };
  
  // Upload photos to Supabase storage
  const uploadPhotosToStorage = async (): Promise<string[]> => {
    if (uploadedPhotos.length === 0) return [];
    
    setIsUploading(true);
    const uploadedUrls: string[] = [];
    
    try {
      // First, check if the bucket exists
      const { data: buckets, error: bucketsError } = await supabase
        .storage
        .listBuckets();
      
      const bucketExists = buckets?.some(bucket => bucket.name === 'review-photos');
      
      if (bucketsError || !bucketExists) {
        console.error('Storage bucket error:', bucketsError || 'Bucket "review-photos" does not exist');
        toast({
          title: "Storage Error",
          description: "Could not access the storage system. Please try again later or contact support.",
          variant: "destructive",
        });
        return [];
      }
      
      for (const photo of uploadedPhotos) {
        // Check file size again before upload
        if (photo.size > MAX_FILE_SIZE) {
          console.warn(`Skipping file ${photo.name} as it exceeds 5MB limit`);
          continue;
        }
        
        const fileName = `${user!.id}_${Date.now()}_${photo.name}`;
        
        const { data, error } = await supabase.storage
          .from('review-photos')
          .upload(fileName, photo);
        
        if (error) {
          console.error('Error uploading photo:', error);
          throw error;
        }
        
        // Get public URL
        const { data: urlData } = supabase.storage
          .from('review-photos')
          .getPublicUrl(data.path);
        
        uploadedUrls.push(urlData.publicUrl);
      }
      
      return uploadedUrls;
    } catch (error: any) {
      console.error('Error uploading photos:', error);
      let errorMessage = 'Failed to upload photos. Please try again.';
      
      // Handle specific error cases
      if (error.message?.includes('Bucket not found')) {
        errorMessage = 'Storage system is not properly configured. Please contact support.';
      } else if (error.message?.includes('size limit')) {
        errorMessage = 'One or more files exceed the 5MB size limit.';
      }
      
      toast({
        title: 'Upload Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return [];
    } finally {
      setIsUploading(false);
    }
  };
  
  // Add review mutation
  const addReviewMutation = useMutation({
    mutationFn: async (newReviewData: any) => {
      if (!user) throw new Error('You must be logged in to add a review');
      
      // Upload photos first
      const photoUrls = await uploadPhotosToStorage();
      
      const { data, error } = await supabase
        .from('reviews')
        .insert([
          {
            hostel_id: hostelId,
            user_id: user.id,
            rating: newReviewData.rating,
            food_rating: newReviewData.foodRating,
            content: newReviewData.content,
            photos: photoUrls,
            upvotes: 0
          }
        ])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', hostelId] });
      toast({
        title: 'Review Added',
        description: 'Your review has been added successfully.',
      });
      setShowAddReviewDialog(false);
      setNewReview({ rating: 0, foodRating: 0, content: '' });
      setUploadedPhotos([]);
      setPhotoUrls([]);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to add review: ${error.message}`,
        variant: 'destructive',
      });
    }
  });
  
  // Upvote mutation
  const upvoteMutation = useMutation({
    mutationFn: async (reviewId: string) => {
      if (!user) throw new Error('You must be logged in to upvote a review');
      
      const review = reviews.find(r => r.id === reviewId);
      if (!review) throw new Error('Review not found');
      
      const { data, error } = await supabase
        .from('reviews')
        .update({ upvotes: review.upvotes + 1 })
        .eq('id', reviewId)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', hostelId] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to upvote review: ${error.message}`,
        variant: 'destructive',
      });
    }
  });
  
  // Handle review submission
  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    addReviewMutation.mutate(newReview);
  };
  
  // Clean up object URLs when component unmounts
  React.useEffect(() => {
    return () => {
      photoUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);
  
  if (isLoading) {
    return <div className="space-y-4">
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>;
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">Hostel Ratings</CardTitle>
            <Dialog open={showAddReviewDialog} onOpenChange={setShowAddReviewDialog}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-hostel-600 hover:bg-hostel-700 text-white"
                  onClick={handleAddReviewClick}
                >
                  Add Review
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add Your Review</DialogTitle>
                  <DialogDescription>
                    Share your experience at this hostel to help other students.
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleAddReview} className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Overall Rating</label>
                    <div className="flex items-center space-x-1">
                      {renderStars(newReview.rating)}
                      <span className="ml-2 text-sm text-muted-foreground">
                        {newReview.rating > 0 ? `${newReview.rating}/5` : 'Select rating'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Food Rating</label>
                    <div className="flex items-center space-x-1">
                      {renderFoodStars(newReview.foodRating)}
                      <span className="ml-2 text-sm text-muted-foreground">
                        {newReview.foodRating > 0 ? `${newReview.foodRating}/5` : 'Select rating'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Your Review</label>
                    <textarea 
                      className="w-full min-h-[100px] p-2 border rounded-md"
                      placeholder="Share your experience..."
                      value={newReview.content}
                      onChange={(e) => setNewReview({...newReview, content: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Add Photos (Optional)</label>
                    <div className="flex items-center">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handlePhotoUpload}
                        accept="image/*"
                        multiple
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                      >
                        <Image className="h-4 w-4 mr-2" />
                        Choose Photos
                      </Button>
                    </div>
                    
                    {photoUrls.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {photoUrls.map((url, index) => (
                          <div key={index} className="relative">
                            <img
                              src={url}
                              alt={`Preview ${index}`}
                              className="w-20 h-20 object-cover rounded border"
                            />
                            <button
                              type="button"
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                              onClick={() => handleRemovePhoto(index)}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <DialogFooter>
                    <Button 
                      type="submit" 
                      className="bg-hostel-600 hover:bg-hostel-700 text-white"
                      disabled={newReview.rating === 0 || newReview.foodRating === 0 || !newReview.content || addReviewMutation.isPending || isUploading}
                    >
                      {addReviewMutation.isPending || isUploading ? 'Submitting...' : 'Submit Review'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
              <h3 className="text-sm font-medium mb-2">Overall Rating</h3>
              <div className="flex items-center mb-1">
                <span className="text-3xl font-bold mr-2">{avgRating}</span>
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              </div>
              <p className="text-sm text-muted-foreground">Based on {reviews.length} reviews</p>
            </div>
            
            <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
              <h3 className="text-sm font-medium mb-2">Food Rating</h3>
              <div className="flex items-center mb-1">
                <span className="text-3xl font-bold mr-2">{avgFoodRating}</span>
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              </div>
              <p className="text-sm text-muted-foreground">Mess food quality</p>
            </div>
            
            <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
              <h3 className="text-sm font-medium mb-2">Review Count</h3>
              <div className="flex items-center mb-1">
                <span className="text-3xl font-bold mr-2">{reviews.length}</span>
                <MessageSquare className="h-5 w-5 text-hostel-600" />
              </div>
              <p className="text-sm text-muted-foreground">Total reviews submitted</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Reviews ({reviews.length})</TabsTrigger>
          <TabsTrigger value="positive">Positive ({reviews.filter(r => r.rating >= 4).length})</TabsTrigger>
          <TabsTrigger value="negative">Negative ({reviews.filter(r => r.rating <= 2).length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          {filteredReviews.length > 0 ? (
            filteredReviews.map((review) => (
              <ReviewCard 
                key={review.id} 
                review={review}
                onUpvote={() => upvoteMutation.mutate(review.id)}
                isUpvoting={upvoteMutation.isPending}
              />
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No reviews available in this category.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="positive" className="space-y-4">
          {filteredReviews.length > 0 ? (
            filteredReviews.map((review) => (
              <ReviewCard 
                key={review.id} 
                review={review}
                onUpvote={() => upvoteMutation.mutate(review.id)}
                isUpvoting={upvoteMutation.isPending}
              />
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No positive reviews available.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="negative" className="space-y-4">
          {filteredReviews.length > 0 ? (
            filteredReviews.map((review) => (
              <ReviewCard 
                key={review.id} 
                review={review}
                onUpvote={() => upvoteMutation.mutate(review.id)}
                isUpvoting={upvoteMutation.isPending}
              />
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No negative reviews available.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface ReviewCardProps {
  review: Review;
  onUpvote: () => void;
  isUpvoting: boolean;
}

const ReviewCard = ({ review, onUpvote, isUpvoting }: ReviewCardProps) => {
  const { user } = useAuth();
  
  // Format date
  const formattedDate = review.created_at 
    ? format(new Date(review.created_at), 'MMM d, yyyy')
    : '';
  
  // Get display name
  const displayName = review.user?.alias_name && review.user.use_alias_for_reviews 
    ? review.user.alias_name
    : review.user?.full_name || 'Anonymous';
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-medium">{displayName}</h3>
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              <span>{formattedDate}</span>
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex mr-4">
              {[1, 2, 3, 4, 5].map(star => (
                <Star 
                  key={star}
                  className={`h-4 w-4 ${star <= review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                />
              ))}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="text-sm">
            <span className="text-muted-foreground">Overall:</span>
            <div className="flex mt-1">
              {[1, 2, 3, 4, 5].map(star => (
                <Star 
                  key={star}
                  className={`h-3.5 w-3.5 ${star <= review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                />
              ))}
            </div>
          </div>
          
          <div className="text-sm">
            <span className="text-muted-foreground">Food:</span>
            <div className="flex mt-1">
              {[1, 2, 3, 4, 5].map(star => (
                <Star 
                  key={star}
                  className={`h-3.5 w-3.5 ${star <= review.food_rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                />
              ))}
            </div>
          </div>
        </div>
        
        <p className="mb-6">{review.content}</p>
        
        {review.photos && review.photos.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {review.photos.map((photo, index) => (
              <img 
                key={index}
                src={photo}
                alt={`Review photo ${index + 1}`}
                className="w-20 h-20 object-cover rounded"
              />
            ))}
          </div>
        )}
        
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
            onClick={onUpvote}
            disabled={isUpvoting || !user}
          >
            <ThumbsUp className="h-4 w-4 mr-2" />
            {review.upvotes} Helpful
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewsSection;
