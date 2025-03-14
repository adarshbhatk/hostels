
import React from 'react';
import { MapPin, Users, Utensils } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Hostel } from '@/types';

interface HostelDetailsProps {
  hostel: Hostel;
}

const HostelDetails = ({
  hostel
}: HostelDetailsProps) => {
  return <Card>
      <CardHeader>
        <CardTitle className="text-xl">Hostel Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium mb-2">Location</h3>
          <div className="flex items-start">
            <MapPin className="h-4 w-4 mr-2 mt-1 text-hostel-600" />
            <span>{hostel.location}</span>
          </div>
        </div>
        
        <div>
          <h3 className="font-medium mb-2">Type & Capacity</h3>
          <div className="flex items-start mb-2">
            <Users className="h-4 w-4 mr-2 mt-1 text-hostel-600" />
            <span>{hostel.type} Hostel - Capacity: {hostel.capacity} students</span>
          </div>
        </div>
        
        <div>
          <h3 className="font-medium mb-2">Mess Food</h3>
          <div className="flex items-start">
            <Utensils className="h-4 w-4 mr-2 mt-1 text-hostel-600" />
            <span>{hostel.mess_food === 'Veg' ? 'Vegetarian Only' : hostel.mess_food === 'Non-veg' ? 'Non-Vegetarian Available' : 'Both Vegetarian and Non-Vegetarian Options'}</span>
          </div>
        </div>
        
        <div>
          <h3 className="font-medium mb-2">Hostel Fees</h3>
          <div className="flex items-start">
            <span className="text-hostel-600 font-medium">{hostel.rent}</span>
            <span className="text-muted-foreground ml-1"> per month</span>
          </div>
        </div>
      </CardContent>
    </Card>;
};

export default HostelDetails;
