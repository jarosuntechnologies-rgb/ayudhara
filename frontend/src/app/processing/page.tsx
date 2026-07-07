'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Snowflake, FlaskConical, Sprout, Heart, Eye } from 'lucide-react';

export default function MilkProcessingPage() {
  const [activeStep, setActiveStep] = useState(0);

  const timelineSteps = [
    {
      title: 'Our Cow Farm',
      desc: ' Gir cows roam freely in pastures, feeding on certified organic grass. Zero hormone injections or synthetic feeds.',
      icon: <Sprout size={20} />,
      details: 'Our veterinary staff monitors heart rates and sleep patterns to ensure cows remain stress-free. Happy cows produce clean, nutrient-dense milk.'
    },
    {
      title: 'Hygienic Milk Collection',
      desc: 'Automated touch-free milking units collect milk directly into sealed stainless steel coolers. Zero human hand contact.',
      icon: <Heart size={20} />,
      details: 'Milk is immediately vacuum-sealed, keeping external pathogens and bacteria out. The raw milk is pumped into clean chillers.'
    },
    {
      title: 'Real-time Lab Testing',
      desc: 'Samples are analyzed at the farm gate for adulteration, antibiotics, fat contents, and SNF indexes.',
      icon: <FlaskConical size={20} />,
      details: 'We publish live batch reports showing pure water levels and zero synthetic thickeners. Transparency is our core value.'
    },
    {
      title: 'Standardized Pasteurization',
      desc: 'Milk is heated to 72°C for exactly 15 seconds, followed by rapid cooling to eliminate pathogens without destroying vitamins.',
      icon: <ShieldCheck size={20} />,
      details: 'This processes the milk safely while locking in native whey proteins and enzymes that support overall health.'
    },
    {
      title: 'Homogenization & Cooling',
      desc: 'Fat globules are gently dispersed uniformly for a smooth texture, followed by chilling to 4°C to seal freshness.',
      icon: <Snowflake size={20} />,
      details: 'This prevents cream separation naturally without chemicals, ensuring a consistent, creamy taste in every glass.'
    },
    {
      title: 'Glass Bottle Packaging',
      desc: 'Sterilized glass bottles are filled and sealed inside clean isolation rooms. Environment-conscious and zero plastic leaching.',
      icon: <Eye size={20} />,
      details: 'Glass maintains pure taste and temperature significantly better than plastic pouches or paper cartons.'
    },
    {
      title: 'Cold Storage & Home Delivery',
      desc: 'Bottles are loaded onto refrigerated vans and delivered directly to your doorstep before 7:00 AM.',
      icon: <Snowflake size={20} />,
      details: 'We maintain a strict 4°C cold chain network. If any bottle goes above 6°C during transit, it is automatically discarded.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-16 text-center max-w-2xl mx-auto">
        <span className="text-xs uppercase font-extrabold text-secondary-blue tracking-[0.2em] mb-2.5 block">
          Cinematic Production
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
          The Safe Milk Processing
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          From healthy cows feeding on clover fields to glass bottles resting at your front door, explore the rigorous cold-chain process that ensures absolute purity.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column - Vertical Timeline */}
        <div className="lg:col-span-7 space-y-8 relative">
          {/* Vertical connecting line */}
          <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-slate-200 dark:bg-slate-800 z-0" />

          {timelineSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              onClick={() => setActiveStep(index)}
              className={`flex gap-6 relative z-10 cursor-pointer p-5 rounded-2xl border transition-all duration-300 ${
                activeStep === index
                  ? 'bg-white dark:bg-slate-900 border-secondary-blue shadow-md'
                  : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-900/40'
              }`}
            >
              {/* Step indicator bubble */}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 transition-colors ${
                activeStep === index
                  ? 'bg-secondary-blue text-white'
                  : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
              }`}>
                {index + 1}
              </div>

              <div>
                <h3 className={`font-bold text-base mb-1.5 transition-colors ${
                  activeStep === index ? 'text-secondary-blue' : 'text-slate-800 dark:text-slate-200'
                }`}>
                  {step.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Right Column - Step Details & Interactive Graphics */}
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="border border-card-border rounded-3xl glass-premium p-8 shadow-md"
          >
            {/* Visual Icon */}
            <div className="w-16 h-16 bg-sky-100 dark:bg-sky-900/30 rounded-2xl flex items-center justify-center text-secondary-blue mb-6">
              {timelineSteps[activeStep].icon}
            </div>

            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1 block">
              Stage details - {activeStep + 1} of {timelineSteps.length}
            </span>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              {timelineSteps[activeStep].title}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
              {timelineSteps[activeStep].details}
            </p>

            {/* Quality check flags */}
            <div className="space-y-3.5 pt-6 border-t border-card-border">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span className="w-2 h-2 rounded-full bg-accent-green" />
                <span>Pathogen Free Certified</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span className="w-2 h-2 rounded-full bg-accent-green" />
                <span>Zero Direct Human Hand Interaction</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span className="w-2 h-2 rounded-full bg-accent-green" />
                <span>Maintained at cold 4°C chain</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
