import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, ChevronRight } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import Navbar from './Navbar';

const ALL_PRODUCTS = [
  {
    id: 1,
    name: 'MacBook Pro 16" M3 Max',
    category: 'Laptops',
    price: 2499,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    description: 'Extreme performance with M3 Max, 36GB unified memory, and stunning Liquid Retina XDR display.'
  },
  {
    id: 2,
    name: 'Dell XPS 15 OLED Touch',
    category: 'Laptops',
    price: 1799,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80',
    description: 'Precision-crafted laptop featuring a breathtaking 3.5K OLED infinity edge display.'
  },
  {
    id: 3,
    name: 'Apple Studio Display 27" 5K',
    category: 'Monitors',
    price: 1599,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
    description: 'Immersive 27-inch 5K Retina display with a 12MP Ultra Wide camera with Center Stage.'
  },
  {
    id: 4,
    name: 'LG UltraWide 38" Curved 4K',
    category: 'Monitors',
    price: 1199,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    description: 'Ultra-smooth workstation monitor with Nano IPS technology and HDR600 support.'
  },
  {
    id: 5,
    name: '4K AI Smart Security CCTV Kit (4-Cam)',
    category: 'CCTV',
    price: 349,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80',
    description: 'Weatherproof 4K color night vision security system with real-time AI human detection.'
  },
  {
    id: 6,
    name: 'Logitech MX Master 3S Wireless Mouse',
    category: 'Mouse',
    price: 99,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',
    description: 'An iconic master mouse remastered for ultimate tactility, performance, and quiet clicks.'
  },
  {
    id: 7,
    name: 'Keychron Q1 Pro Wireless Mechanical Keyboard',
    category: 'Keyboards',
    price: 189,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    description: 'Full aluminum custom mechanical keyboard with hot-swappable switches and QMK/VIA support.'
  },
  {
    id: 8,
    name: 'Hikvision 8MP Outdoor PTZ Dome Camera',
    category: 'CCTV',
    price: 219,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80',
    description: 'Pan, tilt, and zoom security camera with 360-degree coverage and active strobe defense.'
  }
];

const CATEGORIES = [
  { name: 'Laptops', value: 'Laptops', image: 'https://media.base44.com/images/public/6abe086a20e68e9886a3d08b/c7c896874_generated_image.png' },
  { name: 'Monitors', value: 'Monitors', image: 'https://media.base44.com/images/public/6abe086a20e68e9886a3d08b/b2805c1b0_generated_image.png' },
  { name: 'CCTV', value: 'CCTV', image: 'https://media.base44.com/images/public/6abe086a20e68e9886a3d08b/6cb9afe13_generated_image.png' },
  { name: 'Mouse', value: 'Mouse', image: 'https://media.base44.com/images/public/6abe086a20e68e9886a3d08b/7254ec4ea_generated_image.png' },
  { name: 'Keyboards', value: 'Keyboards', image: 'https://media.base44.com/images/public/6abe086a20e68e9886a3d08b/b554088c9_generated_image.png' }
];

export default function Shop() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('Laptops');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const productsSectionRef = useRef(null);

  const handleCategoryClick = (categoryValue) => {
    setSelectedCategory(categoryValue);
    if (productsSectionRef.current) {
      productsSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAddToCart = (product) => {
    setCartCount(prev => prev + 1);
    toast.success(`Added ${product.name} to cart!`, {
      description: `$${product.price} • Ready for fast dispatch`
    });
  };

  const filteredProducts = ALL_PRODUCTS.filter(item => {
    const matchesCategory = item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white text-[#1D1D1F] selection:bg-blue-600 selection:text-white pb-24">
      <Toaster position="top-right" richColors />

      {/* Imported Navigation Component */}
      <Navbar cartCount={cartCount} />

      {/* Apple Store Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-10 flex flex-col md:flex-row justify-between items-start md:items-end">
        <div>
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-gray-900">
            Store.
          </h1>
          <p className="text-3xl sm:text-4xl font-semibold text-gray-400 mt-1 tracking-tight">
            The best way to buy the tech you love.
          </p>
        </div>
        <div className="mt-6 md:mt-0 text-sm">
          <p className="text-gray-500 font-medium">Need shopping help?</p>
          <a href="#contact" className="text-blue-600 hover:underline inline-flex items-center mt-0.5">
            Connect with a specialist <ChevronRight className="w-4 h-4 ml-0.5" />
          </a>
        </div>
      </section>

      {/* Pure White Category Selector */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-start sm:justify-center items-center space-x-6 sm:space-x-10 overflow-x-auto pb-6 pt-4 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.value;
            return (
              <div
                key={cat.value}
                onClick={() => handleCategoryClick(cat.value)}
                className="flex-shrink-0 w-36 sm:w-44 cursor-pointer group text-center transition-all duration-300 flex flex-col items-center"
              >
                {/* Image Container */}
                <div className={`h-28 sm:h-32 w-full flex items-center justify-center bg-white rounded-2xl transition-transform duration-300 ${
                  isSelected ? 'scale-105' : 'group-hover:scale-102'
                }`}>
                  <img 
                    src={cat.image} 
                    alt={cat.name} 
                    className="w-full h-full object-contain opacity-90 group-hover:opacity-100 transition-opacity"
                  />
                </div>
                {/* Text positioned cleanly below the image, centered horizontally */}
                <h3 className={`mt-3 text-xs sm:text-sm font-semibold transition-colors ${
                  isSelected 
                    ? 'text-blue-600 font-bold underline decoration-2 underline-offset-4' 
                    : 'text-gray-800 group-hover:text-blue-600'
                }`}>
                  {cat.name}
                </h3>
              </div>
            );
          })}
        </div>
      </section>

      {/* Products Listing Section */}
      <div ref={productsSectionRef} className="max-w-7xl mx-auto px-6 pt-12 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-t border-gray-200/80">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
            {selectedCategory}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Showing {filteredProducts.length} high-performance items
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full sm:w-72 relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${selectedCategory.toLowerCase()}...`}
            className="w-full bg-gray-50 border border-gray-200 rounded-full pl-10 pr-4 py-2 text-xs text-gray-900 shadow-sm focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Product Grid */}
      <section className="max-w-7xl mx-auto px-6 mt-6">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-200">
            <p className="text-gray-400 text-sm">No products found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div 
                key={product.id}
                className="bg-white rounded-3xl border border-gray-200/80 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Image Box */}
                  <div className="h-48 rounded-2xl bg-gray-50 overflow-hidden relative border border-gray-100 mb-4 flex items-center justify-center p-4">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-semibold text-blue-700 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                        {product.category}
                      </span>
                    </div>
                  </div>

                  {/* Product Details */}
                  <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Price & Action */}
                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Price</span>
                    <span className="text-lg font-bold text-gray-900">${product.price}</span>
                  </div>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="px-4 py-2 bg-gray-900 hover:bg-blue-600 text-white rounded-xl text-xs font-medium transition-all shadow-sm cursor-pointer"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 mt-28 pt-8 border-t border-gray-200 text-center text-xs text-gray-400">
        <p>&copy; {new Date().getFullYear()} V-Mac Tech Store. Premium Hardware, Displays, and Security Systems.</p>
      </footer>
    </div>
  );
}