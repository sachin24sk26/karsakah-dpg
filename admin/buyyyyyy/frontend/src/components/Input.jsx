import React from 'react';

export default function Input({ label, id, error, className = '', ...props }) {
  return (
    <div className={`flex flex-col space-y-1 ${className}`}>
      {label && <label htmlFor={id} className="text-sm font-medium text-gray-700">{label}</label>}
      <input
        id={id}
        className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
          error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
        }`}
        {...props}
      />
      {error && <span className="text-sm text-red-500 mt-1">{error}</span>}
    </div>
  );
}
