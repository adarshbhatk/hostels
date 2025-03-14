
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge"; 
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowRight, School, UserPlus, UserCheck, Star } from "lucide-react";
import AnimatedCard from "@/components/ui/AnimatedCard";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center md:max-w-4xl md:mx-auto">
              <Badge variant="default" className="mb-6">
                Find The Perfect Hostel For Your College
              </Badge>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
                <span className="text-primary">Review &amp; Discover</span> College Hostels in India
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-8 md:mb-10">
                Hostelwise helps you find the best hostel for your college stay through authentic reviews, photos, and detailed information about facilities.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link to="/colleges">
                    Browse Colleges <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                
                <Button variant="outline" size="lg" asChild>
                  <Link to="/auth?tab=signup">
                    Create Account
                  </Link>
                </Button>
              </div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 md:mt-20">
              {[
                { count: '500+', label: 'Hostels', icon: School },
                { count: '50+', label: 'Colleges', icon: School },
                { count: '10K+', label: 'Reviews', icon: Star },
                { count: '15K+', label: 'Users', icon: UserCheck },
              ].map((stat, index) => (
                <Card key={index} className="text-center p-6">
                  <CardContent className="p-0">
                    <div className="flex justify-center mb-2">
                      <stat.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold">{stat.count}</h3>
                    <p className="text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* How It Works */}
        <section className="py-16 md:py-24 px-6 bg-muted/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How Hostelwise Works</h2>
              <p className="text-muted-foreground md:text-lg max-w-2xl mx-auto">
                Simple steps to find your ideal hostel and make informed decisions
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Browse Hostels',
                  description: 'Explore hostels by college, location, or facilities that matter to you.',
                  icon: School,
                  delay: 0.1
                },
                {
                  title: 'Read Authentic Reviews',
                  description: 'Get insights from current and former residents about their hostel experience.',
                  icon: Star,
                  delay: 0.3
                },
                {
                  title: 'Share Your Experience',
                  description: 'Help others by posting your own reviews and photos of your hostel.',
                  icon: UserPlus,
                  delay: 0.5
                }
              ].map((step, index) => (
                <AnimatedCard
                  key={index}
                  title={step.title}
                  description={step.description}
                  icon={<step.icon className="h-10 w-10" />}
                  delay={step.delay}
                />
              ))}
            </div>
          </div>
        </section>
        
        {/* Featured Colleges */}
        <section className="py-16 md:py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Colleges</h2>
              <p className="text-muted-foreground md:text-lg max-w-2xl mx-auto">
                Discover top colleges and their hostels
              </p>
            </div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.5, staggerChildren: 0.1 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {[
                { name: 'IIT Delhi', location: 'New Delhi', hostels: 15 },
                { name: 'IIT Bombay', location: 'Mumbai', hostels: 18 },
                { name: 'IIT Madras', location: 'Chennai', hostels: 20 },
                { name: 'BITS Pilani', location: 'Pilani', hostels: 12 },
                { name: 'NIT Trichy', location: 'Tiruchirappalli', hostels: 10 },
                { name: 'IIIT Hyderabad', location: 'Hyderabad', hostels: 8 },
                { name: 'Delhi University', location: 'New Delhi', hostels: 25 },
                { name: 'VIT Vellore', location: 'Vellore', hostels: 22 },
              ].map((college, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <h3 className="font-bold text-lg mb-2">{college.name}</h3>
                      <p className="text-muted-foreground text-sm">{college.location}</p>
                      <p className="text-sm mt-2">{college.hostels} hostels</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
            
            <div className="text-center mt-10">
              <Button variant="outline" size="lg" asChild>
                <Link to="/colleges">
                  View All Colleges <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* CTA */}
        <section className="py-16 md:py-24 px-6 bg-primary text-primary-foreground">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to find your ideal hostel?</h2>
            <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of students who've used Hostelwise to make informed decisions about their accommodation.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/auth?tab=signup">
                  Create Free Account <UserPlus className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              
              <Button variant="outline" size="lg" className="bg-transparent" asChild>
                <Link to="/colleges">
                  Browse Colleges
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
