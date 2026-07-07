'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, Sun, Moon, User, Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import CartDrawer from './CartDrawer';

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { cartCount, cartTotal } = useCart();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: 'Products', href: '/products' },
    { name: 'Milk Processing', href: '/processing' },
    { name: 'Vending Machines', href: '/vending' },
    { name: 'Subscription', href: '/subscriptions' },
    { name: 'Gated Orders', href: '/leads?tab=community' },
    { name: 'Bulk Orders', href: '/leads?tab=bulk' },
    { name: 'Feedback & Ratings', href: '/feedback' },
    { name: 'Recipes', href: '/blog' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-40 glass border-b border-card-border transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-2xl font-bold tracking-tight text-gradient flex items-center gap-2">
                <span className="text-3xl font-extrabold">AYUDHARA</span>
                <span className="text-sm uppercase tracking-[0.2em] font-medium text-slate-500 dark:text-slate-400">Dairy</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-slate-700 hover:text-secondary-blue dark:text-slate-300 dark:hover:text-secondary-blue transition-colors duration-200"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Actions (Cart, Theme, Dashboard/Profile) */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                aria-label="Toggle Theme"
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>

              {/* Shopping Cart Trigger */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                aria-label="View Cart"
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent-green text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* User Actions */}
              {user ? (
                <div className="flex items-center space-x-2">
                  <Link
                    href={user.role === 'ADMIN' ? '/dashboard/admin' : '/dashboard/customer'}
                    className="flex items-center gap-1.5 px-4 h-10 rounded-full border border-card-border hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-200 transition-colors"
                  >
                    <LayoutDashboard size={16} />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="p-2 text-slate-500 hover:text-red-500 rounded-full transition-colors"
                    title="Logout"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 px-5 h-10 rounded-full bg-secondary-blue hover:bg-sky-500 text-white text-sm font-medium shadow-sm transition-all hover:scale-105"
                >
                  <User size={16} />
                  <span>Sign In</span>
                </Link>
              )}
            </div>

            {/* Mobile menu trigger */}
            <div className="flex lg:hidden items-center space-x-3">
              {/* Mobile Cart */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent-green text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile Theme */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>

              <button
                onClick={toggleMenu}
                className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isOpen && (
          <div className="lg:hidden glass border-b border-card-border animate-fade-in">
            <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2.5 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                >
                  {link.name}
                </Link>
              ))}

              <div className="pt-4 border-t border-card-border px-3 flex flex-col gap-2">
                {user ? (
                  <>
                    <Link
                      href={user.role === 'ADMIN' ? '/dashboard/admin' : '/dashboard/customer'}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-md border border-card-border font-medium text-slate-700 dark:text-slate-200"
                    >
                      <LayoutDashboard size={18} />
                      <span>My Dashboard</span>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-md border border-red-200 dark:border-red-900/30 text-red-500 font-medium"
                    >
                      <LogOut size={18} />
                      <span>Log Out</span>
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-md bg-secondary-blue text-white font-medium shadow-sm"
                  >
                    <User size={18} />
                    <span>Sign In</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Slide-out Cart Drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default Navbar;
