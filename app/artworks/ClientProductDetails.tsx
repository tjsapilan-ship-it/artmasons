'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShoppingCart,
  ShoppingBag,
  Palette,
  Phone,
  Star,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { type CartItem, useCart } from '../context/CartContext';
import type { Artwork } from '../../data/artworks';
import { getArtworkSlug } from '../../data/artworks';
import { useToast } from '../context/ToastContext';

type ArtworkOption = NonNullable<Artwork['options']>[number];

type ConflictState = {
  existing: CartItem;
  newItem: CartItem;
};

export default function ClientProductDetails({
  artwork,
  slug,
  similarArtworks = [],
}: {
  artwork: Artwork;
  slug: string;
  similarArtworks?: (Artwork & { _slug?: string })[];
}) {
  const [selectedOption, setSelectedOption] = useState<ArtworkOption>(
    (artwork.options && artwork.options.length > 0 && artwork.options[0]) || {
      id: 'opt-default',
      width: 70,
      height: 90,
      price: artwork.basePrice || 0,
      label: 'Default'
    }
  );
  const [quantity, setQuantity] = useState(1);
  const [imageIsPortrait, setImageIsPortrait] = useState<boolean | null>(null);

  const optionIsPortrait = useMemo(() => selectedOption.width < selectedOption.height, [selectedOption.width, selectedOption.height]);
  const isPortrait = imageIsPortrait ?? optionIsPortrait;
  const formatPrice = (value: number) => new Intl.NumberFormat('en-US').format(value);

  const availableOptions = (artwork.options && artwork.options.length > 0) ? artwork.options : [selectedOption];
  const { addItem, items: cartItems } = useCart();
  const { addToast } = useToast();
  const [conflictItem, setConflictItem] = useState<ConflictState | null>(null);
  const [showConflictModal, setShowConflictModal] = useState(false);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">

      {/* LEFT: Image */}
      <div className="w-full">
        <div className="bg-transparent border border-gray-200 p-0 flex items-center justify-center relative group">
          {/* Dynamic aspect container: portrait or landscape to avoid white bars */}
          <div className={`relative w-full ${isPortrait ? 'aspect-[3/4]' : 'aspect-[4/3]'} max-h-[70vh]`}>
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src={artwork.image}
                alt={artwork.name}
                fill
                onLoadingComplete={(img) => {
                  if (img && img.naturalWidth && img.naturalHeight) {
                    setImageIsPortrait(img.naturalWidth < img.naturalHeight);
                  }
                }}
                className="object-contain w-full h-full max-h-[70vh] shadow-xl"
                priority
              />
            </div>

            {/* Museum Quality Diagonal Ribbon */}
            <div className="absolute top-0 left-0 w-32 md:w-48 h-32 md:h-48 overflow-hidden pointer-events-none">
              <div className="absolute -left-12 md:-left-20 top-6 md:top-10 transform -rotate-45 bg-[#800000] text-white px-16 md:px-24 py-1.5 md:py-2.5 font-serif text-[9px] md:text-xs font-bold uppercase tracking-wide shadow-xl whitespace-nowrap flex items-center justify-center">
                Museum Quality
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Below Image */}
        <div className="mt-4 md:mt-6 space-y-3 md:space-y-4">
          <div className="bg-gray-50 border border-gray-200 p-4 md:p-5">
            <h3 className="font-serif text-lg md:text-xl font-bold text-[#800000] mb-2 md:mb-3 uppercase">About This Artwork</h3>
            <div className="space-y-1.5 text-sm md:text-base text-gray-700 font-serif">
              <p>
                <span className="font-bold text-gray-900">Artist:</span>{' '}
                {artwork.artist}
                {artwork.artistLifespan ? ` (${artwork.artistLifespan})` : ''}
              </p>
              <p>
                <span className="font-bold text-gray-900">Original Year:</span>{' '}
                {artwork.year ?? 'Unknown'}
              </p>
              <p>
                <span className="font-bold text-gray-900">Original Dimensions:</span>{' '}
                {artwork.originalDimensions ?? (selectedOption ? `${selectedOption.width} x ${selectedOption.height} cm` : 'Varies')}
              </p>
            </div>
          </div>

          <div className="bg-[#800000] text-white p-4 md:p-5">
            <h3 className="font-serif text-lg md:text-xl font-bold mb-2 md:mb-3 uppercase">Art Masons Assurance</h3>
            <ul className="space-y-1.5 text-sm md:text-base font-serif">
              <li className="flex items-center gap-2">
                <Star size={12} className="flex-shrink-0" fill="white" />
                100% Hand-Painted by Master Artists
              </li>
              <li className="flex items-center gap-2">
                <Star size={12} className="flex-shrink-0" fill="white" />
                Premium Linen Canvas & Oil Paints
              </li>
              <li className="flex items-center gap-2">
                <Star size={12} className="flex-shrink-0" fill="white" />
                Museum-Quality Reproduction
              </li>
              <li className="flex items-center gap-2">
                <Star size={12} className="flex-shrink-0" fill="white" />
                International Academic Training
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* RIGHT: Product Details & Cart */}
      <div className="w-full space-y-4 md:space-y-6">

        {/* Title & Artist */}
        <div className="border-b border-gray-200 pb-4 md:pb-5">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#800000] mb-1.5">
            {artwork.name}
          </h1>
          <p className="font-serif text-xl md:text-2xl text-gray-600 italic mb-1">
            {artwork.artist}, {artwork.year}
          </p>
          {artwork.artistLifespan && (
            <p className="font-serif text-sm text-gray-500">
              ({artwork.artistLifespan})
            </p>
          )}
        </div>

        {/* Pricing Section */}
        <div className="bg-gray-50 border border-gray-200 p-4 md:p-5">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-serif text-4xl md:text-5xl font-bold text-[#800000] inline-flex items-end">
              {formatPrice(selectedOption.price)}
            </span>
            <span className="font-serif text-lg md:text-xl text-gray-600">{artwork.currency}</span>
          </div>
          <p className="text-sm md:text-sm text-gray-500 font-serif uppercase tracking-wide">
            Hand-painted on linen canvas
          </p>
        </div>

        {/* Size Selection */}
          <div>
          <h3 className="font-serif text-lg md:text-xl font-bold text-gray-900 mb-3 uppercase">Select Canvas Size</h3>
          <div className="space-y-2 md:space-y-3">
            {availableOptions.map((option) => (
              <label 
                key={option.id} 
                className={`
                  flex items-center justify-between p-3 md:p-4 border cursor-pointer transition-all duration-200
                  ${selectedOption.id === option.id 
                    ? 'border-[#800000] bg-red-50 shadow-sm' 
                    : 'border-gray-200 hover:border-gray-400 bg-white'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`
                    w-4 h-4 md:w-5 md:h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
                    ${selectedOption.id === option.id ? 'border-[#800000]' : 'border-gray-300'}
                  `}>
                    {selectedOption.id === option.id && (
                      <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-[#800000]" />
                    )}
                  </div>
                  <div className="font-serif">
                    <div className="text-base md:text-lg font-bold text-gray-900">
                      {option.width.toFixed(1)} x {option.height.toFixed(1)} cm
                    </div>
                    {option.id === 'opt1' && (
                      <span className="text-sm md:text-sm text-gray-500 italic">Original Size</span>
                    )}
                  </div>
                </div>
                <span className="font-serif font-bold text-base md:text-lg text-gray-800 inline-flex items-end">
                  {formatPrice(option.price)}
                  <span className="ml-1">{artwork.currency}</span>
                </span>
                
                <input 
                  type="radio" 
                  name="size" 
                  value={option.id} 
                  checked={selectedOption.id === option.id} 
                  onChange={() => setSelectedOption(option)} 
                  className="hidden"
                />
              </label>
            ))}
          </div>
          
          {/* Custom Size Note */}
            <div className="mt-3 flex items-start gap-2 text-sm md:text-sm text-gray-600 font-serif border border-gray-200 p-2.5 md:p-3 bg-gray-50">
            <Info size={12} className="flex-shrink-0 mt-0.5" />
            <p>
              Need a custom size? <a href="mailto:info@artmasons.com" className="text-[#800000] hover:underline font-normal cursor-pointer">Contact us</a> for personalized dimensions.
            </p>
          </div>
        </div>

        {/* Quantity Selector */}
        <div>
          <h3 className="font-serif text-lg md:text-xl font-bold text-gray-900 mb-3 uppercase">Quantity</h3>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-9 h-9 md:w-10 md:h-10 border border-gray-300 hover:border-[#800000] flex items-center justify-center font-bold text-xl md:text-2xl transition-colors cursor-pointer"
            >
              -
            </button>
            <input 
              type="number" 
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-16 md:w-20 h-9 md:h-10 border border-gray-300 text-center font-serif font-bold text-lg md:text-xl outline-none focus:border-[#800000]"
              min="1"
            />
            <button 
              onClick={() => setQuantity(quantity + 1)}
              className="w-9 h-9 md:w-10 md:h-10 border border-gray-300 hover:border-[#800000] flex items-center justify-center font-bold text-xl md:text-2xl transition-colors cursor-pointer"
            >
              +
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-3 border-t border-gray-200">
          <button
            onClick={() => {
              const baseId = slug;
              const existing = cartItems.find((p) => {
                const parts = String(p.id).split('-');
                return parts[0] === baseId;
              });

              const itemId = `${slug}-${selectedOption.id}`;
              const newItem = {
                id: itemId,
                title: artwork.name,
                artist: artwork.artist,
                image: artwork.image,
                option: selectedOption,
                size: `${selectedOption.width} x ${selectedOption.height} cm`,
                dimensions: `${selectedOption.width} x ${selectedOption.height} cm`,
                price: selectedOption.price,
                quantity,
              };

              // If a product with same base id exists but different option, prompt user
              if (existing && existing.option && existing.option.id !== selectedOption.id) {
                setConflictItem({ existing, newItem });
                setShowConflictModal(true);
                return;
              }

              addItem(newItem);
              addToast(`${artwork.name} added to cart`, 'success');
            }}
            className="w-full bg-[#800000] hover:bg-[#600000] text-white font-serif font-bold text-base md:text-lg py-3 md:py-3.5 px-4 transition-colors flex items-center justify-center gap-2 shadow-md uppercase tracking-wide cursor-pointer"
          >
            <ShoppingCart size={18} />
            <span className="inline-flex items-end">
              Add to Cart -
              &nbsp;
              {formatPrice(selectedOption.price)}
              <span className="ml-1">{artwork.currency}</span>
            </span>
          </button>
          
          <button className="w-full bg-white border border-[#800000] text-[#800000] hover:bg-red-50 font-serif font-bold text-base md:text-lg py-3 md:py-3.5 px-4 transition-colors uppercase tracking-wide cursor-pointer">
            Request Custom Size Quote
          </button>

          <div className="flex items-center justify-center gap-2 text-sm md:text-base text-gray-600 font-serif pt-1">
            <Phone size={14} />
            <span className="text-center">Need Help? <a href="https://wa.me/971561704788" target="_blank" rel="noopener noreferrer" className="text-[#800000] font-bold hover:underline inline-flex items-center gap-1 cursor-pointer">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              +971 56 170 4788
            </a></span>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 gap-3 pt-4">
          <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200">
            <ShoppingBag size={20} className="text-[#800000] flex-shrink-0" />
            <div className="font-serif text-sm md:text-sm">
              <p className="font-bold text-gray-900 leading-tight">Secure Checkout</p>
              <p className="text-gray-600 leading-tight">Safe & Protected</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200">
            <Palette size={20} className="text-[#800000] flex-shrink-0" />
            <div className="font-serif text-sm md:text-sm">
              <p className="font-bold text-gray-900 leading-tight">Handmade</p>
              <p className="text-gray-600 leading-tight">By Master Artists</p>
            </div>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {showConflictModal && conflictItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40"
          >
            <motion.div
              initial={{ y: 12, scale: 0.98, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 12, scale: 0.98, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="bg-white rounded-lg p-6 max-w-lg w-full mx-4"
            >
              <h3 className="font-serif text-lg font-bold mb-2">Product already in cart</h3>
              <p className="text-sm text-gray-700 mb-4">You already have this artwork in a different size/option. How would you like to add the new selection?</p>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    addItem(conflictItem.newItem, { merge: 'replace' });
                    addToast(`${conflictItem.newItem.title} merged into existing item`, 'success');
                    setShowConflictModal(false);
                  }}
                  className="w-full bg-[#800000] text-white px-4 py-3 rounded-md font-bold cursor-pointer"
                >
                  Replace existing option & increase quantity
                </button>

                <button
                  onClick={() => {
                    addItem(conflictItem.newItem, { merge: 'separate' });
                    addToast(`${conflictItem.newItem.title} added as separate item`, 'success');
                    setShowConflictModal(false);
                  }}
                  className="w-full bg-white border border-gray-300 text-[#800000] px-4 py-3 rounded-md font-bold cursor-pointer"
                >
                  Add as separate line item
                </button>

                <button onClick={() => setShowConflictModal(false)} className="w-full text-gray-700 underline cursor-pointer">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {similarArtworks.length > 0 && (
        <div className="lg:col-span-2 mt-12">
          <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#800000] mb-5 uppercase text-center">
            Similar paintings by {artwork.artist}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 max-w-6xl mx-auto justify-center">
            {similarArtworks.map((item) => {
              const itemSlug = item._slug || getArtworkSlug(item);
              const displayPrice = item.basePrice ?? item.options?.[0]?.price ?? 0;

              return (
                <Link
                  key={itemSlug}
                  href={`/artworks/${itemSlug}`}
                  className="group block bg-white border border-gray-200 hover:border-[#800000] transition-colors shadow-sm rounded-md overflow-hidden cursor-pointer"
                >
                  <div className="relative w-full h-56 md:h-52 overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 100vw"
                    />
                  </div>
                  <div className="p-3 space-y-1">
                    <p className="font-serif text-xs text-gray-600 uppercase tracking-wide">{item.artist}</p>
                    <p className="font-serif text-base font-bold text-gray-900 leading-snug line-clamp-2">{item.name}</p>
                    <p className="font-serif text-xs text-gray-500">{item.year ?? 'Year unknown'}</p>
                    <p className="font-serif text-lg md:text-xl font-bold text-[#800000]">
                      {displayPrice.toLocaleString()} {item.currency ?? artwork.currency}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
