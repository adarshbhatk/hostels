
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, Star } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import type { Hostel } from '@/types';

interface HostelCardProps {
  hostel: Hostel;
  collegeId: string;
}

const HostelCard = ({
  hostel,
  collegeId
}: HostelCardProps) => {
  return (
    <Card key={hostel.id} className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{hostel.name}</CardTitle>
          <Badge variant={hostel.type === 'Boys' ? 'default' : hostel.type === 'Girls' ? 'secondary' : 'outline'} size="sm">
            {hostel.type}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center">
            <MapPin className="h-3.5 w-3.5 mr-1" />
            <span>{hostel.distance} from campus</span>
          </div>
          <div className="flex items-center">
            <Users className="h-3.5 w-3.5 mr-1" />
            <span>Capacity: {hostel.capacity}</span>
          </div>
          <div className="flex items-center">
            <Star className="h-3.5 w-3.5 mr-1 text-yellow-500" />
            <span>{hostel.rating}/5</span>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">
          {hostel.description}
        </p>
        
        <div className="mb-2">
          <h4 className="text-sm font-medium mb-2">Amenities:</h4>
          <div className="flex flex-wrap gap-2">
            {hostel.amenities.map((amenity, index) => (
              <span key={index} className="text-xs bg-muted px-2 py-1 rounded-full">
                {amenity}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button className="w-full bg-hostel-600 hover:bg-hostel-700 text-white" asChild>
          <Link to={`/colleges/${collegeId}/hostel/${hostel.id}`}>
            View Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default HostelCard;
