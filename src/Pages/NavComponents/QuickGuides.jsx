import React from 'react';
import { Link } from 'react-router-dom';

const QuickGuides = () => {
  const guides = [
    {
      id: 1,
      name: 'Leica FlexLine TS07 5" R500 Manual Total Station',
      image: '/images/flexline-ts07-5.png',
      downloadLink: '#'
    },
    {
      id: 2,
      name: 'Leica FlexLine TS07 1" R500 Manual Total Station',
      image: '/images/flexline-ts07-1.png',
      downloadLink: '#'
    },
    {
      id: 3,
      name: 'Leica FlexLine TS03 5" R500 Manual Total Station',
      image: '/images/flexline-ts03-5.png',
      downloadLink: '#'
    },
    {
      id: 4,
      name: 'Leica FlexLine TS10 5" R500 Manual Total Station',
      image: '/images/flexline-ts10-5.png',
      downloadLink: '#'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col">
        <nav className="text-sm mb-6">
          <Link to="/" className="text-red-500 hover:text-red-700">Home</Link>
          {' / '}
          <Link to="/support" className="text-red-500 hover:text-red-700">SUPPORT</Link>
          {' / '}
          <span className="text-gray-600">Quick Guides</span>
        </nav>
        
        <h1 className="text-3xl font-bold mb-8">Quick Guides</h1>
        
        <h2 className="text-xl font-semibold mb-6">G2 Survey 3D Laser Scanner Quick Guides</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {guides.map((guide) => (
            <div key={guide.id} className="flex flex-col items-center">
              <img 
                src={guide.image} 
                alt={guide.name} 
                className="w-full max-w-[200px] mb-4"
              />
              <h3 className="text-sm text-center mb-3">{guide.name}</h3>
              <button 
                className="bg-red-500 text-white px-6 py-2 rounded-sm hover:bg-red-600 transition-colors"
                onClick={() => window.open(guide.downloadLink, '_blank')}
              >
                DOWNLOAD
              </button>
            </div>
          ))}
        </div>
        
        <div className="flex items-center justify-center gap-2 mt-8">
          <button className="px-3 py-1 border border-gray-300">1</button>
          <button className="px-3 py-1 border border-gray-300">2</button>
          <button className="px-3 py-1 border border-gray-300">3</button>
          <button className="px-3 py-1 border border-gray-300">4</button>
          <button className="px-3 py-1 border border-gray-300">5</button>
          <button className="px-3 py-1 border border-gray-300">6</button>
          <button className="px-3 py-1 border border-gray-300">Next</button>
        </div>
      </div>
    </div>
  );
};

export default QuickGuides;
