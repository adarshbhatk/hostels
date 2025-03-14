
import React from 'react';
import { Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface HostelAmenitiesProps {
  amenities: string[];
  description: string;
}

const HostelAmenities = ({ amenities, description }: HostelAmenitiesProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Amenities & Description</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium mb-2">Description</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>
        
        <div>
          <h3 className="font-medium mb-2">Amenities</h3>
          <div className="flex flex-wrap gap-2">
            {amenities.map((amenity, index) => (
              <Badge key={index} variant="outline" className="flex items-center gap-1">
                <Check className="h-3 w-3" />
                {amenity}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HostelAmenities;
