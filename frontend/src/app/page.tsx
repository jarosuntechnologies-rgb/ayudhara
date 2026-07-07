'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Star, ShieldCheck, Truck, Sparkles, Milestone } from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';

interface Product {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  category: string;
  sizes: string;
  description: string;
}

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/products');
        setFeaturedProducts(res.data.products.slice(0, 4));
      } catch (err) {
        console.error('Failed to load products');
      }
    };
    fetchFeatured();
  }, []);

  // Stats Data
  const stats = [
    { label: 'Families Served', value: '15,000+' },
    { label: 'Liters Delivered Daily', value: '45,000L' },
    { label: 'Active Smart Vending', value: '120+' },
    { label: 'Farms Connected', value: '45+' },
  ];

  return (
    <div className="relative min-h-screen">
      {/* Background Droplets System */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="droplet"
            style={{
              left: `${Math.random() * 90}%`,
              animationDelay: `${i * 1.5}s`,
              width: `${15 + Math.random() * 20}px`,
              height: `${25 + Math.random() * 25}px`,
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 md:pt-20 md:pb-32 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-card-border glass mb-8 text-xs font-semibold text-secondary-blue shadow-sm animate-pulse"
        >
          <Sparkles size={12} />
          <span>Award-Winning Dairy Innovation</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-5xl leading-[1.1] mb-6"
        >
          Fresh Milk. <br className="sm:hidden" />
          <span className="text-gradient">Pure Goodness.</span> <br />
          Delivered Every Morning.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed mb-10"
        >
          Ayudhara Dairy delivers cold-pressed, single-source A2 milk and fresh dairy products straight from our farms to your doorstep in under 4 hours. No additives, no compromises.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full max-w-md mb-20"
        >
          <Link
            href="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 h-14 rounded-full bg-secondary-blue hover:bg-sky-500 text-white font-semibold shadow-lg transition-transform hover:scale-[1.03]"
          >
            <span>Order Now</span>
            <ArrowRight size={18} />
          </Link>
          <Link
            href="/processing"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 h-14 rounded-full border border-card-border glass text-slate-800 dark:text-white font-semibold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <span>Our Milk Journey</span>
          </Link>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-5xl grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 border border-card-border rounded-3xl glass-premium p-8 md:p-10 shadow-sm"
        >
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center">
              <span className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">
                {stat.value}
              </span>
              <span className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Featured Showcase Carousel */}
      <section className="py-20 md:py-28 bg-slate-100/50 dark:bg-slate-950/40 border-y border-card-border relative z-10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs uppercase font-bold text-accent-green tracking-wider mb-2 block">
                Pure Selections
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Fresh From Our Farms Today
              </h2>
            </div>
            <Link
              href="/products"
              className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-sm font-semibold text-secondary-blue hover:text-sky-500 group"
            >
              <span>Explore All Products</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {featuredProducts.map((prod) => (
              <motion.div
                key={prod.id}
                whileHover={{ y: -6 }}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-card-border overflow-hidden shadow-sm flex flex-col h-full"
              >
                <div className="relative aspect-square overflow-hidden bg-slate-100">
                  <img
                    src={prod.imageUrl}
                    alt={prod.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full text-slate-700 dark:text-slate-200">
                    {prod.category}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white line-clamp-1 mb-1">
                      {prod.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                      {prod.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-lg font-bold text-slate-900 dark:text-white">
                      ₹{prod.price}
                    </span>
                    <button
                      onClick={() =>
                        addToCart({
                          id: prod.id,
                          title: prod.title,
                          price: prod.price,
                          imageUrl: prod.imageUrl,
                          size: prod.sizes.split(',')[0].trim(),
                        })
                      }
                      className="h-9 px-4 rounded-full bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold shadow-sm transition-colors"
                    >
                      Quick Add
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Quality Features */}
      <section className="py-20 md:py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="border border-card-border rounded-3xl glass p-8 shadow-sm flex gap-4">
              <div className="w-12 h-12 bg-sky-100 dark:bg-sky-900/30 rounded-2xl flex items-center justify-center text-secondary-blue flex-shrink-0">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
                  Zero Preservatives
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  We verify each batch with over 45 laboratory quality checks. Free of antibiotics, starch, or hormones.
                </p>
              </div>
            </div>

            <div className="border border-card-border rounded-3xl glass p-8 shadow-sm flex gap-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center text-accent-green flex-shrink-0">
                <Truck size={24} />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
                  Cold Chain Logistics
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Our customized temperature-controlled delivery network maintains milk freshness at precisely 4°C.
                </p>
              </div>
            </div>

            <div className="border border-card-border rounded-3xl glass p-8 shadow-sm flex gap-4">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-2xl flex items-center justify-center text-yellow-600 flex-shrink-0">
                <Milestone size={24} />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
                  Daily Subscription Flex
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Select quantity, schedule delivery frequencies, and easily pause deliveries whenever you travel.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
