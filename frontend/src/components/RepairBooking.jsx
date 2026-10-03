import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const DEVICES = [
  { id: 'Laptop', label: 'Laptop', icon: 'M9.75 17L9 20m5.75-3l.75 3M5 13h14M5 7h14a2 2 0 012 2v4a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2z' },
  { id: 'Desktop', label: 'Desktop', icon: 'M9.75 17L9 20m5.75-3l.75 3M5 3h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z' },
  { id: 'Mac', label: 'Mac', icon: 'M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.72c.57-.69.96-1.64.85-2.6-.84.03-1.87.56-2.47 1.25-.53.59-.99 1.56-.87 2.49.94.07 1.9-.55 2.49-1.14z' },
  { id: 'Phone', label: 'Phone', icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z' },
  { id: 'Tablet', label: 'Tablet', icon: 'M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z' },
  { id: 'Printer', label: 'Printer', icon: 'M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6v-8z' },
  { id: 'Monitor', label: 'Monitor', icon: 'M9.75 17L9 20m5.75-3l.75 3M4 5h16a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1z' },
  { id: 'Internet', label: 'Internet', icon: 'M12 21a9 9 0 100-18 9 9 0 000 18zm0 0a8.959 8.959 0 01-5.631-2m11.262 0A8.959 8.959 0 0112 21m0-18a8.959 8.959 0 00-5.631 2m11.262 0A8.959 8.959 0 0012 3m0 0v18m-9-9h18' },
  { id: 'TV', label: 'TV', icon: 'M7 4h10a2 2 0 012 2v8a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2zM8 18h8m-4 3v-3' },
  { id: 'Other', label: 'Other', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' }
];

const SERVICE_TYPES = [
  { id: 'Bring to shop', title: 'Bring to shop', desc: 'Drop off your device at our location.' },
  { id: 'Pickup/drop-off', title: 'Pickup/drop-off', desc: "We'll pick up and return your device." },
  { id: 'Home service', title: 'Home service', desc: 'A technician visits your location.' },
];

const STEPS = [
  { number: 1, title: 'Device' },
  { number: 2, title: 'Details' },
  { number: 3, title: 'Service' },
  { number: 4, title: 'Your info' },
  { number: 5, title: 'Review' },
];

export default function RepairBooking() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [currentStep, setCurrentStep] = useState(location.state?.device ? 2 : 1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });

  const [formData, setFormData] = useState({
    device: location.state?.device || '',
    brand: '',
    model: '',
    problem: '',
    description: '',
    photoFile: null,
    serviceType: 'Bring to shop',
    name: '',
    phone: '',
    email: '',
    address: '',
    date: '',
    time: '',
  });

  useEffect(() => {
    async function checkAuthAndLoadUser() {
      const { data: { session } } = await supabase.auth.getSession();
      const localUser = JSON.parse(localStorage.getItem('vmac_current_user') || 'null');
      
      // Redirect to home if user is not logged in
      if (!session?.user && (!localUser || Object.keys(localUser).length === 0)) {
        navigate('/', { replace: true });
        return;
      }

      const user = session?.user || localUser;
      if (user) {
        setFormData(prev => ({
          ...prev,
          name: user.user_metadata?.name || user.name || '',
          email: user.email || '',
          phone: user.user_metadata?.phone || user.phone || '',
          address: user.user_metadata?.address || user.address || '',
        }));
      }
    }
    checkAuthAndLoadUser();
  }, [navigate]);

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 4000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return Boolean(formData.device);
      case 2:
        return Boolean(formData.brand.trim() && formData.problem.trim());
      case 3:
        return Boolean(formData.serviceType);
      case 4:
        return Boolean(formData.name.trim() && formData.phone.trim() && formData.email.trim() && formData.address.trim());
      case 5:
        return Boolean(
          formData.device && 
          formData.brand.trim() && 
          formData.problem.trim() && 
          formData.serviceType && 
          formData.name.trim() && 
          formData.phone.trim() &&
          formData.email.trim() &&
          formData.address.trim()
        );
      default:
        return true;
    }
  };

  const handleContinue = () => {
    if (currentStep < 5 && isStepValid()) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isStepValid() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session?.user) {
        showToast('You must be logged in to submit a repair request.');
        setIsSubmitting(false);
        return;
      }

      let imageUrl = null;

      // 1. Upload photo to Supabase Storage if selected (Camera or Gallery)
      if (formData.photoFile) {
        const fileExt = formData.photoFile.name.split('.').pop() || 'jpg';
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('repair-images')
          .upload(fileName, formData.photoFile);

        if (uploadError) {
          console.error('Storage upload error:', uploadError.message);
          showToast(`Failed to upload image: ${uploadError.message}`);
          setIsSubmitting(false);
          return;
        }

        const { data: publicUrlData } = supabase.storage
          .from('repair-images')
          .getPublicUrl(fileName);

        imageUrl = publicUrlData.publicUrl;
      }

      let dbServiceType = 'drop_off';
      if (formData.serviceType === 'Home service') {
        dbServiceType = 'home_service';
      } else {
        dbServiceType = 'drop_off';
      }

      const brandModel = formData.model.trim() 
        ? `${formData.brand.trim()} ${formData.model.trim()}` 
        : formData.brand.trim();

      const issueDescription = formData.description.trim()
        ? `${formData.problem.trim()} - Details: ${formData.description.trim()}`
        : formData.problem.trim();

      // 2. Send repair data including image_url and address to backend API
      const response = await fetch('http://localhost:5000/api/repairs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_id: session.user.id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          device_type: formData.device,
          brand_model: brandModel,
          issue_description: issueDescription,
          service_type: dbServiceType,
          image_url: imageUrl,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        console.error('Backend submission error:', result.error);
        showToast(`Failed to submit: ${result.error || 'Unknown error'}`);
        setIsSubmitting(false);
        return;
      }

      showToast('Submitted successfully!');
      setTimeout(() => {
        navigate('/user-portal');
      }, 2000);
    } catch (err) {
      console.error('Unexpected error:', err);
      showToast('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFD] text-[#1D1D1F] selection:bg-blue-600 selection:text-white pb-20">
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center space-x-3 transition-all text-xs font-medium">
          <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>{toast.message}</span>
        </div>
      )}

      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-gray-200/60">
        <div className="max-w-6xl mx-auto px-8 h-16 flex justify-between items-center">
          <div className="text-xl font-semibold tracking-tight">
            <Link to="/" className="flex items-center space-x-1">
              <span className="text-blue-600 font-bold">V-</span>
              <span className="text-gray-900">Mac</span>
            </Link>
          </div>
          <Link 
            to="/user-portal" 
            className="text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            Back to Portal
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 pt-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900">
            Book a Repair
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            Tell us about your device and we'll take it from there.
          </p>
        </div>

        <div className="mb-12 hidden sm:flex justify-between items-center px-4 relative">
          <div className="absolute left-8 right-8 top-4 h-[2px] bg-gray-200 -z-10" />
          {STEPS.map((step) => {
            const isCompleted = currentStep > step.number;
            const isCurrent = currentStep === step.number;

            return (
              <div key={step.number} className="flex flex-col items-center bg-[#FBFBFD] px-2">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                    isCompleted || isCurrent
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                      : 'bg-white text-gray-400 border border-gray-200'
                  }`}
                >
                  {isCompleted ? '✓' : step.number}
                </div>
                <span className={`text-xs mt-2 font-medium ${isCurrent ? 'text-gray-900 font-semibold' : 'text-gray-400'}`}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-3xl border border-gray-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.02)] p-8 md:p-12 transition-all">
          
          {currentStep === 1 && (
            <div>
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 tracking-tight">Select your device</h2>
                <p className="text-gray-400 text-xs mt-1">What kind of device needs repair?</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-10">
                {DEVICES.map((dev) => {
                  const isSelected = formData.device === dev.id;
                  return (
                    <button
                      key={dev.id}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, device: dev.id }))}
                      className={`flex flex-col items-center justify-center p-5 rounded-2xl border transition-all ${
                        isSelected 
                          ? 'border-blue-600 bg-blue-50/40 text-blue-600 shadow-sm ring-1 ring-blue-600' 
                          : 'border-gray-200/80 hover:border-gray-300 text-gray-600 bg-white'
                      }`}
                    >
                      <svg className="w-7 h-7 mb-3 stroke-[1.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d={dev.icon} />
                      </svg>
                      <span className="text-xs font-medium">{dev.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 tracking-tight">Device details</h2>
                <p className="text-gray-400 text-xs mt-1">Tell us about the brand and the problem.</p>
              </div>

              <div className="space-y-5 mb-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Brand *</label>
                    <input 
                      type="text" 
                      name="brand" 
                      value={formData.brand} 
                      onChange={handleChange} 
                      placeholder="e.g. Apple, Dell, Samsung" 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Model</label>
                    <input 
                      type="text" 
                      name="model" 
                      value={formData.model} 
                      onChange={handleChange} 
                      placeholder="e.g. MacBook Pro, Galaxy S22" 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Problem *</label>
                  <input 
                    type="text" 
                    name="problem" 
                    value={formData.problem} 
                    onChange={handleChange} 
                    placeholder="e.g. Screen cracked, won't turn on" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Description</label>
                  <textarea 
                    name="description" 
                    rows="3" 
                    value={formData.description} 
                    onChange={handleChange} 
                    placeholder="Describe the issue in more detail..." 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                  />
                </div>

                {/* Cross-Browser & Camera Compatible Photo Input */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Photo / Issue Proof (optional)</label>
                  <div className="flex items-center space-x-4">
                    <label className="flex-1 border-2 border-dashed border-gray-200 hover:border-blue-400 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all bg-gray-50/50">
                      <svg className="w-6 h-6 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      <span className="text-xs text-gray-700 font-medium text-center">
                        {formData.photoFile ? formData.photoFile.name : 'Click to snap photo or upload image'}
                      </span>
                      <span className="text-[10px] text-gray-400 mt-1">Supports JPG, PNG, WEBP (Camera & Gallery)</span>
                      <input 
                        type="file" 
                        accept="image/jpeg,image/png,image/webp" 
                        className="hidden" 
                        onChange={(e) => setFormData(prev => ({ ...prev, photoFile: e.target.files[0] || null }))}
                      />
                    </label>
                    {formData.photoFile && (
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, photoFile: null }))}
                        className="px-3.5 py-2 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all shrink-0 cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 tracking-tight">Choose service type</h2>
                <p className="text-gray-400 text-xs mt-1">How would you like to get your device to us?</p>
              </div>

              <div className="space-y-4 mb-10">
                {SERVICE_TYPES.map((service) => {
                  const isSelected = formData.serviceType === service.id;
                  return (
                    <div
                      key={service.id}
                      onClick={() => setFormData(prev => ({ ...prev, serviceType: service.id }))}
                      className={`p-5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected 
                          ? 'border-blue-600 bg-blue-50/30 ring-1 ring-blue-600 shadow-sm' 
                          : 'border-gray-200/80 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900">{service.title}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">{service.desc}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-300'}`}>
                        {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div>
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 tracking-tight">Your information</h2>
                <p className="text-gray-400 text-xs mt-1">So we can contact you and email your confirmation.</p>
              </div>

              <div className="space-y-4 mb-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">FULL NAME / COMPANY NAME *</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange} 
                      placeholder="Your name or company name" 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Phone *</label>
                    <input 
                      type="text" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleChange} 
                      placeholder="Your phone" 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Email *</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    placeholder="you@example.com" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Address *</label>
                  <input 
                    type="text" 
                    name="address" 
                    value={formData.address} 
                    onChange={handleChange} 
                    placeholder="Your address" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Preferred date</label>
                    <input 
                      type="date" 
                      name="date" 
                      value={formData.date} 
                      onChange={handleChange} 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm text-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Preferred time</label>
                    <input 
                      type="time" 
                      name="time" 
                      value={formData.time} 
                      onChange={handleChange} 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm text-gray-700"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div>
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 tracking-tight">Review & confirm</h2>
                <p className="text-gray-400 text-xs mt-1">Check the details before submitting.</p>
              </div>

              <div className="space-y-4 mb-10 text-sm">
                <div className="bg-gray-50/70 p-5 rounded-2xl border border-gray-200/80">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-3">Device</span>
                  <div className="grid grid-cols-2 gap-y-2">
                    <div><span className="text-gray-400 text-xs">Type</span> <p className="font-medium text-gray-800">{formData.device || '—'}</p></div>
                    <div><span className="text-gray-400 text-xs">Brand</span> <p className="font-medium text-gray-800">{formData.brand || '—'}</p></div>
                    <div><span className="text-gray-400 text-xs">Model</span> <p className="font-medium text-gray-800">{formData.model || '—'}</p></div>
                    <div><span className="text-gray-400 text-xs">Problem</span> <p className="font-medium text-gray-800">{formData.problem || '—'}</p></div>
                    <div className="col-span-2 mt-2">
                      <span className="text-gray-400 text-xs">Attached Photo</span> 
                      <p className="font-medium text-blue-600">{formData.photoFile ? formData.photoFile.name : 'None'}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50/70 p-5 rounded-2xl border border-gray-200/80">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-3">Service</span>
                  <div className="grid grid-cols-2 gap-y-2">
                    <div><span className="text-gray-400 text-xs">Service type</span> <p className="font-medium text-gray-800">{formData.serviceType}</p></div>
                    <div><span className="text-gray-400 text-xs">Preferred date</span> <p className="font-medium text-gray-800">{formData.date || '—'}</p></div>
                    <div><span className="text-gray-400 text-xs">Preferred time</span> <p className="font-medium text-gray-800">{formData.time || '—'}</p></div>
                  </div>
                </div>

                <div className="bg-gray-50/70 p-5 rounded-2xl border border-gray-200/80">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-3">Contact</span>
                  <div className="grid grid-cols-2 gap-y-2">
                    <div><span className="text-gray-400 text-xs">Name / Company</span> <p className="font-medium text-gray-800">{formData.name || '—'}</p></div>
                    <div><span className="text-gray-400 text-xs">Phone</span> <p className="font-medium text-gray-800">{formData.phone || '—'}</p></div>
                    <div className="col-span-2"><span className="text-gray-400 text-xs">Email</span> <p className="font-medium text-gray-800">{formData.email || '—'}</p></div>
                    <div className="col-span-2"><span className="text-gray-400 text-xs">Address</span> <p className="font-medium text-gray-800">{formData.address || '—'}</p></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center pt-8 border-t border-gray-100">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-full text-xs font-medium text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
              >
                ← Back
              </button>
            ) : <div />}

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleContinue}
                disabled={!isStepValid()}
                className={`px-8 py-3 rounded-full text-xs font-semibold transition-all shadow-sm ${
                  !isStepValid()
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 hover:shadow-blue-500/30 shadow-md cursor-pointer'
                }`}
              >
                Continue →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!isStepValid() || isSubmitting}
                className={`px-8 py-3 rounded-full text-xs font-semibold transition-all shadow-sm ${
                  !isStepValid() || isSubmitting
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 shadow-md cursor-pointer'
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit request →'}
              </button>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}