import React from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

export default function Cart() {
  const { cartItems, removeFromCart, getCartTotal } = useCart();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <ShoppingBag className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-600 mb-4">Your cart is empty</h2>
          <Link to="/marketplace">
            <Button variant="primary">Browse Marketplace</Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <li key={item.id} className="p-6 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-green-100 rounded-lg h-16 w-16 flex items-center justify-center">
                        <ShoppingBag className="text-green-600 h-8 w-8" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{item.crop_name}</h3>
                        <p className="text-sm text-gray-500">{item.location} • ₹{item.price}/{item.price_unit}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">₹{item.price * item.quantity}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 transition-colors p-2"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">₹{getCartTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Transport/Platform Fee</span>
                  <span className="font-semibold text-gray-900">₹500</span>
                </div>
                <div className="pt-4 border-t border-gray-200 flex justify-between">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-lg font-bold text-green-600">₹{(getCartTotal() + 500).toLocaleString()}</span>
                </div>
              </div>
              <Link to="/checkout" className="block">
                <Button variant="primary" className="w-full flex justify-center items-center">
                  Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
