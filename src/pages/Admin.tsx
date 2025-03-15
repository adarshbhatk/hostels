
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import CollegesAdmin from '@/components/admin/CollegesAdmin';
import HostelsAdmin from '@/components/admin/HostelsAdmin';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

const Admin = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isAdminLoading, setIsAdminLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Admin page mounted");
    console.log("Auth loading:", authLoading);
    console.log("User:", user);
    
    const checkAdminStatus = async () => {
      if (!user) {
        console.log("No user, setting admin loading to false");
        setIsAdminLoading(false);
        return;
      }

      console.log("Checking admin status for user:", user.id);
      setLoadingError(null);
      
      try {
        // Simple direct query approach
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching profile:', error);
          setLoadingError(`Failed to check admin status: ${error.message}`);
          setIsAdmin(false);
          setIsAdminLoading(false);
          return;
        }
        
        console.log("Profile data retrieved:", data);
        
        if (!data) {
          console.log("No profile found for user");
          setIsAdmin(false);
          setIsAdminLoading(false);
          return;
        }
        
        // Check if the user has the admin role
        const userIsAdmin = data.role === 'admin';
        console.log("Is user admin?", userIsAdmin);
        
        setIsAdmin(userIsAdmin);
      } catch (error) {
        console.error('Unexpected error checking admin status:', error);
        setLoadingError(`An unexpected error occurred: ${(error as Error).message}`);
        setIsAdmin(false);
      } finally {
        console.log("Setting admin loading to false");
        setIsAdminLoading(false);
      }
    };

    if (!authLoading) {
      console.log("Auth loading complete, checking admin status");
      checkAdminStatus();
    }
  }, [user, authLoading]);

  console.log("Admin page render state:", { authLoading, isAdminLoading, isAdmin, user: !!user });

  // If authentication is still loading, show loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-hostel-600 mx-auto" />
            <p className="mt-4 text-muted-foreground">Loading authentication...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    console.log("No user, redirecting to auth");
    return <Navigate to="/auth" replace />;
  }

  // If we're still checking admin status
  if (isAdminLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-hostel-600 mx-auto" />
            <p className="mt-4 text-muted-foreground">Verifying admin privileges...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // If there was an error loading admin status
  if (loadingError) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center p-6">
          <Alert variant="destructive" className="max-w-md">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {loadingError}
            </AlertDescription>
          </Alert>
        </main>
        <Footer />
      </div>
    );
  }

  // If not an admin, show access denied
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center p-6">
          <Alert variant="destructive" className="max-w-md">
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
              You don't have permission to access the admin panel. Please contact an administrator if you believe this is an error.
            </AlertDescription>
          </Alert>
        </main>
        <Footer />
      </div>
    );
  }

  // If we get here, the user is authenticated and is an admin
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto py-16 px-6 mt-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-muted-foreground mt-2">
            Manage colleges and hostels in the system
          </p>
        </div>
        
        <Tabs defaultValue="colleges" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="colleges">Colleges</TabsTrigger>
            <TabsTrigger value="hostels">Hostels</TabsTrigger>
          </TabsList>
          
          <TabsContent value="colleges" className="mt-0">
            <CollegesAdmin />
          </TabsContent>
          
          <TabsContent value="hostels" className="mt-0">
            <HostelsAdmin />
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default Admin;
