import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, TrendingUp, Users } from 'lucide-react';
import Button from '../components/Button';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-green-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Empowering Farmers, Delivering Freshness
          </h1>
          <p className="text-xl md:text-2xl text-green-100 mb-10 max-w-3xl mx-auto">
            Direct from farm to your home. No middlemen. Fair prices for farmers, fresh produce for you.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/marketplace">
              <Button variant="secondary" className="w-full sm:w-auto text-lg px-8 py-4 bg-white text-green-700 hover:bg-gray-50 border-0">
                Explore Marketplace <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="primary" className="w-full sm:w-auto text-lg px-8 py-4 border-2 border-white hover:bg-green-700 shadow-none">
                I am a Farmer
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose AgriMarket?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <ShieldCheck className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Verified Farmers</h3>
              <p className="text-gray-600">All our farmers are verified to ensure you get authentic and quality produce.</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Fair Pricing</h3>
              <p className="text-gray-600">By removing middlemen, farmers earn more and you pay less.</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Community Support</h3>
              <p className="text-gray-600">Directly support local agriculture and sustainable farming practices.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
