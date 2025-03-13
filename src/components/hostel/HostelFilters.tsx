
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface HostelFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

const HostelFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  activeFilter, 
  setActiveFilter 
}: HostelFiltersProps) => {
  return (
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
  );
};

export default HostelFilters;
