
import { useSearchParams } from 'react-router-dom';
import AuthForm from '@/components/auth/AuthForm';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab') === 'signup' ? 'signup' : 'signin';
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center px-6 py-20 mt-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">
              {tab === 'signin' ? 'Welcome Back' : 'Create an Account'}
            </h1>
            <p className="text-muted-foreground mt-2">
              {tab === 'signin' 
                ? 'Sign in to access your account and reviews'
                : 'Join Hostelwise to share and read hostel reviews'
              }
            </p>
          </div>
          
          <AuthForm />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Auth;
