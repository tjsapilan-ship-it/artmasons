"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Lock, Truck, Shield } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';


const SHIPPING_COST = 0; // Free shipping
//const TAX_RATE = 0.05; // 5% tax

export default function CartPage() {
  const { items: cartItems, updateQuantity, removeItem, subtotal } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const { formatPrice } = useCurrency();

  const applyPromoCode = () => {
    if (promoCode.trim()) {
      setPromoApplied(true);
    }
  };

  const discount = promoApplied ? subtotal * 0.1 : 0;
  //const tax = (subtotal - discount) * TAX_RATE;
  const total = subtotal - discount + /*tax*/ + SHIPPING_COST;

  return (
    <main className="min-h-screen bg-art-texture text-black">
      {/* Linen Canvas Background Pattern */}
      <style jsx global>{`
        .bg-art-texture {
          background-color: #fdfbf7;
          background-image: url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23800000' fill-opacity='0.03' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E");
        }
      `}</style>

      <div className="w-full px-4 py-12 relative z-10">

        <div className="mb-8">
          <Breadcrumbs items={[{ label: 'Shopping Cart', href: '/cart' }]} />
        </div>

        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-8 text-[#800000]">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          // Empty Cart State
          <div className="text-center py-20 bg-white/60 rounded-lg shadow-sm border border-[#800000]/10">
            <div className="inline-block p-6 bg-white rounded-full mb-6 shadow-sm">
              <ShoppingBag size={64} className="text-gray-400" />
            </div>
            <h2 className="font-serif text-3xl font-bold mb-4 text-gray-800">Your Cart is Empty</h2>
            <p className="font-serif text-lg text-gray-600 mb-8">
              Discover our collection of museum-quality masterpieces
            </p>
            <Link
              href="/artists-a-z"
              className="inline-flex items-center gap-2 bg-[#800000] text-white px-8 py-4 rounded-lg font-serif font-bold text-lg hover:bg-[#600000] transition-colors cursor-pointer"
            >
              Browse Collection
              <ArrowRight size={20} />
            </Link>
          </div>
        ) : (
          // Cart with Items
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Cart Items - Left Column */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white/80 p-4 rounded-lg mb-4 border border-[#800000]/10 backdrop-blur-sm">
                <p className="font-serif text-lg">
                  <span className="font-bold text-[#800000] tabular-nums">{cartItems.length}</span>{' '}
                  <span>{cartItems.length === 1 ? 'item' : 'items'} in your cart</span>
                </p>
              </div>

              {cartItems.map((item) => (
                <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow">
                  <div className="flex gap-4 sm:gap-6">
                    {/* Product Image */}
                    <div className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-lg overflow-hidden relative">
                      <Image
                        src={item.image || '/placeholder.webp'}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="font-serif text-2xl font-bold text-[#800000] mb-1">
                            {item.title}
                          </h3>
                          <p className="font-serif text-gray-600 mb-1">by {item.artist}</p>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors p-2 cursor-pointer"
                          aria-label="Remove item"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>

                      <div className="space-y-2 mb-4">
                        <p className="font-serif text-sm text-gray-700">
                          <span className="font-semibold">Size:</span> {item.size}
                        </p>
                        <p className="font-serif text-sm text-gray-700">
                          <span className="font-semibold">Dimensions:</span> {item.dimensions}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <span className="font-serif text-sm text-gray-600">Quantity:</span>
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-2 hover:bg-gray-100 transition-colors cursor-pointer"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="px-4 font-serif font-bold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-2 hover:bg-gray-100 transition-colors cursor-pointer"
                              aria-label="Increase quantity"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="font-serif text-2xl font-bold text-[#800000] tabular-nums">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                          {item.quantity > 1 && (
                            <p className="font-serif text-sm text-gray-500 tabular-nums">
                              {formatPrice(item.price)} each
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Continue Shopping */}
              <div className="pt-4">
                <Link
                  href="/artists-a-z"
                  className="inline-flex items-center gap-2 text-[#800000] hover:underline font-serif font-semibold cursor-pointer"
                >
                  ← Continue Shopping
                </Link>
              </div>
            </div>

            {/* Order Summary - Right Column */}
            <div className="lg:col-span-1">
              <div className="space-y-6 sticky top-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <h2 className="font-serif text-2xl font-bold mb-6 text-gray-800">Order Summary</h2>

                  {/* Promo Code */}
                  <div className="mb-6">
                    <label className="font-serif text-sm font-semibold text-gray-700 mb-2 block">
                      Promo Code
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Enter code"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-serif focus:outline-none focus:border-[#800000]"
                        disabled={promoApplied}
                      />
                      <button
                        onClick={applyPromoCode}
                        disabled={promoApplied}
                        className={`px-4 py-2 rounded-lg font-serif font-bold transition-colors ${promoApplied
                          ? 'bg-green-600 text-white cursor-not-allowed'
                          : 'bg-[#800000] text-white hover:bg-[#600000] cursor-pointer'
                          }`}
                      >
                        {promoApplied ? '✓' : 'Apply'}
                      </button>
                    </div>
                    {promoApplied && (
                      <p className="text-green-600 text-sm font-serif mt-2">
                        ✓ Promo code applied successfully!
                      </p>
                    )}
                  </div>

                  <div className="space-y-3 mb-6 pb-6 border-b border-gray-300">
                    <div className="flex justify-between items-baseline font-serif">
                      <span className="text-gray-700">Subtotal:</span>
                      <span className="font-semibold tabular-nums">{formatPrice(subtotal)}</span>
                    </div>

                    {promoApplied && (
                      <div className="flex justify-between items-baseline font-serif text-green-600">
                        <span>Discount (10%):</span>
                        <span className="font-semibold tabular-nums">-{formatPrice(discount)}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-baseline font-serif">
                      <span className="text-gray-700">Shipping:</span>
                      <span className="font-semibold text-green-600">FREE</span>
                    </div>

                    <div className="flex justify-between items-baseline font-serif">
                      <span className="text-gray-700">Tax (5%):</span>
                      <span className="font-semibold tabular-nums">{formatPrice(tax)}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-baseline font-serif text-xl font-bold mb-6">
                    <span className="text-gray-900">Total:</span>
                    <span className="text-[#800000] tabular-nums">{formatPrice(total)}</span>
                  </div>

                  <Link
                    href="/checkout"
                    className="w-full flex items-center justify-center gap-2 bg-[#800000] text-white px-6 py-4 rounded-lg font-serif font-bold text-lg hover:bg-[#600000] transition-colors mb-4 cursor-pointer"
                  >
                    <Lock size={20} />
                    Proceed to Checkout
                  </Link>

                  <div className="space-y-3 pt-4 border-t border-gray-300">
                    <div className="flex items-center gap-3 text-sm font-serif text-gray-600">
                      <Shield size={18} className="text-[#800000]" />
                      <span>Secure Payment</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm font-serif text-gray-600">
                      <Truck size={18} className="text-[#800000]" />
                      <span>Free Worldwide Shipping</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm font-serif text-gray-600">
                      <ShoppingBag size={18} className="text-[#800000]" />
                      <span>30-Day Return Policy</span>
                    </div>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="bg-white/80 border border-gray-200 rounded-lg p-6 backdrop-blur-sm">
                  <h3 className="font-serif text-lg font-bold mb-4 text-gray-800">Why Choose Art Masons?</h3>
                  <ul className="space-y-3 font-serif text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-[#800000] mt-1">✓</span>
                      <span>Museum-quality reproductions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#800000] mt-1">✓</span>
                      <span>Hand-painted by master artists</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#800000] mt-1">✓</span>
                      <span>Premium linen canvas & oil paints</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#800000] mt-1">✓</span>
                      <span>Worldwide secure shipping</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Additional Information Section */}
        {cartItems.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/80 p-6 rounded-lg text-center border border-[#800000]/5 backdrop-blur-sm">
              <div className="inline-block p-4 bg-[#800000] text-white rounded-full mb-4">
                <Lock size={32} />
              </div>
              <h3 className="font-serif text-xl font-bold mb-2 text-gray-800">Secure Checkout</h3>
              <p className="font-serif text-sm text-gray-600">
                Your payment information is protected with industry-standard encryption
              </p>
            </div>

            <div className="bg-white/80 p-6 rounded-lg text-center border border-[#800000]/5 backdrop-blur-sm">
              <div className="inline-block p-4 bg-[#800000] text-white rounded-full mb-4">
                <Truck size={32} />
              </div>
              <h3 className="font-serif text-xl font-bold mb-2 text-gray-800">Free Shipping</h3>
              <p className="font-serif text-sm text-gray-600">
                Complimentary worldwide shipping on all orders, carefully packaged for protection
              </p>
            </div>

            <div className="bg-white/80 p-6 rounded-lg text-center border border-[#800000]/5 backdrop-blur-sm">
              <div className="inline-block p-4 bg-[#800000] text-white rounded-full mb-4">
                <Shield size={32} />
              </div>
              <h3 className="font-serif text-xl font-bold mb-2 text-gray-800">Quality Guarantee</h3>
              <p className="font-serif text-sm text-gray-600">
                Each painting is inspected for quality before shipping with a satisfaction guarantee
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
