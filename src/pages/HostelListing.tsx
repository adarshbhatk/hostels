import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, Users, Star, ArrowLeft, Building } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

// Mock data for the hostels
const mockHostels = [
  { 
    id: 1, 
    name: 'Jubilee Hall', 
    type: 'Boys', 
    distance: '1.2 km', 
    capacity: 200, 
    rating: 4.2,
    amenities: ['WiFi', 'Gym', 'Mess', 'Laundry'],
    description: 'One of the oldest and most prestigious hostels on campus, known for its community spirit and vibrant cultural activities.',
    rent: '₹8,000 - ₹12,000' 
  },
  { 
    id: 2, 
    name: 'Tagore Residency', 
    type: 'Girls', 
    distance: '0.8 km', 
    capacity: 150, 
    rating: 4.5,
    amenities: ['WiFi', 'Common Room', 'Mess', 'Library'],
    description: 'Modern facilities with a focus on academic environment. Offers single and double occupancy rooms with attached bathrooms.',
    rent: '₹10,000 - ₹15,000' 
  },
  { 
    id: 3, 
    name: 'Unity Block', 
    type: 'Co-ed', 
    distance: '0.5 km', 
    capacity: 300, 
    rating: 3.8,
    amenities: ['WiFi', 'Cafeteria', 'Study Rooms', 'Sports Facilities'],
    description: 'A large hostel complex with separate wings for male and female students. Features modern amenities and 24/7 security.',
    rent: '₹7,500 - ₹11,000' 
  },
  { 
    id: 4, 
    name: 'Lakeside Residence', 
    type: 'Girls', 
    distance: '1.5 km', 
    capacity: 180, 
    rating: 4.7,
    amenities: ['WiFi', 'AC Rooms', 'Mess', 'Gym', 'Swimming Pool'],
    description: 'Premium accommodation with scenic views. Each floor has dedicated common areas and modern kitchen facilities.',
    rent: '₹12,000 - ₹18,000' 
  },
  { 
    id: 5, 
    name: 'Heritage Towers', 
    type: 'Boys', 
    distance: '0.3 km', 
    capacity: 250, 
    rating: 4.0,
    amenities: ['WiFi', 'Mess', 'Reading Room', 'Indoor Games'],
    description: 'Traditional hostel with a rich history. Known for its cultural events and student-led initiatives.',
    rent: '₹6,000 - ₹9,000' 
  },
  { 
    id: 6, 
    name: 'Sunrise Block', 
    type: 'Co-ed', 
    distance: '0.7 km', 
    capacity: 220, 
    rating: 4.3,
    amenities: ['WiFi', 'Cafeteria', 'Laundry', 'Recreation Room'],
    description: 'Modern hostel with emphasis on community living. Features spacious rooms and well-maintained common areas.',
    rent: '₹9,000 - ₹14,000' 
  },
];

// Mock data for colleges
const mockColleges = [
  { id: 1, name: 'Delhi University', location: 'New Delhi', hostelCount: 12 },
  { id: 2, name: 'IIT Bombay', location: 'Mumbai', hostelCount: 8 },
  { id: 3, name: 'Manipal University', location: 'Manipal', hostelCount: 10 },
  { id: 4, name: 'Jawaharlal Nehru University', location: 'New Delhi', hostelCount: 15 },
  { id: 5, name: 'VIT University', location: 'Vellore', hostelCount: 14 },
  { id: 6, name: 'Banaras Hindu University', location: 'Varanasi', hostelCount: 7 },
  { id: 7, name: 'BITS Pilani', location: 'Pilani', hostelCount: 9 },
  { id: 8, name: 'Christ University', location: 'Bangalore', hostelCount: 6 },
];

const HostelListing = () => {
  const { collegeId } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const hostelsPerPage = 4;
  
  // Find the college based on the ID from the URL
  const college = mockColleges.find(c => c.id === parseInt(collegeId || '0'));
  
  // Filter hostels based on search term and active filter
  const filteredHostels = mockHostels.filter(hostel => {
    const matchesSearch = hostel.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'all' || hostel.type.toLowerCase() === activeFilter.toLowerCase();
    return matchesSearch && matchesFilter;
  });
  
  // Calculate pagination
  const indexOfLastHostel = currentPage * hostelsPerPage;
  const indexOfFirstHostel = indexOfLastHostel - hostelsPerPage;
  const currentHostels = filteredHostels.slice(indexOfFirstHostel, indexOfLastHostel);
  const totalPages = Math.ceil(filteredHostels.length / hostelsPerPage);
  
  if (!college) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-16 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">College not found</h1>
            <Button 
              onClick={() => navigate('/colleges')}
              className="mt-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Colleges
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Back button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate('/colleges')}
            className="mb-6 text-hostel-600 hover:text-hostel-700 hover:bg-hostel-50 pl-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Colleges
          </Button>
          
          <div className="mb-12">
            <Badge
              variant="default"
              size="md"
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
              <span>{college.hostelCount} Hostels</span>
            </div>
            
            <p className="text-muted-foreground max-w-3xl">
              Browse through all available hostels at {college.name}. Filter by type, check amenities, and find your perfect accommodation.
            </p>
          </div>
          
          {/* Search and Filter */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Search */}
            <div className="md:w-1/3">
              <Input
                type="text"
                placeholder="Search hostels..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Filters */}
            <div className="flex space-x-2">
              <Button 
                variant={activeFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter('all')}
                className={activeFilter === 'all' ? 'bg-hostel-600 hover:bg-hostel-700' : ''}
              >
                All
              </Button>
              <Button 
                variant={activeFilter === 'boys' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter('boys')}
                className={activeFilter === 'boys' ? 'bg-hostel-600 hover:bg-hostel-700' : ''}
              >
                Boys
              </Button>
              <Button 
                variant={activeFilter === 'girls' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter('girls')}
                className={activeFilter === 'girls' ? 'bg-hostel-600 hover:bg-hostel-700' : ''}
              >
                Girls
              </Button>
              <Button 
                variant={activeFilter === 'co-ed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter('co-ed')}
                className={activeFilter === 'co-ed' ? 'bg-hostel-600 hover:bg-hostel-700' : ''}
              >
                Co-Ed
              </Button>
            </div>
          </div>
          
          {/* Hostel Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {currentHostels.map((hostel) => (
              <Card key={hostel.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{hostel.name}</CardTitle>
                    <Badge 
                      variant={hostel.type === 'Boys' ? 'default' : hostel.type === 'Girls' ? 'secondary' : 'outline'}
                      size="sm"
                    >
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
                  
                  <div className="mt-4 text-sm">
                    <span className="font-medium">Rent: </span>
                    <span className="text-hostel-600 font-medium">{hostel.rent}</span>
                    <span className="text-muted-foreground"> per month</span>
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    className="w-full bg-hostel-600 hover:bg-hostel-700 text-white"
                    asChild
                  >
                    <Link to={`/colleges/${collegeId}/hostel/${hostel.id}`}>
                      View Details
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {/* Empty State */}
          {filteredHostels.length === 0 && (
            <div className="text-center py-12 border rounded-lg">
              <Building className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No hostels found</h3>
              <p className="text-muted-foreground mb-4">
                No hostels match your current search and filters.
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setActiveFilter('all');
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
          
          {/* Pagination */}
          {filteredHostels.length > 0 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }).map((_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      isActive={currentPage === index + 1}
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default HostelListing;
