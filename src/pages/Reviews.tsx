
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/Badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const Reviews = () => {
  const [reviews, setReviews] = useState<any[]>([]);

  const { data: reviewsData, error, isLoading } = useQuery({
    queryKey: ['reviews'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles (
            full_name,
            alias_name,
            use_alias_for_reviews
          )
        `);

      if (error) {
        console.error('Error fetching reviews:', error);
        throw error;
      }

      return data;
    }
  });

  useEffect(() => {
    if (reviewsData) {
      setReviews(reviewsData);
    }
  }, [reviewsData]);

  if (isLoading) {
    return <div>Loading reviews...</div>;
  }

  if (error) {
    return <div>Error: {(error as Error).message}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {/* Added max-w-7xl and mx-auto for horizontal spacing */}
      <div className="max-w-7xl mx-auto w-full px-6">
        <ScrollArea className="w-full space-y-4 flex-1 mt-16">
          {reviews.map((review) => {
            const profile = review.profiles || { 
              full_name: '', 
              alias_name: null, 
              use_alias_for_reviews: false 
            };
            
            const displayName = profile.use_alias_for_reviews && profile.alias_name 
              ? profile.alias_name 
              : profile.full_name;
  
            return (
              <Card key={review.id}>
                <CardHeader>
                  <div className="flex items-center">
                    <Avatar className="mr-4">
                      <AvatarImage src={`https://avatar.vercel.sh/${displayName}.png`} />
                      <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <CardTitle>{displayName}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p>{review.content}</p>
                  <div className="mt-2">
                    <Badge>Rating: {review.rating}</Badge>
                    <Badge className="ml-2">Food Rating: {review.food_rating}</Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </ScrollArea>
      </div>
      <Footer />
    </div>
  );
  

};

export default Reviews;
