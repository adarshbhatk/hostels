
import { Wifi, Utensils, Tv, Home, Coffee, Layers, Heart, Bath, Shirt, DoorOpen, Plug, UtensilsCrossed } from "lucide-react";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/Badge"; // Fixed the casing to match existing project imports

interface HostelAmenitiesProps {
  amenities: {
    wifi: boolean;
    ac: boolean;
    tv: boolean;
    food: boolean;
    laundry: boolean;
    medical: boolean;
    gym: boolean;
    bathroom: boolean;
    cafeteria: boolean;
    general: string[];
  };
}

const HostelAmenities = ({ amenities }: HostelAmenitiesProps) => {
  // Motion variants for animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Helper to render amenity icons with consistent styling
  const renderAmenity = (
    title: string, 
    available: boolean, 
    Icon: typeof Wifi,
    description: string = ""
  ) => {
    return (
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div 
              variants={itemVariants} 
              className={`flex flex-col items-center justify-center p-4 rounded-lg border ${
                available 
                  ? "bg-primary/5 border-primary/20" 
                  : "bg-muted border-muted-foreground/20"
              }`}
            >
              <Icon 
                className={`h-8 w-8 mb-2 ${
                  available ? "text-primary" : "text-muted-foreground/40"
                }`} 
              />
              <span 
                className={`text-sm font-medium ${
                  available ? "" : "text-muted-foreground/60"
                }`}
              >
                {title}
              </span>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{available ? description || `${title} available` : `${title} not available`}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div className="space-y-6 mb-10">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Amenities</h2>
        
        <Button variant="outline" size="sm">
          Report incorrect info
        </Button>
      </div>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4"
      >
        {renderAmenity("WiFi", amenities.wifi, Wifi, "WiFi connectivity is available")}
        {renderAmenity("AC Rooms", amenities.ac, Layers, "Rooms are air conditioned")}
        {renderAmenity("TV Room", amenities.tv, Tv, "Common television room available")}
        {renderAmenity("Mess", amenities.food, Utensils, "Mess facility is available")}
        {renderAmenity("Laundry", amenities.laundry, Shirt, "Laundry services are available")}
        {renderAmenity("Medical", amenities.medical, Heart, "Medical facilities are available")}
        {renderAmenity("Gym", amenities.gym, Home, "Gym facility is available")}
        {renderAmenity("Attached Bathroom", amenities.bathroom, Bath, "Rooms have attached bathrooms")}
        {renderAmenity("Cafeteria", amenities.cafeteria, Coffee, "Cafeteria is available")}
        {renderAmenity("Power Backup", true, Plug, "Power backup is available")}
        {renderAmenity("Dining Room", true, UtensilsCrossed, "Dining facility is available")}
        {renderAmenity("Entry/Exit", true, DoorOpen, "24/7 Entry/Exit available")}
      </motion.div>
      
      {amenities.general.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-3">Other Amenities</h3>
          <div className="flex flex-wrap gap-2">
            {amenities.general.map((item, index) => (
              <Badge key={index} variant="outline" className="px-3 py-1">
                {item}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HostelAmenities;
