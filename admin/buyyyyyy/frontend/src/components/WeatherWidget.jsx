import React, { useState, useEffect } from 'react';
import { CloudRain, Sun, Wind } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function WeatherWidget({ location = 'Local Region' }) {
  const { t } = useTranslation();
  const [weather, setWeather] = useState({ temp: 32, condition: 'Sunny', humidity: 45 });
  const [loading, setLoading] = useState(true);

  // Mock API integration
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1200);
  }, []);

  if (loading) {
     return <div className="h-40 bg-gray-50 rounded-xl animate-pulse flex items-center justify-center text-gray-400">Loading Weather...</div>;
  }

  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-20">
           <Sun className="h-32 w-32" />
        </div>
        <div className="relative z-10">
           <h2 className="text-lg font-semibold mb-1">{t('dashboard.weather')}</h2>
           <p className="text-blue-100 text-sm mb-6">{location}</p>
           
           <div className="flex items-end space-x-4 mb-4">
              <span className="text-5xl font-bold">{weather.temp}°C</span>
              <span className="text-xl font-medium mb-1">{weather.condition}</span>
           </div>

           <div className="flex space-x-6 text-sm text-blue-100">
              <div className="flex items-center">
                 <CloudRain className="h-4 w-4 mr-1" />
                 <span>10% Precip</span>
              </div>
              <div className="flex items-center">
                 <Wind className="h-4 w-4 mr-1" />
                 <span>12 km/h</span>
              </div>
           </div>
        </div>
    </div>
  );
}
