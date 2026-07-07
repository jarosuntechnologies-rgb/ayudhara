'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Calendar, CreditCard, MapPin, User, LogOut, CheckCircle, RefreshCw, ShoppingBag, Eye } from 'lucide-react';
import api from '../../../services/api';

interface Subscription {
  id: string;
  productId: string;
  quantity: number;
  frequency: string;
  status: string; // ACTIVE, PAUSED
  startDate: string;
  address: string;
  phone: string;
}

interface Order {
  id: string;
  items: string; // JSON string
  total: number;
  status: string;
  razorpayOrderId: string;
  createdAt: string;
}

export default function CustomerDashboard() {
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'profile' | 'subscriptions' | 'orders'>('subscriptions');
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  // Profile Form States
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      setProfileName(user.name);
      setProfileEmail(user.email);
    }
  }, [user, authLoading, router]);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const subRes = await api.get('/subscriptions/my-subscriptions');
      setSubscriptions(subRes.data.subscriptions);

      const orderRes = await api.get('/orders/my-orders');
      setOrders(orderRes.data.orders);
    } catch (err) {
      console.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const toggleSubStatus = async (subId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    try {
      await api.put(`/subscriptions/${subId}/status`, { status: nextStatus });
      fetchData();
    } catch (err) {
      alert('Failed to update subscription status');
    }
  };

  if (authLoading || !user) {
    return <div className="text-center py-20">Loading dashboard session...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Welcome banner */}
      <div className="border border-card-border rounded-3xl glass-premium p-6 md:p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1 block">Customer panel</span>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
            Hello, {user.name}!
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Check your active subscriptions or view delivery order tracking lists.
          </p>
        </div>
        <button
          onClick={logout}
          className="px-5 py-2.5 rounded-full border border-red-200 dark:border-red-900/30 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <LogOut size={14} /> Log Out
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar Nav */}
        <div className="lg:col-span-3 border border-card-border rounded-3xl glass p-4 space-y-1.5 shadow-sm">
          {[
            { id: 'subscriptions', label: 'Subscriptions', icon: <Calendar size={16} /> },
            { id: 'orders', label: 'Order History', icon: <ShoppingBag size={16} /> },
            { id: 'profile', label: 'Account Profile', icon: <User size={16} /> },
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
              <span className="text-xs text-slate-400">Loading details...</span>
            </div>
          ) : activeTab === 'subscriptions' ? (
            /* Subscriptions Tab */
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Active Subscriptions</h2>
                <button
                  onClick={() => router.push('/subscriptions')}
                  className="px-4 py-2 rounded-full bg-secondary-blue hover:bg-sky-500 text-white text-xs font-semibold transition-colors"
                >
                  Create New Subscription
                </button>
              </div>

              {subscriptions.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-slate-900 border border-card-border rounded-3xl p-6">
                  <p className="text-slate-500 dark:text-slate-400 text-xs mb-4">You do not have any active daily milk plans yet.</p>
                  <button
                    onClick={() => router.push('/subscriptions')}
                    className="px-5 py-2.5 rounded-full border border-card-border hover:border-secondary-blue text-xs font-semibold transition-colors text-slate-700 dark:text-slate-200"
                  >
                    Set up your first plan
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {subscriptions.map((sub) => (
                    <div
                      key={sub.id}
                      className="border border-card-border rounded-3xl bg-white dark:bg-slate-900 shadow-sm p-6 space-y-4"
                    >
                      <div className="flex justify-between items-start border-b border-card-border/60 pb-3">
                        <div>
                          <h3 className="font-bold text-sm text-slate-900 dark:text-white">A2 Fresh Milk Plan</h3>
                          <span className="text-[10px] text-slate-400 block mt-0.5">Start: {new Date(sub.startDate).toLocaleDateString()}</span>
                        </div>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          sub.status === 'ACTIVE'
                            ? 'bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400'
                            : 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950/20 dark:text-yellow-400'
                        }`}>
                          {sub.status}
                        </span>
                      </div>

                      <div className="text-xs space-y-2 text-slate-500 dark:text-slate-400">
                        <div className="flex justify-between">
                          <span>Quantity</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">{sub.quantity} Liters/day</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Frequency</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200 capitalize">{sub.frequency.toLowerCase()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Phone</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">{sub.phone}</span>
                        </div>
                        <div className="flex flex-col">
                          <span>Address</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1 mt-0.5">{sub.address}</span>
                        </div>
                      </div>

                      <div className="flex gap-2.5 pt-3 border-t border-card-border/60">
                        <button
                          onClick={() => toggleSubStatus(sub.id, sub.status)}
                          className={`flex-1 py-2 rounded-full text-xs font-semibold border transition-colors ${
                            sub.status === 'ACTIVE'
                              ? 'bg-yellow-50 hover:bg-yellow-100 text-yellow-600 border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-900/30'
                              : 'bg-green-50 hover:bg-green-100 text-green-600 border-green-200 dark:bg-green-950/20 dark:border-green-900/30'
                          }`}
                        >
                          {sub.status === 'ACTIVE' ? 'Pause drops' : 'Resume drops'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : activeTab === 'orders' ? (
            /* Orders Tab */
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Order History</h2>

              {orders.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-slate-900 border border-card-border rounded-3xl p-6">
                  <p className="text-slate-500 dark:text-slate-400 text-xs">You have not completed any shop orders yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((ord) => {
                    const items = JSON.parse(ord.items);
                    return (
                      <div
                        key={ord.id}
                        className="border border-card-border rounded-2xl bg-white dark:bg-slate-900 shadow-sm p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="font-bold text-xs text-slate-800 dark:text-white">Order: #{ord.id.substring(0, 8)}</span>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                              ord.status === 'PAID'
                                ? 'bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400'
                                : 'bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400'
                            }`}>
                              {ord.status}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 flex gap-3">
                            <span>Date: {new Date(ord.createdAt).toLocaleDateString()}</span>
                            <span>Items: {items.length}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between w-full md:w-auto gap-8">
                          <span className="text-sm font-extrabold text-slate-900 dark:text-white">₹{ord.total}</span>
                          <button
                            onClick={() => alert(`Order details:\n${items.map((i: any) => `${i.title} (${i.size}) x ${i.quantity}`).join('\n')}`)}
                            className="px-4.5 py-1.5 rounded-full border border-card-border hover:border-secondary-blue text-xs font-semibold flex items-center gap-1 text-slate-600 dark:text-slate-300"
                          >
                            <Eye size={12} /> View Items
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* Profile Tab */
            <div className="border border-card-border rounded-3xl bg-white dark:bg-slate-900 shadow-sm p-6 md:p-8 max-w-xl">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Account Profile</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    disabled
                    value={profileName}
                    className="w-full px-4 py-2.5 rounded-full border border-card-border bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Email Address</label>
                  <input
                    type="email"
                    disabled
                    value={profileEmail}
                    className="w-full px-4 py-2.5 rounded-full border border-card-border bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs"
                  />
                </div>
                <div className="pt-4 text-xs text-slate-400 italic">
                  Profile adjustments are locked for security validation. Please contact Ayudhara Dairy Support for email modifications.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
