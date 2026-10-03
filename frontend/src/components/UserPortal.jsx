import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function UserPortal() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'history'
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserRepairs() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          navigate('/');
          return;
        }

        const { data, error } = await supabase
          .from('repairs')
          .select('*')
          .eq('customer_id', session.user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching repairs:', error);
        } else {
          setRepairs(data || []);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchUserRepairs();
  }, [navigate]);

  // Filter repairs based on tab
  const activeRepairs = repairs.filter(r => r.status !== 'Completed' && r.status !== 'Cancelled');
  const historyRepairs = repairs.filter(r => r.status === 'Completed' || r.status === 'Cancelled');

  const displayedRepairs = activeTab === 'active' ? activeRepairs : historyRepairs;

  return (
    <div className="min-h-screen bg-[#FBFBFD] text-[#1D1D1F] pb-20">
      {/* Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-gray-200/60">
        <div className="max-w-6xl mx-auto px-8 h-16 flex justify-between items-center">
          <div className="text-xl font-semibold tracking-tight flex items-center space-x-1">
            <span className="text-blue-600 font-bold">V-</span>
            <span className="text-gray-900">Mac</span>
            <span className="text-xs text-gray-400 font-normal ml-2">Portal</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors">
              Back to Home
            </Link>
            <button 
              onClick={async () => {
                await supabase.auth.signOut();
                localStorage.removeItem('vmac_current_user');
                navigate('/');
              }}
              className="text-xs font-medium bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 pt-10">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900">
            Repair Dashboard
          </h1>
          <p className="text-gray-500 text-xs mt-1">
            Track your device diagnostics, active repairs, and service timelines in real time.
          </p>
        </div>

        {/* Action Bar & Tabs */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="bg-gray-200/70 p-1 rounded-full flex space-x-1 text-xs font-medium">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-5 py-2 rounded-full transition-all ${
                activeTab === 'active' ? 'bg-white text-gray-900 shadow-sm font-semibold' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Active Repairs ({activeRepairs.length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-5 py-2 rounded-full transition-all ${
                activeTab === 'history' ? 'bg-white text-gray-900 shadow-sm font-semibold' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Service History ({historyRepairs.length})
            </button>
          </div>

          <Link
            to="/repair-booking"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full text-xs font-semibold transition-all shadow-sm shadow-blue-500/20"
          >
            + New Repair Request
          </Link>
        </div>

        {/* Content Box */}
        {loading ? (
          <div className="bg-white rounded-3xl border border-gray-200/80 p-16 text-center text-gray-400 text-xs">
            Loading your repairs...
          </div>
        ) : displayedRepairs.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.02)] p-16 text-center">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl mx-auto flex items-center justify-center mb-4">
              <svg className="w-6 h-6 stroke-[1.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-gray-900">
              {activeTab === 'active' ? 'No active repair tickets' : 'No service history'}
            </h3>
            <p className="text-gray-400 text-xs mt-1 max-w-sm mx-auto">
              {activeTab === 'active' 
                ? "You don't have any devices currently checked in for service. Create a new request to get started."
                : "Completed or past repair records will appear here."}
            </p>
            {activeTab === 'active' && (
              <Link
                to="/repair-booking"
                className="inline-block mt-6 bg-[#1D1D1F] hover:bg-black text-white px-6 py-3 rounded-full text-xs font-medium transition-all"
              >
                Submit Device For Repair
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayedRepairs.map((repair) => (
              <div key={repair.id} className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">{repair.brand_model}</h3>
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
                      {repair.status}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-gray-500 mb-6">
                    <p><span className="text-gray-400">Device Type:</span> {repair.device_type}</p>
                    <p><span className="text-gray-400">Issue:</span> {repair.issue_description}</p>
                    <p><span className="text-gray-400">Submitted:</span> {new Date(repair.created_at).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-xs">
                  <span className="text-gray-400 font-medium">Estimated Cost: {repair.estimated_cost ? `$${repair.estimated_cost}` : 'Pending diagnosis'}</span>
                  <Link 
                    to={`/repair/${repair.id}`} 
                    className="font-semibold text-blue-600 hover:underline cursor-pointer"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}