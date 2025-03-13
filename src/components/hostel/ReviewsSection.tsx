
import React, { useState } from 'react';
import { Search, Filter, ThumbsUp, Star, Clock, Utensils } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface Review {
  id: number;
  user: string;
  rating: number;
  date: string;
  content: string;
  foodRating: number;
  upvotes: number;
  photos: string[];
}

interface ReviewsSectionProps {
  reviews: Review[];
}

const ReviewsSection = ({ reviews }: ReviewsSectionProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  
  // Filtered reviews based on search term
  const filteredReviews = reviews.filter(review => 
    review.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.user.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Sort reviews based on selected sort option
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortBy === 'upvotes') {
      return b.upvotes - a.upvotes;
    }
    return 0;
  });
  
  // Generate star rating display
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star}
            className={`h-4 w-4 ${
              star <= rating 
                ? 'text-yellow-500 fill-yellow-500' 
                : star <= rating + 0.5 
                  ? 'text-yellow-500 fill-yellow-500/50' 
                  : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative w-full md:w-auto flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Latest</SelectItem>
              <SelectItem value="upvotes">Popular</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-6">
        {sortedReviews.length > 0 ? (
          sortedReviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="font-medium mb-1">{review.user}</div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {review.date}
                      </div>
                      <div className="flex items-center">
                        <Utensils className="h-3 w-3 mr-1" />
                        Food: {renderStars(review.foodRating)}
                      </div>
                    </div>
                  </div>
                  {renderStars(review.rating)}
                </div>
                
                <p className="mb-4">{review.content}</p>
                
                {review.photos.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {review.photos.map((photo, idx) => (
                      <img 
                        key={idx}
                        src={photo} 
                        alt={`Review photo ${idx + 1}`}
                        className="rounded-md object-cover h-24"
                      />
                    ))}
                  </div>
                )}
                
                <Separator className="my-4" />
                
                <div className="flex items-center text-sm text-muted-foreground">
                  <button className="flex items-center hover:text-foreground">
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    <span>Helpful ({review.upvotes})</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No reviews match your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsSection;
