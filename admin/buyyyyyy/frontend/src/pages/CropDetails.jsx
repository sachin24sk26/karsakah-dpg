import React from 'react';
import { useParams } from 'react-router-dom';

export default function CropDetails() {
  const { id } = useParams();
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-4">Crop Details (ID: {id})</h1>
      <p className="text-gray-600">Full integration with the backend API will display farmer details, images, and reviews here.</p>
    </div>
  );
}
