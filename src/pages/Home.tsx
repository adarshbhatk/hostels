
import React from 'react';
import { ArrowRight, Building, Sparkles, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import AnimatedCard from '@/components/ui/AnimatedCard';

const Home = () => {
  const features = [
    {
      id: 1,
      heading: 'Find the Perfect Hostel',
      description: 'Browse hostels based on location, price, and amenities that matter to you.',
      icon: <Building className="h-10 w-10 text-hostel-600" />,
      delay: 100
    },
    {
      id: 2,
      heading: 'Read Honest Reviews',
      description: 'Learn from other students about real hostel experiences.',
      icon: <Sparkles className="h-10 w-10 text-hostel-600" />,
      delay: 300
    },
    {
      id: 3,
      heading: 'Make Informed Decisions',
      description: 'Compare hostels side by side to find the perfect place to call home.',
      icon: <Search className="h-10 w-10 text-hostel-600" />,
      delay: 500
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-hostel-50 to-background pt-16 pb-24 md:pt-24 md:pb-32">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-12 md:mb-0">
              <Badge
                variant="primary"
                className="mb-6"
                size="md"
              >
                Launching Soon
              </Badge>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Find Your Perfect College&nbsp;
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-hostel-700 to-hostel-500">
                  Hostel
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg">
                Compare hostels, read reviews from fellow students, and find the perfect home for your college years.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg">
                  <Link to="/colleges">
                    Browse Colleges
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                
                <Button variant="outline" size="lg">
                  <Link to="/about">
                    Learn More
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="md:w-1/2">
              <div className="relative">
                <img 
                  src="https://placehold.co/800x600/hostel/white?text=Hostel+Hero+Image" 
                  alt="Students in hostel" 
                  className="rounded-lg shadow-xl" 
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 md:py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <Badge variant="primary" className="mb-4">
                Our Features
              </Badge>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Everything you need to find the right hostel
              </h2>
              
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We help students make one of their most important decisions: where they'll live during their college years.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature) => (
                <AnimatedCard
                  key={feature.id}
                  className="p-6"
                  delay={feature.delay}
                  animation="fade-up"
                  hoverEffect="lift"
                >
                  <div className="mb-4 p-3 bg-hostel-50 rounded-full w-fit">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.heading}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;
