import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Login from './Login';

export default function Navbar() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeSection, setActiveSection] = useState('#hero');

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

    // 2. Listen for real-time auth changes (handles logouts or session drops)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setCurrentUser(session.user);
        localStorage.setItem('vmac_current_user', JSON.stringify(session.user));
      } else {
        setCurrentUser(null);
        localStorage.removeItem('vmac_current_user');
      }
    });

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);

    // Intersection Observer to track active section during scrolling
    const sections = ['#hero', '#about', '#products', '#services', '#contact'];
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(`#${entry.target.id}`);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach((selector) => {
      const el = document.querySelector(selector);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
      subscription?.unsubscribe();
    };
  }, []);

  const scrollToSection = (e, targetId) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    setActiveSection(targetId);
    const element = document.querySelector(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
          isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <div className="logo">
            <a href="#hero" onClick={(e) => scrollToSection(e, '#hero')} className="text-2xl font-bold tracking-tight">
              <span className="text-blue-600">V-</span>
              <span className={isScrolled ? 'text-gray-800' : 'text-white'}>Mac</span>
            </a>
          </div>

          {/* Desktop Navigation Menu & Right Action */}
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex items-center space-x-8">
              <a 
                href="#hero" 
                onClick={(e) => scrollToSection(e, '#hero')} 
                className={`font-medium hover:text-blue-600 transition-colors ${activeSection === '#hero' ? 'text-blue-600' : isScrolled ? 'text-gray-700' : 'text-white'}`}
              >
                Home
              </a>
              <a 
                href="#about" 
                onClick={(e) => scrollToSection(e, '#about')} 
                className={`font-medium hover:text-blue-600 transition-colors ${activeSection === '#about' ? 'text-blue-600' : isScrolled ? 'text-gray-700' : 'text-white'}`}
              >
                About
              </a>
              <a 
                href="#products" 
                onClick={(e) => scrollToSection(e, '#products')} 
                className={`font-medium hover:text-blue-600 transition-colors ${activeSection === '#products' ? 'text-blue-600' : isScrolled ? 'text-gray-700' : 'text-white'}`}
              >
                Products
              </a>
              <a 
                href="#services" 
                onClick={(e) => scrollToSection(e, '#services')} 
                className={`font-medium hover:text-blue-600 transition-colors ${activeSection === '#services' ? 'text-blue-600' : isScrolled ? 'text-gray-700' : 'text-white'}`}
              >
                Services
              </a>
              <a 
                href="#contact" 
                onClick={(e) => scrollToSection(e, '#contact')} 
                className={`font-medium hover:text-blue-600 transition-colors ${activeSection === '#contact' ? 'text-blue-600' : isScrolled ? 'text-gray-700' : 'text-white'}`}
              >
                Contact
              </a>
            </nav>

            {/* Dynamic Auth / Portal Button */}
            {currentUser ? (
              <Link
                to="/user-portal"
                className="px-4 py-2 rounded-lg font-medium text-sm transition-all shadow-sm bg-blue-600 hover:bg-blue-700 text-white"
              >
                User Portal
              </Link>
            ) : (
              <button
                onClick={() => setLoginModalOpen(true)}
                className="px-4 py-2 rounded-lg font-medium text-sm transition-all shadow-sm bg-blue-600 hover:bg-blue-700 text-white"
              >
                Login / Register
              </button>
            )}
          </div>

          {/* Mobile Menu & Action Container */}
          <div className="flex items-center space-x-4 md:hidden">
            {currentUser ? (
              <Link
                to="/user-portal"
                className="px-3 py-1.5 rounded-md font-medium text-xs bg-blue-600 hover:bg-blue-700 text-white"
              >
                Portal
              </Link>
            ) : (
              <button
                onClick={() => setLoginModalOpen(true)}
                className="px-3 py-1.5 rounded-md font-medium text-xs bg-blue-600 hover:bg-blue-700 text-white"
              >
                Login
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`focus:outline-none ${isScrolled ? 'text-gray-800' : 'text-white'}`}
              aria-label="Toggle Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg py-4 px-6 space-y-4">
            <a 
              href="#hero" 
              onClick={(e) => scrollToSection(e, '#hero')} 
              className={`block font-medium ${activeSection === '#hero' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
            >
              Home
            </a>
            <a 
              href="#about" 
              onClick={(e) => scrollToSection(e, '#about')} 
              className={`block font-medium ${activeSection === '#about' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
            >
              About
            </a>
            <a 
              href="#products" 
              onClick={(e) => scrollToSection(e, '#products')} 
              className={`block font-medium ${activeSection === '#products' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
            >
              Products
            </a>
            <a 
              href="#services" 
              onClick={(e) => scrollToSection(e, '#services')} 
              className={`block font-medium ${activeSection === '#services' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
            >
              Services
            </a>
            <a 
              href="#contact" 
              onClick={(e) => scrollToSection(e, '#contact')} 
              className={`block font-medium ${activeSection === '#contact' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
            >
              Contact
            </a>
          </div>
        )}
      </header>

      {/* Login Modal */}
      <Login isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
    </>
  );
}