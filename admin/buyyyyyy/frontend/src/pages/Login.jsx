import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';

export default function Login() {
  const [role, setRole] = useState('buyer');
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would make an API call here.
    // For now, we simulate a successful login/registration by navigating.
    if (role === 'farmer') {
      navigate('/farmer/dashboard');
    } else {
      navigate('/marketplace');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Welcome back' : 'Create an account'}
          </h2>
          <p className="text-center text-sm text-gray-600 mt-2">
            {isLogin ? 'Login to your AgriMarket account' : 'Join AgriMarket today'}
          </p>
        </div>
        
        <div className="flex rounded-md shadow-sm mb-6">
          <button 
            type="button"
            onClick={() => setRole('farmer')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-l-md border ${
              role === 'farmer' ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Farmer
          </button>
          <button 
            type="button"
            onClick={() => setRole('buyer')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-r-md border-t border-r border-b ${
              role === 'buyer' ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Buyer
          </button>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {!isLogin && (
               <Input label="Full Name" id="name" type="text" placeholder="John Doe" required />
            )}
            <Input label="Phone Number" id="phone" type="tel" placeholder="Enter phone number" required />
            <Input label="Password" id="password" type="password" placeholder="••••••••" required />
          </div>

          <div>
            <Button type="submit" variant="primary" className="w-full">
              {isLogin ? 'Sign In' : 'Register'} as {role === 'farmer' ? 'Farmer' : 'Buyer'}
            </Button>
          </div>
        </form>

        <div className="text-center text-sm text-gray-600 mt-4">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-green-600 hover:underline font-medium"
            type="button"
          >
             {isLogin ? 'Register here' : 'Login here'}
          </button>
        </div>
      </div>
    </div>
  );
}
