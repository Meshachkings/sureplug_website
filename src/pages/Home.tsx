import { useState } from 'react';
import SearchBar from '../components/SearchBar';
import ServiceCard from '../components/ServiceCard';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock data for featured services
  const featuredServices = [
    {
      id: '1',
      title: 'Home Cleaning',
      category: 'Cleaning',
      provider: 'CleanPro Services',
      rating: 4.8,
      price: '$80/hr',
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    },
    {
      id: '2',
      title: 'Plumbing Repair',
      category: 'Plumbing',
      provider: 'FixIt Plumbers',
      rating: 4.6,
      price: '$95/hr',
      image: 'https://images.unsplash.com/photo-1574359411659-11a4b39013b0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    },
    {
      id: '3',
      title: 'Electrical Installation',
      category: 'Electrical',
      provider: 'PowerUp Electricians',
      rating: 4.9,
      price: '$110/hr',
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    },
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // In a real app, you would navigate to search results page or filter results
    console.log('Searching for:', query);
  };

  return (
    <div className="home max-w-6xl mx-auto px-4 py-8">
      <div className="hero-section text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to SurePlug</h1>
        <p className="text-xl mb-8">Connect with trusted service providers in your area</p>
        
        <div className="search-container flex justify-center mb-8">
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>
      
      <div className="featured-services mb-12">
        <h2 className="text-2xl font-semibold mb-6">Popular Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredServices.map(service => (
            <ServiceCard key={service.id} {...service} />
          ))}
        </div>
      </div>
      
      <div className="how-it-works bg-gray-50 p-8 rounded-lg">
        <h2 className="text-2xl font-semibold mb-6 text-center">How It Works</h2>
        <div className="steps grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="step text-center">
            <div className="step-number bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Search</h3>
            <p className="text-gray-600">Find the service you need from our extensive directory</p>
          </div>
          <div className="step text-center">
            <div className="step-number bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Connect</h3>
            <p className="text-gray-600">Choose from verified providers with reviews and ratings</p>
          </div>
          <div className="step text-center">
            <div className="step-number bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Book</h3>
            <p className="text-gray-600">Schedule appointments and pay securely through our platform</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 