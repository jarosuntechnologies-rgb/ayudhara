'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import api from '../services/api';
import { useRouter } from 'next/navigation';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ open, onClose }) => {
  const { cart, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  if (!open) return null;

  const handleCheckout = async () => {
    if (!user) {
      router.push('/login?redirect=checkout');
      onClose();
      return;
    }

    try {
      // Mock order creation on the server
      const itemsMap = cart.map((i) => ({
        productId: i.id,
        title: i.title,
        price: i.price,
        quantity: i.quantity,
        size: i.size,
      }));

      const res = await api.post('/orders', {
        items: itemsMap,
        total: cartTotal,
        address: 'Saved Default Address, Gated Residency, Block C',
        phone: '9876543210',
        notes: 'Deliver before 7:00 AM',
      });

      const { order } = res.data;

      // Mock payment verification immediately
      await api.post('/orders/verify', {
        orderId: order.id,
        razorpayPaymentId: 'pay_mock_' + Math.random().toString(36).substr(2, 9),
      });

      // Clear local cart
      clearCart();
      onClose();

      // Route to customer dashboard orders list
      router.push('/dashboard/customer?tab=orders&status=success');
    } catch (err) {
      alert('Checkout failed, please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md">
          <div className="h-full flex flex-col bg-white dark:bg-slate-900 shadow-2xl border-l border-card-border overflow-y-auto">
            {/* Header */}
            <div className="px-6 py-5 border-b border-card-border flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <ShoppingBag size={20} className="text-secondary-blue" />
                <span>Your Milk Cart</span>
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full text-slate-400 hover:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 py-6 overflow-y-auto px-6">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag size={28} className="text-slate-400" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white">Your cart is empty</h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Add farm fresh products to get started.
                  </p>
                  <button
                    onClick={() => {
                      router.push('/products');
                      onClose();
                    }}
                    className="mt-6 inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-secondary-blue hover:bg-sky-500 text-white font-medium text-sm transition-colors"
                  >
                    <span>Shop Fresh Dairy</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              ) : (
                <div className="flow-root">
                  <ul className="-my-6 divide-y divide-card-border">
                    {cart.map((item) => (
                      <li key={`${item.id}-${item.size}`} className="py-6 flex">
                        <div className="flex-shrink-0 w-20 h-20 border border-card-border rounded-lg overflow-hidden relative">
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="ml-4 flex-1 flex flex-col">
                          <div>
                            <div className="flex justify-between text-base font-medium text-slate-900 dark:text-white">
                              <h3 className="line-clamp-1">{item.title}</h3>
                              <p className="ml-4">₹{item.price * item.quantity}</p>
                            </div>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                              Size: {item.size}
                            </p>
                          </div>
                          <div className="flex-1 flex items-end justify-between text-sm">
                            <div className="flex items-center border border-card-border rounded-full p-0.5">
                              <button
                                onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                                className="p-1 text-slate-500 hover:text-slate-700 dark:hover:text-white"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="px-2.5 text-slate-800 dark:text-slate-200 text-xs font-semibold">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                                className="p-1 text-slate-500 hover:text-slate-700 dark:hover:text-white"
                              >
                                <Plus size={14} />
                              </button>
                            </div>

                            <div className="flex">
                              <button
                                onClick={() => removeFromCart(item.id, item.size)}
                                className="font-medium text-red-500 hover:text-red-600 flex items-center gap-1 text-xs transition-colors"
                              >
                                <Trash2 size={14} />
                                <span>Remove</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t border-card-border py-6 px-6 bg-slate-50 dark:bg-slate-950/40">
                <div className="flex justify-between text-base font-semibold text-slate-900 dark:text-white">
                  <span>Subtotal</span>
                  <span>₹{cartTotal}</span>
                </div>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  Shipping, quality reports, and environment taxes calculated at checkout.
                </p>
                <div className="mt-6 flex flex-col gap-3">
                  <button
                    onClick={handleCheckout}
                    className="w-full flex justify-center items-center gap-1.5 px-6 py-3 border border-transparent rounded-full shadow-sm text-sm font-semibold text-white bg-secondary-blue hover:bg-sky-500 transition-colors"
                  >
                    <span>Instant Checkout</span>
                    <ArrowRight size={16} />
                  </button>
                  <button
                    onClick={() => {
                      router.push('/subscriptions');
                      onClose();
                    }}
                    className="w-full flex justify-center items-center gap-1.5 px-6 py-3 border border-card-border rounded-full shadow-sm text-sm font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <span>Convert to Daily Subscription</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
