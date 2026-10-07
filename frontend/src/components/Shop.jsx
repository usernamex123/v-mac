import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, ChevronRight, Loader2 } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { supabase } from '../lib/supabase';

const CATEGORIES = [
  { name: 'Laptops', value: 'Laptops', image: 'https://media.base44.com/images/public/6abe086a20e68e9886a3d08b/c7c896874_generated_image.png' },
  { name: 'Monitors', value: 'Monitors', image: 'https://media.base44.com/images/public/6abe086a20e68e9886a3d08b/b2805c1b0_generated_image.png' },
  { name: 'CCTV', value: 'CCTV', image: 'https://media.base44.com/images/public/6abe086a20e68e9886a3d08b/6cb9afe13_generated_image.png' },
  { name: 'Mouse', value: 'Mouse', image: 'https://media.base44.com/images/public/6abe086a20e68e9886a3d08b/7254ec4ea_generated_image.png' },
  { name: 'Keyboards', value: 'Keyboards', image: 'https://media.base44.com/images/public/6abe086a20e68e9886a3d08b/b554088c9_generated_image.png' }
];

const CATEGORY_MAP = {
  'Laptop': 'Laptops',
  'Laptops': 'Laptops',
  'MOnitors': 'Monitors',
  'Monitors': 'Monitors',
  'Other': 'CCTV',
  'CCTV': 'CCTV',
  'Mouse': 'Mouse',
  'Keyboard': 'Keyboards',
  'Keyboards': 'Keyboards'
};

export default function Shop() {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedCategory, setSelectedCategory] = useState(() => {
    const passedCategory = location.state?.category;
    return CATEGORY_MAP[passedCategory] || 'Laptops';
  });

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);
  const productsSectionRef = useRef(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchCartCount(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchCartCount(session.user.id);
      } else {
        setCartCount(0);
      }
    });

    fetchProducts();

    return () => subscription.unsubscribe();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*');

    if (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products from database.');
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (location.state?.category && productsSectionRef.current) {
      productsSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location.state]);

  const fetchCartCount = async (userId) => {
    const { data, error } = await supabase
      .from('cart_items')
      .select('quantity')
      .eq('user_id', userId);
    if (!error && data) {
      const total = data.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(total);
    }
  };

  const handleCategoryClick = (categoryValue) => {
    setSelectedCategory(categoryValue);
    if (productsSectionRef.current) {
      productsSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAddToCart = async (product) => {
    if (!user) {
      toast.error('Please sign in to add items to your cart.');
      navigate('/login');
      return;
    }

    const { data: existing } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', user.id)
      .eq('product_id', product.id)
      .single();

    if (existing) {
      await supabase
        .from('cart_items')
        .update({ quantity: existing.quantity + 1 })
        .eq('id', existing.id);
    } else {
      await supabase
        .from('cart_items')
        .insert([{
          user_id: user.id,
          product_id: product.id,
          name: product.name,
          category: product.category,
          price: product.price,
          image: product.image,
          description: product.description,
          quantity: 1
        }]);
    }
    
    fetchCartCount(user.id);

    toast.custom((t) => (
      <div className="flex items-center gap-3.5 bg-white border border-gray-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.08)] rounded-2xl p-4 w-80 pointer-events-auto">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
          <ShoppingBag className="w-5 h-5 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-blue-600 truncate">{product.name}</p>
          <p className="text-[11px] text-gray-500 mt-0.5">Added to bag • ${product.price}</p>
        </div>
      </div>
    ), {
      duration: 1500,
    });
  };

  const filteredProducts = products.filter(item => {
    const matchesCategory = item.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white text-[#1D1D1F] selection:bg-blue-600 selection:text-white pb-24">
      <Toaster position="top-right" />

      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <Link to="/" className="text-xl font-extrabold tracking-tight text-gray-900 flex items-center space-x-1">
            <span>V-</span>
            <span className="text-blue-600">Mac</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-900">
            <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <Link to="/about" className="hover:text-blue-600 transition-colors">About</Link>
            <Link to="/products" className="hover:text-blue-600 transition-colors">Products</Link>
            <Link to="/shop" className="text-blue-600 font-semibold transition-colors">Shop</Link>
            <Link to="/services" className="hover:text-blue-600 transition-colors">Services</Link>
            <Link to="/contact" className="hover:text-blue-600 transition-colors">Contact</Link>
          </div>

          <div className="flex items-center">
            <Link 
              to="/shop/bag"
              className="relative p-2 text-gray-800 hover:text-blue-600 transition-colors cursor-pointer"
              title="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-10 flex flex-col md:flex-row justify-between items-start md:items-end">
        <div>
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-gray-900">
            Store.
          </h1>
          <p className="text-3xl sm:text-4xl font-semibold text-gray-400 mt-1 tracking-tight">
            The best way to buy the tech you love.
          </p>
        </div>
      </section>

      {/* Category Selector */}
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
                <div className={`h-28 sm:h-32 w-full flex items-center justify-center bg-white rounded-2xl transition-transform duration-300 ${
                  isSelected ? 'scale-105' : 'group-hover:scale-102'
                }`}>
                  <img 
                    src={cat.image} 
                    alt={cat.name} 
                    className="w-full h-full object-contain opacity-90 group-hover:opacity-100 transition-opacity"
                  />
                </div>
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

      {/* Products Listing Header */}
      <div ref={productsSectionRef} className="max-w-7xl mx-auto px-6 pt-12 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-t border-gray-200/80">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
            {selectedCategory}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Showing {filteredProducts.length} high-performance items
          </p>
        </div>

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
        {loading ? (
          <div className="text-center py-24 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
            <p className="text-gray-400 text-sm">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
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
                  <div className="h-48 rounded-2xl bg-white overflow-hidden relative mb-4 flex items-center justify-center">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>

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

      <footer className="max-w-7xl mx-auto px-6 mt-28 pt-8 border-t border-gray-200 text-center text-xs text-gray-400">
        <p>&copy; {new Date().getFullYear()} V-Mac Tech Store. Premium Hardware, Displays, and Security Systems.</p>
      </footer>
    </div>
  );
}