"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Lock, Truck, Shield } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';

const SHIPPING_COST = 0; 
const TAX_RATE = 0; // Tax rate remains 0%

export default function CartPage() {
  const { items: cartItems, updateQuantity, removeItem, subtotal } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const { formatPrice } = useCurrency();

  const applyPromoCode = () => {
    if (promoCode.trim().toUpperCase() === 'WELCOME10') { // Example logic
      setPromoApplied(true);
    } else if (promoCode.trim()) {
      setPromoApplied(true); // Keeping your original "apply anything" logic
    }
  };

  // Calculate totals
  const { discount, tax, total } = useMemo(() => {
    const discountVal = promoApplied ? subtotal * 0.1 : 0;
    const taxVal = (subtotal - discountVal) * TAX_RATE;
    const totalVal = subtotal - discountVal + taxVal + SHIPPING_COST;
    return { discount: discountVal, tax: taxVal, total: totalVal };
  }, [subtotal, promoApplied]);

  return (
    <main className="min-h-screen bg-art-texture text-black">
      <style jsx global>{`
        .bg-art-texture {
          background-color: #fdfbf7;
          background-image: url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23800000' fill-opacity='0.03' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E");
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
        <div className="mb-8">
          <Breadcrumbs items={[{ label: 'Shopping Cart', href: '/cart' }]} />
        </div>

        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-8 text-[#800000]">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-20 bg-white/60 rounded-lg shadow-sm border border-[#800000]/10">
            <div className="inline-block p-6 bg-white rounded-full mb-6 shadow-sm">
              <ShoppingBag size={64} className="text-gray-400" />
            </div>
            <h2 className="font-serif text-3xl font-bold mb-4 text-gray-800">Your Cart is Empty</h2>
            <p className="font-serif text-lg text-gray-600 mb-8">Discover our collection of masterpieces</p>
            <Link href="/artists-a-z" className="inline-flex items-center gap-2 bg-[#800000] text-white px-8 py-4 rounded-lg font-serif font-bold text-lg hover:bg-[#600000] transition-all">
              Browse Collection <ArrowRight size={20} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white/80 p-4 rounded-lg mb-4 border border-[#800000]/10 backdrop-blur-sm">
                <p className="font-serif text-lg">
                  <span className="font-bold text-[#800000] tabular-nums">{cartItems.length}</span>{' '}
                  {cartItems.length === 1 ? 'item' : 'items'} in your cart
                </p>
              </div>

              {cartItems.map((item) => (
                <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    <div className="relative w-full sm:w-32 h-48 sm:h-32 bg-gray-100 rounded-lg overflow-hidden">
                      <Image src={item.image || '/placeholder.webp'} alt={item.title} fill className="object-cover" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-serif text-2xl font-bold text-[#800000] mb-1">{item.title}</h3>
                          <p className="font-serif text-gray-600 mb-4">by {item.artist}</p>
                        </div>
                        <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-600 p-2"><Trash2 size={20} /></button>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                          <button 
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="p-2 hover:bg-gray-100"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="px-4 font-serif font-bold min-w-[3rem] text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 hover:bg-gray-100"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="font-serif text-2xl font-bold text-[#800000] tabular-nums">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="space-y-6 sticky top-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <h2 className="font-serif text-2xl font-bold mb-6 text-gray-800">Order Summary</h2>
                  
                  <div className="mb-6">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Promo Code"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:border-[#800000] outline-none"
                        disabled={promoApplied}
                      />
                      <button
                        onClick={applyPromoCode}
                        disabled={promoApplied}
                        className={`px-4 py-2 rounded-lg font-bold transition-all ${promoApplied ? 'bg-green-600 text-white' : 'bg-[#800000] text-white hover:bg-[#600000]'}`}
                      >
                        {promoApplied ? '✓' : 'Apply'}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                    <div className="flex justify-between font-serif">
                      <span>Subtotal</span>
                      <span className="font-semibold">{formatPrice(subtotal)}</span>
                    </div>
                    {promoApplied && (
                      <div className="flex justify-between font-serif text-green-600">
                        <span>Discount (10%)</span>
                        <span className="font-semibold">-{formatPrice(discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-serif">
                      <span>Shipping</span>
                      <span className="font-semibold text-green-600">FREE</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-baseline font-serif text-xl font-bold mb-6">
                    <span>Total</span>
                    <span className="text-[#800000]">{formatPrice(total)}</span>
                  </div>

                  <Link href="/checkout" className="w-full flex items-center justify-center gap-2 bg-[#800000] text-white px-6 py-4 rounded-lg font-serif font-bold text-lg hover:bg-[#600000] transition-all">
                    <Lock size={20} /> Proceed to Checkout
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
