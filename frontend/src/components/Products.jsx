import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from './Login';

export default function Products() {
  const navigate = useNavigate();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const savedUser = localStorage.getItem('vmac_current_user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse user session');
      }
    }
  }, []);

  const handleProductClick = (deviceId) => {
    if (currentUser) {
      navigate('/repair-booking', { state: { device: deviceId } });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setLoginModalOpen(true);
    }
  };

  const productsList = [
    {
      title: 'Laptops',
      deviceId: 'Laptop',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
      alt: 'Laptops'
    },
    {
      title: 'Desktops',
      deviceId: 'Desktop',
      image: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=600&q=80',
      alt: 'Desktops'
    },
    {
      title: 'Printers',
      deviceId: 'Printer',
      image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=600&q=80',
      alt: 'Printers'
    },
    {
      title: 'Smartphones',
      deviceId: 'Phone',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
      alt: 'Smartphones'
    },
    {
      title: 'CCTV Cameras',
      deviceId: 'Other',
      image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80',
      alt: 'CCTV Cameras'
    },
    {
      title: 'Internet & Networking',
      deviceId: 'Internet',
      image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80',
      alt: 'Internet and Networking'
    }
  ];

  return (
    <>
      <section id="products" className="py-20 bg-gray-50 text-gray-800">
        <div className="container mx-auto px-6 max-w-6xl">
          
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight uppercase mb-3">
              Our Products
            </h2>
            <div className="w-16 h-1 bg-blue-600 mx-auto rounded-full"></div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {productsList.map((product, index) => (
              <div 
                key={index} 
                onClick={() => handleProductClick(product.deviceId)}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 group flex flex-col transition-all duration-300 hover:shadow-xl cursor-pointer"
              >
                {/* Product Image Container with Zoom Effect & Hover Overlay */}
                <div className="h-52 relative overflow-hidden bg-gray-100">
                  <img 
                    src={product.image} 
                    alt={product.alt} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Smooth Hover Overlay with Repair / Plus Icon */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                    <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Product Title Container */}
                <div className="py-6 px-4 text-center">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                    {product.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Login Modal */}
      <Login isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
    </>
  );
}