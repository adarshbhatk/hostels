import { Link } from 'react-router-dom';
import { ArrowRight, Github, Twitter, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
const Footer = () => {
  const currentYear = new Date().getFullYear();
  return <footer className="bg-background border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4 md:col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <span className="font-display text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-hostel-700 to-hostel-500">
                Hostelwise
              </span>
            </Link>
            
            <p className="text-muted-foreground max-w-md">
              Helping students make informed decisions about their college accommodation through honest reviews and detailed information.
            </p>
            
            <div className="flex space-x-4 pt-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Twitter">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="GitHub">
                <Github size={18} />
              </a>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-display font-medium text-sm uppercase tracking-wider text-muted-foreground">
              Explore
            </h4>
            <ul className="space-y-3">
              {['Home', 'About', 'Colleges', 'FAQs'].map(item => {})}
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-display font-medium text-sm uppercase tracking-wider text-muted-foreground">
              Legal
            </h4>
            <ul className="space-y-3">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(item => <li key={item}>
                  <Link to="#" className="text-muted-foreground hover:text-hostel-600 transition-colors text-sm">
                    {item}
                  </Link>
                </li>)}
            </ul>
            
            <div className="pt-4">
              <Button asChild variant="outline" size="sm" className="w-full flex items-center justify-between">
                <Link to="/auth?tab=signup">
                  <span>Join the community</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © {currentYear} Hostelwise. All rights reserved.
          </p>
          <p className="text-muted-foreground text-sm flex items-center">
            Made with <Heart className="h-3 w-3 mx-1 text-red-500" /> in India
          </p>
        </div>
      </div>
    </footer>;
};
export default Footer;