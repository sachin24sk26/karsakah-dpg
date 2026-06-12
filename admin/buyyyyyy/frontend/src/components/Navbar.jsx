import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ShoppingCart, User, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Navbar() {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'hi' ? 'en' : 'hi');
  };

  return (
    <nav className="bg-green-600 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Sprout className="h-8 w-8" />
            <span className="font-bold text-xl tracking-tight">AgriMarket</span>
          </Link>
          <div className="hidden md:flex space-x-8">
            <Link to="/marketplace" className="hover:text-green-200 transition-colors">{t('navbar.marketplace') || 'Marketplace'}</Link>
            <Link to="/about" className="hover:text-green-200 transition-colors">How it Works</Link>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4">
            <button onClick={toggleLanguage} className="p-2 hover:bg-green-700 rounded-full transition-colors flex items-center text-sm font-medium">
              <Globe className="h-5 w-5 mr-1" />
              <span className="hidden sm:inline">{i18n.language === 'hi' ? 'HI' : 'EN'}</span>
            </button>
            <Link to="/cart" className="p-2 hover:bg-green-700 rounded-full transition-colors">
              <ShoppingCart className="h-6 w-6" />
            </Link>
            <Link to="/login" className="flex items-center space-x-1 bg-white text-green-600 px-3 py-2 md:px-4 rounded-full font-medium hover:bg-green-50 transition-colors text-sm md:text-base">
              <User className="h-5 w-5" />
              <span className="hidden sm:inline">{t('navbar.login') || 'Login'}</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
