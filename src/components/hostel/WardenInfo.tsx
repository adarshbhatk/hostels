
import React from 'react';
import { Phone, Mail, Building } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface WardenInfoProps {
  warden: {
    name: string;
    phone: string;
    email: string;
  };
}

const WardenInfo = ({ warden }: WardenInfoProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Warden Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium mb-2">Warden Name</h3>
          <div className="flex items-start">
            <Building className="h-4 w-4 mr-2 mt-1 text-hostel-600" />
            <span>{warden.name}</span>
          </div>
        </div>
        
        <div>
          <h3 className="font-medium mb-2">Contact</h3>
          <div className="flex items-start mb-2">
            <Phone className="h-4 w-4 mr-2 mt-1 text-hostel-600" />
            <span>{warden.phone}</span>
          </div>
          <div className="flex items-start">
            <Mail className="h-4 w-4 mr-2 mt-1 text-hostel-600" />
            <span>{warden.email}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WardenInfo;
