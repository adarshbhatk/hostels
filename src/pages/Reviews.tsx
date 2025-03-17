
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Calendar, Image } from 'lucide-react';
import { format } from 'date-fns';
import type { Review } from '@/types';

const Reviews = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select(`
            *,
            profiles:user_id (
              full_name,
              alias_name,
              use_alias_for_reviews
            ),
            hostels (name)
          `)
          .eq('status', 'approved')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching reviews:', error.message);
        } else {
          console.log('Fetched reviews:', data);
          
          // Process the data to match the Review type
          const processedReviews = data.map(review => {
            const profileData = review.profiles || {};
            const hostelName = review.hostels?.name || '';
            
            // Ensure photos are properly handled
            const photos = Array.isArray(review.photos) ? review.photos : [];
            
            return {
              ...review,
              photos,
              hostelName,
              status: review.status as "approved" | "pending",
              user: {
                full_name: profileData.full_name || '',
                alias_name: profileData.alias_name || null,
                use_alias_for_reviews: profileData.use_alias_for_reviews || false
              }
            } as Review;
          });
          
          setReviews(processedReviews);
        }
      } catch (err) {
        console.error('Unexpected error fetching reviews:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Function to render stars
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

  // Get display name
  const getDisplayName = (review: Review) => {
    if (review.user) {
      return review.user.use_alias_for_reviews && review.user.alias_name 
        ? review.user.alias_name 
        : review.user.full_name || 'Anonymous';
    }
    return 'Anonymous';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto p-4 mt-16 flex-1">
        <h1 className="text-2xl font-bold mb-6">Recent Reviews</h1>
        
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-6"></div>
                  <div className="h-24 bg-gray-200 rounded mb-4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">No reviews available yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-medium">{getDisplayName(review)}</h3>
                      <p className="text-sm text-muted-foreground mb-1">
                        For hostel: {review.hostelName || 'Unknown Hostel'}
                      </p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        <span>{review.created_at ? format(new Date(review.created_at), 'MMM d, yyyy') : ''}</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="flex mr-4">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Overall:</span>
                      <div className="flex mt-1">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    
                    <div className="text-sm">
                      <span className="text-muted-foreground">Food:</span>
                      <div className="flex mt-1">
                        {renderStars(review.food_rating)}
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
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Reviews;
