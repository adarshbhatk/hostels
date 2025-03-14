
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { Checkbox } from '@/components/ui/checkbox';

const AuthForm = () => {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') === 'signup' ? 'signup' : 'signin';
  const [currentTab, setCurrentTab] = useState(defaultTab);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [signinData, setSigninData] = useState({
    email: '',
    password: ''
  });
  
  const [signupData, setSignupData] = useState({
    fullName: '',
    aliasName: '',
    email: '',
    password: '',
    confirmPassword: '',
    useAliasForReviews: false
  });
  
  // Check if user is already signed in on component mount
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/');
      }
    };
    
    checkSession();
    
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          navigate('/');
        }
      }
    );
    
    return () => {
      subscription?.unsubscribe();
    };
  }, [navigate]);
  
  const handleSigninSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: signinData.email,
        password: signinData.password
      });
      
      if (error) {
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Signed in successfully",
          description: "Welcome back to Hostelwise!"
        });
        navigate('/');
      }
    } catch (error: any) {
      toast({
        title: "An error occurred",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please ensure that both passwords match.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
        options: {
          data: {
            full_name: signupData.fullName,
            alias_name: signupData.aliasName || null,
            use_alias_for_reviews: signupData.useAliasForReviews
          }
        }
      });
      
      if (error) {
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Account created",
          description: data.user?.identities?.length === 0 
            ? "An account with this email already exists. Please sign in instead."
            : "Your account has been created successfully. Please check your email to confirm your registration."
        });
        
        if (data.user?.identities?.length === 0) {
          setCurrentTab('signin');
        }
      }
    } catch (error: any) {
      toast({
        title: "An error occurred",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const updateSigninData = (field: string, value: string) => {
    setSigninData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const updateSignupData = (field: string, value: any) => {
    setSignupData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  
  return (
    <div className="w-full max-w-md mx-auto">
      <Tabs 
        defaultValue={defaultTab} 
        value={currentTab} 
        onValueChange={setCurrentTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="signin">Sign In</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        
        <TabsContent value="signin" className="animate-fade-up">
          <form onSubmit={handleSigninSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="signin-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="signin-email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10"
                  value={signinData.email}
                  onChange={(e) => updateSigninData('email', e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="signin-password">Password</Label>
                <a 
                  href="#" 
                  className="text-xs text-hostel-600 hover:text-hostel-700 transition-colors"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="signin-password"
                  type={isPasswordVisible ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  value={signinData.password}
                  onChange={(e) => updateSigninData('password', e.target.value)}
                  required
                />
                <button 
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={togglePasswordVisibility}
                  tabIndex={-1}
                >
                  {isPasswordVisible ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-hostel-600 hover:bg-hostel-700 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </TabsContent>
        
        <TabsContent value="signup" className="animate-fade-up">
          <form onSubmit={handleSignupSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="signup-fullname">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="signup-fullname"
                  type="text"
                  placeholder="John Doe"
                  className="pl-10"
                  value={signupData.fullName}
                  onChange={(e) => updateSignupData('fullName', e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="signup-aliasname">Alias Name (Optional)</Label>
              <div className="relative">
                <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="signup-aliasname"
                  type="text"
                  placeholder="HostelReviewer123"
                  className="pl-10"
                  value={signupData.aliasName}
                  onChange={(e) => updateSignupData('aliasName', e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox 
                  id="use-alias" 
                  checked={signupData.useAliasForReviews}
                  onCheckedChange={(checked) => 
                    updateSignupData('useAliasForReviews', checked)
                  }
                />
                <label
                  htmlFor="use-alias"
                  className="text-sm text-muted-foreground"
                >
                  Use alias name for reviews instead of real name
                </label>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="signup-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="signup-email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10"
                  value={signupData.email}
                  onChange={(e) => updateSignupData('email', e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="signup-password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="signup-password"
                  type={isPasswordVisible ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  value={signupData.password}
                  onChange={(e) => updateSignupData('password', e.target.value)}
                  required
                />
                <button 
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={togglePasswordVisibility}
                  tabIndex={-1}
                >
                  {isPasswordVisible ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Password must be at least 8 characters long
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="signup-confirm-password">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="signup-confirm-password"
                  type={isPasswordVisible ? "text" : "password"}
                  placeholder="••••••••"
                  className={cn(
                    "pl-10 pr-10",
                    signupData.confirmPassword && 
                    signupData.password !== signupData.confirmPassword ? 
                    "border-red-500 focus-visible:ring-red-500" : ""
                  )}
                  value={signupData.confirmPassword}
                  onChange={(e) => updateSignupData('confirmPassword', e.target.value)}
                  required
                />
              </div>
              {signupData.confirmPassword && 
               signupData.password !== signupData.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">
                  Passwords don't match
                </p>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-hostel-600 hover:bg-hostel-700 text-white"
              disabled={isSubmitting || (signupData.password !== signupData.confirmPassword && signupData.confirmPassword !== "")}
            >
              {isSubmitting ? "Creating account..." : "Create Account"}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
      
      <div className="mt-8 pt-6 text-center border-t border-border">
        <p className="text-sm text-muted-foreground">
          {currentTab === 'signin' ? (
            <>
              Don't have an account?{' '}
              <button 
                className="text-hostel-600 hover:text-hostel-700 font-medium transition-colors"
                onClick={() => setCurrentTab('signup')}
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button 
                className="text-hostel-600 hover:text-hostel-700 font-medium transition-colors"
                onClick={() => setCurrentTab('signin')}
              >
                Sign in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
