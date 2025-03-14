
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

// Import our components
import HostelHeader from '@/components/hostel/HostelHeader';
import HostelDetails from '@/components/hostel/HostelDetails';
import WardenInfo from '@/components/hostel/WardenInfo';
import HostelAmenities from '@/components/hostel/HostelAmenities';
import ReviewsSection from '@/components/hostel/ReviewsSection';

// Import hooks
import { useColleges } from '@/hooks/useColleges';
import { useHostel } from '@/hooks/useHostel';
import { useReviews } from '@/hooks/useReviews';

const HostelDetail = () => {
  const { collegeId, hostelId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Fetch college data
  const { data: colleges, isLoading: isCollegeLoading } = useColleges();
  const college = colleges?.find(c => c.id === collegeId);
  
  // Fetch hostel data
  const { 
    data: hostel, 
    isLoading: isHostelLoading, 
    error: hostelError 
  } = useHostel(hostelId || '');
  
  // Fetch reviews
  const { 
    data: reviews, 
    isLoading: isReviewsLoading 
  } = useReviews(hostelId || '');
  
  // Handle loading state
  if (isCollegeLoading || isHostelLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <Skeleton className="h-4 w-40 mb-6" />
              <Skeleton className="h-10 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-6" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Skeleton className="h-64 md:h-96 md:col-span-2 row-span-2" />
              <Skeleton className="h-64" />
              <Skeleton className="h-64" />
            </div>
            
            <Skeleton className="h-12 w-full mb-8" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Skeleton className="h-64" />
              <Skeleton className="h-64" />
              <Skeleton className="h-64" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Handle error or not found
  if (hostelError || !hostel || !college) {
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
  
  // Prepare warden info object
  const warden = {
    name: hostel.warden_name,
    phone: hostel.warden_phone,
    email: hostel.warden_email
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hostel Header with navigation and gallery */}
          <HostelHeader hostel={hostel} college={college} />
          
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
                <HostelDetails hostel={hostel} />
                
                {/* Warden Info Card */}
                <WardenInfo warden={warden} />
                
                {/* Amenities Card */}
                <HostelAmenities amenities={hostel.amenities} description={hostel.description} />
              </div>
            </TabsContent>
            
            {/* Reviews Tab Content */}
            <TabsContent value="reviews">
              <ReviewsSection 
                reviews={reviews || []} 
                isLoading={isReviewsLoading}
                hostelId={hostelId || ''}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default HostelDetail;
