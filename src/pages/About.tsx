import { Building, Star, Search, Shield, Users, Clock } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AnimatedCard from '@/components/ui/AnimatedCard';
import { Badge } from '@/components/ui/Badge';

const About = () => {
  const mission = [
    {
      icon: <Building className="h-6 w-6 text-hostel-600" />,
      title: 'Transparency',
      description: 'We aim to bring transparency to college hostel conditions through honest reviews and accurate information.'
    },
    {
      icon: <Star className="h-6 w-6 text-hostel-600" />,
      title: 'Student Empowerment',
      description: 'We empower students to make informed decisions about their college accommodation.'
    },
    {
      icon: <Search className="h-6 w-6 text-hostel-600" />,
      title: 'Accountability',
      description: 'We hold hostel management accountable by making hostel conditions publicly known.'
    },
  ];
  
  const values = [
    {
      icon: <Shield className="h-6 w-6 text-hostel-600" />,
      title: 'Integrity',
      description: 'We maintain the highest standards of accuracy and honesty in all reviews and information.'
    },
    {
      icon: <Users className="h-6 w-6 text-hostel-600" />,
      title: 'Community',
      description: 'We foster a supportive community of students helping each other make important decisions.'
    },
    {
      icon: <Clock className="h-6 w-6 text-hostel-600" />,
      title: 'Relevance',
      description: "We ensure all information is current and relevant to today's students and their needs."
    },
  ];
  
  const team = [
    {
      name: 'Adarsh K',
      role: 'Founder & CEO',
      bio: 'Former college student who experienced the challenges of deciding between hostel and PG accommodation firsthand.'
    },
    {
      name: 'Lovable AI',
      role: 'Founding Engineer',
      bio: 'Superhuman full stack engineer focused on creating intuitive user experiences and reliable platforms.'
    },
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24">
        {/* Hero Section */}
        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <Badge 
              variant="default"
              className="mb-6 mx-auto"
            >
              Our Story
            </Badge>
            
            <h1 className="text-4xl md:text-5xl font-bold max-w-3xl mx-auto">
              Making hostel decisions easier for 
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-hostel-700 to-hostel-500">
                {' '}every student
              </span>
            </h1>
            
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Hostelwise was founded with a simple mission: to help students make informed decisions about their college accommodation through honest reviews and detailed information.
            </p>
          </div>
        </section>
        
        {/* Mission Section */}
        <section className="py-16 px-6 bg-gradient-to-b from-background to-hostel-50/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <Badge 
                variant="default"
                className="mb-4 mx-auto"
              >
                Our Mission
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold">
                Why we built Hostelwise
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                We're on a mission to transform how students choose their college accommodation
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {mission.map((item, index) => (
                <AnimatedCard 
                  key={item.title}
                  animation="fade-up"
                  delay={200 * (index + 1)}
                  className="p-6"
                  hoverEffect="lift"
                >
                  <div className="h-12 w-12 rounded-full bg-hostel-100 flex items-center justify-center mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </section>
        
        {/* Values Section */}
        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <Badge 
                variant="default"
                className="mb-4 mx-auto"
              >
                Our Values
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold">
                What guides us
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                These core principles inform everything we do at Hostelwise
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((item, index) => (
                <AnimatedCard 
                  key={item.title}
                  animation="fade-up"
                  delay={200 * (index + 1)}
                  className="p-6"
                  hoverEffect="lift"
                >
                  <div className="h-12 w-12 rounded-full bg-hostel-100 flex items-center justify-center mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </section>
        
        {/* Team Section */}
        <section className="py-16 px-6 bg-gradient-to-b from-background to-hostel-50/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <Badge 
                variant="default"
                className="mb-4 mx-auto"
              >
                Our Team
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold">
                Meet the people behind Hostelwise
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                A passionate team dedicated to improving the student accommodation experience
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 justify-items-center max-w-4xl mx-auto">
              {team.map((member, index) => (
                <AnimatedCard 
                  key={member.name}
                  animation="fade-up"
                  delay={200 * (index + 1)}
                  className="p-6"
                  hoverEffect="lift"
                >
                  <div className="w-20 h-20 bg-hostel-100 rounded-full mb-4 flex items-center justify-center text-2xl text-hostel-600 font-bold">
                    {member.name.charAt(0)}
                  </div>
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-hostel-600 text-sm mb-3">{member.role}</p>
                  <p className="text-muted-foreground">{member.bio}</p>
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

export default About;
