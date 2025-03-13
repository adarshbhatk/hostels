
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
  { id: 1, name: 'Delhi University', location: 'New Delhi', hostelCount: 20 },
  { id: 2, name: 'IIT Bombay', location: 'Mumbai', hostelCount: 8 },
  { id: 3, name: 'Manipal University', location: 'Manipal', hostelCount: 10 },
  { id: 4, name: 'Jawaharlal Nehru University', location: 'New Delhi', hostelCount: 18 },
  { id: 5, name: 'VIT University', location: 'Vellore', hostelCount: 14 },
  { id: 6, name: 'Banaras Hindu University', location: 'Varanasi', hostelCount: 79 },
  { id: 7, name: 'BITS Pilani', location: 'Pilani', hostelCount: 9 },
  { id: 8, name: 'Christ University', location: 'Bangalore', hostelCount: 6 },
  { id: 9, name: 'NIT Trichy', location: 'Tiruchirappalli', hostelCount: 11 },
  { id: 10, name: 'IIT (BHU) Varanasi', location: 'Varanasi', hostelCount: 15 },
  { id: 11, name: 'IISc Bengaluru', location: 'Bengaluru', hostelCount: 10 },
  { id: 12, name: 'JNU', location: 'New Delhi', hostelCount: 18 },
  { id: 13, name: 'Jamia Millia Islamia', location: 'New Delhi', hostelCount: 10 },
  { id: 14, name: 'IIT Delhi', location: 'New Delhi', hostelCount: 13 },
  { id: 15, name: 'IIT Madras', location: 'Chennai', hostelCount: 20 },
  { id: 16, name: 'University of Delhi', location: 'New Delhi', hostelCount: 20 },
  { id: 17, name: 'Amrita Vishwa Vidyapeetham', location: 'Coimbatore', hostelCount: 8 },
  { id: 18, name: 'Aligarh Muslim University', location: 'Aligarh', hostelCount: 19 },
  { id: 19, name: 'Jadavpur University', location: 'Kolkata', hostelCount: 6 },
  { id: 20, name: 'Vellore Institute of Technology', location: 'Vellore', hostelCount: 14 },
  { id: 21, name: 'AIIMS New Delhi', location: 'New Delhi', hostelCount: 6 },
  { id: 22, name: 'PGIMER Chandigarh', location: 'Chandigarh', hostelCount: 4 },
  { id: 23, name: 'Christian Medical College', location: 'Vellore', hostelCount: 8 },
  { id: 24, name: 'NIMHANS Bengaluru', location: 'Bengaluru', hostelCount: 5 },
  { id: 25, name: 'JIPMER Puducherry', location: 'Puducherry', hostelCount: 6 },
  { id: 26, name: 'SGPGIMS Lucknow', location: 'Lucknow', hostelCount: 3 },
  { id: 27, name: 'Institute of Medical Sciences, BHU', location: 'Varanasi', hostelCount: 10 },
  { id: 28, name: 'Kasturba Medical College', location: 'Manipal', hostelCount: 7 },
  { id: 29, name: 'Madras Medical College', location: 'Chennai', hostelCount: 5 },
  { id: 30, name: 'NITK Surathkal', location: 'Surathkal', hostelCount: 12 },
  { id: 31, name: 'NIT Warangal', location: 'Warangal', hostelCount: 14 },
  { id: 32, name: 'NIT Calicut', location: 'Kozhikode', hostelCount: 10 },
  { id: 33, name: 'NIT Rourkela', location: 'Rourkela', hostelCount: 11 },
  { id: 34, name: 'NIT Durgapur', location: 'Durgapur', hostelCount: 9 },
  { id: 35, name: 'NIT Silchar', location: 'Silchar', hostelCount: 8 },
  { id: 36, name: 'NIT Hamirpur', location: 'Hamirpur', hostelCount: 7 },
  { id: 37, name: 'NIT Jamshedpur', location: 'Jamshedpur', hostelCount: 8 },
  { id: 38, name: 'NIT Kurukshetra', location: 'Kurukshetra', hostelCount: 10 },
  { id: 39, name: 'NIT Raipur', location: 'Raipur', hostelCount: 6 },
  { id: 40, name: 'NIT Meghalaya', location: 'Shillong', hostelCount: 4 },
  { id: 41, name: 'NIT Nagaland', location: 'Dimapur', hostelCount: 3 },
  { id: 42, name: 'NIT Arunachal Pradesh', location: 'Yupia', hostelCount: 3 },
  { id: 43, name: 'NIT Sikkim', location: 'Ravangla', hostelCount: 2 },
  { id: 44, name: 'NIT Mizoram', location: 'Aizawl', hostelCount: 2 },
  { id: 45, name: 'NIT Manipur', location: 'Imphal', hostelCount: 3 },
  { id: 46, name: 'NIT Uttarakhand', location: 'Srinagar', hostelCount: 3 },
  { id: 47, name: 'NIT Delhi', location: 'New Delhi', hostelCount: 2 },
  { id: 48, name: 'NIT Goa', location: 'Farmagudi', hostelCount: 2 },
  { id: 49, name: 'NIT Puducherry', location: 'Karaikal', hostelCount: 2 },
  { id: 50, name: 'NIT Andhra Pradesh', location: 'Tadepalligudem', hostelCount: 4 },
  { id: 51, name: 'IIT Kanpur', location: 'Kanpur', hostelCount: 12 },
  { id: 52, name: 'IIT Kharagpur', location: 'Kharagpur', hostelCount: 22 },
  { id: 53, name: 'IIT Roorkee', location: 'Roorkee', hostelCount: 14 },
  { id: 54, name: 'IIT Guwahati', location: 'Guwahati', hostelCount: 13 },
  { id: 55, name: 'NMAM Institute of Technology', location: 'Nitte', hostelCount: 5 },
  { id: 56, name: 'VCET Puttur', location: 'Dakshina Kannada', hostelCount: 3 },
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
