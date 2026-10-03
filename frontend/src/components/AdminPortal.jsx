import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function AdminPortal() {
  const navigate = useNavigate();
  const [repairs, setRepairs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [toast, setToast] = useState({ show: false, message: '' });

  useEffect(() => {
    // Guard check for admin authentication
    const isAdmin = localStorage.getItem('vmac_admin_auth') === 'true';
    if (!isAdmin) {
      navigate('/');
      return;
    }
    fetchRepairs();
  }, [navigate]);

  const fetchRepairs = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('repairs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching repairs:', error);
        showToast('Failed to load repair requests.');
      } else {
        setRepairs(data || []);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      showToast('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 4000);
  };

  const handleLogout = () => {
    localStorage.removeItem('vmac_admin_auth');
    navigate('/');
  };

  const filteredRepairs = filter === 'All' 
    ? repairs 
    : repairs.filter(r => (r.status || 'Request Received')?.toLowerCase() === filter.toLowerCase());

  const stats = {
    total: repairs.length,
    requestReceived: repairs.filter(r => !r.status || r.status === 'Submitted' || r.status === 'Pending' || r.status === 'Request Received').length,
    inRepair: repairs.filter(r => r.status === 'In Progress' || r.status === 'In Repair').length,
    completed: repairs.filter(r => r.status === 'Completed').length,
  };

  return (
    <div className="min-h-screen bg-[#FBFBFD] text-[#1D1D1F] selection:bg-blue-600 selection:text-white pb-20">
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
        <div className="max-w-7xl mx-auto px-8 h-16 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <span className="text-xl font-semibold tracking-tight">
              <span className="text-blue-600 font-bold">V-</span>
              <span className="text-gray-900">Mac</span>
            </span>
            <span className="text-[11px] bg-blue-50 text-blue-600 font-semibold px-2.5 py-1 rounded-full border border-blue-100/60">
              Admin Portal
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors">
              View Site
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-full text-xs font-medium bg-gray-100 hover:bg-gray-200/80 text-gray-700 transition-all cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-10">
        {/* Title & Overview */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900">
            Dashboard Overview
          </h1>
          <p className="text-gray-500 text-xs mt-1.5">
            Manage incoming repair requests and monitor records.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-gray-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Total Requests</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1.5">{stats.total}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-500">Request Received</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1.5">{stats.requestReceived}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-500">In Repair</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1.5">{stats.inRepair}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-500">Completed</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1.5">{stats.completed}</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
          {['All', 'Request Received', 'In Repair', 'Completed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                filter === tab
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                  : 'bg-white text-gray-600 border border-gray-200/60 hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Repairs Table */}
        <div className="bg-white rounded-3xl border border-gray-200/60 shadow-[0_4px_24px_rgba(0,0,0,0.03)] overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-xs text-gray-400">Loading repair requests...</div>
          ) : filteredRepairs.length === 0 ? (
            <div className="p-12 text-center text-xs text-gray-400">No repair requests found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50 text-gray-400 uppercase tracking-wider font-semibold text-[10px]">
                    <th className="py-3 px-4 pl-6">Repair #</th>
                    <th className="py-3 px-4">Device / Model</th>
                    <th className="py-3 px-4">Issue Description</th>
                    <th className="py-3 px-4">Service Type</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 pr-6 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100/80">
                  {filteredRepairs.map((repair) => (
                    <tr key={repair.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-4 pl-6 font-semibold text-blue-600">
                        {repair['repair-number'] || '—'}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-gray-900 block">{repair.device_type}</span>
                        <span className="text-gray-500 text-[11px]">{repair.brand_model || '—'}</span>
                      </td>
                      <td className="py-3 px-4 text-gray-700 max-w-xs truncate" title={repair.issue_description}>
                        {repair.issue_description || '—'}
                      </td>
                      <td className="py-3 px-4 text-gray-600 font-medium">
                      </td>
                      <td className="py-3 px-4 text-gray-500">
                        {repair.created_at ? new Date(repair.created_at).toLocaleDateString() : '—'}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-full font-medium text-[10px] inline-block ${
                          repair.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/40' :
                          repair.status === 'In Repair' ? 'bg-amber-50 text-amber-600 border border-amber-200/40' :
                          'bg-blue-50 text-blue-600 border border-blue-200/40'
                        }`}>
                          {repair.status || 'Request Received'}
                        </span>
                      </td>
                      <td className="py-3 px-4 pr-6 text-right">
                        <button
                          onClick={() => navigate(`/admin-portal/details/${repair['repair-number']}`)}
                          className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-blue-50 hover:text-blue-600 text-gray-700 font-semibold transition-all cursor-pointer"
                        >
                          View →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}