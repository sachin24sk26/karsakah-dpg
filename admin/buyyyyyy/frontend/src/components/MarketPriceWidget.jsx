import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, RefreshCcw } from 'lucide-react';

export default function MarketPriceWidget() {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mocking an APMC / Mandi API fetch for live commodities
    setTimeout(() => {
      setPrices([
        { id: 1, commodity: 'Wheat', variety: 'Sharbati', price: 2750, trend: 'up', change: 45 },
        { id: 2, commodity: 'Rice', variety: 'Basmati', price: 8200, trend: 'up', change: 120 },
        { id: 3, commodity: 'Onion', variety: 'Red', price: 1800, trend: 'down', change: -50 },
        { id: 4, commodity: 'Tomato', variety: 'Local', price: 2100, trend: 'up', change: 30 },
      ]);
      setLoading(false);
    }, 1500);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
         <h2 className="text-xl font-bold text-gray-900">Live Mandi Prices</h2>
         <button className="p-2 text-gray-400 hover:text-green-600 rounded-full hover:bg-gray-50 flex items-center transition-colors">
            <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
         </button>
      </div>

      {loading ? (
        <div className="space-y-4">
           {[1, 2, 3].map(i => (
             <div key={i} className="h-12 bg-gray-50 rounded animate-pulse"></div>
           ))}
        </div>
      ) : (
        <div className="space-y-4">
          {prices.map(item => (
            <div key={item.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
               <div>
                  <h3 className="font-semibold text-gray-900">{item.commodity}</h3>
                  <p className="text-xs text-gray-500">{item.variety}</p>
               </div>
               <div className="text-right">
                  <p className="font-bold text-gray-900">₹{item.price}<span className="text-xs text-gray-500 font-normal">/qtl</span></p>
                  <div className={`flex items-center justify-end text-xs font-medium ${item.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                     {item.trend === 'up' ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                     ₹{Math.abs(item.change)}
                  </div>
               </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-4 text-center">
         <button className="text-sm font-medium text-green-600 hover:text-green-700">View All Commodities</button>
      </div>
    </div>
  );
}
