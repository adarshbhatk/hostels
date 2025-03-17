
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HostelCard from '@/components/hostel/HostelCard';
import HostelFilters from '@/components/hostel/HostelFilters';
import EmptyState from '@/components/hostel/EmptyState';
import CollegeHeader from '@/components/hostel/CollegeHeader';
import HostelSubmitForm from '@/components/hostel/HostelSubmitForm';
import { useColleges } from '@/hooks/useColleges';
import { useHostels } from '@/hooks/useHostels';
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

const HostelListing = () => {
  const { collegeId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const hostelsPerPage = 4;
  
  // Fetch the specific college
  const { data: colleges, isLoading: isCollegeLoading, error: collegeError } = useColleges();
  const college = colleges?.find(c => c.id === collegeId);
  
  // Fetch hostels for this college
  const { 
    data: hostels, 
    isLoading: isHostelsLoading, 
    error: hostelsError 
  } = useHostels(collegeId || '', searchTerm, activeFilter);
  
  // Filter out pending hostels for regular users
  const visibleHostels = hostels ? hostels.filter(hostel => 
    hostel.status === 'approved' || user
  ) : [];
  
  // Calculate pagination
  const indexOfLastHostel = currentPage * hostelsPerPage;
  const indexOfFirstHostel = indexOfLastHostel - hostelsPerPage;
  const currentHostels = visibleHostels.slice(indexOfFirstHostel, indexOfLastHostel);
  const totalPages = Math.ceil(visibleHostels.length / hostelsPerPage);
  
  // Handler to clear filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setActiveFilter('all');
  };
  
  if (collegeError || (colleges && colleges.length > 0 && !college)) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-16 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">College not found</h1>
            <button 
              onClick={() => navigate('/colleges')}
              className="mt-4 px-4 py-2 bg-hostel-600 text-white rounded-md"
            >
              Back to Colleges
            </button>
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
          {/* College Header */}
          {isCollegeLoading ? (
            <div className="mb-12">
              <Skeleton className="h-4 w-24 mb-4" />
              <Skeleton className="h-10 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-6" />
              <Skeleton className="h-4 w-full" />
            </div>
          ) : college ? (
            <CollegeHeader college={college} />
          ) : null}
          
          <HostelFilters 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
          />
          
          {/* Loading State */}
          {isHostelsLoading && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="rounded-lg border p-6 space-y-4">
                  <div className="flex justify-between">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <div className="flex gap-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-24 w-full" />
                  <div className="flex flex-wrap gap-2">
                    {[...Array(4)].map((_, i) => (
                      <Skeleton key={i} className="h-6 w-16 rounded-full" />
                    ))}
                  </div>
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          )}
          
          {/* Error State */}
          {hostelsError && (
            <div className="text-center py-12">
              <p className="text-destructive">
                Error loading hostels. Please try again later.
              </p>
            </div>
          )}
          
          {/* Hostel Cards */}
          {!isHostelsLoading && !hostelsError && currentHostels && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {currentHostels.map((hostel) => (
                <HostelCard 
                  key={hostel.id} 
                  hostel={hostel} 
                  collegeId={collegeId || ''}
                />
              ))}
            </div>
          )}
          
          {/* Empty State */}
          {!isHostelsLoading && !hostelsError && visibleHostels.length === 0 && (
            <EmptyState onClearFilters={handleClearFilters} />
          )}
          
          {/* Pagination */}
          {!isHostelsLoading && !hostelsError && visibleHostels.length > 0 && (
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
          
          {/* Hostel Submission Form */}
          {collegeId && !isCollegeLoading && college && (
            <div className="max-w-lg mx-auto mt-12 text-center">
              <HostelSubmitForm collegeId={collegeId} />
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default HostelListing;
