import React from 'react';
import { PlusCircle, Package, TrendingUp, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import WeatherWidget from '../components/WeatherWidget';
import MarketPriceWidget from '../components/MarketPriceWidget';
import { useTranslation } from 'react-i18next';

export default function FarmerDashboard() {
  const { t } = useTranslation();
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Farmer Dashboard</h1>
          <p className="text-gray-600">Welcome back, Ram Singh (Farm ID: #8821)</p>
        </div>
        <Link to="/farmer/add-crop">
          <Button variant="primary" className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5" /> Post New Crop
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="bg-green-100 p-3 rounded-full text-green-600">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Active Listings</p>
            <h3 className="text-2xl font-bold text-gray-900">12</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="bg-blue-100 p-3 rounded-full text-blue-600">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Orders Pending</p>
            <h3 className="text-2xl font-bold text-gray-900">5</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="bg-yellow-100 p-3 rounded-full text-yellow-600">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Earnings</p>
            <h3 className="text-2xl font-bold text-gray-900">₹45,200</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="bg-purple-100 p-3 rounded-full text-purple-600">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Profile Rating</p>
            <h3 className="text-2xl font-bold text-gray-900">4.8/5</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
         <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
           <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Orders</h2>
           <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-3 font-semibold text-gray-600">Order ID</th>
                <th className="pb-3 font-semibold text-gray-600">Crop</th>
                <th className="pb-3 font-semibold text-gray-600">Quantity</th>
                <th className="pb-3 font-semibold text-gray-600">Price</th>
                <th className="pb-3 font-semibold text-gray-600">Status</th>
                <th className="pb-3 font-semibold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4">#ORD-0921</td>
                <td className="py-4 font-medium text-gray-900">Organic Wheat</td>
                <td className="py-4">5 quintal</td>
                <td className="py-4 font-medium text-green-600">₹12,500</td>
                <td className="py-4">
                  <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Pending</span>
                </td>
                <td className="py-4">
                  <button className="text-green-600 hover:text-green-800 font-medium" onClick={() => alert("Order accepted successfully!")}>Accept</button>
                </td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4">#ORD-0918</td>
                <td className="py-4 font-medium text-gray-900">Basmati Rice</td>
                <td className="py-4">100 kg</td>
                <td className="py-4 font-medium text-green-600">₹8,000</td>
                <td className="py-4">
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Shipped</span>
                </td>
                <td className="py-4">
                  <button className="text-gray-500 hover:text-gray-700 font-medium" onClick={() => alert("Viewing detailed order invoice...")}>View</button>
                </td>
              </tr>
            </tbody>
          </table>
         </div>
       </div>

       <div className="space-y-6">
          <WeatherWidget location="Punjab, India" />
          
          <div className="bg-orange-50 rounded-xl shadow-sm border border-orange-100 p-6">
             <h3 className="text-lg font-bold text-orange-900 mb-2 flex flex-col">{t('dashboard.alerts')}</h3>
             <ul className="space-y-3 text-sm text-orange-800">
                <li className="flex items-start">
                   <span className="h-1.5 w-1.5 rounded-full bg-orange-500 mt-1.5 mr-2 flex-shrink-0"></span>
                   <span>Heavy rainfall expected in next 48 hours. Secure harvested crops.</span>
                </li>
                <li className="flex items-start">
                   <span className="h-1.5 w-1.5 rounded-full bg-orange-500 mt-1.5 mr-2 flex-shrink-0"></span>
                   <span>Market price for Wheat has increased by 2% today.</span>
                </li>
             </ul>
          </div>

          <MarketPriceWidget />
       </div>
      </div>
    </div>
  );
}
