'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, ShieldCheck, MessageSquare, AlertCircle, ArrowRight } from 'lucide-react';
import api from '../../services/api';

interface Feedback {
  id: string;
  name: string;
  type: string;
  ratings: string; // JSON string
  comment: string;
  createdAt: string;
}

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [type, setType] = useState('PRODUCT'); // SUGGESTION, COMPLAINT, WEB, DELIVERY, PRODUCT
  const [overall, setOverall] = useState(5);
  const [quality, setQuality] = useState(5);
  const [packaging, setPackaging] = useState(5);
  const [delivery, setDelivery] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await api.get('/feedback/public');
        setFeedbacks(res.data.feedbacks);
      } catch (err) {
        console.error('Failed to load feedbacks');
      }
    };
    fetchFeedbacks();
  }, [success]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await api.post('/feedback', {
        name,
        email,
        type,
        ratings: { overall, quality, packaging, delivery },
        comment,
      });

      setSuccess(true);
      setName('');
      setEmail('');
      setComment('');
      setOverall(5);
      setQuality(5);
      setPackaging(5);
      setDelivery(5);

      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      setMessage(err.response?.data?.error || 'Feedback submission failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-14 text-center max-w-2xl mx-auto">
        <span className="text-xs uppercase font-extrabold text-secondary-blue tracking-[0.2em] mb-2.5 block">
          Client Reviews
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
          Rate Us & Feedback
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          Your reviews directly impact our delivery timings and packaging systems. Share your Ayudhara Dairy experience with us.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left - Feedback Form */}
        <div className="lg:col-span-6">
          <form onSubmit={handleSubmit} className="border border-card-border rounded-3xl glass-premium p-6 md:p-8 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-card-border pb-3 flex items-center gap-2">
              <MessageSquare size={20} className="text-secondary-blue" />
              <span>Leave a Review</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full px-4 py-2.5 rounded-xl border border-card-border bg-white dark:bg-slate-900 dark:text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. sarah@outlook.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-card-border bg-white dark:bg-slate-900 dark:text-white text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Feedback Category</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-card-border bg-white dark:bg-slate-900 dark:text-white text-xs focus:outline-none"
                >
                  <option value="PRODUCT">Product Quality</option>
                  <option value="DELIVERY">Delivery Timings</option>
                  <option value="WEB">Website Usability</option>
                  <option value="SUGGESTION">General Suggestion</option>
                  <option value="COMPLAINT">Complaint / Dispute</option>
                </select>
              </div>

              {/* Overall Star Picker */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Overall Satisfaction</label>
                <div className="flex gap-1.5 pt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setOverall(star)}
                      className="text-slate-300 hover:text-yellow-400 transition-colors"
                    >
                      <Star
                        size={20}
                        className={star <= overall ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Individual sliders */}
            <div className="space-y-4 pt-2">
              <span className="block text-[11px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Detailed Metrics
              </span>

              {[
                { label: 'Milk & Product Quality', val: quality, setVal: setQuality },
                { label: 'Bottle & Cap Packaging', val: packaging, setVal: setPackaging },
                { label: 'Delivery Rider Behavior', val: delivery, setVal: setDelivery },
              ].map((slider) => (
                <div key={slider.label} className="flex items-center justify-between gap-4">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{slider.label}</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={1}
                      max={5}
                      value={slider.val}
                      onChange={(e) => slider.setVal(parseInt(e.target.value))}
                      className="w-24 accent-secondary-blue"
                    />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 w-4 text-right">
                      {slider.val}★
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5 font-semibold">Your Review / Comments</label>
              <textarea
                rows={3}
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your detailed experience..."
                className="w-full px-4 py-3 rounded-xl border border-card-border bg-white dark:bg-slate-900 dark:text-white text-xs"
              />
            </div>

            {message && (
              <div className="flex gap-2 p-3 bg-red-50/50 dark:bg-red-950/20 text-red-500 text-xs rounded-xl border border-red-200">
                <AlertCircle size={16} />
                <span>{message}</span>
              </div>
            )}

            {success && (
              <div className="flex gap-2 p-3 bg-green-50/50 dark:bg-green-950/20 text-green-600 dark:text-green-400 text-xs rounded-xl border border-green-200 dark:border-green-900/30">
                <ShieldCheck size={16} />
                <span>Your review was published successfully. Thank you!</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-secondary-blue hover:bg-sky-500 text-white font-semibold text-xs shadow-sm transition-colors flex items-center justify-center gap-1.5"
            >
              <span>{loading ? 'Publishing...' : 'Submit Rating'}</span>
              <ArrowRight size={14} />
            </button>
          </form>
        </div>

        {/* Right - Feedbacks grid */}
        <div className="lg:col-span-6 space-y-4 overflow-y-auto max-h-[600px] pr-2">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-2">
            <span>Recent Testimonials</span>
          </h2>

          {feedbacks.map((fb) => {
            const ratings = JSON.parse(fb.ratings);
            return (
              <div key={fb.id} className="p-5 rounded-2xl border border-card-border bg-white dark:bg-slate-900/40 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">{fb.name}</h3>
                    <span className="text-[10px] text-slate-400 font-semibold">{new Date(fb.createdAt).toLocaleDateString()}</span>
                  </div>

                  {/* Stars display */}
                  <div className="flex gap-0.5 text-yellow-400 mb-3">
                    {[...Array(ratings.overall)].map((_, i) => (
                      <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic mb-4">
                    "{fb.comment}"
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 text-[10px] text-slate-400 pt-3 border-t border-card-border/60">
                  <span className="bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-md">Category: {fb.type}</span>
                  <span className="bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-md">Quality: {ratings.quality}★</span>
                  <span className="bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-md">Delivery: {ratings.delivery}★</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
