
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { mockColleges } from '@/data/mockData';

const Colleges = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredColleges = mockColleges.filter(college =>
    college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    college.location.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge
              variant="default"
              size="md"
              className="mb-4 mx-auto"
            >
              Browse Colleges
            </Badge>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Find Hostels at Your College
            </h1>
            
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Browse through our list of colleges to find and read reviews for hostels
            </p>
          </div>
          
          {/* Search */}
          <div className="max-w-xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by college name or location..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {/* Colleges Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredColleges.map((college) => (
              <Card key={college.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>{college.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-2">
                    <span className="font-medium">Location:</span> {college.location}
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium">Hostels:</span> {college.hostelCount}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full text-hostel-600 border-hostel-600 hover:bg-hostel-50"
                    asChild
                  >
                    <Link to={`/colleges/${college.id}`}>
                      View Hostels
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {filteredColleges.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No colleges found matching "{searchTerm}".
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Colleges;
