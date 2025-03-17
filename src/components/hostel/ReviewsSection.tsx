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
import { Badge } from '@/components/ui/Badge';

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
  
  // Filter reviews based on active tab and only show approved reviews
  const approvedReviews = reviews.filter(review => review.status === 'approved');
  
  const filteredReviews = approvedReviews.filter(review => {
    switch (activeTab) {
      case 'positive':
        return review.rating >= 4;
      case 'negative':
        return review.rating <= 2;
      default:
        return true;
    }
  });

  // Calculate average ratings from approved reviews only
  const avgRating = approvedReviews.length > 0 
    ? (approvedReviews.reduce((sum, review) => sum + review.rating, 0) / approvedReviews.length).toFixed(1) 
    : 'N/A';
  
  const avgFoodRating = approvedReviews.length > 0 
    ? (approvedReviews.reduce((sum, review) => sum + review.food_rating, 0) / approvedReviews.length).toFixed(1) 
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
  
  // Handle photo upload - completely rewritten
  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
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
  
  // Upload photos to Supabase storage - completely rewritten
  const uploadPhotosToStorage = async (): Promise<string[]> => {
    if (!uploadedPhotos.length) return [];
    
    setIsUploading(true);
    const uploadedUrls: string[] = [];
    
    try {
      console.log(`Starting upload of ${uploadedPhotos.length} photos`);
      
      for (const [index, photo] of uploadedPhotos.entries()) {
        console.log(`Processing photo ${index + 1}/${uploadedPhotos.length}: ${photo.name} (${photo.size} bytes)`);
        
        // Check file size again before upload
        if (photo.size > MAX_FILE_SIZE) {
          console.warn(`Skipping file ${photo.name} as it exceeds 5MB limit`);
          continue;
        }
        
        // Create a unique filename to avoid collisions
        const fileExt = photo.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `${user!.id}/${fileName}`;
        
        console.log(`Uploading to path: ${filePath}`);
        
        const { data, error } = await supabase.storage
          .from('review-photos')
          .upload(filePath, photo, {
            cacheControl: '3600',
            upsert: false
          });
        
        if (error) {
          console.error('Upload error:', error);
          throw new Error(`Failed to upload ${photo.name}: ${error.message}`);
        }
        
        console.log('Upload successful, data:', data);
        
        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from('review-photos')
          .getPublicUrl(filePath);
        
        console.log('Generated public URL:', publicUrlData.publicUrl);
        uploadedUrls.push(publicUrlData.publicUrl);
      }
      
      console.log(`Successfully uploaded ${uploadedUrls.length} photos`);
      return uploadedUrls;
    } catch (error) {
      console.error('Error in uploadPhotosToStorage:', error);
      
      // Show user-friendly error
      toast({
        title: 'Upload Failed',
        description: error instanceof Error ? error.message : 'Failed to upload photos. Please try again.',
        variant: 'destructive',
      });
      
      return [];
    } finally {
      setIsUploading(false);
    }
  };
  
  // Add review mutation - updated to handle the new photo upload logic
  const addReviewMutation = useMutation({
    mutationFn: async (reviewData: typeof newReview) => {
      if (!user) throw new Error('You must be logged in to add a review');
      
      console.log('Starting review submission process');
      
      // Upload photos first
      const photoUrls = await uploadPhotosToStorage();
      console.log(`Received ${photoUrls.length} photo URLs after upload`);
      
      // Create review in database
      const { data, error } = await supabase
        .from('reviews')
        .insert([
          {
            hostel_id: hostelId,
            user_id: user.id,
            rating: reviewData.rating,
            food_rating: reviewData.foodRating,
            content: reviewData.content,
            photos: photoUrls,
            upvotes: 0,
            status: 'pending' // All new reviews are pending by default
          }
        ])
        .select();
      
      if (error) {
        console.error('Error inserting review:', error);
        throw error;
      }
      
      console.log('Review created successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', hostelId] });
      toast({
        title: 'Review Submitted',
        description: 'Your review has been submitted and is pending approval by an administrator.',
      });
      setShowAddReviewDialog(false);
      setNewReview({ rating: 0, foodRating: 0, content: '' });
      setUploadedPhotos([]);
      setPhotoUrls([]);
    },
    onError: (error) => {
      console.error('Review submission error:', error);
      toast({
        title: 'Error',
        description: `Failed to add review: ${error instanceof Error ? error.message : 'Unknown error'}`,
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
        description: `Failed to upvote review: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    }
  });
  
  // Handle review submission
  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newReview.rating === 0 || newReview.foodRating === 0 || !newReview.content) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields (rating, food rating, and review content).',
        variant: 'destructive',
      });
      return;
    }
    
    console.log('Submitting review:', newReview, `with ${uploadedPhotos.length} photos`);
    addReviewMutation.mutate(newReview);
  };
  
  // Clean up object URLs when component unmounts
  React.useEffect(() => {
    return () => {
      photoUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [photoUrls]);
  
  // Show loading state
  if (isLoading) {
    return <div className="space-y-4">
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>;
  }
  
  // Get user's pending reviews for this hostel
  const userPendingReviews = user 
    ? reviews.filter(review => review.user_id === user.id && review.status === 'pending')
    : [];
  
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
                    Reviews will be published after approval by an administrator.
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
                      <span className="ml-2 text-xs text-muted-foreground">
                        Maximum 5MB per image
                      </span>
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
          {/* Show pending reviews message */}
          {userPendingReviews.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-4">
              <p className="text-amber-800">
                You have {userPendingReviews.length} pending {userPendingReviews.length === 1 ? 'review' : 'reviews'} for this hostel that {userPendingReviews.length === 1 ? 'is' : 'are'} awaiting admin approval.
              </p>
            </div>
          )}
        
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
              <h3 className="text-sm font-medium mb-2">Overall Rating</h3>
              <div className="flex items-center mb-1">
                <span className="text-3xl font-bold mr-2">{avgRating}</span>
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              </div>
              <p className="text-sm text-muted-foreground">Based on {approvedReviews.length} reviews</p>
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
                <span className="text-3xl font-bold mr-2">{approvedReviews.length}</span>
                <MessageSquare className="h-5 w-5 text-hostel-600" />
              </div>
              <p className="text-sm text-muted-foreground">Total published reviews</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Reviews ({approvedReviews.length})</TabsTrigger>
          <TabsTrigger value="positive">Positive ({approvedReviews.filter(r => r.rating >= 4).length})</TabsTrigger>
          <TabsTrigger value="negative">Negative ({approvedReviews.filter(r => r.rating <= 2).length})</TabsTrigger>
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

// Keep the ReviewCard component the same
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
                className="w-20 h-20 object-cover rounded border border-gray-200 hover:w-auto hover:h-auto hover:max-w-xs hover:max-h-64 hover:z-10 hover:absolute hover:shadow-xl transition-all duration-200 cursor-pointer"
                onClick={() => window.open(photo, '_blank')}
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
