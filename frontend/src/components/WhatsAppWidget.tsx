'use client';

import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

const WhatsAppWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleWhatsAppRedirect = () => {
    const phone = '919876543210';
    const text = encodeURIComponent("Hello Ayudhara Dairy Support! I am interested in subscribing to your fresh A2 milk.");
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 z-40 p-4 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform duration-300"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={24} />
      </button>

      {/* Pop-up Box */}
      {isOpen && (
        <div className="fixed bottom-24 left-6 w-80 z-50 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-card-border overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="bg-[#075e54] text-white px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <MessageCircle size={24} className="text-[#25D366]" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full"></span>
              </div>
              <div>
                <h4 className="font-semibold text-sm">Ayudhara Dairy Care</h4>
                <p className="text-[10px] text-white/80">Typically replies instantly</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-white/10 text-white"
            >
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 bg-[#efeae2] dark:bg-slate-950/40 text-slate-800 dark:text-slate-200">
            <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none shadow-sm text-xs leading-relaxed max-w-[90%]">
              Hello! 👋 Have any questions about subscriptions, order tracking, or corporate bulk pricing? Chat with us directly on WhatsApp!
            </div>
          </div>

          {/* Footer CTA */}
          <div className="p-3 bg-white dark:bg-slate-900 border-t border-card-border">
            <button
              onClick={handleWhatsAppRedirect}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full font-semibold text-sm transition-colors shadow-sm"
            >
              <Send size={14} />
              <span>Start Chat</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default WhatsAppWidget;
