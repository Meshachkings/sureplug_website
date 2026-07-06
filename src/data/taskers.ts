export type Tasker = {
  id: string;
  name: string;
  role: string;
  category: string;
  tags: string[];
  image: string;
  rating: number;
  reviews: number;
  price: number;
  location: string;
  featured?: boolean;
  isPremium?: boolean;
  isVerified?: boolean;
};

export const taskerCategories = [
  'All',
  'Home Repair',
  'Cleaning',
  'Electrical',
  'Plumbing',
  'Moving',
  'Assembly',
] as const;

export const taskers: Tasker[] = [
  {
    id: 'paul-liam',
    name: 'Paul Liam',
    role: 'Welder',
    category: 'Home Repair',
    tags: ['Maintenance', 'Welding'],
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=280&fit=crop',
    rating: 4.5,
    reviews: 2023,
    price: 12000,
    location: 'Lagos',
    featured: true,
  },
  {
    id: 'bryan',
    name: 'Bryan',
    role: 'Electrician',
    category: 'Electrical',
    tags: ['Maintenance', 'Electricity'],
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=280&fit=crop',
    rating: 4.8,
    reviews: 1856,
    price: 15000,
    location: 'Abuja',
    featured: true,
  },
  {
    id: 'timi',
    name: 'Timi',
    role: 'Cleaner',
    category: 'Cleaning',
    tags: ['Cleaning', 'Organization'],
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=280&fit=crop',
    rating: 4.7,
    reviews: 1432,
    price: 4500,
    location: 'Lagos',
    featured: true,
  },
  {
    id: 'marcus',
    name: 'Marcus',
    role: 'Plumber',
    category: 'Plumbing',
    tags: ['Plumbing', 'Maintenance'],
    image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&h=280&fit=crop',
    rating: 4.6,
    reviews: 1678,
    price: 10000,
    location: 'Port Harcourt',
    featured: true,
  },
  {
    id: 'ada',
    name: 'Ada',
    role: 'Interior painter',
    category: 'Home Repair',
    tags: ['Decoration Services', 'Painting'],
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=280&fit=crop',
    rating: 4.9,
    reviews: 892,
    price: 8500,
    location: 'Lagos',
  },
  {
    id: 'emeka',
    name: 'Emeka',
    role: 'Furniture assembler',
    category: 'Assembly',
    tags: ['Assembly', 'Assistant'],
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=280&fit=crop',
    rating: 4.6,
    reviews: 1104,
    price: 6000,
    location: 'Ibadan',
  },
  {
    id: 'fatima',
    name: 'Fatima',
    role: 'Deep cleaner',
    category: 'Cleaning',
    tags: ['Cleaning', 'Deep Clean'],
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=280&fit=crop',
    rating: 4.8,
    reviews: 756,
    price: 5000,
    location: 'Kano',
  },
  {
    id: 'james',
    name: 'James',
    role: 'Moving helper',
    category: 'Moving',
    tags: ['Moving Assistance', 'Packing'],
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=280&fit=crop',
    rating: 4.4,
    reviews: 623,
    price: 7000,
    location: 'Abuja',
  },
  {
    id: 'kemi',
    name: 'Kemi',
    role: 'Handyman',
    category: 'Home Repair',
    tags: ['Maintenance', 'Repairs'],
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=280&fit=crop',
    rating: 4.7,
    reviews: 1340,
    price: 9000,
    location: 'Lagos',
  },
  {
    id: 'samuel',
    name: 'Samuel',
    role: 'AC technician',
    category: 'Electrical',
    tags: ['Electricity', 'AC Repair'],
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=280&fit=crop',
    rating: 4.5,
    reviews: 445,
    price: 11000,
    location: 'Enugu',
  },
  {
    id: 'grace',
    name: 'Grace',
    role: 'Organizer',
    category: 'Cleaning',
    tags: ['Organization', 'Cleaning'],
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=280&fit=crop',
    rating: 4.9,
    reviews: 512,
    price: 5500,
    location: 'Lagos',
  },
  {
    id: 'yusuf',
    name: 'Yusuf',
    role: 'Pipe fitter',
    category: 'Plumbing',
    tags: ['Plumbing', 'Pipe Fitting'],
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=280&fit=crop',
    rating: 4.3,
    reviews: 389,
    price: 9500,
    location: 'Kaduna',
  },
];

export const featuredTaskers = taskers.filter((tasker) => tasker.featured);
