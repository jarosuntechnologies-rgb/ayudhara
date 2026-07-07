'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, Plus, ShoppingCart, Sparkles, X, ChevronRight } from 'lucide-react';
import api from '../../services/api';
import { useCart } from '../../context/CartContext';

interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  imageUrl: string;
  sizes: string;
  nutrition: string; // JSON string
}

export default function ProductsPage() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState('');

  const categories = ['All', 'Milk', 'Curd', 'Butter', 'Paneer', 'Ghee', 'Ice Cream', 'Yogurt'];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products', {
          params: {
            category: selectedCategory,
            search: search,
            sortBy: sortBy,
          },
        });
        setProducts(res.data.products);
      } catch (err) {
        console.error('Failed to load products');
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [selectedCategory, search, sortBy]);

  const handleOpenDetails = (prod: Product) => {
    setSelectedProduct(prod);
    const sizeList = prod.sizes.split(',');
    setSelectedSize(sizeList[0].trim());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <span className="text-xs uppercase font-extrabold text-secondary-blue tracking-[0.2em] mb-2.5 block">
          Dairy Catalog
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
          Fresh, Pure & Nutritious
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          Order single-origin daily items or subscribe for scheduled mornings. All items are packed in environment-conscious, food-grade glass and clay modules.
        </p>
      </div>

      {/* Filter and Search Bar Row */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-8 border border-card-border p-4 rounded-3xl glass shadow-sm">
        {/* Search */}
        <div className="relative w-full lg:max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search fresh milk, paneer, curd..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-full border border-card-border focus:outline-none focus:ring-1 focus:ring-secondary-blue bg-white dark:bg-slate-900 dark:text-white text-sm"
          />
        </div>

        {/* Sort select */}
        <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
          <SlidersHorizontal size={16} className="text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 rounded-full border border-card-border bg-white dark:bg-slate-900 dark:text-white text-sm focus:outline-none"
          >
            <option value="newest">Newest Arrivals</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Category Chips Bar */}
      <div className="flex gap-2.5 overflow-x-auto pb-4 mb-8 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-6 py-2 rounded-full text-xs font-semibold whitespace-nowrap shadow-sm border transition-all duration-200 ${
              selectedCategory === cat
                ? 'bg-secondary-blue border-secondary-blue text-white scale-105'
                : 'bg-white dark:bg-slate-900 border-card-border text-slate-600 dark:text-slate-300 hover:border-secondary-blue hover:text-secondary-blue'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 border border-card-border rounded-3xl p-10">
          <p className="text-slate-500 dark:text-slate-400 font-medium">No fresh products match your filters right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((prod) => (
            <motion.div
              key={prod.id}
              whileHover={{ y: -6 }}
              className="bg-white dark:bg-slate-900 border border-card-border rounded-3xl shadow-sm flex flex-col justify-between overflow-hidden relative group transition-colors duration-300 h-full"
            >
              {/* Product Image */}
              <div className="relative aspect-square bg-slate-100 overflow-hidden cursor-pointer" onClick={() => handleOpenDetails(prod)}>
                <img
                  src={prod.imageUrl}
                  alt={prod.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full text-slate-700 dark:text-slate-200">
                  {prod.category}
                </span>
              </div>

              {/* Product Info */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3
                    onClick={() => handleOpenDetails(prod)}
                    className="font-bold text-lg text-slate-900 dark:text-white line-clamp-1 mb-1.5 cursor-pointer hover:text-secondary-blue transition-colors"
                  >
                    {prod.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                    {prod.description}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <div className="flex flex-col">
                    <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                      ₹{prod.price}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">
                      Size: {prod.sizes.split(',')[0]}
                    </span>
                  </div>
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
                    className="h-10 px-5 rounded-full bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
                  >
                    <Plus size={14} /> Add to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Product Detail Modal overlay */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-card-border z-10 grid grid-cols-1 md:grid-cols-2"
            >
              {/* Product Photo */}
              <div className="relative h-64 md:h-full bg-slate-100">
                <img
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-4 left-4 p-2 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-slate-700 dark:text-slate-200 md:hidden"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Product Specifications */}
              <div className="p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[85vh]">
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors hidden md:block"
                >
                  <X size={18} />
                </button>

                <div>
                  <span className="text-[10px] uppercase font-bold text-accent-green tracking-wider mb-1 block">
                    {selectedProduct.category}
                  </span>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                    {selectedProduct.title}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                    {selectedProduct.description}
                  </p>

                  {/* Size selectors */}
                  <div className="mb-6">
                    <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2 block">
                      Choose Volume / Quantity
                    </span>
                    <div className="flex gap-2.5">
                      {selectedProduct.sizes.split(',').map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size.trim())}
                          className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
                            selectedSize === size.trim()
                              ? 'bg-secondary-blue border-secondary-blue text-white shadow-sm'
                              : 'bg-white dark:bg-slate-800 border-card-border text-slate-600 dark:text-slate-300 hover:border-secondary-blue'
                          }`}
                        >
                          {size.trim()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Nutrition parameters */}
                  {selectedProduct.nutrition && (
                    <div className="mb-6">
                      <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3.5 block flex items-center gap-1">
                        <Sparkles size={14} className="text-yellow-500" /> Nutritional facts (per 100g)
                      </span>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        {Object.entries(JSON.parse(selectedProduct.nutrition)).map(([key, val]: any) => (
                          <div key={key} className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-2xl border border-card-border">
                            <span className="text-[10px] text-slate-400 capitalize block mb-0.5">{key}</span>
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{val}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-card-border flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm text-slate-400 font-semibold">Total Price</span>
                    <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                      ₹{selectedProduct.price}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      addToCart({
                        id: selectedProduct.id,
                        title: selectedProduct.title,
                        price: selectedProduct.price,
                        imageUrl: selectedProduct.imageUrl,
                        size: selectedSize,
                      });
                      setSelectedProduct(null);
                    }}
                    className="px-6 py-3 rounded-full bg-secondary-blue hover:bg-sky-500 text-white font-semibold text-xs flex items-center gap-2 shadow-md transition-all hover:scale-102"
                  >
                    <ShoppingCart size={16} /> Add to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
