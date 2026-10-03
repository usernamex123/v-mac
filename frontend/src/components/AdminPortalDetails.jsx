import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function AdminPortalDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [repair, setRepair] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '' });

  useEffect(() => {
    // Guard check for admin authentication
    const isAdmin = localStorage.getItem('vmac_admin_auth') === 'true';
    if (!isAdmin) {
      navigate('/');
      return;
    }
    fetchRepairDetails();
  }, [id, navigate]);

  const fetchRepairDetails = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('repairs')
        .select('*')
        .eq('repair-number', id)
        .single();

      if (error) {
        console.error('Error fetching repair details:', error);
        showToast('Failed to load repair details.');
      } else {
        // Fallback or default to 'Request Received' if status is empty/Submitted
        if (!data.status || data.status === 'Submitted') {
          data.status = 'Request Received';
        }
        setRepair(data);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      showToast('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const { error } = await supabase
        .from('repairs')
        .update({ status: newStatus })
        .eq('repair-number', id);

      if (error) {
        showToast(`Failed to update status: ${error.message}`);
      } else {
        showToast('Repair status updated successfully.');
        setRepair({ ...repair, status: newStatus });
      }
    } catch (err) {
      showToast('Failed to update status.');
    }
  };

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 4000);
  };

  return (
    <div className="min-h-screen bg-[#FBFBFD] text-[#1D1D1F] selection:bg-blue-600 selection:text-white pb-24">
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900/90 backdrop-blur-md text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center space-x-3 transition-all text-xs font-medium">
          <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-gray-200/60">
        <div className="max-w-5xl mx-auto px-8 h-16 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <span className="text-xl font-semibold tracking-tight">
              <span className="text-blue-600 font-bold">V-</span>
              <span className="text-gray-900">Mac</span>
            </span>
            <span className="text-[11px] bg-blue-50 text-blue-600 font-semibold px-2.5 py-1 rounded-full border border-blue-100/60">
              Request Details
            </span>
          </div>
          <Link
            to="/admin-portal"
            className="px-4 py-2 rounded-full text-xs font-medium bg-gray-100 hover:bg-gray-200/80 text-gray-700 transition-all"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 pt-12">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900">
              Repair Entry Details
            </h1>
            <p className="text-gray-500 text-xs mt-1.5">
              Complete database record for repair number: <span className="font-mono text-blue-600 font-semibold">{repair?.['repair-number'] || id}</span>
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-3xl border border-gray-200/60 p-16 text-center text-xs text-gray-400 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
            Loading details...
          </div>
        ) : !repair ? (
          <div className="bg-white rounded-3xl border border-gray-200/60 p-16 text-center text-xs text-gray-400 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
            Repair request not found.
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-gray-200/60 shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-8 md:p-12 space-y-8">
            
            {/* Status & Timestamp */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-gray-100">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 block mb-1.5">Current Status</span>
                <select
                  value={repair.status || 'Request Received'}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className={`px-3.5 py-1.5 rounded-full font-semibold text-xs border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                    repair.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-200/60' :
                    repair.status === 'In Repair' ? 'bg-amber-50 text-amber-600 border-amber-200/60' :
                    'bg-blue-50 text-blue-600 border-blue-200/60'
                  }`}
                >
                  <option value="Request Received">Request Received</option>
                  <option value="In Repair">In Repair</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 block mb-1.5">Submitted At</span>
                <span className="text-xs font-medium text-gray-700">
                  {repair.created_at ? new Date(repair.created_at).toLocaleString() : '—'}
                </span>
              </div>
            </div>

            {/* All Database Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              <div className="bg-[#FBFBFD] p-5 rounded-2xl border border-gray-200/60">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 block mb-1.5">Repair Number</span>
                <p className="text-sm font-mono font-semibold text-blue-600 tracking-tight">{repair['repair-number'] || '—'}</p>
              </div>

              <div className="bg-[#FBFBFD] p-5 rounded-2xl border border-gray-200/60">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 block mb-1.5">User ID</span>
                <p className="text-sm font-mono font-semibold text-gray-800 tracking-tight">{repair['user-id'] || '—'}</p>
              </div>

              <div className="bg-[#FBFBFD] p-5 rounded-2xl border border-gray-200/60">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 block mb-1.5">Full Name / Company Name</span>
                <p className="text-sm font-medium text-gray-900">{repair.name || '—'}</p>
              </div>

              <div className="bg-[#FBFBFD] p-5 rounded-2xl border border-gray-200/60">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 block mb-1.5">Phone Number</span>
                <p className="text-sm font-medium text-gray-900">{repair.phone || '—'}</p>
              </div>

              <div className="bg-[#FBFBFD] p-5 rounded-2xl border border-gray-200/60">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 block mb-1.5">Email Address</span>
                <p className="text-sm font-medium text-gray-900">{repair.email || '—'}</p>
              </div>

              <div className="bg-[#FBFBFD] p-5 rounded-2xl border border-gray-200/60">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 block mb-1.5">Address</span>
                <p className="text-sm font-medium text-gray-900">{repair.address || '—'}</p>
              </div>

              <div className="bg-[#FBFBFD] p-5 rounded-2xl border border-gray-200/60">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 block mb-1.5">Device Type</span>
                <p className="text-sm font-medium text-gray-900">{repair.device_type || '—'}</p>
              </div>

              <div className="bg-[#FBFBFD] p-5 rounded-2xl border border-gray-200/60">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 block mb-1.5">Brand & Model</span>
                <p className="text-sm font-medium text-gray-900">{repair.brand_model || '—'}</p>
              </div>

              <div className="bg-[#FBFBFD] p-5 rounded-2xl border border-gray-200/60">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 block mb-1.5">Service Type</span>
                <p className="">
                </p>
              </div>

              <div className="bg-[#FBFBFD] p-5 rounded-2xl border border-gray-200/60 md:col-span-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 block mb-1.5">Issue Description</span>
                <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{repair.issue_description || '—'}</p>
              </div>

            </div>

            {/* Attached Image Section (At the Bottom) */}
            <div className="bg-[#FBFBFD] p-6 rounded-2xl border border-gray-200/60 pt-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Attached Image Preview</span>
                {repair.image_url && (
                  <a
                    href={repair.image_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors flex items-center space-x-1"
                  >
                    <span>Open Full Size</span>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>

              {repair.image_url ? (
                <div className="rounded-xl overflow-hidden border border-gray-200/60 bg-white flex items-center justify-center p-4">
                  <img
                    src={repair.image_url}
                    alt="Repair Issue"
                    className="max-h-[420px] w-auto object-contain rounded-lg cursor-zoom-in hover:opacity-95 transition-opacity"
                    onClick={() => window.open(repair.image_url, '_blank')}
                    title="Click to view full size"
                  />
                </div>
              ) : (
                <div className="p-12 text-center bg-white rounded-xl border border-gray-200/60 text-xs text-gray-400 font-medium">
                  No image found
                </div>
              )}
            </div>

          </div>
        )}
      </main>
    </div>
  );
}