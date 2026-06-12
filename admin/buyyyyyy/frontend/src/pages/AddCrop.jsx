import React, { useState } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import { UploadCloud } from 'lucide-react';

export default function AddCrop() {
  const [formData, setFormData] = useState({
    crop_name: '',
    category: 'wheat',
    quantity: '',
    price: '',
    price_unit: 'kg',
    location: '',
    harvest_date: '',
    description: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting crop data:', formData);
    // API Call goes here
    alert("Crop listed successfully!");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">List a New Crop for Sale</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="Crop Name" 
              id="crop_name" 
              name="crop_name"
              placeholder="e.g. Organic Sharbati Wheat" 
              value={formData.crop_name}
              onChange={handleChange}
              required 
            />
            
            <div className="flex flex-col space-y-1">
              <label htmlFor="category" className="text-sm font-medium text-gray-700">Category</label>
              <select 
                id="category" 
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
              >
                <option value="wheat">Wheat</option>
                <option value="rice">Rice</option>
                <option value="vegetables">Vegetables</option>
                <option value="fruits">Fruits</option>
                <option value="other">Other</option>
              </select>
            </div>

            <Input 
              label="Total Quantity Available" 
              id="quantity" 
              name="quantity"
              type="number"
              placeholder="e.g. 50" 
              value={formData.quantity}
              onChange={handleChange}
              required 
            />

            <div className="flex flex-col space-y-1">
              <label htmlFor="price" className="text-sm font-medium text-gray-700">Price settings</label>
              <div className="flex">
                <input 
                  type="number" 
                  name="price"
                  placeholder="Price in ₹" 
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500 border-r-0"
                  required
                />
                <select 
                  name="price_unit"
                  value={formData.price_unit}
                  onChange={handleChange}
                  className="px-4 py-2 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 border-l-0"
                >
                  <option value="kg">per kg</option>
                  <option value="quintal">per quintal</option>
                </select>
              </div>
            </div>

            <Input 
              label="Farm Location" 
              id="location" 
              name="location"
              placeholder="City, State" 
              value={formData.location}
              onChange={handleChange}
              required 
            />

            <Input 
              label="Harvest Date (or expected)" 
              id="harvest_date" 
              name="harvest_date"
              type="date"
              value={formData.harvest_date}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label htmlFor="description" className="text-sm font-medium text-gray-700">Crop Description</label>
            <textarea 
              id="description" 
              name="description"
              rows="4" 
              value={formData.description}
              onChange={handleChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              placeholder="Describe the quality, farming method (organic/conventional) and any other details buyers should know..."
            ></textarea>
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-gray-700">Upload Images</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="space-y-1 text-center">
                <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600 justify-center">
                  <span className="relative cursor-pointer rounded-md font-medium text-green-600 hover:text-green-500">
                    <span>Upload files</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple accept="image/*" />
                  </span>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end space-x-3">
            <Button type="button" variant="secondary">Cancel</Button>
            <Button type="submit" variant="primary">Post Listing</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
