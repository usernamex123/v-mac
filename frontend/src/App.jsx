import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Products from './components/Products';
import Backtotop from './components/Backtotop';
import Contacts from './components/Contacts';
import Services from './components/Services';
import UserPortal from './components/UserPortal';
import RepairBooking from './components/RepairBooking';
import RepairDetails from './components/RepairDetails';
import AdminPortal from './components/AdminPortal';
import AdminPortalDetails from './components/AdminPortalDetails';
import Shop from './components/Shop';

function LandingPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Products />
      <Services />
      <About />
      <Contacts />
      <Backtotop />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/user-portal" element={<UserPortal />} />
        <Route path="/repair-booking" element={<RepairBooking />} />
        <Route path="/user-portal/repair" element={<RepairBooking />} />
        <Route path="/repair/:id" element={<RepairDetails />} />
        <Route path="/admin-portal" element={<AdminPortal />} />
        <Route path="/admin-portal/details/:id" element={<AdminPortalDetails />} />
        <Route path="/shop" element={<Shop />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;