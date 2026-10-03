import React, { useState } from 'react';
import { Wrench, Phone, Mail, User, MapPin, Laptop, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast, Toaster } from 'sonner';

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    deviceType: 'Laptop',
    brandModel: '',
    issueDescription: '',
    serviceType: 'drop_off'
  });

  const [loading, setLoading] = useState(false);
  const [trackingToken, setTrackingToken] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/repairs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit repair request');
      }

      toast.success('Repair ticket created successfully!');
      setTrackingToken(data.trackingToken);
      
      // Reset form
      setFormData({
        name: '',
        phone: '',
        email: '',
        address: '',
        deviceType: 'Laptop',
        brandModel: '',
        issueDescription: '',
        serviceType: 'drop_off'
      });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" richColors />
      
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-amber-500/10 rounded-2xl text-amber-400 mb-4">
            <Wrench className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">V-mac Repair Center</h1>
          <p className="text-slate-400 mt-2">Book a professional repair service or request a home visit.</p>
        </div>

        {/* Success Tracking View */}
        {trackingToken ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-4 shadow-xl">
            <div className="inline-flex p-3 bg-emerald-500/10 text-emerald-400 rounded-full">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold">Booking Confirmed!</h2>
            <p className="text-slate-400">Save your tracking token below to check your repair status anytime:</p>
            
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-amber-400 select-all text-lg">
              {trackingToken}
            </div>

            <button
              onClick={() => setTrackingToken(null)}
              className="mt-4 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold rounded-xl transition"
            >
              Submit Another Request
            </button>
          </div>
        ) : (
          /* Form View */
          <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
            
            {/* Service Type Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Service Type</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, serviceType: 'drop_off' })}
                  className={`py-3 px-4 rounded-xl font-medium border text-sm transition ${
                    formData.serviceType === 'drop_off'
                      ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  Store Drop-Off
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, serviceType: 'home_service' })}
                  className={`py-3 px-4 rounded-xl font-medium border text-sm transition ${
                    formData.serviceType === 'home_service'
                      ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  Home Service Visit
                </button>
              </div>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+977 98XXXXXXXX"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Email Address (Optional)</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Device Type</label>
                <div className="relative">
                  <Laptop className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                  <select
                    name="deviceType"
                    value={formData.deviceType}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Laptop">Laptop</option>
                    <option value="Desktop">Desktop PC</option>
                    <option value="Smartphone">Smartphone</option>
                    <option value="Console">Gaming Console</option>
                    <option value="Other">Other Device</option>
                  </select>
                </div>
              </div>
            </div>

            {formData.serviceType === 'home_service' && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Home Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Street, City, Landmark"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Brand & Model</label>
              <input
                type="text"
                name="brandModel"
                required
                value={formData.brandModel}
                onChange={handleChange}
                placeholder="e.g., Acer Aspire E1-432 / MacBook Air M1"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Issue Description</label>
              <textarea
                name="issueDescription"
                required
                rows={4}
                value={formData.issueDescription}
                onChange={handleChange}
                placeholder="Describe what's wrong with the device..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl transition disabled:opacity-50"
            >
              {loading ? 'Submitting Request...' : 'Submit Repair Request'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}