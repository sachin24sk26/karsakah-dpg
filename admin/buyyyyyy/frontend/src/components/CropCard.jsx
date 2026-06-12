import React from 'react';
import { MapPin, Calendar } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Button from './Button';
import { useCart } from '../context/CartContext';

export default function CropCard({ crop }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    addToCart(crop);
    navigate('/cart');
  };
  const imageUrl = crop.image_url || 'https://images.unsplash.com/photo-1592982537447-6f2b6a0aedc1?auto=format&fit=crop&q=80&w=800';
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
      <div className="relative h-48 overflow-hidden">
        <img src={imageUrl} alt={crop.crop_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-green-700">
          {crop.category}
        </div>
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{crop.crop_name}</h3>
          <p className="text-lg font-bold text-green-600 whitespace-nowrap ml-2">₹{crop.price}<span className="text-xs text-gray-500">/{crop.price_unit}</span></p>
        </div>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{crop.description || 'Fresh crop direct from farm.'}</p>
        
        <div className="space-y-2 mb-6">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            <span className="line-clamp-1">{crop.location || 'Local Farm'}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-medium mr-2">Qty:</span>
            {crop.quantity} {crop.price_unit}
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Link to={`/crop/${crop.id || 1}`} className="flex-1">
            <Button variant="secondary" className="w-full">View Details</Button>
          </Link>
          <Button variant="primary" className="flex-1" onClick={handleAddToCart}>
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
