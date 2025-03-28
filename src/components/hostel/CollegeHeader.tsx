
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Building, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/button';
import type { College } from '@/types';

interface CollegeHeaderProps {
  college: College & { hostelCount?: number };
}

const CollegeHeader = ({ college }: CollegeHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="mb-12">
      {/* Back button */}
      <Button 
        variant="ghost" 
        onClick={() => navigate('/colleges')}
        className="mb-6 text-hostel-600 hover:text-hostel-700 hover:bg-hostel-50 pl-2"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Colleges
      </Button>
      
      <Badge
        variant="default"
        className="mb-4"
      >
        Hostel Listings
      </Badge>
      
      <h1 className="text-3xl md:text-4xl font-bold mb-2">
        {college.name}
      </h1>
      
      <div className="flex items-center text-muted-foreground mb-6">
        <MapPin className="h-4 w-4 mr-1" />
        <span>{college.location}</span>
        <span className="mx-2">•</span>
        <Building className="h-4 w-4 mr-1" />
        <span>{college.hostelCount || 0} Hostels</span>
      </div>
      
      <p className="text-muted-foreground max-w-3xl">
        Browse through all available hostels at {college.name}. Filter by type, check amenities, and find your perfect accommodation.
      </p>
    </div>
  );
};

export default CollegeHeader;
