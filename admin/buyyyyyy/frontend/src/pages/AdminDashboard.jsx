import React from 'react';
import { Users, Sprout, ShoppingCart, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-100">
      {/* Sidebar Overlay */}
      <aside className="w-64 bg-gray-900 text-white hidden md:block">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-green-500 mb-8">Admin Portal</h2>
          <nav className="space-y-2">
            <Link to="/admin/dashboard" className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg text-green-400">
              <TrendingUp className="h-5 w-5" /> <span>Dashboard</span>
            </Link>
            <Link to="/admin/users" className="flex items-center space-x-3 p-3 hover:bg-gray-800 rounded-lg text-gray-300 transition-colors">
              <Users className="h-5 w-5" /> <span>User Management</span>
            </Link>
            <Link to="/admin/crops" className="flex items-center space-x-3 p-3 hover:bg-gray-800 rounded-lg text-gray-300 transition-colors">
              <Sprout className="h-5 w-5" /> <span>Crop Moderation</span>
            </Link>
            <Link to="/admin/orders" className="flex items-center space-x-3 p-3 hover:bg-gray-800 rounded-lg text-gray-300 transition-colors">
              <ShoppingCart className="h-5 w-5" /> <span>Order Disputes</span>
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Platform Overview</h1>
          <p className="text-gray-600">Administrator statistics and reports</p>
        </div>

        {/* Top KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
           <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500 flex justify-between items-center">
             <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Total Farmers</p>
                <h3 className="text-3xl font-bold text-gray-900">1,245</h3>
             </div>
             <div className="bg-blue-100 p-3 rounded-full"><Users className="h-6 w-6 text-blue-600" /></div>
           </div>
           
           <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500 flex justify-between items-center">
             <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Active Listings</p>
                <h3 className="text-3xl font-bold text-gray-900">4,892</h3>
             </div>
             <div className="bg-green-100 p-3 rounded-full"><Sprout className="h-6 w-6 text-green-600" /></div>
           </div>

           <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-yellow-500 flex justify-between items-center">
             <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Total Orders</p>
                <h3 className="text-3xl font-bold text-gray-900">8,102</h3>
             </div>
             <div className="bg-yellow-100 p-3 rounded-full"><ShoppingCart className="h-6 w-6 text-yellow-600" /></div>
           </div>

           <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500 flex justify-between items-center">
             <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Platform Revenue</p>
                <h3 className="text-3xl font-bold text-gray-900">₹4.2M</h3>
             </div>
             <div className="bg-purple-100 p-3 rounded-full"><TrendingUp className="h-6 w-6 text-purple-600" /></div>
           </div>
        </div>

        {/* Secondary KPIs & Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Pending Approvals</h2>
              <div className="space-y-4">
                     <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                       <AlertCircle className="h-5 w-5 text-yellow-500 mr-3" />
                       <div>
                          <p className="font-semibold text-gray-900">KYC Verification: Ram Singh</p>
                          <p className="text-sm text-gray-500">Document uploaded 2 hours ago</p>
                       </div>
                    </div>
                    <button className="text-green-600 font-medium hover:text-green-800" onClick={() => alert("Opening Document Viewer...")}>Review</button>
                 </div>
                 <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                       <CheckCircle className="h-5 w-5 text-gray-400 mr-3" />
                       <div>
                          <p className="font-semibold text-gray-900">New Crop Listing Alert</p>
                          <p className="text-sm text-gray-500">Flagged for suspicious pricing</p>
                       </div>
                    </div>
                    <button className="text-green-600 font-medium hover:text-green-800" onClick={() => alert("Reviewing crop details...")}>Review</button>
                 </div>
              </div>
           </div>

           <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Transactions</h2>
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="border-b border-gray-100">
                       <th className="pb-2 font-semibold text-gray-500">ID</th>
                       <th className="pb-2 font-semibold text-gray-500">Amount</th>
                       <th className="pb-2 font-semibold text-gray-500">Status</th>
                    </tr>
                 </thead>
                 <tbody className="text-sm">
                    <tr className="border-b border-gray-50">
                       <td className="py-3 font-mono">TXN-9821</td>
                       <td className="py-3 font-medium">₹12,500</td>
                       <td className="py-3"><span className="text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs">Success</span></td>
                    </tr>
                    <tr className="border-b border-gray-50">
                       <td className="py-3 font-mono">TXN-9820</td>
                       <td className="py-3 font-medium">₹4,200</td>
                       <td className="py-3"><span className="text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs">Success</span></td>
                    </tr>
                    <tr className="border-b border-gray-50">
                       <td className="py-3 font-mono">TXN-9819</td>
                       <td className="py-3 font-medium">₹850</td>
                       <td className="py-3"><span className="text-red-600 bg-red-50 px-2 py-1 rounded-full text-xs">Failed</span></td>
                    </tr>
                 </tbody>
              </table>
           </div>
        </div>
      </main>
    </div>
  );
}
