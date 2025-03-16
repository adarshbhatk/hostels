import React from 'react';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Profile = () => {
  const { user, profile, signOut } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-xl text-muted-foreground">You are not signed in.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto py-16 px-6 mt-16">
        <Card className="max-w-lg mx-auto p-6">
          <CardContent className="space-y-6">
            <h1 className="text-3xl font-bold">Your Profile</h1>
            <div className="space-y-2">
              <p className="text-lg"><strong>Full Name:</strong> {profile?.fullName}</p>
              <p className="text-lg"><strong>Alias Name:</strong> {profile?.aliasName || 'Not set'}</p>
              <p className="text-lg"><strong>Email:</strong> {user.email}</p>
            </div>
            <Button
              onClick={signOut}
              className="w-full bg-hostel-600 hover:bg-hostel-700 text-white"
            >
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
