
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePendingReviews, useUpdateReviewStatus } from '@/hooks/useReviews';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, Clock, Image, Star, Trash2, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ReviewsAdmin = () => {
  const { data: pendingReviews, isLoading, error } = usePendingReviews();
  const updateReviewStatus = useUpdateReviewStatus();
  const { toast } = useToast();
  const [selectedReview, setSelectedReview] = useState<string | null>(null);
  const [previewDialog, setPreviewDialog] = useState(false);
  
  // Get the selected review object
  const reviewToPreview = pendingReviews?.find(review => review.id === selectedReview);
  
  // Handle approval
  const handleApproveReview = (reviewId: string) => {
    updateReviewStatus.mutate(
      { reviewId, status: 'approved' },
      {
        onSuccess: () => {
          toast({
            title: 'Review Approved',
            description: 'The review has been approved and is now published.',
          });
        },
        onError: (error) => {
          toast({
            title: 'Error',
            description: `Failed to approve review: ${error.message}`,
            variant: 'destructive',
          });
        }
      }
    );
  };
  
  // Handle rejection/deletion
  const handleRejectReview = (reviewId: string) => {
    updateReviewStatus.mutate(
      { reviewId, status: 'rejected' },
      {
        onSuccess: () => {
          toast({
            title: 'Review Rejected',
            description: 'The review has been rejected and removed.',
          });
          // Close the preview dialog if it's open
          if (selectedReview === reviewId && previewDialog) {
            setPreviewDialog(false);
          }
        },
        onError: (error) => {
          toast({
            title: 'Error',
            description: `Failed to reject review: ${error.message}`,
            variant: 'destructive',
          });
        }
      }
    );
  };
  
  // Render stars
  const renderStars = (rating: number) => (
    <div className="flex">
      {[1, 2, 3, 4, 5].map(star => (
        <Star 
          key={star}
          className={`h-4 w-4 ${star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );
  
  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-40 mb-4" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <div className="flex">
          <div className="py-1">
            <AlertCircle className="h-6 w-6 text-red-500 mr-4" />
          </div>
          <div>
            <p className="font-bold">Error Loading Reviews</p>
            <p className="text-sm">{(error as Error).message}</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Review Management</h2>
      
      {pendingReviews && pendingReviews.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-6">
              <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-lg font-medium mb-2">All Caught Up!</h3>
              <p className="text-muted-foreground">
                There are no pending reviews that need approval.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Pending Reviews</h3>
              <p className="text-muted-foreground">
                {pendingReviews?.length || 0} reviews waiting for approval
              </p>
            </div>
          </div>
          
          <div className="grid gap-4">
            {pendingReviews?.map((review) => (
              <Card key={review.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{review.user?.full_name || 'Anonymous'}</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          For hostel: {review.hostelName || review.hostel_id}
                        </p>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium">Rating: </span>
                          {renderStars(review.rating)}
                          <span className="text-sm font-medium ml-4">Food: </span>
                          {renderStars(review.food_rating)}
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                          <Clock className="h-3.5 w-3.5" />
                          <span>
                            Submitted {review.created_at ? format(new Date(review.created_at), 'MMM d, yyyy') : ''}
                          </span>
                          
                          {review.photos && review.photos.length > 0 && (
                            <>
                              <span className="mx-1">•</span>
                              <Image className="h-3.5 w-3.5" />
                              <span>{review.photos.length} photos</span>
                            </>
                          )}
                        </div>
                        
                        <p className="line-clamp-2">{review.content}</p>
                      </div>
                      
                      <Badge variant="primary" className="bg-amber-500 hover:bg-amber-600">
                        Pending
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex justify-end items-center gap-2 bg-muted p-4 border-t">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedReview(review.id);
                        setPreviewDialog(true);
                      }}
                    >
                      Preview
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Reject Review</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to reject this review? This action cannot be undone and the review will be permanently deleted.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleRejectReview(review.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Reject
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    
                    <Button 
                      variant="default" 
                      size="sm"
                      className="bg-green-600 hover:bg-green-700" 
                      onClick={() => handleApproveReview(review.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Preview Dialog */}
          <Dialog open={previewDialog} onOpenChange={setPreviewDialog}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Review Preview</DialogTitle>
                <DialogDescription>
                  Full review details
                </DialogDescription>
              </DialogHeader>
              
              {reviewToPreview && (
                <div className="space-y-4 max-h-[70vh] overflow-y-auto p-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{reviewToPreview.user?.full_name || 'Anonymous'}</h3>
                      <p className="text-sm text-muted-foreground">
                        For hostel: {reviewToPreview.hostelName || reviewToPreview.hostel_id}
                      </p>
                    </div>
                    <Badge variant="primary" className="bg-amber-500 hover:bg-amber-600">
                      Pending
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-sm text-muted-foreground">Overall Rating</span>
                      <div className="flex items-center">
                        {renderStars(reviewToPreview.rating)}
                        <span className="ml-2 text-sm">{reviewToPreview.rating}/5</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <span className="text-sm text-muted-foreground">Food Rating</span>
                      <div className="flex items-center">
                        {renderStars(reviewToPreview.food_rating)}
                        <span className="ml-2 text-sm">{reviewToPreview.food_rating}/5</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">Submitted</span>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>
                        {reviewToPreview.created_at 
                          ? format(new Date(reviewToPreview.created_at), 'PPP')
                          : ''}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">Review Content</span>
                    <p className="p-4 bg-muted rounded-md whitespace-pre-wrap">
                      {reviewToPreview.content}
                    </p>
                  </div>
                  
                  {reviewToPreview.photos && reviewToPreview.photos.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-sm text-muted-foreground">Photos ({reviewToPreview.photos.length})</span>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {reviewToPreview.photos.map((photo, index) => (
                          <div key={index} className="relative group">
                            <img 
                              src={photo} 
                              alt={`Review photo ${index + 1}`}
                              className="h-40 w-full object-cover rounded-md border"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="bg-white"
                                onClick={() => window.open(photo, '_blank')}
                              >
                                <ExternalLink className="h-4 w-4 mr-1" />
                                View Full Size
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <DialogFooter className="gap-2 sm:gap-0">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="h-4 w-4 mr-1" />
                      Reject Review
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Reject Review</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to reject this review? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => {
                          if (selectedReview) {
                            handleRejectReview(selectedReview);
                            setPreviewDialog(false);
                          }
                        }}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Reject
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                
                <Button 
                  variant="default" 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    if (selectedReview) {
                      handleApproveReview(selectedReview);
                      setPreviewDialog(false);
                    }
                  }}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approve Review
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default ReviewsAdmin;
