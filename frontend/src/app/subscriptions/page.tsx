'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { CalendarRange, Sparkles, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import api from '../../services/api';

interface Product {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  category: string;
}

export default function SubscriptionPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [frequency, setFrequency] = useState('DAILY'); // DAILY, ALTERNATE, WEEKLY, MONTHLY
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchMilk = async () => {
      try {
        const res = await api.get('/products', { params: { category: 'Milk' } });
        setProducts(res.data.products);
        if (res.data.products.length > 0) {
          setSelectedProductId(res.data.products[0].id);
        }
      } catch (err) {
        console.error('Failed to load milk products');
      }
    };
    fetchMilk();
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push('/login?redirect=subscriptions');
      return;
    }

    if (!address || !phone) {
      setMessage('Address and phone number are required.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      await api.post('/subscriptions', {
        productId: selectedProductId,
        quantity,
        frequency,
        address,
        phone,
      });

      router.push('/dashboard/customer?tab=subscriptions&status=created');
    } catch (err: any) {
      setMessage(err.response?.data?.error || 'Subscription creation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-14 text-center max-w-2xl mx-auto">
        <span className="text-xs uppercase font-extrabold text-secondary-blue tracking-[0.2em] mb-2.5 block">
          Daily Delivery
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
          Milk Subscription Plans
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          Configure milk varieties, delivery counts, and frequency settings. Sleep peacefully knowing cold-chain organic milk arrives at your door by 6:30 AM.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-5xl mx-auto items-start">
        {/* Left - Configurator Form */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubscribe} className="border border-card-border rounded-3xl glass-premium p-6 md:p-8 shadow-sm space-y-6">
            {/* Product selection */}
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">
                Select Milk Variety
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-full border border-card-border bg-white dark:bg-slate-900 dark:text-white text-sm focus:outline-none"
              >
                {products.map((prod) => (
                  <option key={prod.id} value={prod.id}>
                    {prod.title} (₹{prod.price}/L)
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">
                Quantity (Liters per morning)
              </label>
              <div className="flex gap-3">
                {[1, 2, 3, 4].map((qty) => (
                  <button
                    key={qty}
                    type="button"
                    onClick={() => setQuantity(qty)}
                    className={`flex-1 py-2 rounded-full text-xs font-semibold border transition-all ${
                      quantity === qty
                        ? 'bg-secondary-blue border-secondary-blue text-white shadow-sm'
                        : 'bg-white dark:bg-slate-800 border-card-border text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {qty} Liter{qty > 1 && 's'}
                  </button>
                ))}
              </div>
            </div>

            {/* Frequency selection */}
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">
                Delivery Schedule
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'DAILY', label: 'Every Morning' },
                  { value: 'ALTERNATE', label: 'Alternate Days' },
                  { value: 'WEEKLY', label: 'Weekends Only' },
                  { value: 'MONTHLY', label: 'Once a Month' },
                ].map((freq) => (
                  <button
                    key={freq.value}
                    type="button"
                    onClick={() => setFrequency(freq.value)}
                    className={`py-2.5 px-4 rounded-full text-xs font-semibold border transition-all ${
                      frequency === freq.value
                        ? 'bg-secondary-blue border-secondary-blue text-white shadow-sm'
                        : 'bg-white dark:bg-slate-800 border-card-border text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {freq.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">
                Delivery Address
              </label>
              <textarea
                rows={3}
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Apartment name, tower, flat number, street..."
                className="w-full px-4 py-3 rounded-2xl border border-card-border bg-white dark:bg-slate-900 dark:text-white text-sm focus:outline-none"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">
                Contact Phone Number
              </label>
              <input
                type="tel"
                required
                placeholder="10-digit mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                className="w-full px-4 py-2.5 rounded-full border border-card-border bg-white dark:bg-slate-900 dark:text-white text-sm focus:outline-none"
              />
            </div>

            {message && (
              <div className="flex gap-2 p-4 bg-red-50/50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-2xl text-xs border border-red-200 dark:border-red-900/30">
                <AlertCircle size={16} className="flex-shrink-0" />
                <span>{message}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-secondary-blue hover:bg-sky-500 text-white font-semibold text-sm transition-all hover:scale-102 shadow-md flex items-center justify-center gap-1.5"
            >
              <span>{loading ? 'Processing...' : 'Subscribe Plan'}</span>
              <ArrowRight size={16} />
            </button>
          </form>
        </div>

        {/* Right - Quality Info & Timeline preview */}
        <div className="lg:col-span-5 space-y-6">
          <div className="border border-card-border rounded-3xl glass p-6 shadow-sm">
            <h3 className="font-bold text-base text-slate-800 dark:text-white flex items-center gap-2 mb-4">
              <CalendarRange size={20} className="text-secondary-blue" />
              <span>Subscription Perks</span>
            </h3>
            <ul className="space-y-4 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              <li className="flex gap-3">
                <ShieldCheck size={18} className="text-accent-green flex-shrink-0" />
                <span><strong>No commitments:</strong> Pause, adjust volumes, or cancel delivery anytime via your dashboard.</span>
              </li>
              <li className="flex gap-3">
                <ShieldCheck size={18} className="text-accent-green flex-shrink-0" />
                <span><strong>Guaranteed early arrival:</strong> Milk drops before 6:30 AM so it is ready for your morning tea.</span>
              </li>
              <li className="flex gap-3">
                <ShieldCheck size={18} className="text-accent-green flex-shrink-0" />
                <span><strong>Zero delivery charge:</strong> Monthly subscribers pay no transportation or delivery overheads.</span>
              </li>
            </ul>
          </div>

          <div className="border border-card-border rounded-3xl glass p-6 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center text-yellow-600 flex-shrink-0">
              <Sparkles size={20} />
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-800 dark:text-white mb-0.5">Pause for Vacations</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Traveling? Turn on "Vacation Mode" inside your customer panel to suspend drops. We credit remaining sums automatically.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
