
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
import { Plus, Pencil, Trash, Check } from 'lucide-react';
import { Hostel, College } from '@/types';
import HostelForm from './HostelForm';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const HostelsAdmin = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentHostel, setCurrentHostel] = useState<Hostel | null>(null);
  const [activeTab, setActiveTab] = useState('all');

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
    queryKey: ['hostels', 'admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hostels')
        .select(`
          *,
          colleges:college_id (name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as (Hostel & { colleges: { name: string } })[];
    },
  });

  // Filter hostels based on active tab
  const filteredHostels = hostels?.filter(hostel => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return hostel.status === 'pending';
    if (activeTab === 'approved') return hostel.status === 'approved';
    return true;
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

  // Approve hostel mutation
  const approveHostelMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('hostels')
        .update({ status: 'approved' })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hostels'] });
      toast({
        title: 'Hostel Approved',
        description: 'The hostel has been approved successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to approve hostel: ${error.message}`,
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

  const handleApprove = (hostel: Hostel) => {
    approveHostelMutation.mutate(hostel.id);
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

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Hostels</TabsTrigger>
          <TabsTrigger value="pending">
            Pending
            {hostels?.filter(h => h.status === 'pending').length > 0 && (
              <Badge variant="default" className="ml-2">
                {hostels?.filter(h => h.status === 'pending').length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
        </TabsList>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>College</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
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
                ) : filteredHostels && filteredHostels.length > 0 ? (
                  filteredHostels.map((hostel) => (
                    <TableRow key={hostel.id}>
                      <TableCell className="font-medium">{hostel.name}</TableCell>
                      <TableCell>{hostel.colleges.name}</TableCell>
                      <TableCell>{hostel.type}</TableCell>
                      <TableCell>
                        <Badge variant={hostel.status === 'approved' ? 'default' : 'secondary'}>
                          {hostel.status === 'approved' ? 'Approved' : 'Pending'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {hostel.status === 'pending' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleApprove(hostel)}
                              className="text-green-600 border-green-600 hover:bg-green-50"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
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
                      {activeTab === 'pending' 
                        ? 'No pending hostels found.' 
                        : activeTab === 'approved'
                          ? 'No approved hostels found.'
                          : 'No hostels found. Add a hostel to get started.'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Tabs>

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
