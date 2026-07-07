'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, ShoppingCart, Calendar, Mail, FileText, CheckCircle, XCircle, RefreshCw, BarChart2 } from 'lucide-react';
import api from '../../../services/api';

export default function AdminDashboard() {
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'analytics' | 'subscriptions' | 'leads' | 'feedback'>('analytics');
  const [loading, setLoading] = useState(false);

  // Data states
  const [subscriptions, setSubscriptions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [communityLeads, setCommunityLeads] = useState([]);
  const [bulkLeads, setBulkLeads] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'ADMIN')) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const fetchData = async () => {
    if (!user || user.role !== 'ADMIN') return;
    setLoading(true);
    try {
      const subRes = await api.get('/subscriptions/admin');
      setSubscriptions(subRes.data.subscriptions);

      const orderRes = await api.get('/orders/admin');
      setOrders(orderRes.data.orders);

      const commLeadRes = await api.get('/leads/community/admin');
      setCommunityLeads(commLeadRes.data.orders);

      const bulkLeadRes = await api.get('/leads/bulk/admin');
      setBulkLeads(bulkLeadRes.data.orders);

      const fbRes = await api.get('/feedback/admin');
      setFeedbacks(fbRes.data.feedbacks);
    } catch (err) {
      console.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'ADMIN') {
      fetchData();
    }
  }, [user]);

  const handleUpdateLeadStatus = async (type: 'community' | 'bulk', id: string, nextStatus: string) => {
    try {
      await api.put(`/leads/${type}/${id}/status`, { status: nextStatus });
      fetchData();
    } catch (err) {
      alert('Failed to update lead status');
    }
  };

  if (authLoading || !user || user.role !== 'ADMIN') {
    return <div className="text-center py-20">Loading admin session...</div>;
  }

  // Analytics helper counts
  const totalRevenue = orders.reduce((sum: number, o: any) => sum + (o.status === 'PAID' ? o.total : 0), 0);
  const activeSubs = subscriptions.filter((s: any) => s.status === 'ACTIVE').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Title */}
      <div className="border border-card-border rounded-3xl glass-premium p-6 md:p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1 block">Management Console</span>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
            Ayudhara Admin Dashboard
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Analyze daily volumes, review pipeline B2B lead sheets, and configure dispenser networks.
          </p>
        </div>
        <button
          onClick={logout}
          className="px-5 py-2.5 rounded-full border border-red-200 dark:border-red-900/30 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 border border-card-border rounded-3xl glass p-4 space-y-1.5 shadow-sm">
          {[
            { id: 'analytics', label: 'Platform Analytics', icon: <BarChart2 size={16} /> },
            { id: 'subscriptions', label: 'Customer Plans', icon: <Calendar size={16} /> },
            { id: 'leads', label: 'B2B & Society Leads', icon: <Users size={16} /> },
            { id: 'feedback', label: 'Feedbacks & Reviews', icon: <FileText size={16} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-semibold text-left transition-all ${
                activeTab === tab.id
                  ? 'bg-secondary-blue text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Contents Column */}
        <div className="lg:col-span-9">
          {loading ? (
            <div className="text-center py-10 flex flex-col items-center justify-center gap-3">
              <RefreshCw size={24} className="animate-spin text-secondary-blue" />
              <span className="text-xs text-slate-400">Fetching platform telemetry...</span>
            </div>
          ) : activeTab === 'analytics' ? (
            /* Analytics Overview Tab */
            <div className="space-y-8">
              {/* Counts Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Active Subs', value: activeSubs, sub: 'Daily mornings drops' },
                  { label: 'Total Revenue', value: `₹${totalRevenue}`, sub: 'Shop sales complete' },
                  { label: 'Society Leads', value: communityLeads.length, sub: 'Gated waitlists' },
                  { label: 'Feedback Logs', value: feedbacks.length, sub: 'Star ratings count' },
                ].map((c) => (
                  <div key={c.label} className="border border-card-border rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-sm">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">{c.label}</span>
                    <span className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">{c.value}</span>
                    <span className="text-[10px] text-slate-400 block mt-1">{c.sub}</span>
                  </div>
                ))}
              </div>

              {/* Graphic Mock */}
              <div className="border border-card-border rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-sm">
                <h3 className="font-bold text-sm text-slate-950 dark:text-slate-100 mb-6">Weekly Volume Logs</h3>
                <div className="h-44 flex items-end justify-between gap-2.5 pt-4">
                  {[45, 60, 55, 70, 85, 90, 110].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full bg-secondary-blue rounded-t-lg transition-all hover:bg-sky-500" style={{ height: `${h}%` }}></div>
                      <span className="text-[9px] text-slate-400 font-semibold">Day {i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : activeTab === 'subscriptions' ? (
            /* Subscriptions Tab */
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Active Subscription Registrations</h2>

              <div className="border border-card-border rounded-3xl bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
                <table className="min-w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-semibold border-b border-card-border">
                      <th className="p-4">Customer</th>
                      <th className="p-4">Qty (L)</th>
                      <th className="p-4">Frequency</th>
                      <th className="p-4">Address</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-card-border">
                    {subscriptions.map((sub: any) => (
                      <tr key={sub.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="p-4 font-bold text-slate-900 dark:text-white">
                          <div>{sub.user?.name}</div>
                          <div className="text-[10px] text-slate-400 font-normal">{sub.user?.email}</div>
                        </td>
                        <td className="p-4 font-semibold text-slate-850 dark:text-slate-200">{sub.quantity}L</td>
                        <td className="p-4 capitalize">{sub.frequency.toLowerCase()}</td>
                        <td className="p-4 text-slate-400 max-w-[150px] truncate" title={sub.address}>{sub.address}</td>
                        <td className="p-4">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            sub.status === 'ACTIVE'
                              ? 'bg-green-50 text-green-700 dark:bg-green-950/20'
                              : 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950/20'
                          }`}>
                            {sub.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : activeTab === 'leads' ? (
            /* Leads Tab (B2B + Gated Communities) */
            <div className="space-y-8">
              {/* Communities Table */}
              <div>
                <h2 className="text-sm uppercase font-bold tracking-wider text-slate-400 mb-3.5">Gated Community Leads</h2>
                <div className="border border-card-border rounded-3xl bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
                  <table className="min-w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-semibold border-b border-card-border">
                        <th className="p-4">Complex Name</th>
                        <th className="p-4">Est. Liters</th>
                        <th className="p-4">Families</th>
                        <th className="p-4">Contact</th>
                        <th className="p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-card-border">
                      {communityLeads.map((c: any) => (
                        <tr key={c.id}>
                          <td className="p-4 font-bold text-slate-900 dark:text-white">
                            <div>{c.apartmentName}</div>
                            <div className="text-[10px] text-slate-400 font-normal">{c.location}</div>
                          </td>
                          <td className="p-4 font-semibold">{c.quantity}L</td>
                          <td className="p-4">{c.families}</td>
                          <td className="p-4">
                            <div>{c.contactName}</div>
                            <div className="text-[10px] text-slate-400 font-normal">{c.phone}</div>
                          </td>
                          <td className="p-4">
                            {c.status === 'PENDING' ? (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleUpdateLeadStatus('community', c.id, 'APPROVED')}
                                  className="p-1 rounded-md text-green-500 hover:bg-green-50 dark:hover:bg-green-950/20"
                                  title="Approve"
                                >
                                  <CheckCircle size={16} />
                                </button>
                                <button
                                  onClick={() => handleUpdateLeadStatus('community', c.id, 'REJECTED')}
                                  className="p-1 rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                                  title="Reject"
                                >
                                  <XCircle size={16} />
                                </button>
                              </div>
                            ) : (
                              <span className="text-[10px] text-slate-400 font-semibold">{c.status}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* B2B Table */}
              <div>
                <h2 className="text-sm uppercase font-bold tracking-wider text-slate-400 mb-3.5">B2B Corporate Leads</h2>
                <div className="border border-card-border rounded-3xl bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
                  <table className="min-w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-semibold border-b border-card-border">
                        <th className="p-4">Business</th>
                        <th className="p-4">Product / Qty</th>
                        <th className="p-4">Frequency</th>
                        <th className="p-4">Expected Date</th>
                        <th className="p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-card-border">
                      {bulkLeads.map((b: any) => (
                        <tr key={b.id}>
                          <td className="p-4 font-bold text-slate-900 dark:text-white">
                            <div>{b.businessName}</div>
                            <div className="text-[10px] text-slate-400 font-normal">{b.contactName} ({b.phone})</div>
                          </td>
                          <td className="p-4">
                            <div>{b.products}</div>
                            <div className="text-[10px] text-slate-400 font-normal">{b.quantity} units</div>
                          </td>
                          <td className="p-4 uppercase">{b.frequency}</td>
                          <td className="p-4 text-slate-400">{new Date(b.expectedDate).toLocaleDateString()}</td>
                          <td className="p-4">
                            {b.status === 'PENDING' ? (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleUpdateLeadStatus('bulk', b.id, 'APPROVED')}
                                  className="p-1 rounded-md text-green-500 hover:bg-green-50 dark:hover:bg-green-950/20"
                                  title="Approve"
                                >
                                  <CheckCircle size={16} />
                                </button>
                                <button
                                  onClick={() => handleUpdateLeadStatus('bulk', b.id, 'REJECTED')}
                                  className="p-1 rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                                  title="Reject"
                                >
                                  <XCircle size={16} />
                                </button>
                              </div>
                            ) : (
                              <span className="text-[10px] text-slate-400 font-semibold">{b.status}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            /* Feedback Tab */
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Customer Star Reviews Logs</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {feedbacks.map((fb: any) => {
                  const ratings = JSON.parse(fb.ratings);
                  return (
                    <div key={fb.id} className="border border-card-border rounded-2xl bg-white dark:bg-slate-900 p-5 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white">{fb.name}</h4>
                          <span className="text-[9px] text-slate-400 block">{fb.email}</span>
                        </div>
                        <span className="text-xs font-bold text-yellow-500 bg-yellow-50 dark:bg-yellow-950/20 px-2 py-0.5 rounded-full">
                          {ratings.overall}★
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic">
                        "{fb.comment}"
                      </p>
                      <div className="flex gap-2 text-[9px] text-slate-400 border-t border-card-border/60 pt-2.5">
                        <span>Quality: {ratings.quality}★</span>
                        <span>Delivery: {ratings.delivery}★</span>
                        <span>Packaging: {ratings.packaging}★</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
