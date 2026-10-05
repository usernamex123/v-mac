import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Login from './Login';

export default function Hero() {
  const navigate = useNavigate();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // 1. Verify actual live Supabase session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setCurrentUser(session.user);
        localStorage.setItem('vmac_current_user', JSON.stringify(session.user));
      } else {
        setCurrentUser(null);
        localStorage.removeItem('vmac_current_user');
      }
    });

    // 2. Listen for real-time auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setCurrentUser(session.user);
        localStorage.setItem('vmac_current_user', JSON.stringify(session.user));
      } else {
        setCurrentUser(null);
        localStorage.removeItem('vmac_current_user');
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const handleGetStarted = (e) => {
    e.preventDefault();
    if (currentUser) {
      navigate('/user-portal');
    } else {
      setLoginModalOpen(true);
    }
  };

  return (
    <>
      <section id="hero" className="relative h-screen flex items-center justify-center bg-gray-950 overflow-hidden">
        {/* Background Image - Clear with no blur */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-65" 
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1920&q=80')` }}
        ></div>
        
        {/* Mild Side Vignette & Subtle Center Tint */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60"></div>
        <div className="absolute inset-0 bg-black/35"></div>

        {/* Content Container */}
        <div className="relative container mx-auto px-6 text-center z-10 text-white">
          {/* Main Heading */}
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-8 animate-fade-in-down">
            We Provide Great Solutions <br className="hidden md:block" /> For Your Business
          </h1>

          {/* Single Blue Button with Smart Auth Check */}
          <div>
            <button
              onClick={handleGetStarted}
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-full transition-all shadow-lg cursor-pointer"
            >
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* Login Modal */}
      <Login isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
    </>
  );
}