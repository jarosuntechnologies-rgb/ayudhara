'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Building, Building2, CheckCircle, ArrowRight, ShieldAlert } from 'lucide-react';
import api from '../../services/api';

function LeadsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'community' | 'bulk'>('community');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Gated Community Form States
  const [apartmentName, setApartmentName] = useState('');
  const [location, setLocation] = useState('');
  const [families, setFamilies] = useState('');
  const [milkQuantity, setMilkQuantity] = useState('');
  const [preferredTime, setPreferredTime] = useState('6:00 AM - 7:00 AM');
  const [contactName, setContactName] = useState('');
  const [communityPhone, setCommunityPhone] = useState('');
  const [communityEmail, setCommunityEmail] = useState('');
  const [communityNotes, setCommunityNotes] = useState('');

  // Bulk B2B Form States
  const [businessName, setBusinessName] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [bulkContactName, setBulkContactName] = useState('');
  const [bulkPhone, setBulkPhone] = useState('');
  const [bulkEmail, setBulkEmail] = useState('');
  const [bulkProducts, setBulkProducts] = useState('Premium A2 Cow Milk');
  const [bulkQuantity, setBulkQuantity] = useState('');
  const [bulkFrequency, setBulkFrequency] = useState('DAILY'); // DAILY, WEEKLY, ONCE
  const [bulkAddress, setBulkAddress] = useState('');
  const [expectedDate, setExpectedDate] = useState('');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'bulk') {
      setActiveTab('bulk');
    } else {
      setActiveTab('community');
    }
  }, [searchParams]);

  const handleTabChange = (tab: 'community' | 'bulk') => {
    setActiveTab(tab);
    router.replace(`/leads?tab=${tab}`);
  };

  const handleCommunitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      await api.post('/leads/community', {
        apartmentName,
        location,
        families: parseInt(families),
        quantity: parseFloat(milkQuantity),
        preferredTime,
        contactName,
        phone: communityPhone,
        email: communityEmail,
        notes: communityNotes,
      });
      setSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || 'Failed to submit community order request.');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      await api.post('/leads/bulk', {
        businessName,
        gstNumber,
        contactName: bulkContactName,
        phone: bulkPhone,
        email: bulkEmail,
        products: bulkProducts,
        quantity: parseInt(bulkQuantity),
        frequency: bulkFrequency,
        address: bulkAddress,
        expectedDate,
      });
      setSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || 'Failed to submit bulk order request.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-accent-green rounded-full flex items-center justify-center mb-6">
          <CheckCircle size={32} />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">Request Received!</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
          Thank you for reaching out to Ayudhara Dairy. Our senior accounts architect will review your volumetric estimates and call you within 2 hours with customized contract logistics and price discounts.
        </p>
        <button
          onClick={() => {
            setSuccess(false);
            router.push('/');
          }}
          className="inline-flex items-center gap-1.5 px-6 py-3 bg-secondary-blue text-white rounded-full font-semibold text-xs shadow-md"
        >
          <span>Return Home</span>
          <ArrowRight size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-12 text-center max-w-2xl mx-auto">
        <span className="text-xs uppercase font-extrabold text-secondary-blue tracking-[0.2em] mb-2.5 block">
          Enterprise Services
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
          Bulk & Community Orders
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          Unlock commercial discounts, custom delivery times, and dedicated account managers for residential complexes and B2B culinary partners.
        </p>
      </div>

      {/* Tabs Row */}
      <div className="flex justify-center gap-4 mb-10 max-w-md mx-auto">
        <button
          onClick={() => handleTabChange('community')}
          className={`flex-1 py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
            activeTab === 'community'
              ? 'bg-white dark:bg-slate-900 border-secondary-blue text-secondary-blue shadow-sm scale-102'
              : 'bg-transparent border-card-border text-slate-500 hover:border-slate-400'
          }`}
        >
          <Building size={16} />
          <span>Gated Communities</span>
        </button>
        <button
          onClick={() => handleTabChange('bulk')}
          className={`flex-1 py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
            activeTab === 'bulk'
              ? 'bg-white dark:bg-slate-900 border-secondary-blue text-secondary-blue shadow-sm scale-102'
              : 'bg-transparent border-card-border text-slate-500 hover:border-slate-400'
          }`}
        >
          <Building2 size={16} />
          <span>B2B Commercial Bulk</span>
        </button>
      </div>

      {/* Forms Grid */}
      <div className="max-w-2xl mx-auto">
        {activeTab === 'community' ? (
          /* Gated Community Form */
          <form onSubmit={handleCommunitySubmit} className="border border-card-border rounded-3xl glass-premium p-6 md:p-8 shadow-sm space-y-5">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 border-b border-card-border pb-3">
              Residential Delivery Request
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Apartment Complex Name</label>
                <input
                  type="text"
                  required
                  value={apartmentName}
                  onChange={(e) => setApartmentName(e.target.value)}
                  placeholder="e.g. Prestige Boulevard"
                  className="w-full px-4 py-2.5 rounded-xl border border-card-border bg-white dark:bg-slate-900 dark:text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Apartment Location</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Lavelle Road, Bangalore"
                  className="w-full px-4 py-2.5 rounded-xl border border-card-border bg-white dark:bg-slate-900 dark:text-white text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Number of Resident Families</label>
                <input
                  type="number"
                  required
                  value={families}
                  onChange={(e) => setFamilies(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 150"
                  className="w-full px-4 py-2.5 rounded-xl border border-card-border bg-white dark:bg-slate-900 dark:text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Estimated Milk Liters Daily</label>
                <input
                  type="number"
                  required
                  value={milkQuantity}
                  onChange={(e) => setMilkQuantity(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 300"
                  className="w-full px-4 py-2.5 rounded-xl border border-card-border bg-white dark:bg-slate-900 dark:text-white text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Primary Contact Name</label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g. Aditya Sen"
                  className="w-full px-4 py-2.5 rounded-xl border border-card-border bg-white dark:bg-slate-900 dark:text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Preferred Morning Window</label>
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-card-border bg-white dark:bg-slate-900 dark:text-white text-xs focus:outline-none"
                >
                  <option>5:30 AM - 6:30 AM</option>
                  <option>6:00 AM - 7:00 AM</option>
                  <option>6:30 AM - 7:30 AM</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Mobile Phone Number</label>
                <input
                  type="tel"
                  required
                  value={communityPhone}
                  onChange={(e) => setCommunityPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 9876543210"
                  className="w-full px-4 py-2.5 rounded-xl border border-card-border bg-white dark:bg-slate-900 dark:text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={communityEmail}
                  onChange={(e) => setCommunityEmail(e.target.value)}
                  placeholder="e.g. aditya@society.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-card-border bg-white dark:bg-slate-900 dark:text-white text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Special Instructions / Notes</label>
              <textarea
                rows={3}
                value={communityNotes}
                onChange={(e) => setCommunityNotes(e.target.value)}
                placeholder="Mention gate security locks, parking slots, or vending machine spaces if available..."
                className="w-full px-4 py-3 rounded-xl border border-card-border bg-white dark:bg-slate-900 dark:text-white text-xs"
              />
            </div>

            {errorMsg && (
              <div className="flex gap-2 p-3 bg-red-50/50 dark:bg-red-950/20 text-red-500 text-xs rounded-xl border border-red-200">
                <ShieldAlert size={16} />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-secondary-blue hover:bg-sky-500 text-white font-semibold text-xs shadow-sm transition-colors flex items-center justify-center gap-1.5"
            >
              <span>{loading ? 'Submitting...' : 'Register Society'}</span>
              <ArrowRight size={14} />
            </button>
          </form>
        ) : (
          /* Bulk B2B Form */
          <form onSubmit={handleBulkSubmit} className="border border-card-border rounded-3xl glass-premium p-6 md:p-8 shadow-sm space-y-5">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 border-b border-card-border pb-3">
              Commercial B2B Delivery Request
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Registered Business Name</label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Sweet Delights Corp"
                  className="w-full px-4 py-2.5 rounded-xl border border-card-border bg-white dark:bg-slate-900 dark:text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">GST Identification (Optional)</label>
                <input
                  type="text"
                  value={gstNumber}
                  onChange={(e) => setGstNumber(e.target.value)}
                  placeholder="e.g. 29AAAAA0000A1Z5"
                  className="w-full px-4 py-2.5 rounded-xl border border-card-border bg-white dark:bg-slate-900 dark:text-white text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">B2B Product Selected</label>
                <select
                  value={bulkProducts}
                  onChange={(e) => setBulkProducts(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-card-border bg-white dark:bg-slate-900 dark:text-white text-xs focus:outline-none"
                >
                  <option>Premium A2 Cow Milk</option>
                  <option>Farm Fresh Buffalo Milk</option>
                  <option>Classic Set Curd</option>
                  <option>Premium Organic Paneer</option>
                  <option>Pure A2 Cow Ghee</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Volume (Units/Liters per drop)</label>
                <input
                  type="number"
                  required
                  value={bulkQuantity}
                  onChange={(e) => setBulkQuantity(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 50"
                  className="w-full px-4 py-2.5 rounded-xl border border-card-border bg-white dark:bg-slate-900 dark:text-white text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Delivery Frequency</label>
                <select
                  value={bulkFrequency}
                  onChange={(e) => setBulkFrequency(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-card-border bg-white dark:bg-slate-900 dark:text-white text-xs focus:outline-none"
                >
                  <option value="DAILY">Every Single Day</option>
                  <option value="WEEKLY">Weekly Shipment</option>
                  <option value="ONCE">One-time Event bulk</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Expected Start Date</label>
                <input
                  type="date"
                  required
                  value={expectedDate}
                  onChange={(e) => setExpectedDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-card-border bg-white dark:bg-slate-900 dark:text-white text-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">B2B Account Manager Name</label>
                <input
                  type="text"
                  required
                  value={bulkContactName}
                  onChange={(e) => setBulkContactName(e.target.value)}
                  placeholder="e.g. Chef Miller"
                  className="w-full px-4 py-2.5 rounded-xl border border-card-border bg-white dark:bg-slate-900 dark:text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Contact Phone Number</label>
                <input
                  type="tel"
                  required
                  value={bulkPhone}
                  onChange={(e) => setBulkPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 9876543210"
                  className="w-full px-4 py-2.5 rounded-xl border border-card-border bg-white dark:bg-slate-900 dark:text-white text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Contact Email Address</label>
              <input
                type="email"
                required
                value={bulkEmail}
                onChange={(e) => setBulkEmail(e.target.value)}
                placeholder="e.g. chef@sweetdelights.com"
                className="w-full px-4 py-2.5 rounded-xl border border-card-border bg-white dark:bg-slate-900 dark:text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Commercial Delivery Address</label>
              <textarea
                rows={3}
                required
                value={bulkAddress}
                onChange={(e) => setBulkAddress(e.target.value)}
                placeholder="Hotel, restaurant kitchen, hospital loading bay address..."
                className="w-full px-4 py-3 rounded-xl border border-card-border bg-white dark:bg-slate-900 dark:text-white text-xs"
              />
            </div>

            {errorMsg && (
              <div className="flex gap-2 p-3 bg-red-50/50 dark:bg-red-950/20 text-red-500 text-xs rounded-xl border border-red-200">
                <ShieldAlert size={16} />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-secondary-blue hover:bg-sky-500 text-white font-semibold text-xs shadow-sm transition-colors flex items-center justify-center gap-1.5"
            >
              <span>{loading ? 'Sending Estimates...' : 'Request B2B Contract'}</span>
              <ArrowRight size={14} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function LeadsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-500">Loading...</div>}>
      <LeadsPageContent />
    </Suspense>
  );
}
