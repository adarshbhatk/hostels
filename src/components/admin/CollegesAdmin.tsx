
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
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
import { Plus, Pencil, Trash, Check, X } from 'lucide-react';
import { College } from '@/types';
import CollegeForm from './CollegeForm';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CollegesAdmin = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentCollege, setCurrentCollege] = useState<College | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  // Fetch colleges
  const { data: colleges, isLoading, error } = useQuery({
    queryKey: ['colleges', 'admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('colleges')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as College[];
    },
  });

  // Filter colleges based on active tab
  const filteredColleges = colleges?.filter(college => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return college.status === 'pending';
    if (activeTab === 'approved') return college.status === 'approved';
    return true;
  });

  // Add college mutation
  const addCollegeMutation = useMutation({
    mutationFn: async (newCollege: Omit<College, 'id' | 'created_at' | 'updated_at' | 'status'>) => {
      const { data, error } = await supabase
        .from('colleges')
        .insert({ ...newCollege, status: 'approved' })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colleges'] });
      setIsAddDialogOpen(false);
      toast({
        title: 'College Added',
        description: 'The college has been added successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to add college: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Update college mutation
  const updateCollegeMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<College> }) => {
      const { data: updatedData, error } = await supabase
        .from('colleges')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return updatedData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colleges'] });
      setIsEditDialogOpen(false);
      setCurrentCollege(null);
      toast({
        title: 'College Updated',
        description: 'The college has been updated successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update college: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Delete college mutation
  const deleteCollegeMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('colleges')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colleges'] });
      setIsDeleteDialogOpen(false);
      setCurrentCollege(null);
      toast({
        title: 'College Deleted',
        description: 'The college has been deleted successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to delete college: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Approve college mutation
  const approveCollegeMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('colleges')
        .update({ status: 'approved' })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colleges'] });
      toast({
        title: 'College Approved',
        description: 'The college has been approved successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to approve college: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Handle form submissions
  const handleAddSubmit = (data: Omit<College, 'id' | 'created_at' | 'updated_at' | 'status'>) => {
    console.log("Submitting college data:", data);
    addCollegeMutation.mutate(data, {
      onError: (error) => {
        console.error("Error adding college:", error);
      },
    });
  };

  const handleEditSubmit = (data: Omit<College, 'id' | 'created_at' | 'updated_at' | 'status'>) => {
    if (currentCollege) {
      updateCollegeMutation.mutate({
        id: currentCollege.id,
        data,
      });
    }
  };

  const handleDelete = () => {
    if (currentCollege) {
      deleteCollegeMutation.mutate(currentCollege.id);
    }
  };

  const handleApprove = (college: College) => {
    approveCollegeMutation.mutate(college.id);
  };

  // Open edit dialog
  const openEditDialog = (college: College) => {
    setCurrentCollege(college);
    setIsEditDialogOpen(true);
  };

  // Open delete dialog
  const openDeleteDialog = (college: College) => {
    setCurrentCollege(college);
    setIsDeleteDialogOpen(true);
  };

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-destructive">
            Error loading colleges: {(error as Error).message}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Colleges</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add College
        </Button>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Colleges</TabsTrigger>
          <TabsTrigger value="pending">
            Pending
            {colleges?.filter(c => c.status === 'pending').length > 0 && (
              <Badge variant="default" className="ml-2">
                {colleges?.filter(c => c.status === 'pending').length}
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
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[200px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      Loading colleges...
                    </TableCell>
                  </TableRow>
                ) : filteredColleges && filteredColleges.length > 0 ? (
                  filteredColleges.map((college) => (
                    <TableRow key={college.id}>
                      <TableCell className="font-medium">{college.name}</TableCell>
                      <TableCell>{college.location}</TableCell>
                      <TableCell>
                        <Badge variant={college.status === 'approved' ? 'default' : 'secondary'}>
                          {college.status === 'approved' ? 'Approved' : 'Pending'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {college.status === 'pending' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleApprove(college)}
                              className="text-green-600 border-green-600 hover:bg-green-50"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(college)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => openDeleteDialog(college)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      {activeTab === 'pending' 
                        ? 'No pending colleges found.' 
                        : activeTab === 'approved'
                          ? 'No approved colleges found.'
                          : 'No colleges found. Add a college to get started.'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Tabs>

      {/* Add College Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New College</DialogTitle>
            <DialogDescription>
              Enter the details of the new college below.
            </DialogDescription>
          </DialogHeader>
          <CollegeForm
            onSubmit={handleAddSubmit}
            isLoading={addCollegeMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Edit College Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit College</DialogTitle>
            <DialogDescription>
              Update the details of the college below.
            </DialogDescription>
          </DialogHeader>
          {currentCollege && (
            <CollegeForm
              initialData={currentCollege}
              onSubmit={handleEditSubmit}
              isLoading={updateCollegeMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete College Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the college "{currentCollege?.name}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteCollegeMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CollegesAdmin;
