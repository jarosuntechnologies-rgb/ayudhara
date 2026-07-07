'use client';

import React, { useState } from 'react';
import { MessageSquare, Send, X, Bot, Sparkles, User } from 'lucide-react';

const AiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: 'ai' | 'user'; text: string }[]>([
    { sender: 'ai', text: 'Hello! I am your Ayudhara Dairy Assistant. How can I help you today? I can answer questions about our organic A2 cow milk, subscription adjustments, active pincodes, or vending machine locations!' },
  ]);
  const [input, setInput] = useState('');

  const quickChips = [
    'How do I pause my subscription?',
    'What is A2 Cow Milk?',
    'Where is the nearest vending machine?',
    'Check delivery pincode',
  ];

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { sender: 'user', text }]);
    setInput('');

    // Mock AI reply
    setTimeout(() => {
      let reply = 'I am processing your query. Ayudhara Dairy ensures delivery before 7:00 AM. For immediate changes, you can toggle pauses inside your Customer Dashboard.';
      const lower = text.toLowerCase();

      if (lower.includes('pause')) {
        reply = 'To pause your milk delivery, log into your Customer Dashboard, navigate to Subscriptions, and toggle the Status slider to "PAUSED". Delivery stops from next morning.';
      } else if (lower.includes('a2')) {
        reply = 'A2 milk contains only the A2 beta-casein protein (unlike standard A1 milk). It is sourced from grass-fed Gir cows, making it significantly easier to digest and prevent bloat.';
      } else if (lower.includes('vending') || lower.includes('machine')) {
        reply = 'We have active vending machines at Skyline Premium Apartments, Greenwood Heights, and Prestige Boulevard Mall. You can inspect active stock levels on our Vending Machine Locator page.';
      } else if (lower.includes('pincode') || lower.includes('area') || lower.includes('deliver')) {
        reply = 'We active deliver inside central and east Bangalore regions (Pincodes 560001, 560025, 560037, 560066). Check your specific location on the Delivery Area page!';
      }

      setMessages((prev) => [...prev, { sender: 'ai', text: reply }]);
    }, 800);
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-accent-green hover:bg-green-500 text-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform duration-300 animate-bounce"
        aria-label="Open AI Assistant"
      >
        <MessageSquare size={24} />
      </button>

      {/* Drawer */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] z-50 rounded-2xl glass-premium shadow-2xl overflow-hidden flex flex-col border border-card-border animate-fade-in">
          {/* Header */}
          <div className="px-5 py-4 border-b border-card-border bg-gradient-to-r from-secondary-blue to-accent-green text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot size={22} className="animate-pulse" />
              <div>
                <h3 className="font-semibold text-sm">AYUDHARA Assistant</h3>
                <span className="text-[10px] text-white/80 flex items-center gap-1">
                  <Sparkles size={8} /> AI Active
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-white/10 text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50 dark:bg-slate-950/20">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`flex gap-2 max-w-[80%] items-start rounded-2xl p-3 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-secondary-blue text-white rounded-tr-none'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-card-border rounded-tl-none'
                  }`}
                >
                  {msg.sender === 'ai' && <Bot size={14} className="mt-0.5 text-secondary-blue flex-shrink-0" />}
                  <span>{msg.text}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Chips */}
          <div className="p-3 border-t border-card-border flex gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none bg-white dark:bg-slate-900">
            {quickChips.map((chip) => (
              <button
                key={chip}
                onClick={() => handleSend(chip)}
                className="px-3 py-1 rounded-full border border-card-border hover:border-secondary-blue hover:text-secondary-blue text-[10px] text-slate-500 dark:text-slate-400 transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="p-3 border-t border-card-border flex gap-2 items-center bg-white dark:bg-slate-900"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 px-4 py-2 rounded-full border border-card-border focus:outline-none focus:ring-1 focus:ring-secondary-blue text-xs dark:bg-slate-800 dark:text-white"
            />
            <button
              type="submit"
              className="p-2 rounded-full bg-secondary-blue text-white hover:bg-sky-500 transition-colors"
              aria-label="Send Message"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default AiAssistant;
