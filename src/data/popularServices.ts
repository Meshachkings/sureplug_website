export type PopularService = {
  id: string;
  title: string;
  price: number;
  image: string;
  tags: string[];
};

export const popularServices: PopularService[] = [
  {
    id: 'home-maintenance',
    title: 'Home Maintenance',
    price: 5000,
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&h=800&fit=crop',
    tags: ['Furniture Installation', 'Repair', 'Plumbing'],
  },
  {
    id: 'moving-delivery',
    title: 'Moving & Delivery',
    price: 7000,
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=800&fit=crop',
    tags: ['Packing', 'Delivery', 'Loading'],
  },
  {
    id: 'outdoor-services',
    title: 'Outdoor Services',
    price: 4500,
    image: 'https://images.unsplash.com/photo-1595846519845-68e298c2edd8?w=600&h=800&fit=crop',
    tags: ['Lawn Care', 'Gardening', 'Landscaping'],
  },
  {
    id: 'cleaning',
    title: 'Cleaning Services',
    price: 4500,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=800&fit=crop',
    tags: ['Deep Clean', 'Organization', 'Laundry'],
  },
  {
    id: 'electrical',
    title: 'Electrical Work',
    price: 12000,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&h=800&fit=crop',
    tags: ['Wiring', 'AC Repair', 'Installation'],
  },
  {
    id: 'assembly',
    title: 'Furniture Assembly',
    price: 6000,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=800&fit=crop',
    tags: ['Flat-pack', 'Mounting', 'Setup'],
  },
];
