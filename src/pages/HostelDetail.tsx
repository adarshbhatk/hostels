
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Users, 
  Star, 
  ArrowLeft, 
  Building, 
  Phone, 
  Mail, 
  Search, 
  ThumbsUp, 
  Calendar, 
  Filter, 
  Clock,
  Utensils
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data for hostels
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
    rent: '₹8,000 - ₹12,000',
    location: 'North Campus, Near Science Block',
    messFood: 'Both',
    warden: {
      name: 'Dr. Rajesh Kumar',
      phone: '+91-9876543210',
      email: 'rajesh.kumar@example.edu'
    },
    photos: [
      'https://placehold.co/800x500/hostel/white?text=Jubilee+Hall+Building',
      'https://placehold.co/800x500/hostel/white?text=Common+Room',
      'https://placehold.co/800x500/hostel/white?text=Mess+Area'
    ],
    reviews: [
      {
        id: 1,
        user: 'Amit Singh',
        rating: 4,
        date: '2023-05-15',
        content: 'Great hostel with a vibrant community. The rooms are spacious and well-maintained. The mess food is good most of the time. WiFi can be a bit spotty during peak hours though.',
        foodRating: 3.5,
        upvotes: 24,
        photos: ['https://placehold.co/400x300/hostel/white?text=Room+Photo']
      },
      {
        id: 2,
        user: 'Rahul Sharma',
        rating: 5,
        date: '2023-07-20',
        content: 'Best hostel experience I could have asked for! The warden is very supportive and the facilities are well-maintained. The gym is a big plus and the laundry service is prompt.',
        foodRating: 4.0,
        upvotes: 42,
        photos: []
      },
      {
        id: 3,
        user: 'Vivek Patel',
        rating: 3,
        date: '2023-02-10',
        content: 'Decent place to stay. The location is convenient but the building needs some maintenance. Hot water is inconsistent in winters. Cultural activities are the highlight though.',
        foodRating: 3.0,
        upvotes: 15,
        photos: ['https://placehold.co/400x300/hostel/white?text=Corridor', 'https://placehold.co/400x300/hostel/white?text=Bathroom']
      },
      {
        id: 4,
        user: 'Karan Malhotra',
        rating: 4,
        date: '2023-09-05',
        content: 'I\'ve been staying here for two years and it\'s been a good experience overall. The community and friendships you build here are the best part. Facilities are decent but could use some upgrading.',
        foodRating: 4.5,
        upvotes: 31,
        photos: []
      },
      {
        id: 5,
        user: 'Nikhil Joshi',
        rating: 5,
        date: '2023-11-25',
        content: 'Fantastic hostel! Clean rooms, good food, and the staff is very helpful. There are plenty of activities to participate in and the location is ideal for quick access to classrooms.',
        foodRating: 5.0,
        upvotes: 55,
        photos: ['https://placehold.co/400x300/hostel/white?text=Event+Photo']
      }
    ]
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
    rent: '₹10,000 - ₹15,000',
    location: 'South Campus, Near Arts Faculty',
    messFood: 'Veg',
    warden: {
      name: 'Mrs. Smita Verma',
      phone: '+91-9988776655',
      email: 'smita.verma@example.edu'
    },
    photos: [
      'https://placehold.co/800x500/hostel/white?text=Tagore+Residency+Entrance',
      'https://placehold.co/800x500/hostel/white?text=Room+Interior',
      'https://placehold.co/800x500/hostel/white?text=Library'
    ],
    reviews: [
      {
        id: 6,
        user: 'Priya Kapoor',
        rating: 5,
        date: '2023-06-10',
        content: 'Excellent hostel for girls. Very safe and secure environment. The warden is very strict about rules, which is good. Food is purely vegetarian and of good quality.',
        foodRating: 4.5,
        upvotes: 38,
        photos: ['https://placehold.co/400x300/hostel/white?text=Security+Desk']
      },
      {
        id: 7,
        user: 'Anjali Gupta',
        rating: 4,
        date: '2023-08-15',
        content: 'Good hostel with all basic amenities. The rooms are clean and well-maintained. The library is a great place to study. Sometimes there are issues with the water supply.',
        foodRating: 4.0,
        upvotes: 27,
        photos: []
      },
      {
        id: 8,
        user: 'Neha Reddy',
        rating: 3,
        date: '2023-03-01',
        content: 'Average hostel. The location is good but the building is quite old. The common room is not well-equipped. The mess food is okay but can get repetitive.',
        foodRating: 3.0,
        upvotes: 12,
        photos: ['https://placehold.co/400x300/hostel/white?text=Common+Room']
      },
      {
        id: 9,
        user: 'Deepika Menon',
        rating: 4,
        date: '2023-10-20',
        content: 'I\'ve had a comfortable stay here. The staff is friendly and helpful. The hostel is located close to the market, which is very convenient. The only issue is the noise from the nearby road.',
        foodRating: 3.5,
        upvotes: 21,
        photos: []
      },
      {
        id: 10,
        user: 'Shweta Nair',
        rating: 5,
        date: '2023-12-05',
        content: 'Amazing hostel! The rooms are spacious and well-lit. The warden is very caring and takes good care of the students. The food is delicious and there is a variety of dishes.',
        foodRating: 5.0,
        upvotes: 48,
        photos: ['https://placehold.co/400x300/hostel/white?text=Dining+Hall']
      }
    ]
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
    rent: '₹7,500 - ₹11,000',
    location: 'Central Campus, Near Main Auditorium',
    messFood: 'Both',
    warden: {
      name: 'Mr. Arvind Singh',
      phone: '+91-9765432109',
      email: 'arvind.singh@example.edu'
    },
    photos: [
      'https://placehold.co/800x500/hostel/white?text=Unity+Block+Exterior',
      'https://placehold.co/800x500/hostel/white?text=Study+Room',
      'https://placehold.co/800x500/hostel/white?text=Sports+Field'
    ],
    reviews: [
      {
        id: 11,
        user: 'Aryan Verma',
        rating: 4,
        date: '2023-07-01',
        content: 'Good co-ed hostel with decent facilities. The rooms are a bit small but clean. The cafeteria is a great place to hang out. The sports facilities are well-maintained.',
        foodRating: 3.5,
        upvotes: 29,
        photos: ['https://placehold.co/400x300/hostel/white?text=Cafeteria']
      },
      {
        id: 12,
        user: 'Sakshi Yadav',
        rating: 3,
        date: '2023-09-10',
        content: 'Average hostel. The location is convenient but the building is quite old. The study rooms are not very comfortable. The mess food is okay but can get repetitive.',
        foodRating: 3.0,
        upvotes: 18,
        photos: []
      },
      {
        id: 13,
        user: 'Rohan Kumar',
        rating: 4,
        date: '2023-04-05',
        content: 'I\'ve had a decent stay here. The security is good and the staff is helpful. The hostel is located close to the classrooms, which is very convenient. The only issue is the noise from the nearby road.',
        foodRating: 4.0,
        upvotes: 23,
        photos: ['https://placehold.co/400x300/hostel/white?text=Security+Gate']
      },
      {
        id: 14,
        user: 'Pooja Sharma',
        rating: 5,
        date: '2023-11-15',
        content: 'Excellent hostel! The rooms are spacious and well-lit. The warden is very caring and takes good care of the students. The food is delicious and there is a variety of dishes.',
        foodRating: 5.0,
        upvotes: 45,
        photos: []
      },
      {
        id: 15,
        user: 'Vikram Singh',
        rating: 3,
        date: '2023-12-20',
        content: 'Okay hostel. The rooms are small and not very well-maintained. The cafeteria is overpriced. The sports facilities are decent but could be better.',
        foodRating: 2.5,
        upvotes: 10,
        photos: ['https://placehold.co/400x300/hostel/white?text=Room+Interior']
      }
    ]
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
    rent: '₹12,000 - ₹18,000',
    location: 'East Campus, Near Lake View Point',
    messFood: 'Veg',
    warden: {
      name: 'Mrs. Lakshmi Devi',
      phone: '+91-9654321087',
      email: 'lakshmi.devi@example.edu'
    },
    photos: [
      'https://placehold.co/800x500/hostel/white?text=Lakeside+Residence+View',
      'https://placehold.co/800x500/hostel/white?text=Swimming+Pool',
      'https://placehold.co/800x500/hostel/white?text=AC+Room'
    ],
    reviews: [
      {
        id: 16,
        user: 'Aishwarya Krishnan',
        rating: 5,
        date: '2023-08-01',
        content: 'Amazing hostel with excellent facilities. The rooms are spacious and well-maintained. The swimming pool is a great place to relax. The food is purely vegetarian and of good quality.',
        foodRating: 4.5,
        upvotes: 41,
        photos: ['https://placehold.co/400x300/hostel/white?text=Swimming+Pool']
      },
      {
        id: 17,
        user: 'Meera Iyer',
        rating: 4,
        date: '2023-10-10',
        content: 'Good hostel with all the necessary amenities. The AC rooms are very comfortable. The gym is well-equipped. Sometimes there are issues with the power supply.',
        foodRating: 4.0,
        upvotes: 30,
        photos: []
      },
      {
        id: 18,
        user: 'Gayatri Nair',
        rating: 5,
        date: '2023-05-05',
        content: 'Excellent hostel! The location is beautiful and the rooms have a great view. The staff is very friendly and helpful. The food is delicious and there is a variety of dishes.',
        foodRating: 5.0,
        upvotes: 52,
        photos: ['https://placehold.co/400x300/hostel/white?text=Room+View']
      },
      {
        id: 19,
        user: 'Ananya Pillai',
        rating: 4,
        date: '2023-12-10',
        content: 'I\'ve had a comfortable stay here. The security is good and the staff is helpful. The hostel is located close to the market, which is very convenient. The only issue is the noise from the nearby road.',
        foodRating: 3.5,
        upvotes: 26,
        photos: []
      },
      {
        id: 20,
        user: 'Divya Menon',
        rating: 3,
        date: '2023-02-20',
        content: 'Average hostel. The rooms are small and not very well-maintained. The common room is not well-equipped. The mess food is okay but can get repetitive.',
        foodRating: 3.0,
        upvotes: 15,
        photos: ['https://placehold.co/400x300/hostel/white?text=Common+Room']
      }
    ]
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
    rent: '₹6,000 - ₹9,000',
    location: 'West Campus, Near Old Library',
    messFood: 'Non-veg',
    warden: {
      name: 'Mr. Suresh Kumar',
      phone: '+91-9543210765',
      email: 'suresh.kumar@example.edu'
    },
    photos: [
      'https://placehold.co/800x500/hostel/white?text=Heritage+Towers+Entrance',
      'https://placehold.co/800x500/hostel/white?text=Reading+Room',
      'https://placehold.co/800x500/hostel/white?text=Indoor+Games'
    ],
    reviews: [
      {
        id: 21,
        user: 'Arjun Reddy',
        rating: 4,
        date: '2023-06-15',
        content: 'Good hostel with decent facilities. The rooms are clean and well-maintained. The reading room is a great place to study. The food is non-vegetarian and of good quality.',
        foodRating: 4.0,
        upvotes: 33,
        photos: ['https://placehold.co/400x300/hostel/white?text=Reading+Room']
      },
      {
        id: 22,
        user: 'Karthik Rao',
        rating: 3,
        date: '2023-08-20',
        content: 'Average hostel. The location is convenient but the building is quite old. The indoor games are not well-maintained. The mess food is okay but can get repetitive.',
        foodRating: 3.0,
        upvotes: 20,
        photos: []
      },
      {
        id: 23,
        user: 'Mahesh Babu',
        rating: 5,
        date: '2023-03-10',
        content: 'Excellent hostel! The rooms are spacious and well-lit. The warden is very caring and takes good care of the students. The food is delicious and there is a variety of dishes.',
        foodRating: 5.0,
        upvotes: 49,
        photos: ['https://placehold.co/400x300/hostel/white?text=Dining+Hall']
      },
      {
        id: 24,
        user: 'Vijay Devarakonda',
        rating: 4,
        date: '2023-10-25',
        content: 'I\'ve had a comfortable stay here. The security is good and the staff is helpful. The hostel is located close to the classrooms, which is very convenient. The only issue is the noise from the nearby road.',
        foodRating: 3.5,
        upvotes: 25,
        photos: []
      },
      {
        id: 25,
        user: 'Nani Ghanta',
        rating: 3,
        date: '2023-12-30',
        content: 'Okay hostel. The rooms are small and not very well-maintained. The reading room is not very comfortable. The mess food is okay but can get repetitive.',
        foodRating: 2.5,
        upvotes: 12,
        photos: ['https://placehold.co/400x300/hostel/white?text=Room+Interior']
      }
    ]
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
    rent: '₹9,000 - ₹14,000',
    location: 'Near Sports Complex',
    messFood: 'Both',
    warden: {
      name: 'Priya Sharma',
      phone: '+91-8976543210',
      email: 'priya.sharma@example.edu'
    },
    photos: [
      'https://placehold.co/800x500/hostel/white?text=Sunrise+Block+Exterior',
      'https://placehold.co/800x500/hostel/white?text=Recreation+Room',
      'https://placehold.co/800x500/hostel/white?text=Laundry+Area'
    ],
    reviews: [
      {
        id: 26,
        user: 'Anika Verma',
        rating: 5,
        date: '2024-01-05',
        content: 'Excellent co-ed hostel with great facilities. The rooms are spacious and well-maintained. The recreation room is a great place to relax and socialize. The food is good with a variety of options.',
        foodRating: 4.5,
        upvotes: 40,
        photos: ['https://placehold.co/400x300/hostel/white?text=Recreation+Room']
      },
      {
        id: 27,
        user: 'Ishaan Kapoor',
        rating: 4,
        date: '2023-11-20',
        content: 'Good hostel with all the necessary amenities. The laundry service is very convenient. The cafeteria offers a variety of snacks and beverages. The location is close to the sports complex.',
        foodRating: 4.0,
        upvotes: 30,
        photos: []
      },
      {
        id: 28,
        user: 'Neha Gupta',
        rating: 3,
        date: '2023-09-10',
        content: 'Average hostel. The rooms are a bit small but clean. The cafeteria is overpriced. The WiFi can be unreliable at times. The staff is generally helpful and responsive.',
        foodRating: 3.0,
        upvotes: 20,
        photos: ['https://placehold.co/400x300/hostel/white?text=Room+Interior']
      },
      {
        id: 29,
        user: 'Rohan Sharma',
        rating: 4,
        date: '2023-07-15',
        content: 'I\'ve had a comfortable stay here. The hostel is well-maintained and the common areas are clean. The warden is approachable and addresses concerns promptly. The food is decent and there are options for both veg and non-veg.',
        foodRating: 3.5,
        upvotes: 25,
        photos: []
      },
      {
        id: 30,
        user: 'Priya Singh',
        rating: 5,
        date: '2023-05-01',
        content: 'Amazing hostel! The rooms are spacious and well-lit. The staff is very caring and takes good care of the students. The food is delicious and there is a variety of dishes. The community is vibrant and supportive.',
        foodRating: 5.0,
        upvotes: 45,
        photos: ['https://placehold.co/400x300/hostel/white?text=Dining+Hall']
      }
    ]
  }
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

