import React from 'react';

export default function About() {
  return (
    <section id="about" className="relative py-20 bg-white text-gray-800 overflow-hidden">
      {/* Subtle World Map Background with background lock (bg-fixed) */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed opacity-15 pointer-events-none" 
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1920&q=80')` 
        }}
      ></div>

      <div className="relative container mx-auto px-6 z-10 max-w-6xl">
        
        {/* About Us Heading and Intro Text */}
        <div className="text-center mb-16">
          <div className="mb-6">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight uppercase mb-3">
              About Us
            </h2>
            <div className="w-16 h-1 bg-blue-600 mx-auto rounded-full"></div>
          </div>

          <div className="max-w-4xl mx-auto space-y-4 text-gray-600 text-sm md:text-base leading-relaxed text-left md:text-justify">
            <p>
              Welcome to V-MAC, your trusted destination for quality computers, electronics, and IT accessories. We are dedicated to providing the best technology solutions for students, professionals, gamers, and businesses.
            </p>
            <p>
              At V-MAC, we believe in delivering top-quality products, fair prices, and excellent customer service. Whether you need a powerful laptop, a custom-built desktop, reliable networking devices, or everyday accessories, our team is here to guide you with expert advice and honest recommendations.
            </p>
            <p>
              With a focus on customer satisfaction, we ensure every product meets high standards of performance and reliability. Our goal is to make advanced technology easy, accessible, and affordable for everyone.
            </p>
          </div>
        </div>

        {/* 3 Cards Grid (Our Mission, Our Plan, Our Vision) with hover effect */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: Our Mission */}
          <div className="relative bg-white rounded-xl shadow-md overflow-hidden pb-6 border border-gray-100 flex flex-col group">
            <div className="h-48 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80" 
                alt="Our Mission" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            {/* Overlapping Badge with White Border Remaining Fixed on Hover */}
            <div className="absolute left-1/2 transform -translate-x-1/2 top-[156px] w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg border-4 border-white transition-all duration-300 group-hover:bg-white group-hover:text-blue-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="px-6 pt-8 text-center flex-1 flex flex-col">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Our Mission</h3>
              <p className="text-gray-600 text-xs md:text-sm leading-relaxed text-left">
                At V-MAC, our mission is to provide reliable, affordable, and high-quality technology solutions that empower individuals, students, and businesses to stay connected and productive in a fast-changing digital world.
              </p>
            </div>
          </div>

          {/* Card 2: Our Plan */}
          <div className="relative bg-white rounded-xl shadow-md overflow-hidden pb-6 border border-gray-100 flex flex-col group">
            <div className="h-48 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80" 
                alt="Our Plan" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            {/* Overlapping Badge with White Border Remaining Fixed on Hover */}
            <div className="absolute left-1/2 transform -translate-x-1/2 top-[156px] w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg border-4 border-white transition-all duration-300 group-hover:bg-white group-hover:text-blue-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="px-6 pt-8 text-center flex-1 flex flex-col">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Our Plan</h3>
              <p className="text-gray-600 text-xs md:text-sm leading-relaxed text-left">
                At V-MAC, our plan is to grow with our customers and provide smarter, more advanced technology services. We aim to become a leading and trusted tech hub in our community by focusing on innovation, customer satisfaction, and continuous improvement.
              </p>
            </div>
          </div>

          {/* Card 3: Our Vision */}
          <div className="relative bg-white rounded-xl shadow-md overflow-hidden pb-6 border border-gray-100 flex flex-col group">
            <div className="h-48 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80" 
                alt="Our Vision" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            {/* Overlapping Badge with White Border Remaining Fixed on Hover */}
            <div className="absolute left-1/2 transform -translate-x-1/2 top-[156px] w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg border-4 border-white transition-all duration-300 group-hover:bg-white group-hover:text-blue-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="px-6 pt-8 text-center flex-1 flex flex-col">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Our Vision</h3>
              <p className="text-gray-600 text-xs md:text-sm leading-relaxed text-left">
                At V-MAC, our vision is to become the most trusted and innovative technology store in our region—known for reliability, customer care, and modern tech solutions. We aim to create a place where everyone can access the latest technology with confidence and convenience.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}