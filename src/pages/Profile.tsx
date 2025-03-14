
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, AtSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const Profile = () => {
  const { user, profile, updateProfile, isLoading } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: profile?.full_name || '',
    aliasName: profile?.alias_name || '',
  });
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hostel-600"></div>
      </div>
    );
  }
  
  if (!user) {
    navigate('/auth');
    return null;
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      await updateProfile({
        full_name: formData.fullName,
        alias_name: formData.aliasName || null,
      });
    } catch (error) {
      // Error is handled in updateProfile
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  return (
    <div className="container max-w-4xl mx-auto px-4 py-20 min-h-screen">
      <h1 className="text-3xl font-bold mb-10">Profile Settings</h1>
      
      <div className="grid gap-8 md:grid-cols-[300px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>View and manage your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-muted rounded-full h-16 w-16 flex items-center justify-center">
                <User className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">{profile?.full_name || 'User'}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
            <CardDescription>Update your name and display preferences</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    name="fullName"
                    placeholder="Your full name"
                    className="pl-10"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  This is the name that will appear on your account
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="aliasName">Alias Name (Optional)</Label>
                <div className="relative">
                  <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="aliasName"
                    name="aliasName"
                    placeholder="Your alias name for reviews"
                    className="pl-10"
                    value={formData.aliasName}
                    onChange={handleChange}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  This name will be used when you post reviews if you prefer to remain anonymous
                </p>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-end">
              <Button
                type="submit"
                className="bg-hostel-600 hover:bg-hostel-700 text-white"
                disabled={isUpdating}
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
