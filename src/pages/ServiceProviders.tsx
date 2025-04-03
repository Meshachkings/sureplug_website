import { useState } from 'react';
import SearchBar from '../components/SearchBar';
import ProviderCard from '../components/ProviderCard';

const ServiceProviders = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock data for service providers
  const providers = [
    {
      id: '1',
      name: 'John Smith',
      profession: 'Plumber',
      rating: 4.8,
      reviews: 124,
      location: 'New York, NY',
      image: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      profession: 'Electrician',
      rating: 4.9,
      reviews: 89,
      location: 'Brooklyn, NY',
      image: 'https://randomuser.me/api/portraits/women/2.jpg',
    },
    {
      id: '3',
      name: 'Michael Brown',
      profession: 'House Cleaner',
      rating: 4.7,
      reviews: 56,
      location: 'Queens, NY',
      image: 'https://randomuser.me/api/portraits/men/3.jpg',
    },
    {
      id: '4',
      name: 'Jessica Williams',
      profession: 'Painter',
      rating: 4.5,
      reviews: 42,
      location: 'Bronx, NY',
      image: 'https://randomuser.me/api/portraits/women/4.jpg',
    },
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // In a real app, you would filter providers based on the search query
    console.log('Searching for providers:', query);
  };

  return (
    <div className="service-providers max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Find Service Providers</h1>
      
      <div className="search-filters mb-8">
        <SearchBar onSearch={handleSearch} />
        
        <div className="filters mt-4 flex flex-wrap gap-4">
          <select className="border rounded px-3 py-2">
            <option value="">All Categories</option>
            <option value="plumbing">Plumbing</option>
            <option value="electrical">Electrical</option>
            <option value="cleaning">Cleaning</option>
            <option value="painting">Painting</option>
          </select>
          
          <select className="border rounded px-3 py-2">
            <option value="">Sort By</option>
            <option value="rating">Highest Rating</option>
            <option value="reviews">Most Reviews</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
          </select>
        </div>
      </div>
      
      <div className="providers-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {providers.map(provider => (
          <ProviderCard key={provider.id} {...provider} />
        ))}
      </div>
    </div>
  );
};

export default ServiceProviders; 