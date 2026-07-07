'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Heart, Award, ArrowRight } from 'lucide-react';

export default function BlogRecipesPage() {
  const blogs = [
    {
      title: 'A2 Cow Milk vs A1 Milk: The Biological Differences',
      desc: 'Understand the genetics of beta-casein proteins and why single-source Gir cow milk eliminates common lactose bloating symptoms.',
      category: 'Health & Science',
      time: '5 min read',
      imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=800'
    },
    {
      title: 'Creamy A2 Milk Kheer (Rice Pudding Recipe)',
      desc: 'Slow-cook this traditional Indian dessert using Gir cow milk, Basmati rice, and organic cardamom for a velvety sweet consistency.',
      category: 'Dairy Recipes',
      time: '15 mins prep',
      imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=800'
    },
    {
      title: 'Vedic Bilona Ghee: The Ancient Churning Process',
      desc: 'Discover why milk curd is slow-churned into butter before heating, locking in healing fats, vitamins, and granular textures.',
      category: 'Traditions',
      time: '7 min read',
      imageUrl: 'https://images.unsplash.com/photo-1629978431853-38827fa66885?auto=format&fit=crop&q=80&w=800'
    },
    {
      title: 'Paneer Butter Masala: Restaurant Quality at Home',
      desc: 'Cook our soft, organic paneer cubes in a rich tomato, cashew nut, and churned butter gravy. Perfect with garlic naan.',
      category: 'Dairy Recipes',
      time: '25 mins prep',
      imageUrl: 'https://images.unsplash.com/photo-1567982047351-76b6f93e38ee?auto=format&fit=crop&q=80&w=800'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-14 text-center max-w-2xl mx-auto">
        <span className="text-xs uppercase font-extrabold text-secondary-blue tracking-[0.2em] mb-2.5 block">
          Dairy Blog
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
          Recipes & Wellness
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          Learn how to integrate organic dairy into your wellness diet or cook traditional sweet dishes with farm-fresh milk, paneer, and bilona ghee.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {blogs.map((blog, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -5 }}
            className="border border-card-border rounded-3xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between"
          >
            <div className="relative h-56 bg-slate-100 overflow-hidden">
              <img
                src={blog.imageUrl}
                alt={blog.title}
                className="w-full h-full object-cover hover:scale-103 transition-transform duration-500"
              />
              <span className="absolute top-4 left-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full text-slate-700 dark:text-slate-200">
                {blog.category}
              </span>
            </div>

            <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-lg md:text-xl text-slate-900 dark:text-white mb-2 leading-snug">
                  {blog.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                  {blog.desc}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-card-border/60 text-xs text-slate-400 mt-auto">
                <span className="flex items-center gap-1">
                  <Clock size={14} /> {blog.time}
                </span>
                <span className="flex items-center gap-1 text-secondary-blue font-semibold hover:text-sky-500 cursor-pointer">
                  <span>Read Article</span>
                  <ArrowRight size={14} />
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Benefits Banner */}
      <section className="border border-card-border rounded-3xl glass-premium p-8 md:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="flex gap-4">
          <div className="w-12 h-12 bg-sky-100 dark:bg-sky-900/30 rounded-2xl flex items-center justify-center text-secondary-blue flex-shrink-0">
            <Heart size={24} />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-800 dark:text-white mb-1.5">Cardiac Wellness</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Organic grass-fed butter containing Conjugated Linoleic Acid (CLA) supports cardiovascular health naturally.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center text-accent-green flex-shrink-0">
            <BookOpen size={24} />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-800 dark:text-white mb-1.5">Gut Microbes</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Active sets curd dahi provides premium prebiotic strains that help rebalance digestive bacterial flora.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-2xl flex items-center justify-center text-yellow-600 flex-shrink-0">
            <Award size={24} />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-800 dark:text-white mb-1.5">Skeletal Calcium</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              A single glass of our Murrah Buffalo milk supplies 30% of daily human calcium requirements.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
