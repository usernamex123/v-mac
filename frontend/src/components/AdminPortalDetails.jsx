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

  const handlePrint = () => {
    window.print();
  };

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 4000);
  };

  // Format database details into plain text for the QR code
  const qrTextData = repair ? [
    `--- V-MAC REPAIR RECEIPT ---`,
    `Repair #: ${repair['repair-number']}`,
    `Customer: ${repair.name || '—'}`,
    `Device Left: ${repair.device_type} (${repair.brand_model})`,
    `Status: ${repair.status}`,
    `Total Amount: ${repair.amount !== null && repair.amount !== undefined ? repair.amount : '—'}`,
    `Thank you for trusting V-Mac!`
  ].join('\n') : '';

  return (
    <div className="min-h-screen bg-[#FBFBFD] text-[#1D1D1F] selection:bg-blue-600 selection:text-white pb-24">
      {/* Print Styles: Zero browser margins, half-page A4 height */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page {
            size: A4 portrait;
            margin: 0 !important;
          }
          body {
            margin: 0 !important;
            background-color: white !important;
            -webkit-print-color-adjust: exact;
          }
          .print-receipt-sheet {
            width: 210mm;
            height: 148.5mm;
            max-height: 148.5mm;
            box-sizing: border-box;
            padding: 10mm 12mm;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            page-break-after: always;
          }
        }
      ` }} />

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900/95 backdrop-blur-md text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center space-x-3 transition-all text-xs font-medium print:hidden">
          <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-gray-200/60 print:hidden">
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

      <main className="max-w-5xl mx-auto px-6 pt-12 print:p-0">
        <div className="mb-8 flex justify-between items-center print:hidden">
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
          <div className="bg-white rounded-3xl border border-gray-200/60 p-16 text-center text-xs text-gray-400 shadow-[0_4px_24px_rgba(0,0,0,0.02)] print:hidden">
            Loading details...
          </div>
        ) : !repair ? (
          <div className="bg-white rounded-3xl border border-gray-200/60 p-16 text-center text-xs text-gray-400 shadow-[0_4px_24px_rgba(0,0,0,0.02)] print:hidden">
            Repair request not found.
          </div>
        ) : (
          <>
            {/* Screen View */}
            <div className="bg-white rounded-3xl border border-gray-200/60 shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-8 md:p-12 space-y-8 print:hidden">
              
              {/* Status, Print Button & Timestamp */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 block mb-1.5">Current Status</span>
                    <select
                      value={repair.status || 'Request Received'}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      className={`px-3.5 py-2 rounded-full font-semibold text-xs border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600 ${
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
                  <div className="self-end">
                    <button
                      onClick={handlePrint}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer h-[34px]"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                      </svg>
                      Print Receipt
                    </button>
                  </div>
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
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 block mb-1.5">Total Amount</span>
                  <p className="text-sm font-mono font-bold text-blue-600">{repair.amount !== null && repair.amount !== undefined ? repair.amount : '—'}</p>
                </div>
                <div className="bg-[#FBFBFD] p-5 rounded-2xl border border-gray-200/60 md:col-span-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 block mb-1.5">Issue Description</span>
                  <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{repair.issue_description || '—'}</p>
                </div>
              </div>

              {/* Attached Image Section */}
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

            {/* Print View: Clean Half-Page Sheet with Total Amount on the Downside */}
            <div className="hidden print:flex print-receipt-sheet bg-white text-[#1D1D1F] font-sans">
              <div>
                {/* Top Header */}
                <div className="flex justify-between items-start border-b border-gray-200 pb-3 mb-4">
                  <div>
                    <h2 className="text-xl font-bold tracking-tight">
                      <span className="text-blue-600">V-</span>Mac
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">Repair Service Receipt</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono font-bold text-blue-600">{repair['repair-number']}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {repair.created_at ? new Date(repair.created_at).toLocaleDateString() : '—'}
                    </p>
                  </div>
                </div>

                {/* 3-Column Layout: Customer | Device Details | QR Code */}
                <div className="grid grid-cols-3 gap-4 pb-4 mb-2 text-sm">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Customer</span>
                    <p className="font-bold text-gray-900 text-base">{repair.name || '—'}</p>
                    <p className="text-gray-700 mt-0.5 font-medium">{repair.phone || '—'}</p>
                    <p className="text-gray-700 mt-0.5">{repair.email || '—'}</p>
                    <p className="text-gray-700 mt-0.5">{repair.address || '—'}</p>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Device Details</span>
                    <p className="font-bold text-gray-900 text-base">{repair.device_type}</p>
                    <p className="text-gray-700 mt-0.5 font-medium">{repair.brand_model}</p>
                  </div>
                  <div className="flex flex-col items-center justify-center text-center">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Scan to View</span>
                    <div className="w-20 h-20 bg-white p-1 border border-gray-200 rounded flex items-center justify-center shadow-xs">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrTextData)}`}
                        alt="Repair QR Code"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="text-[10px] font-mono text-gray-500 mt-1 font-semibold">{repair['repair-number']}</span>
                  </div>
                </div>

                {/* Total Amount Section on the Downside */}
                <div className="flex justify-end items-center pt-3 border-t border-gray-100 mt-2">
                  <div className="bg-gray-50 px-5 py-2.5 rounded-xl border border-gray-200/60 flex items-center space-x-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Total Amount:</span>
                    <span className="text-base font-bold text-blue-600 font-mono">
                      {repair.amount !== null && repair.amount !== undefined ? repair.amount : '—'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer Note */}
              <div className="pt-2 border-t border-gray-100 text-center">
                <p className="text-[11px] text-gray-400 font-medium">Thank you for trusting V-Mac. Please present this receipt upon device pickup.</p>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}