interface ProviderCardProps {
  id: string;
  name: string;
  profession: string;
  rating: number;
  reviews: number;
  location: string;
  image: string;
}

const ProviderCard = ({ name, profession, rating, reviews, location, image }: ProviderCardProps) => {
  return (
    <div className="provider-card border rounded-lg overflow-hidden shadow-md p-4">
      <div className="flex items-center">
        <img 
          src={image} 
          alt={name} 
          className="w-16 h-16 rounded-full object-cover mr-4" 
        />
        <div>
          <h3 className="text-lg font-semibold">{name}</h3>
          <p className="text-sm text-gray-600">{profession}</p>
        </div>
      </div>
      
      <div className="mt-3">
        <div className="flex items-center">
          <span className="text-yellow-500">★</span>
          <span className="ml-1">{rating.toFixed(1)} ({reviews} reviews)</span>
        </div>
        <p className="text-sm text-gray-500 mt-1">{location}</p>
      </div>
      
      <button className="mt-3 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
        View Profile
      </button>
    </div>
  );
};

export default ProviderCard; 