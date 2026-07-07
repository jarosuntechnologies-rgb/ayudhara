'use client';

import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

const ScrollIndicators: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showTopButton, setShowTopButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }

      if (window.scrollY > 300) {
        setShowTopButton(true);
      } else {
        setShowTopButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Scroll Progress Bar at very top */}
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-secondary-blue to-accent-green z-50 transition-all duration-100 pointer-events-none"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Back to top button */}
      {showTopButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-24 z-40 p-3 rounded-full bg-white dark:bg-slate-800 border border-card-border hover:border-secondary-blue text-slate-700 dark:text-slate-200 shadow-md flex items-center justify-center hover:scale-105 transition-transform duration-200"
          aria-label="Scroll to top"
        >
          <ChevronUp size={20} />
        </button>
      )}
    </>
  );
};

export default ScrollIndicators;
