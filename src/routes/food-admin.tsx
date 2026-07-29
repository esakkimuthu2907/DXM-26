import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle2, XCircle, Eye, Search, ArrowLeft, RefreshCw } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { isAdmin } from '@/lib/localdb';

export const Route = createFileRoute('/food-admin')({
  component: AdminFoodTokensComponent,
});

const ADMIN_TOKEN_KEY = 'dxm26_admin_token';

function AdminFoodTokensComponent() {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');

  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const getAdminToken = () => localStorage.getItem(ADMIN_TOKEN_KEY);

  const fetchAdminData = async () => {
    if (!isAdmin()) {
      navigate({ to: '/auth' });
      return;
    }
    const token = getAdminToken();
    setLoading(true);
    try {
      const [statsRes, reqsRes] = await Promise.all([
        fetch('/api/food/admin/stats', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/food/admin/requests', { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (statsRes.status === 401 || reqsRes.status === 401) {
        navigate({ to: '/auth' });
        return;
      }

      setData(await statsRes.json());
      setRequests(await reqsRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleApprove = async (id: string, fromModal = false) => {
    setActionLoading(true);
    const token = getAdminToken();
    try {
      const res = await fetch(`/api/food/admin/approve/${id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Approval failed');
      }
      showToast('✅ Token Approved & Generated!', 'success');
      await fetchAdminData();
      if (fromModal) setSelectedRequest(null);
    } catch (e: any) {
      showToast(e.message, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id: string, fromModal = false) => {
    if (!rejectReason.trim()) {
      showToast('Please enter a reason for rejection', 'error');
      return;
    }
    setActionLoading(true);
    const token = getAdminToken();
    try {
      const res = await fetch(`/api/food/admin/reject/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason: rejectReason }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Rejection failed');
      }
      showToast('❌ Request Rejected', 'success');
      await fetchAdminData();
      if (fromModal) setSelectedRequest(null);
      setRejectReason('');
    } catch (e: any) {
      showToast(e.message, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="animate-spin text-primary w-10 h-10" />
      </div>
    );

  const filteredRequests = requests.filter((r) => {
    const matchSearch =
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.college_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.token_id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const pieData = [
    { name: 'Vegetarian', value: data?.stats?.veg || 0, color: '#22c55e' },
    { name: 'Non-Vegetarian', value: data?.stats?.nonVeg || 0, color: '#ef4444' },
  ];

  const STAT_CARDS = [
    { label: 'Total', value: data?.stats?.total ?? 0, color: 'border-blue-500/50 bg-blue-500/10 text-blue-400' },
    { label: 'Pending', value: data?.stats?.pending ?? 0, color: 'border-yellow-500/50 bg-yellow-500/10 text-yellow-400' },
    { label: 'Approved', value: data?.stats?.approved ?? 0, color: 'border-green-500/50 bg-green-500/10 text-green-400' },
    { label: 'Rejected', value: data?.stats?.rejected ?? 0, color: 'border-red-500/50 bg-red-500/10 text-red-400' },
    { label: 'Veg', value: data?.stats?.veg ?? 0, color: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400' },
    { label: 'Non-Veg', value: data?.stats?.nonVeg ?? 0, color: 'border-orange-500/50 bg-orange-500/10 text-orange-400' },
    { label: "Today's", value: data?.stats?.today ?? 0, color: 'border-purple-500/50 bg-purple-500/10 text-purple-400' },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className={`fixed top-6 right-6 z-[100] px-6 py-3 rounded-xl shadow-2xl font-semibold text-sm border ${
              toast.type === 'success'
                ? 'bg-green-900/80 border-green-500/50 text-green-300'
                : 'bg-red-900/80 border-red-500/50 text-red-300'
            }`}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="border-b border-white/10 bg-black/80 backdrop-blur sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin" className="flex items-center gap-2 text-gray-400 hover:text-white transition text-sm">
            <ArrowLeft size={18} /> Admin Dashboard
          </Link>
          <div className="h-5 w-px bg-white/10" />
          <h1 className="font-bold text-lg">🍽️ Food Token Administration</h1>
        </div>
        <button
          onClick={fetchAdminData}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </header>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {STAT_CARDS.map((stat, i) => (
            <div key={i} className={`p-4 rounded-xl border ${stat.color} text-center`}>
              <p className="text-xs text-gray-400 mb-1">{stat.label}</p>
              <h3 className={`text-3xl font-black ${stat.color.split(' ').pop()}`}>{stat.value}</h3>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Food Preferences</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#000', borderColor: '#333', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Daily Requests</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.daily}>
                  <XAxis dataKey="date" stroke="#666" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#666" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                    contentStyle={{ backgroundColor: '#000', borderColor: '#333', borderRadius: '8px' }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Food Token Requests ({filteredRequests.length})</h3>
            <div className="flex gap-3 flex-wrap items-center">
              {(['All', 'Pending', 'Approved', 'Rejected'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                    statusFilter === s ? 'bg-primary text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {s}
                </button>
              ))}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                <input
                  type="text"
                  placeholder="Search by name, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-black/50 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors w-56"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 text-xs uppercase tracking-wider">
                  <th className="p-4 font-medium">Participant</th>
                  <th className="p-4 font-medium">College</th>
                  <th className="p-4 font-medium">Food Type</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((req) => (
                  <tr key={req._id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                    <td className="p-4">
                      <div className="font-semibold">{req.name}</div>
                      <div className="text-xs text-gray-500">{req.email}</div>
                      <div className="text-xs text-gray-600">{req.mobile}</div>
                    </td>
                    <td className="p-4 text-sm text-gray-300">{req.college_name}</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          req.food_type === 'Vegetarian'
                            ? 'bg-green-500/15 text-green-400 border border-green-500/30'
                            : 'bg-red-500/15 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {req.food_type}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          req.status === 'Approved'
                            ? 'bg-green-500/20 text-green-400'
                            : req.status === 'Rejected'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}
                      >
                        {req.status}
                      </span>
                      {req.token_id && <div className="text-xs text-gray-600 mt-1 font-mono">{req.token_id}</div>}
                    </td>
                    <td className="p-4 text-sm text-gray-400">
                      {new Date(req.created_at).toLocaleDateString('en-IN')}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2 flex-wrap">
                        {req.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(req._id)}
                              disabled={actionLoading}
                              className="flex items-center gap-1 bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition disabled:opacity-50"
                            >
                              <CheckCircle2 size={13} /> Approve
                            </button>
                            <button
                              onClick={() => { setSelectedRequest(req); setRejectReason(''); }}
                              className="flex items-center gap-1 bg-red-600/30 hover:bg-red-500/50 text-red-400 px-3 py-1.5 rounded-lg text-xs font-bold transition border border-red-500/30"
                            >
                              <XCircle size={13} /> Reject
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => setSelectedRequest(req)}
                          className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
                          title="View Details"
                        >
                          <Eye size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredRequests.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-gray-500">
                      <div className="text-4xl mb-3">🍽️</div>
                      No {statusFilter !== 'All' ? statusFilter.toLowerCase() : ''} requests found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detail / Reject Modal */}
      <AnimatePresence>
        {selectedRequest && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setSelectedRequest(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0e0e0e] border border-white/10 rounded-2xl p-7 w-full max-w-md shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedRequest(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white transition"
              >
                <XCircle size={22} />
              </button>

              <h2 className="text-xl font-bold mb-6">📋 Request Details</h2>

              <div className="space-y-3 mb-6 text-sm">
                <InfoRow label="Name" value={selectedRequest.name} />
                <InfoRow label="College" value={selectedRequest.college_name} />
                <InfoRow label="Email" value={selectedRequest.email} />
                <InfoRow label="Phone" value={selectedRequest.mobile} />
                <InfoRow label="Reg ID" value={selectedRequest.reg_id || '—'} />
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <span className="text-gray-500">Food Preference</span>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      selectedRequest.food_type === 'Vegetarian' ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'
                    }`}
                  >
                    {selectedRequest.food_type}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <span className="text-gray-500">Status</span>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      selectedRequest.status === 'Approved'
                        ? 'bg-green-500/20 text-green-400'
                        : selectedRequest.status === 'Rejected'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}
                  >
                    {selectedRequest.status}
                  </span>
                </div>
                {selectedRequest.token_id && <InfoRow label="Token ID" value={selectedRequest.token_id} mono />}
                {selectedRequest.rejection_reason && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                    <p className="text-red-400 text-xs font-semibold mb-1">Rejection Reason</p>
                    <p className="text-red-300 text-sm">{selectedRequest.rejection_reason}</p>
                  </div>
                )}
              </div>

              {selectedRequest.status === 'Pending' && (
                <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
                  <button
                    onClick={() => handleApprove(selectedRequest._id, true)}
                    disabled={actionLoading}
                    className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
                  >
                    {actionLoading ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <>
                        <CheckCircle2 size={18} /> Approve &amp; Generate Token
                      </>
                    )}
                  </button>
                  <div>
                    <textarea
                      placeholder="Enter reason for rejection (required)..."
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 focus:border-red-500/50 rounded-lg p-3 text-sm outline-none transition-colors mb-2 min-h-[70px] resize-none"
                    />
                    <button
                      onClick={() => handleReject(selectedRequest._id, true)}
                      disabled={actionLoading || !rejectReason.trim()}
                      className="w-full bg-red-600/20 hover:bg-red-600/40 text-red-400 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors border border-red-500/30 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {actionLoading ? (
                        <Loader2 className="animate-spin" size={18} />
                      ) : (
                        <>
                          <XCircle size={18} /> Reject Request
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InfoRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between items-center border-b border-white/5 pb-3">
      <span className="text-gray-500">{label}</span>
      <span className={`text-white ${mono ? 'font-mono text-xs bg-white/10 px-2 py-1 rounded' : 'font-medium'}`}>
        {value}
      </span>
    </div>
  );
}
