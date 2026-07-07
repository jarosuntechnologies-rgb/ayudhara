'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Search, Calendar, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';
import api from '../../services/api';

interface Machine {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  status: string; // ACTIVE, OUT_OF_SERVICE, MAINTENANCE
  stock: string; // JSON string
  lastRefilled: string;
}

export default function VendingPage() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  
  // Pincode validation state
  const [pincode, setPincode] = useState('');
  const [coverageResult, setCoverageResult] = useState<{ status: 'served' | 'upcoming' | 'none'; msg: string } | null>(null);

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const res = await api.get('/vending-machines');
        setMachines(res.data.machines);
        if (res.data.machines.length > 0) {
          setSelectedMachine(res.data.machines[0]);
        }
      } catch (err) {
        console.error('Failed to load vending machines');
      }
    };
    fetchMachines();
  }, []);

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    const servedPincodes = ['560001', '560025', '560037', '560066'];
    const upcomingPincodes = ['560012', '560048', '560102'];

    if (servedPincodes.includes(pincode.trim())) {
      setCoverageResult({
        status: 'served',
        msg: 'Hooray! We serve this community daily. Subscriptions and individual cart orders are fully active.',
      });
    } else if (upcomingPincodes.includes(pincode.trim())) {
      setCoverageResult({
        status: 'upcoming',
        msg: 'Ayudhara Dairy is launching in this region very soon. Register for our gated community waitlist to speed up deployment!',
      });
    } else {
      setCoverageResult({
        status: 'none',
        msg: 'We do not serve this region yet. Submit a gated community form, and our sales team will contact your developer.',
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-14 text-center max-w-2xl mx-auto">
        <span className="text-xs uppercase font-extrabold text-secondary-blue tracking-[0.2em] mb-2.5 block">
          Network Map
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
          Locator & Coverage
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          Inspect our real-time smart vending machine network or verify whether our temperature-controlled home delivery riders cover your neighborhood.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
        {/* Left - Vending Machines List */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-2">
            <MapPin size={20} className="text-secondary-blue" />
            <span>Smart Dispensers</span>
          </h2>

          {machines.map((mac) => (
            <div
              key={mac.id}
              onClick={() => setSelectedMachine(mac)}
              className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                selectedMachine?.id === mac.id
                  ? 'bg-white dark:bg-slate-900 border-secondary-blue shadow-md'
                  : 'bg-white/40 dark:bg-slate-900/40 border-card-border hover:border-slate-300'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-sm text-slate-950 dark:text-slate-100">{mac.name}</h3>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  mac.status === 'ACTIVE'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                    : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                }`}>
                  {mac.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-1">{mac.address}</p>
            </div>
          ))}
        </div>

        {/* Right - Telemetry Details & Visual Map */}
        <div className="lg:col-span-7">
          {selectedMachine ? (
            <div className="border border-card-border rounded-3xl glass-premium p-6 md:p-8 shadow-sm h-full flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1 block">
                   Dispenser Telemetry
                </span>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  {selectedMachine.name}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">{selectedMachine.address}</p>

                {/* Stock levels */}
                <div className="mb-6">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                    Dispenser Inventory
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(JSON.parse(selectedMachine.stock)).map(([item, qty]: any) => (
                      <div key={item} className="bg-slate-50 dark:bg-slate-800/40 border border-card-border p-3.5 rounded-2xl flex items-center justify-between">
                        <span className="text-xs text-slate-600 dark:text-slate-300 font-semibold">{item}</span>
                        <span className={`text-xs font-bold ${qty > 10 ? 'text-slate-800 dark:text-slate-200' : 'text-red-500 font-extrabold'}`}>
                          {qty} units
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Telemetry info */}
                <div className="flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400 pt-5 border-t border-card-border">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} /> Refilled: {new Date(selectedMachine.lastRefilled).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <RefreshCw size={14} className="animate-spin-slow" /> Live Telemetry Checked
                  </span>
                </div>
              </div>

              {/* Simulated Map Graphic */}
              <div className="mt-8 bg-slate-100 dark:bg-slate-950 rounded-2xl h-48 border border-card-border relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#0ea5e9_1px,transparent_1px)] [background-size:16px_16px]" />
                <div className="text-center z-10 flex flex-col items-center">
                  <MapPin size={32} className="text-secondary-blue animate-bounce mb-2" />
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    GPS: {selectedMachine.latitude}, {selectedMachine.longitude}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Lavelle Road, Central Bangalore Grid</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-slate-400">
              Select a dispenser to check real-time stock levels.
            </div>
          )}
        </div>
      </div>

      {/* Pincode Validator Section */}
      <section className="border border-card-border rounded-3xl glass-premium p-8 md:p-10 shadow-sm max-w-4xl mx-auto">
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2 text-center">
          Verify Delivery Area Pincode
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 text-center mb-6">
          Check if our refrigerated delivery agents drop off fresh items in your area before 7:00 AM.
        </p>

        <form onSubmit={handleCheckPincode} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto mb-6">
          <input
            type="text"
            required
            maxLength={6}
            placeholder="Enter 6-digit Pincode (e.g. 560066)"
            value={pincode}
            onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
            className="flex-1 px-5 py-3 rounded-full border border-card-border focus:outline-none focus:ring-1 focus:ring-secondary-blue bg-white dark:bg-slate-900 dark:text-white text-sm"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-full bg-secondary-blue hover:bg-sky-500 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-1.5"
          >
            <Search size={16} /> Verify Area
          </button>
        </form>

        {/* Validator Results message */}
        {coverageResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-5 rounded-2xl border text-xs max-w-lg mx-auto leading-relaxed flex gap-3 ${
              coverageResult.status === 'served'
                ? 'bg-green-50/50 border-green-200 text-green-800 dark:bg-green-950/20 dark:border-green-900/30 dark:text-green-300'
                : coverageResult.status === 'upcoming'
                ? 'bg-blue-50/50 border-blue-200 text-blue-800 dark:bg-blue-950/20 dark:border-blue-900/30 dark:text-blue-300'
                : 'bg-yellow-50/50 border-yellow-200 text-yellow-800 dark:bg-yellow-950/20 dark:border-yellow-900/30 dark:text-yellow-300'
            }`}
          >
            {coverageResult.status === 'served' ? (
              <CheckCircle size={18} className="text-accent-green flex-shrink-0" />
            ) : (
              <AlertTriangle size={18} className="text-yellow-600 flex-shrink-0" />
            )}
            <span>{coverageResult.msg}</span>
          </motion.div>
        )}
      </section>
    </div>
  );
}
