import React from 'react';

export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex justify-center items-center shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    primary: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500",
    secondary: "bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 focus:ring-green-500",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700 shadow-none"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
