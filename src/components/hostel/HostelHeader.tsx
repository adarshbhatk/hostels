import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Star, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
interface HostelHeaderProps {
  hostel: {
    id: number;
    name: string;
    type: string;
    location: string;
    rating: number;
    reviews: any[];
    photos: string[];
  };
  college: {
    id: number;
    name: string;
  };
}
const HostelHeader = ({
  hostel,
  college
}: HostelHeaderProps) => {
  const navigate = useNavigate();

  // Generate star rating display
  const renderStars = (rating: number) => {
    return <div className="flex items-center">
        {[1, 2, 3, 4, 5].map(star => <Star key={star} className={`h-4 w-4 ${star <= rating ? 'text-yellow-500 fill-yellow-500' : star <= rating + 0.5 ? 'text-yellow-500 fill-yellow-500/50' : 'text-gray-300'}`} />)}
        <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
      </div>;
  };
  return <>
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 mb-6 text-sm">
        <Button variant="ghost" size="sm" onClick={() => navigate('/colleges')} className="pl-2 text-hostel-600 hover:bg-hostel-50">
          Colleges
        </Button>
        <span className="text-muted-foreground">›</span>
        <Button variant="ghost" size="sm" onClick={() => navigate(`/colleges/${college.id}`)} className="text-hostel-600 hover:bg-hostel-50">
          {college.name}
        </Button>
        <span className="text-muted-foreground">›</span>
        <span className="text-muted-foreground">{hostel.name}</span>
      </div>
      
      {/* Hostel Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          <div>
            <Badge variant="default" className="mb-2">
              {hostel.type} Hostel
            </Badge>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {hostel.name}
            </h1>
            
            <div className="flex items-center text-muted-foreground mb-2">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{hostel.location}</span>
            </div>
            
            <div className="flex items-center gap-4">
              {renderStars(hostel.rating)}
              <span className="text-sm text-muted-foreground">
                ({hostel.reviews.length} reviews)
              </span>
            </div>
          </div>
          
          
        </div>
        
        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-lg overflow-hidden mb-8">
          {hostel.photos.map((photo, index) => <div key={index} className={index === 0 ? "col-span-1 md:col-span-2 row-span-2" : ""}>
              <img src={photo} alt={`${hostel.name} - ${index + 1}`} className="w-full h-full object-cover min-h-[200px]" />
            </div>)}
        </div>
      </div>
    </>;
};
export default HostelHeader;