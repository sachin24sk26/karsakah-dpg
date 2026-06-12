import React from 'react';
import { Sprout } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Sprout className="h-8 w-8 text-green-500" />
              <span className="font-bold text-2xl tracking-tight text-white">AgriMarket</span>
            </div>
            <p className="text-gray-400 text-sm">Connecting farmers directly with buyers to eliminate middlemen and provide fair prices.</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/" className="hover:text-green-400 transition-colors">Home</a></li>
              <li><a href="/marketplace" className="hover:text-green-400 transition-colors">Marketplace</a></li>
              <li><a href="/login" className="hover:text-green-400 transition-colors">Farmer Login</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/faq" className="hover:text-green-400 transition-colors">FAQ</a></li>
              <li><a href="/contact" className="hover:text-green-400 transition-colors">Contact Us</a></li>
              <li><a href="/terms" className="hover:text-green-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <p className="text-gray-400 text-sm">Email: support@agrimarket.com</p>
            <p className="text-gray-400 text-sm">Phone: +91 98765 43210</p>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} AgriMarket. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
