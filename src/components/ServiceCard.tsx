interface ServiceCardProps {
  id: string;
  title: string;
  category: string;
  provider: string;
  rating: number;
  price: string;
  image: string;
}

const ServiceCard = ({ title, category, provider, rating, price, image }: ServiceCardProps) => {
  return (
    <div className="service-card border rounded-lg overflow-hidden shadow-md">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-gray-500">{category}</p>
        <div className="flex justify-between items-center mt-2">
          <span>{provider}</span>
          <span className="flex items-center">
            ★ {rating.toFixed(1)}
          </span>
        </div>
        <div className="mt-3 font-bold">{price}</div>
      </div>
    </div>
  );
};

export default ServiceCard; 