const HostelDetail = () => {
  const { collegeId, hostelId } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [activeTab, setActiveTab] = useState('overview');
  
  // Find the college based on the ID from the URL
  const college = mockColleges.find(c => c.id === parseInt(collegeId || '0'));
  
  // Find the hostel based on the ID from the URL
  const hostel = mockHostels.find(h => h.id === parseInt(hostelId || '0'));
  
  // Filtered reviews based on search term
  const filteredReviews = hostel?.reviews.filter(review => 
    review.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.user.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];
  
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
  const renderStars = (rating) => {
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
  
  if (!college || !hostel) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-16 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Hostel not found</h1>
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
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 mb-6 text-sm">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/colleges')}
              className="pl-2 text-hostel-600 hover:bg-hostel-50"
            >
              Colleges
            </Button>
            <span className="text-muted-foreground">›</span>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate(`/colleges/${collegeId}`)}
              className="text-hostel-600 hover:bg-hostel-50"
            >
              {college.name}
            </Button>
            <span className="text-muted-foreground">›</span>
            <span className="text-muted-foreground">{hostel.name}</span>
          </div>
          
          {/* Hostel Header */}
          <div className="mb-8">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <Badge
                  variant="primary"
                  size="md"
                  className="mb-2"
                >
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
              
              <Button 
                className="bg-hostel-600 hover:bg-hostel-700 text-white"
              >
                Apply for Accommodation
              </Button>
            </div>
            
            {/* Image Gallery */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-lg overflow-hidden mb-8">
              {hostel.photos.map((photo, index) => (
                <div 
                  key={index} 
                  className={index === 0 ? "col-span-1 md:col-span-2 row-span-2" : ""}
                >
                  <img 
                    src={photo}
                    alt={`${hostel.name} - ${index + 1}`}
                    className="w-full h-full object-cover min-h-[200px]"
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Tabs */}
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-10">
            <TabsList className="grid w-full md:w-auto grid-cols-2 md:flex">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            
            {/* Overview Tab Content */}
            <TabsContent value="overview" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Details Card */}
                <Card>
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
                        <span>{hostel.messFood === 'Veg' ? 'Vegetarian Only' : 
                              hostel.messFood === 'Non-veg' ? 'Non-Vegetarian Available' : 
                              'Both Vegetarian and Non-Vegetarian Options'}</span>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Monthly Rent</h3>
                      <div className="flex items-start">
                        <span className="text-hostel-600 font-medium">{hostel.rent}</span>
                        <span className="text-muted-foreground ml-1"> per month</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Warden Info Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Warden Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Name</h3>
                      <div className="flex items-start">
                        <Building className="h-4 w-4 mr-2 mt-1 text-hostel-600" />
                        <span>{hostel.warden.name}</span>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Contact</h3>
                      <div className="flex items-start mb-2">
                        <Phone className="h-4 w-4 mr-2 mt-1 text-hostel-600" />
                        <span>{hostel.warden.phone}</span>
                      </div>
                      <div className="flex items-start">
                        <Mail className="h-4 w-4 mr-2 mt-1 text-hostel-600" />
                        <span>{hostel.warden.email}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Amenities Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {hostel.amenities.map((amenity, index) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Description Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">About {hostel.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {hostel.description}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Reviews Tab Content */}
            <TabsContent value="reviews" className="space-y-8">
              {/* Search and Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="col-span-1 md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search reviews..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <div className="flex items-center">
                        <Filter className="mr-2 h-4 w-4" />
                        <span>Sort by</span>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4" />
                          <span>Newest first</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="upvotes">
                        <div className="flex items-center">
                          <ThumbsUp className="mr-2 h-4 w-4" />
                          <span>Most helpful</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Reviews List */}
              <div className="space-y-6">
                {sortedReviews.length === 0 ? (
                  <div className="text-center py-10">
                    <h3 className="text-lg font-medium mb-2">No reviews found</h3>
                    <p className="text-muted-foreground">
                      {searchTerm ? "Try a different search term" : "Be the first to leave a review"}
                    </p>
                  </div>
                ) : (
                  sortedReviews.map((review) => (
                    <Card key={review.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">{review.user}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              <span>{new Date(review.date).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            {renderStars(review.rating)}
                            {review.foodRating && (
                              <div className="flex items-center justify-end text-sm mt-1">
                                <Utensils className="h-3 w-3 mr-1" />
                                <span className="text-muted-foreground">Food: {review.foodRating.toFixed(1)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-4">{review.content}</p>
                        
                        {review.photos && review.photos.length > 0 && (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                            {review.photos.map((photo, index) => (
                              <div key={index} className="relative aspect-video rounded-md overflow-hidden">
                                <img 
                                  src={photo} 
                                  alt={`Review photo ${index + 1}`}
                                  className="object-cover w-full h-full"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                      <CardFooter>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          <span>{review.upvotes} people found this helpful</span>
                        </div>
                      </CardFooter>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HostelDetail;
