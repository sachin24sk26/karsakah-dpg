import React, { useState } from 'react';
import { Users, Search, MoreVertical, Edit2, Trash2, Ban } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

export default function AdminUsers() {
  const [users] = useState([
    { id: 'USR-001', name: 'Ram Singh', type: 'Farmer', status: 'Active', joined: '2023-11-01' },
    { id: 'USR-002', name: 'ABC Pvt Ltd', type: 'Buyer', status: 'Active', joined: '2023-11-05' },
    { id: 'USR-003', name: 'Suresh Kumar', type: 'Farmer', status: 'Pending', joined: '2024-01-12' },
    { id: 'USR-004', name: 'Organic Foods Co.', type: 'Buyer', status: 'Suspended', joined: '2023-09-21' },
  ]);

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-100">
      <aside className="w-64 bg-gray-900 text-white hidden md:block">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-green-500 mb-8">Admin Portal</h2>
          <nav className="space-y-2">
            <Link to="/admin/dashboard" className="flex items-center space-x-3 p-3 hover:bg-gray-800 rounded-lg text-gray-300 transition-colors">
              <Users className="h-5 w-5" /> <span>Dashboard</span>
            </Link>
            <Link to="/admin/users" className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg text-green-400">
              <Users className="h-5 w-5" /> <span>User Management</span>
            </Link>
          </nav>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600">Approve, suspend, or delete platform users.</p>
          </div>
          <div className="relative">
             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
             <input type="text" placeholder="Search by name or ID..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 w-64" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
           <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                 <tr>
                    <th className="p-4 font-semibold text-gray-600">User ID</th>
                    <th className="p-4 font-semibold text-gray-600">Name</th>
                    <th className="p-4 font-semibold text-gray-600">Role</th>
                    <th className="p-4 font-semibold text-gray-600">Joined</th>
                    <th className="p-4 font-semibold text-gray-600">Status</th>
                    <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                 {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                       <td className="p-4 font-mono text-gray-600">{user.id}</td>
                       <td className="p-4 font-medium text-gray-900">{user.name}</td>
                       <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.type === 'Farmer' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                             {user.type}
                          </span>
                       </td>
                       <td className="p-4 text-gray-500">{user.joined}</td>
                       <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                             user.status === 'Active' ? 'bg-green-100 text-green-800' : 
                             user.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                          }`}>
                             {user.status}
                          </span>
                       </td>
                       <td className="p-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                             {user.status === 'Pending' && <Button variant="secondary" className="px-2 py-1 text-xs border-green-200 text-green-700 hover:bg-green-50" onClick={() => alert("User Approval Processing...")}>Approve</Button>}
                             {user.status === 'Active' && <button className="text-yellow-600 hover:bg-yellow-50 p-1 rounded" title="Suspend" onClick={() => alert("User suspended temporarily.")}><Ban className="h-4 w-4" /></button>}
                             <button className="text-red-600 hover:bg-red-50 p-1 rounded" title="Delete" onClick={() => alert("Delete Confirmation Required")}><Trash2 className="h-4 w-4" /></button>
                          </div>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </main>
    </div>
  );
}
