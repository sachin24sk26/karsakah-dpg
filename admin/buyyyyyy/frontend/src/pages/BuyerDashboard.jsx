import React from 'react';
import { Package, Truck, CheckCircle } from 'lucide-react';
import Button from '../components/Button';
import { Link } from 'react-router-dom';

export default function BuyerDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600">Track and manage your recent purchases</p>
        </div>
        <Link to="/marketplace">
          <Button variant="primary">Continue Shopping</Button>
        </Link>
      </div>

      <div className="space-y-6">
        {/* Order Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-4 mb-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Order ID: #ORD-45291</p>
              <h2 className="text-lg font-bold text-gray-900">Organic Wheat (5 quintal)</h2>
            </div>
            <div className="mt-4 md:mt-0 text-left md:text-right">
              <p className="text-sm text-gray-500 mb-1">Total Amount</p>
              <p className="text-xl font-bold text-green-600">₹12,500</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-full">
              <Truck className="h-5 w-5" />
              <span className="font-semibold text-sm">Shipped - In Transit</span>
            </div>
            
            <div className="flex-1 w-full md:w-auto h-2 bg-gray-200 rounded-full mx-0 md:mx-8 mt-4 md:mt-0 hidden sm:block">
              <div className="h-full bg-blue-500 rounded-full w-2/3"></div>
            </div>

            <Button variant="secondary" className="text-sm" onClick={() => alert("GPS tracking module loading...")}>Track Package</Button>
          </div>
        </div>

        {/* Order Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-4 mb-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Order ID: #ORD-33102</p>
              <h2 className="text-lg font-bold text-gray-900">Fresh Tomatoes (10 kg)</h2>
            </div>
            <div className="mt-4 md:mt-0 text-left md:text-right">
              <p className="text-sm text-gray-500 mb-1">Total Amount</p>
              <p className="text-xl font-bold text-green-600">₹400</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-2 text-green-600 bg-green-50 px-4 py-2 rounded-full">
              <CheckCircle className="h-5 w-5" />
              <span className="font-semibold text-sm">Delivered</span>
            </div>
            
            <div className="flex-1 w-full md:w-auto h-2 bg-gray-200 rounded-full mx-0 md:mx-8 mt-4 md:mt-0 hidden sm:block">
              <div className="h-full bg-green-500 rounded-full w-full"></div>
            </div>

            <Button variant="secondary" className="text-sm border-green-200 text-green-700 hover:bg-green-50" onClick={() => alert("Thank you! Review system coming soon.")}>Leave a Review</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
