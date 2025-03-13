import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, Building, Users, BarChart4, Shield, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AnimatedCard from '@/components/ui/AnimatedCard';
import { Badge } from '@/components/ui/Badge';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  
  const features = [
    {
      icon: <Building className="h-6 w-6 text-hostel-600" />,
      title: 'Hostel Profiles',
      description: 'Detailed information about hostels including location, fees, amenities, and more.'
    },
    {
      icon: <Star className="h-6 w-6 text-hostel-600" />,
      title: 'Reviews & Ratings',
      description: 'Honest reviews and ratings from students who have lived in the hostels.'
    },
    {
      icon: <Search className="h-6 w-6 text-hostel-600" />,
      title: 'Search & Filters',
      description: 'Find the perfect hostel by filtering based on your preferences.'
    },
    {
      icon: <Users className="h-6 w-6 text-hostel-600" />,
      title: 'User Accounts',
      description: 'Create an account to share your own experiences and rate hostels.'
    },
    {
      icon: <BarChart4 className="h-6 w-6 text-hostel-600" />,
      title: 'Vote on Reviews',
      description: 'Upvote helpful reviews to make them more visible to other students.'
    },
    {
      icon: <Shield className="h-6 w-6 text-hostel-600" />,
      title: 'Moderation',
      description: 'All reviews are moderated to ensure accuracy and respectfulness.'
    },
  ];
  
  const metrics = [
    { value: '50+', label: 'Colleges' },
    { value: '200+', label: 'Hostels' },
    { value: '1,000+', label: 'Reviews' },
    { value: '10,000+', label: 'Students Helped' },
  ];
  
  const testimonials = [
    {
      quote: "Hostelwise helped me find the perfect hostel that fit my budget and preferences. The reviews were honest and accurate.",
      author: "Priya S.",
      role: "First Year Student, Delhi University"
    },
    {
      quote: "As someone moving to a new city, I was worried about accommodation. The detailed hostel profiles gave me all the information I needed.",
      author: "Rahul K.",
      role: "Computer Science, IIT Bombay"
    },
    {
      quote: "I wish this platform existed when I started college! Now I contribute reviews to help juniors make informed decisions.",
      author: "Ananya P.",
      role: "Final Year Student, Manipal University"
    },
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 lg:pt-40 pb-16 lg:pb-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <Badge 
            variant="primary" 
            size="md"
            className={`mb-6 mx-auto animate-fade-in ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          >
            Find your perfect college hostel
          </Badge>
          
          <h1 
            className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-tight md:leading-tight lg:leading-tight max-w-4xl mx-auto animate-fade-up ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          >
            Honest hostel reviews from{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-hostel-700 to-hostel-500">
              students who lived there
            </span>
          </h1>
          
          <p 
            className={`mt-6 text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-up ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          >
            Make informed decisions about your college accommodation with Hostelwise. Read honest reviews, see real photos, and get insights from students who've actually lived there.
          </p>
          
          <div 
            className={`mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          >
            <Button 
              asChild
              size="lg"
              className="bg-hostel-600 hover:bg-hostel-700 text-white min-w-[180px]"
            >
              <Link to="/colleges">
                Explore Hostels
              </Link>
            </Button>
            <Button 
              asChild
              size="lg"
              variant="outline"
              className="min-w-[180px]"
            >
              <Link to="/auth?tab=signup">
                Write a Review
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 lg:py-24 px-6 bg-gradient-to-b from-background to-hostel-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge 
              variant="primary" 
              size="md"
              className="mb-4 mx-auto"
            >
              Features
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold">
              Everything you need to make the right choice
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Hostelwise provides all the tools and information to help you find the perfect hostel for your college years.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <AnimatedCard 
                key={feature.title}
                animation="fade-up"
                delay={200 * (index + 1)}
                className="p-6"
                hoverEffect="lift"
              >
                <div className="h-12 w-12 rounded-full bg-hostel-100 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>
      
      {/* Metrics Section */}
      <section className="py-16 lg:py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-hostel-600 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-8 md:p-12 lg:p-16 text-white">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl lg:text-4xl font-bold">
                  Making college hostel decisions easier
                </h2>
                <p className="mt-4 text-hostel-100">
                  Join thousands of students who have used Hostelwise to find their perfect accommodation
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {metrics.map((metric, index) => (
                  <div 
                    key={metric.label} 
                    className="text-center"
                  >
                    <div className="text-4xl md:text-5xl font-bold mb-2">{metric.value}</div>
                    <div className="text-hostel-100">{metric.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 lg:py-24 px-6 bg-gradient-to-b from-background to-hostel-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge 
              variant="primary" 
              size="md"
              className="mb-4 mx-auto"
            >
              Testimonials
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold">
              What students are saying
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Hear from students who have found their perfect hostel through Hostelwise
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <AnimatedCard 
                key={index}
                animation="fade-up"
                delay={200 * (index + 1)}
                className="p-6"
                hoverEffect="lift"
              >
                <div className="mb-4 text-xl text-hostel-700">"</div>
                <p className="text-muted-foreground mb-6">
                  {testimonial.quote}
                </p>
                <div className="mt-auto">
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 lg:py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-2xl bg-gradient-to-r from-hostel-700 to-hostel-600 overflow-hidden shadow-xl">
            <div className="p-8 md:p-12 lg:p-16 text-white">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                  Ready to find your perfect hostel?
                </h2>
                <p className="text-lg text-hostel-100 mb-8">
                  Join Hostelwise today and make an informed decision about your college accommodation.
                </p>
                <Button 
                  asChild
                  size="lg"
                  variant="secondary"
                  className="min-w-[200px] bg-white text-hostel-700 hover:bg-hostel-50"
                >
                  <Link to="/auth?tab=signup" className="inline-flex items-center">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
