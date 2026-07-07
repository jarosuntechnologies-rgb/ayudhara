'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Send, ShieldCheck, HeartPulse } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const handleSubscribeNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for subscribing to our fresh newsletter!');
  };

  return (
    <footer className="bg-slate-50 dark:bg-slate-950 border-t border-card-border pt-16 pb-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="text-2xl font-bold tracking-tight text-gradient flex items-center gap-2">
              <span className="text-3xl font-extrabold">AYUDHARA</span>
              <span className="text-sm uppercase tracking-[0.2em] font-medium text-slate-500">Dairy</span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              We deliver single-source, organic, A2 cow and buffalo milk directly to your doorstep within 4 hours of milking. Clean, pure, glass-bottled dairy products.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full border border-card-border text-slate-600 dark:text-slate-400 font-medium">
                <ShieldCheck size={12} className="text-accent-green" /> FSSAI Certified
              </span>
              <span className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full border border-card-border text-slate-600 dark:text-slate-400 font-medium">
                <HeartPulse size={12} className="text-secondary-blue" /> Organic Grade
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              Explore Products
            </h3>
            <ul className="space-y-2.5 text-sm">
              {['A2 Cow Milk', 'Buffalo Milk', 'Set Curd', 'Organic Paneer', 'Desi Ghee', 'Artisanal Butter'].map((link) => (
                <li key={link}>
                  <Link href="/products" className="text-slate-500 hover:text-secondary-blue dark:text-slate-400 dark:hover:text-secondary-blue transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              Get in Touch
            </h3>
            <ul className="space-y-3.5 text-sm text-slate-500 dark:text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin size={18} className="text-secondary-blue flex-shrink-0 mt-0.5" />
                <span>102, Green Acres Farm Road, Outer Ring Road, Bangalore, India</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={18} className="text-secondary-blue flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={18} className="text-secondary-blue flex-shrink-0" />
                <span>care@ayudharadairy.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter subscription */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              Fresh News
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3.5">
              Subscribe to get recipe blogs, wellness updates, and discount coupon codes.
            </p>
            <form onSubmit={handleSubscribeNewsletter} className="flex gap-2">
              <input
                type="email"
                placeholder="Your email address"
                required
                className="flex-1 px-4 py-2 text-sm rounded-full border border-card-border bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-secondary-blue dark:text-white"
              />
              <button
                type="submit"
                className="p-2.5 rounded-full bg-secondary-blue hover:bg-sky-500 text-white flex items-center justify-center shadow-sm transition-colors"
                aria-label="Subscribe"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 mt-8 border-t border-card-border flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {currentYear} Ayudhara Dairy. All Rights Reserved. Crafted with love.
          </div>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-secondary-blue transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-secondary-blue transition-colors">Terms of Service</Link>
            <Link href="/careers" className="hover:text-secondary-blue transition-colors">Careers</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
