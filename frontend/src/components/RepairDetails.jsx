import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function RepairDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [repair, setRepair] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRepairDetails() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          navigate('/login');
          return;
        }
        setUser(session.user);

        const { data, error } = await supabase
          .from('repairs')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching repair:', error);
        } else {
          setRepair(data);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchRepairDetails();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBFBFD] flex items-center justify-center text-xs text-gray-400">
        Loading repair details...
      </div>
    );
  }

  if (!repair) {
    return (
      <div className="min-h-screen bg-[#FBFBFD] flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Repair ticket not found</h2>
        <Link to="/user-portal" className="text-xs font-semibold text-blue-600 hover:underline">
          ← Back to Portal
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(repair.created_at).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  // Simplified repair progress timeline steps (Request Received, In Repair, Completed)
  const steps = [
    { label: 'Request Received', desc: 'Repair request submitted', active: true },
    { label: 'In Repair', desc: 'Service in progress', active: ['In Progress', 'In Repair', 'Completed'].includes(repair.status) },
    { label: 'Completed', desc: 'Repair finished successfully', active: repair.status === 'Completed' }
  ];

  return (
    <div className="min-h-screen bg-[#FBFBFD] text-[#1D1D1F] pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-gray-200/60">
        <div className="max-w-5xl mx-auto px-8 h-16 flex justify-between items-center">
          <Link to="/user-portal" className="text-xs font-semibold text-blue-600 hover:underline flex items-center space-x-1">
            <span>← Back to Portal</span>
          </Link>
          <div className="text-sm font-medium text-gray-500">
            Service Details
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 pt-10 space-y-8">
        {/* Top Overview Card */}
        <div className="bg-white rounded-3xl border border-gray-200/80 p-8 shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 stroke-[1.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 capitalize">
                  {repair.device_type} · {repair.brand_model}
                </h1>
              </div>
            </div>
            <span className="text-xs font-semibold px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
              {repair.status || 'Request Received'}
            </span>
          </div>

          {/* Grid info cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
            <div className="bg-gray-50/70 p-4 rounded-2xl border border-gray-200/60">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 block mb-1">Problem</span>
              <p className="text-xs font-medium text-gray-800">{repair.issue_description}</p>
            </div>
            <div className="bg-gray-50/70 p-4 rounded-2xl border border-gray-200/60">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 block mb-1">Service type</span>
              <p className="text-xs font-medium text-gray-800 capitalize">{repair.service_type?.replace('_', ' ') || '—'}</p>
            </div>
            <div className="bg-gray-50/70 p-4 rounded-2xl border border-gray-200/60">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 block mb-1">Preferred date</span>
              <p className="text-xs font-medium text-gray-800">—</p>
            </div>

            <div className="bg-gray-50/70 p-4 rounded-2xl border border-gray-200/60">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 block mb-1">Technician</span>
              <p className="text-xs font-medium text-gray-800">{repair.technician_notes ? 'Assigned' : 'Not assigned yet'}</p>
            </div>
            <div className="bg-gray-50/70 p-4 rounded-2xl border border-gray-200/60">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 block mb-1">Estimated cost</span>
              <p className="text-xs font-medium text-gray-800">{repair.estimated_cost ? `$${repair.estimated_cost}` : 'Awaiting diagnosis'}</p>
            </div>
            <div className="bg-gray-50/70 p-4 rounded-2xl border border-gray-200/60">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 block mb-1">Final cost</span>
              <p className="text-xs font-medium text-gray-800">—</p>
            </div>

            <div className="bg-gray-50/70 p-4 rounded-2xl border border-gray-200/60">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 block mb-1">Payment status</span>
              <p className="text-xs font-medium text-gray-800">Pending</p>
            </div>
            <div className="bg-gray-50/70 p-4 rounded-2xl border border-gray-200/60 sm:col-span-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 block mb-1">Submitted</span>
              <p className="text-xs font-medium text-gray-800">{formattedDate}</p>
            </div>
          </div>
        </div>

        {/* Bottom Two Columns: Progress & Customer Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Repair Progress */}
          <div className="bg-white rounded-3xl border border-gray-200/80 p-8 shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
            <div className="flex items-center space-x-2 mb-6">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h2 className="text-base font-semibold text-gray-900">Repair progress</h2>
            </div>

            <div className="space-y-6 relative pl-4 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
              {steps.map((step, idx) => (
                <div key={idx} className="flex items-start space-x-4 relative">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 transition-all ${
                    step.active ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20' : 'bg-gray-100 text-gray-400 border border-gray-200'
                  }`}>
                    {step.active ? (
                      <svg className="w-3.5 h-3.5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-gray-300" />
                    )}
                  </div>
                  <div>
                    <h4 className={`text-xs font-semibold ${step.active ? 'text-gray-900' : 'text-gray-400'}`}>
                      {step.label} {step.active && idx === 0 && <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-600 ml-1" />}
                    </h4>
                    <p className="text-[11px] text-gray-400 mt-0.5">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Your Details */}
          <div className="bg-white rounded-3xl border border-gray-200/80 p-8 shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
            <div className="flex items-center space-x-2 mb-6">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <h2 className="text-base font-semibold text-gray-900">Your details</h2>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-center space-x-3 p-3.5 rounded-2xl bg-gray-50/70 border border-gray-200/60">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-gray-400 block">Name</span>
                  <span className="font-semibold text-gray-800">{user?.user_metadata?.name || user?.name || 'Valued Customer'}</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3.5 rounded-2xl bg-gray-50/70 border border-gray-200/60">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1.1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-gray-400 block">Phone</span>
                  <span className="font-semibold text-gray-800">{user?.user_metadata?.phone || user?.phone || 'Not provided'}</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3.5 rounded-2xl bg-gray-50/70 border border-gray-200/60">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-gray-400 block">Email</span>
                  <span className="font-semibold text-gray-800">{user?.email || 'Not provided'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}