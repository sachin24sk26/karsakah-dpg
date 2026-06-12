import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import Input from '../components/Input';
import Button from '../components/Button';
import { CreditCard, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Checkout() {
  const { getCartTotal } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [orderComplete, setOrderComplete] = useState(false);

  const handleCheckout = (e) => {
    e.preventDefault();
    setTimeout(() => {
      setOrderComplete(true);
    }, 1500);
  };

  if (orderComplete) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-12">
          <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Payment Successful!</h1>
          <p className="text-xl text-gray-600 mb-8">Thank you for your purchase. We have notified the farmer.</p>
          <div className="bg-gray-50 p-6 rounded-lg mb-8 max-w-sm mx-auto text-left">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Order Tracking ID</p>
            <p className="text-2xl font-mono font-bold text-gray-900">#ORD-{(Math.random()*100000).toFixed(0)}</p>
          </div>
          <Link to="/marketplace">
            <Button variant="primary" className="px-8 py-3">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Secure Checkout</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <form onSubmit={handleCheckout} className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center"><Truck className="mr-2" /> Shipping Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Full Name" placeholder="John Doe" required />
                <Input label="Phone Number" placeholder="+91 98xxx xxxxx" required />
                <Input label="Address Line 1" placeholder="Flat No. / Street" className="md:col-span-2" required />
                <Input label="City" placeholder="City" required />
                <Input label="State" placeholder="State/Province" required />
                <Input label="PIN Code" placeholder="ZIP/Postal Code" required />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center"><CreditCard className="mr-2" /> Payment Method</h2>
              <div className="space-y-4">
                <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'card' ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
                  <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300" />
                  <span className="ml-3 font-medium text-gray-900">Credit / Debit Card / UPI</span>
                </label>
                <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
                  <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300" />
                  <span className="ml-3 font-medium text-gray-900">Cash on Delivery</span>
                </label>
              </div>

              {paymentMethod === 'card' && (
                <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
                  <p className="text-sm text-gray-600">Simulating Payment Gateway (e.g. Razorpay/Stripe)</p>
                </div>
              )}
            </div>
            <Button type="submit" variant="primary" className="w-full py-4 text-lg">Pay ₹{(getCartTotal() + 500).toLocaleString()}</Button>
          </form>
        </div>

        <div className="lg:w-1/3">
           <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Summary</h2>
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
            </div>
        </div>
      </div>
    </div>
  );
}
