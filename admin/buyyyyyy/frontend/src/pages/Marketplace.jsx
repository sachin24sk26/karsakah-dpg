import React, { useState, useEffect } from 'react';
import CropCard from '../components/CropCard';
import { Search, Filter } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';

export default function Marketplace() {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data for initial frontend build before API integration
  useEffect(() => {
    setTimeout(() => {
      setCrops([
        { id: 1, crop_name: 'Organic Wheat', category: 'Wheat', price: '2500', price_unit: 'quintal', quantity: '10', location: 'Punjab Farm', description: 'High quality organic wheat directly from Punjab.', image_url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=800' },
        { id: 2, crop_name: 'Basmati Rice', category: 'Rice', price: '80', price_unit: 'kg', quantity: '500', location: 'Haryana Fields', description: 'Aromatic long-grain basmati rice.', image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e8ac?auto=format&fit=crop&q=80&w=800' },
        { id: 3, crop_name: 'Fresh Tomatoes', category: 'Vegetables', price: '40', price_unit: 'kg', quantity: '200', location: 'Maharashtra', description: 'Farm fresh red tomatoes.', image_url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=800' },
        { id: 4, crop_name: 'Alphonso Mangoes', category: 'Fruits', price: '800', price_unit: 'dozen', quantity: '50', location: 'Ratnagiri', description: 'Sweet and export-quality Alphonso mangoes.', image_url: 'https://images.unsplash.com/photo-1553279768-865429fd00a8?auto=format&fit=crop&q=80&w=800' }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
        
        <div className="flex w-full md:w-auto gap-2">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input 
              type="text" 
              placeholder="Search crops, vegetables..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            />
          </div>
          <Button 
            variant="secondary" 
            className="flex items-center gap-2 border border-gray-300"
            onClick={() => alert("Filter functionality coming soon!")}
          >
            <Filter className="h-5 w-5" /> Filters
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {crops.map((crop) => (
            <CropCard key={crop.id} crop={crop} />
          ))}
        </div>
      )}
    </div>
  );
}
