
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Pencil, Trash } from 'lucide-react';
import { Hostel, College } from '@/types';
import HostelForm from './HostelForm';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

const HostelsAdmin = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentHostel, setCurrentHostel] = useState<Hostel | null>(null);

  // Fetch colleges for dropdown
  const { data: colleges = [] } = useQuery({
    queryKey: ['colleges'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('colleges')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as College[];
    },
  });

  // Fetch hostels
  const { data: hostels, isLoading, error } = useQuery({
    queryKey: ['hostels'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hostels')
        .select(`
          *,
          colleges:college_id (name)
        `)
        .order('name');
      
      if (error) throw error;
      return data as (Hostel & { colleges: { name: string } })[];
    },
  });

  // Add hostel mutation
  const addHostelMutation = useMutation({
    mutationFn: async (newHostel: Omit<Hostel, 'id' | 'created_at' | 'updated_at' | 'rating'>) => {
      const { data, error } = await supabase
        .from('hostels')
        .insert(newHostel)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hostels'] });
      setIsAddDialogOpen(false);
      toast({
        title: 'Hostel Added',
        description: 'The hostel has been added successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to add hostel: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Update hostel mutation
  const updateHostelMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Hostel> }) => {
      const { data: updatedData, error } = await supabase
        .from('hostels')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return updatedData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hostels'] });
      setIsEditDialogOpen(false);
      setCurrentHostel(null);
      toast({
        title: 'Hostel Updated',
        description: 'The hostel has been updated successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update hostel: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Delete hostel mutation
  const deleteHostelMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('hostels')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hostels'] });
      setIsDeleteDialogOpen(false);
      setCurrentHostel(null);
      toast({
        title: 'Hostel Deleted',
        description: 'The hostel has been deleted successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to delete hostel: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Handle form submissions
  const handleAddSubmit = (data: Omit<Hostel, 'id' | 'created_at' | 'updated_at' | 'rating'>) => {
    addHostelMutation.mutate(data);
  };

  const handleEditSubmit = (data: Omit<Hostel, 'id' | 'created_at' | 'updated_at' | 'rating'>) => {
    if (currentHostel) {
      updateHostelMutation.mutate({
        id: currentHostel.id,
        data,
      });
    }
  };

  const handleDelete = () => {
    if (currentHostel) {
      deleteHostelMutation.mutate(currentHostel.id);
    }
  };

  // Open edit dialog
  const openEditDialog = (hostel: Hostel) => {
    setCurrentHostel(hostel);
    setIsEditDialogOpen(true);
  };

  // Open delete dialog
  const openDeleteDialog = (hostel: Hostel) => {
    setCurrentHostel(hostel);
    setIsDeleteDialogOpen(true);
  };

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-destructive">
            Error loading hostels: {(error as Error).message}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Hostels</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Hostel
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>College</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead className="w-[160px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Loading hostels...
                  </TableCell>
                </TableRow>
              ) : hostels && hostels.length > 0 ? (
                hostels.map((hostel) => (
                  <TableRow key={hostel.id}>
                    <TableCell className="font-medium">{hostel.name}</TableCell>
                    <TableCell>{hostel.colleges.name}</TableCell>
                    <TableCell>{hostel.type}</TableCell>
                    <TableCell>{hostel.capacity}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(hostel)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => openDeleteDialog(hostel)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    No hostels found. Add a hostel to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Hostel Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Hostel</DialogTitle>
            <DialogDescription>
              Enter the details of the new hostel below.
            </DialogDescription>
          </DialogHeader>
          <HostelForm
            colleges={colleges}
            onSubmit={handleAddSubmit}
            isLoading={addHostelMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Hostel Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Hostel</DialogTitle>
            <DialogDescription>
              Update the details of the hostel below.
            </DialogDescription>
          </DialogHeader>
          {currentHostel && (
            <HostelForm
              initialData={currentHostel}
              colleges={colleges}
              onSubmit={handleEditSubmit}
              isLoading={updateHostelMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Hostel Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the hostel "{currentHostel?.name}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteHostelMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default HostelsAdmin;
