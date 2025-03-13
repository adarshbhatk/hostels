
export interface College {
  id: number;
  name: string;
  location: string;
  hostelCount: number;
}

export interface Hostel {
  id: number;
  name: string;
  type: string;
  distance: string;
  capacity: number;
  rating: number;
  amenities: string[];
  description: string;
  rent: string;
}

// Mock data for colleges
export const mockColleges: College[] = [
  { id: 1, name: 'Delhi University', location: 'New Delhi', hostelCount: 12 },
  { id: 2, name: 'IIT Bombay', location: 'Mumbai', hostelCount: 8 },
  { id: 3, name: 'Manipal University', location: 'Manipal', hostelCount: 10 },
  { id: 4, name: 'Jawaharlal Nehru University', location: 'New Delhi', hostelCount: 15 },
  { id: 5, name: 'VIT University', location: 'Vellore', hostelCount: 14 },
  { id: 6, name: 'Banaras Hindu University', location: 'Varanasi', hostelCount: 7 },
  { id: 7, name: 'BITS Pilani', location: 'Pilani', hostelCount: 9 },
  { id: 8, name: 'Christ University', location: 'Bangalore', hostelCount: 6 },
];

// Mock data for the hostels
export const mockHostels: Hostel[] = [
  { 
    id: 1, 
    name: 'Jubilee Hall', 
    type: 'Boys', 
    distance: '1.2 km', 
    capacity: 200, 
    rating: 4.2,
    amenities: ['WiFi', 'Gym', 'Mess', 'Laundry'],
    description: 'One of the oldest and most prestigious hostels on campus, known for its community spirit and vibrant cultural activities.',
    rent: '₹8,000 - ₹12,000' 
  },
  { 
    id: 2, 
    name: 'Tagore Residency', 
    type: 'Girls', 
    distance: '0.8 km', 
    capacity: 150, 
    rating: 4.5,
    amenities: ['WiFi', 'Common Room', 'Mess', 'Library'],
    description: 'Modern facilities with a focus on academic environment. Offers single and double occupancy rooms with attached bathrooms.',
    rent: '₹10,000 - ₹15,000' 
  },
  { 
    id: 3, 
    name: 'Unity Block', 
    type: 'Co-ed', 
    distance: '0.5 km', 
    capacity: 300, 
    rating: 3.8,
    amenities: ['WiFi', 'Cafeteria', 'Study Rooms', 'Sports Facilities'],
    description: 'A large hostel complex with separate wings for male and female students. Features modern amenities and 24/7 security.',
    rent: '₹7,500 - ₹11,000' 
  },
  { 
    id: 4, 
    name: 'Lakeside Residence', 
    type: 'Girls', 
    distance: '1.5 km', 
    capacity: 180, 
    rating: 4.7,
    amenities: ['WiFi', 'AC Rooms', 'Mess', 'Gym', 'Swimming Pool'],
    description: 'Premium accommodation with scenic views. Each floor has dedicated common areas and modern kitchen facilities.',
    rent: '₹12,000 - ₹18,000' 
  },
  { 
    id: 5, 
    name: 'Heritage Towers', 
    type: 'Boys', 
    distance: '0.3 km', 
    capacity: 250, 
    rating: 4.0,
    amenities: ['WiFi', 'Mess', 'Reading Room', 'Indoor Games'],
    description: 'Traditional hostel with a rich history. Known for its cultural events and student-led initiatives.',
    rent: '₹6,000 - ₹9,000' 
  },
  { 
    id: 6, 
    name: 'Sunrise Block', 
    type: 'Co-ed', 
    distance: '0.7 km', 
    capacity: 220, 
    rating: 4.3,
    amenities: ['WiFi', 'Cafeteria', 'Laundry', 'Recreation Room'],
    description: 'Modern hostel with emphasis on community living. Features spacious rooms and well-maintained common areas.',
    rent: '₹9,000 - ₹14,000' 
  },
];
