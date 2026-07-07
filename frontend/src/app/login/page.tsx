'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ShieldAlert, Sparkles, ArrowRight } from 'lucide-react';

function LoginPageContent() {
  const { user, login, register, googleSignIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const redirect = searchParams.get('redirect') || '';

  useEffect(() => {
    if (user) {
      if (redirect) {
        router.push(`/${redirect}`);
      } else {
        router.push(user.role === 'ADMIN' ? '/dashboard/admin' : '/dashboard/customer');
      }
    }
  }, [user, redirect, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleMock = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      // Mock Google Login API Call
      await googleSignIn(
        'Google User',
        'googleuser@gmail.com',
        'google_id_mock_' + Math.random().toString(36).substr(2, 9)
      );
    } catch (err: any) {
      setErrorMsg(err.message || 'Google Auth failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="border border-card-border rounded-3xl glass-premium p-8 shadow-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold tracking-tight text-gradient flex items-center justify-center gap-1.5 mb-2">
            <span className="text-3xl font-extrabold">AYUDHARA</span>
            <span className="text-sm uppercase tracking-[0.2em] font-medium text-slate-500">Dairy</span>
          </Link>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isLogin ? 'Sign in to manage subscriptions and cart checkout.' : 'Register an account to start daily morning milk drops.'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full pl-10 pr-4 py-2.5 rounded-full border border-card-border bg-white dark:bg-slate-900 dark:text-white text-xs"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. john@gmail.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-card-border bg-white dark:bg-slate-900 dark:text-white text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-card-border bg-white dark:bg-slate-900 dark:text-white text-xs"
              />
            </div>
          </div>

          {errorMsg && (
            <div className="flex gap-2 p-3 bg-red-50/50 dark:bg-red-950/20 text-red-500 text-xs rounded-2xl border border-red-200 dark:border-red-900/30">
              <ShieldAlert size={16} className="flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-secondary-blue hover:bg-sky-500 text-white font-semibold text-xs shadow-sm transition-colors flex items-center justify-center gap-1.5"
          >
            <span>{loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}</span>
            <ArrowRight size={14} />
          </button>
        </form>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-card-border"></div></div>
          <span className="relative bg-white dark:bg-slate-950 px-3 text-[10px] uppercase font-bold text-slate-400">Or Continue With</span>
        </div>

        {/* Mock Google Login Button */}
        <button
          onClick={handleGoogleMock}
          disabled={loading}
          className="w-full py-2.5 rounded-full border border-card-border hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
        >
          <Sparkles size={14} className="text-yellow-500" />
          <span>Google Mock Session</span>
        </button>

        {/* Toggle Login/Signup */}
        <div className="mt-6 text-center text-xs text-slate-500">
          {isLogin ? "Don't have a dairy account?" : 'Already registered?'} {' '}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setErrorMsg('');
            }}
            className="text-secondary-blue font-semibold hover:underline"
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-500">Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}
