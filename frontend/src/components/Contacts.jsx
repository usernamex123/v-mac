import React, { useState } from 'react';

export default function Contacts() {
  const [copied, setCopied] = useState(false);

  const handlePhoneClick = (e) => {
    const phoneNumber = "+977 23 571638";
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (!isMobile) {
      e.preventDefault();
      navigator.clipboard.writeText(phoneNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleEmailClick = (e) => {
    const email = "vmacacc@gmail.com";
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (!isMobile) {
      e.preventDefault();
      window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${email}`, '_blank');
    }
  };

  return (
    <footer id="contact" className="bg-[#111111] text-gray-300 py-16 relative">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Column 1: Brand / Logo */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-1.5 h-8 bg-blue-600 rounded"></div>
              <span className="text-2xl font-bold tracking-wider text-white uppercase">V-Mac</span>
            </div>
          </div>

          {/* Column 2: Useful Links */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4 relative pb-2 inline-block">
              Useful Links
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-blue-600"></span>
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#home" className="hover:text-blue-600 transition-colors flex items-center">
                  <span className="mr-2 text-gray-500">&gt;</span> Home
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-blue-600 transition-colors flex items-center">
                  <span className="mr-2 text-gray-500">&gt;</span> About us
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-blue-600 transition-colors flex items-center">
                  <span className="mr-2 text-gray-500">&gt;</span> Services
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-blue-600 transition-colors flex items-center">
                  <span className="mr-2 text-gray-500">&gt;</span> Terms of service
                </a>
              </li>
              <li>
                <a href="#privacy" className="hover:text-blue-600 transition-colors flex items-center">
                  <span className="mr-2 text-gray-500">&gt;</span> Privacy policy
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Us */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4 relative pb-2 inline-block">
              Contact Us
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-blue-600"></span>
            </h4>
            <div className="space-y-2 text-sm text-gray-300">
              <p>Damak-6, Thanaroad</p>
              <p>Koshi Province 35357</p>
              <p className="mb-4">Jhapa, Nepal</p>
              
              <p className="relative inline-block mb-1">
                <span className="font-semibold text-white">Phone:</span>{' '}
                <a 
                  href="tel:+97723571638" 
                  onClick={handlePhoneClick}
                  className="text-blue-600 hover:underline focus:outline-none relative"
                  title="Click to copy on desktop or call on mobile"
                >
                  +977 23 571638
                </a>
                {copied && (
                  <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-blue-600 text-xs px-2 py-1 rounded shadow border border-blue-600 whitespace-nowrap">
                    Copied!
                  </span>
                )}
              </p>
              
              <p className="block">
                <span className="font-semibold text-white">Email:</span>{' '}
                <a 
                  href="mailto:vmacacc@gmail.com" 
                  onClick={handleEmailClick}
                  className="hover:text-blue-600 transition-colors"
                  title="Click to compose email"
                >
                  vmacacc@gmail.com
                </a>
              </p>
            </div>

            {/* Social Icons */}
            <div className="flex space-x-3 mt-6">
              <a href="#" className="w-9 h-9 bg-[#222222] hover:bg-blue-600 hover:text-white rounded-full flex items-center justify-center transition-colors text-gray-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              <a href="#" className="w-9 h-9 bg-[#222222] hover:bg-blue-600 hover:text-white rounded-full flex items-center justify-center transition-colors text-gray-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.373 14.5 5 15.5 5H18V0h-3.808C10.559 0 9 1.558 9 4.711V8z"/></svg>
              </a>
              <a href="#" className="w-9 h-9 bg-[#222222] hover:bg-blue-600 hover:text-white rounded-full flex items-center justify-center transition-colors text-gray-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="#" className="w-9 h-9 bg-[#222222] hover:bg-blue-600 hover:text-white rounded-full flex items-center justify-center transition-colors text-gray-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}