
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

const Admin = () => {
  const { user, profile, isLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isAdminLoading, setIsAdminLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdminLoading(false);
        return;
      }

      try {
        console.log("Checking admin status for user:", user.id);
        const { data, error } = await supabase
          .rpc('is_admin');
        
        if (error) {
          console.error('Error checking admin status:', error);
          throw error;
        }
        
        console.log("Admin status result:", data);
        setIsAdmin(data);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setIsAdminLoading(false);
      }
    };

    if (!isLoading) {
      checkAdminStatus();
    }
  }, [user, isLoading]);

  if (isLoading || isAdminLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-hostel-600 mx-auto" />
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

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
