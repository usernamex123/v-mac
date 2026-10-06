import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ChevronRight } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { supabase } from '../lib/supabase';

export default function Bag() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    // Load cart items from localStorage (synced with Shop.jsx)
    const savedCart = localStorage.getItem('vmac_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        setCartItems([]);
      }
    }

    // Check active Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoadingAuth(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoadingAuth(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const updateCart = (newItems) => {
    setCartItems(newItems);
    localStorage.setItem('vmac_cart', JSON.stringify(newItems));
  };

  const handleQuantityChange = (id, delta) => {
    const updated = cartItems.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean);
    updateCart(updated);
  };

  const handleRemove = (id) => {
    const updated = cartItems.filter(item => item.id !== id);
    updateCart(updated);
    toast.success('Item removed from bag');
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-white text-[#1D1D1F] selection:bg-blue-600 selection:text-white pb-24">
      <Toaster position="top-right" richColors />

      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/60 shadow-sm">
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
            <Link to="/shop/bag" className="p-2 text-blue-600 font-semibold transition-colors flex items-center space-x-1.5 cursor-pointer">
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded-full font-bold">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 pt-16 pb-20">
        {cartItems.length === 0 ? (
          /* Empty Bag State (Apple Style) */
          <div className="animate-in fade-in duration-300">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-3">
              Your Bag is empty.
            </h1>

            {!loadingAuth && !user && (
              <button 
                onClick={() => navigate('/login')}
                className="text-sm text-blue-600 hover:underline font-medium block mb-6 text-left cursor-pointer"
              >
                Sign in to see if you have any saved items.
              </button>
            )}

            {!loadingAuth && user && (
              <p className="text-sm text-gray-500 mb-6">
                Welcome back, <span className="font-semibold text-gray-800">{user.email}</span>
              </p>
            )}

            {/* Banner to continue shopping */}
            <div className="mt-8 bg-[#F5F5F7] rounded-3xl p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6 border border-gray-200/50">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Looking for inspiration?</h2>
                <p className="text-sm text-gray-500 mt-1">Explore our latest high-performance laptops, displays, and gear.</p>
              </div>
              <button
                onClick={() => navigate('/shop')}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-semibold transition-all shadow-sm flex-shrink-0 cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          /* Populated Bag State */
          <div className="animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-gray-200/80 pb-6 mb-8 gap-4">
              <div>
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
                  Review your Bag.
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Free delivery and free returns on all items.
                </p>
              </div>
              <button 
                onClick={() => navigate('/shop')}
                className="text-sm text-blue-600 hover:underline font-semibold self-start sm:self-auto cursor-pointer"
              >
                Add more items
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Items List */}
              <div className="lg:col-span-2 space-y-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-5 p-6 bg-[#F5F5F7] rounded-3xl border border-gray-200/60 items-center">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-2xl bg-white border border-gray-200 flex-shrink-0 p-1" 
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider block mb-1">
                        {item.category}
                      </span>
                      <h3 className="text-base font-bold text-gray-900 truncate">{item.name}</h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">{item.description}</p>
                      
                      <div className="flex items-center gap-4 mt-4">
                        <div className="flex items-center border border-gray-300 bg-white rounded-xl overflow-hidden shadow-sm">
                          <button 
                            onClick={() => handleQuantityChange(item.id, -1)}
                            className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 text-xs font-bold text-gray-900">{item.quantity}</span>
                          <button 
                            onClick={() => handleQuantityChange(item.id, 1)}
                            className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button 
                          onClick={() => handleRemove(item.id)}
                          className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove
                        </button>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="text-lg font-extrabold text-gray-900">${(item.price * item.quantity).toLocaleString()}</span>
                      <span className="text-[11px] text-gray-400 block">${item.price} each</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary Card */}
              <div className="bg-[#F5F5F7] p-8 rounded-3xl border border-gray-200/60 h-fit sticky top-24">
                <h3 className="text-lg font-bold text-gray-900 mb-6 tracking-tight">Order Summary</h3>
                
                <div className="space-y-4 text-sm pb-6 border-b border-gray-200">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-900">${subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-blue-600 font-semibold">FREE</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Estimated Tax</span>
                    <span className="text-gray-900 font-semibold">$0.00</span>
                  </div>
                </div>

                <div className="flex justify-between text-base font-bold text-gray-900 py-6">
                  <span>Total</span>
                  <span className="text-xl text-blue-600">${subtotal.toLocaleString()}</span>
                </div>

                <button
                  onClick={() => {
                    toast.success('Order placed successfully!', {
                      description: 'Thank you for shopping with V-Mac.'
                    });
                    localStorage.removeItem('vmac_cart');
                    setCartItems([]);
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-2xl text-sm font-semibold transition-all shadow-sm cursor-pointer"
                >
                  Check Out
                </button>
                
                <p className="text-[11px] text-gray-400 text-center mt-4">
                  Secure checkout powered by V-Mac Secure Pay.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 pt-12 border-t border-gray-200 text-center text-xs text-gray-400">
        <p>&copy; {new Date().getFullYear()} V-Mac Tech Store. All rights reserved.</p>
      </footer>
    </div>
  );
}