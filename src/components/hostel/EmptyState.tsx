
import React from 'react';
import { Building } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  onClearFilters: () => void;
}

const EmptyState = ({ onClearFilters }: EmptyStateProps) => {
  return (
    <div className="text-center py-12 border rounded-lg">
      <Building className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">No hostels found</h3>
      <p className="text-muted-foreground mb-4">
        No hostels match your current search and filters.
      </p>
      <Button variant="outline" onClick={onClearFilters}>
        Clear Filters
      </Button>
    </div>
  );
};

export default EmptyState;
