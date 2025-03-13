
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { mockColleges, mockHostels } from '@/data/mockData';
import HostelCard from '@/components/hostel/HostelCard';
import HostelFilters from '@/components/hostel/HostelFilters';
import EmptyState from '@/components/hostel/EmptyState';
import CollegeHeader from '@/components/hostel/CollegeHeader';
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
  
  // Handler to clear filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setActiveFilter('all');
  };
  
  if (!college) {
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
          <CollegeHeader college={college} />
          
          <HostelFilters 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
          />
          
          {/* Hostel Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {currentHostels.map((hostel) => (
              <HostelCard 
                key={hostel.id} 
                hostel={hostel} 
                collegeId={collegeId || ''}
              />
            ))}
          </div>
          
          {/* Empty State */}
          {filteredHostels.length === 0 && (
            <EmptyState onClearFilters={handleClearFilters} />
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
