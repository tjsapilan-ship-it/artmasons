'use client';

import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence, PanInfo } from 'framer-motion';
import Image from 'next/image';

const DEFAULT_IMAGES = [
  { src: "/image/about-us/image_1.png", alt: "Art Masons Masterpiece 1" },
  { src: "/image/about-us/image_2.png", alt: "Art Masons Masterpiece 2" },
  { src: "/image/about-us/image_3.png", alt: "Art Masons Masterpiece 3" },
  { src: "/image/about-us/image_4.png", alt: "Art Masons Masterpiece 4" },
  { src: "/image/about-us/image_5.png", alt: "Art Masons Masterpiece 5" },
  { src: "/image/about-us/image_6.jpg", alt: "Art Masons Masterpiece 6" },
  { src: "/image/about-us/image_7.png", alt: "Art Masons Masterpiece 7" },
];

export default function AboutUsGallery({ images = DEFAULT_IMAGES }: { images?: { src: string; alt: string }[] }) {
  const [cards, setCards] = useState(images);

  const removeCard = (index: number) => {
    setCards((prev) => {
      const newCards = [...prev];
      const removed = newCards.splice(index, 1)[0];
      // Optional: Add to bottom to make it infinite
      newCards.unshift(removed);
      return newCards;
    });
  };

  return (
    <div className="w-full flex flex-col items-center justify-center py-4 min-h-[450px] overflow-visible relative">
      <div className="relative w-full max-w-sm h-[400px] flex items-center justify-center">
        <AnimatePresence>
          {cards.map((card, index) => {
            const isTop = index === cards.length - 1;
            return (
              <Card
                key={card.src}
                card={card}
                index={index}
                isTop={isTop}
                total={cards.length}
                onRemove={() => removeCard(index)}
              />
            );
          })}
        </AnimatePresence>
      </div>
      <p className="mt-8 text-[#800000]/60 text-sm font-serif tracking-widest uppercase animate-pulse">
        Swipe to Explore
      </p>
    </div>
  );
}

const Card = ({ card, index, isTop, total, onRemove }: { 
  card: { src: string; alt: string }; 
  index: number; 
  isTop: boolean; 
  total: number;
  onRemove: () => void;
}) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  // Determine stacking order: top card is visually last in DOM, so it's on top by default in CSS.
  // Actually, standard map order puts last element on top. So `index === total - 1` is top.
  // But we want a visual stack effect.
  
  // Calculate offset for cards behind the top one
  // Top card (index = total - 1) has offset 0
  // Card below (index = total - 2) has offset 1 etc
  const reverseIndex = total - 1 - index; // 0 for top, 1 for next...
  
  // Only show top 3 cards for performance and visual clarity
  const isVisible = reverseIndex < 3;
  
  if (!isVisible) return null;

  const scale = 1 - reverseIndex * 0.05;
  const yOffset = reverseIndex * 15;

  const handleDragEnd = (event: any, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 100) {
      onRemove();
    }
  };

  return (
    <motion.div
      style={{
        width: '100%',
        maxWidth: '300px',
        height: '380px',
        position: 'absolute',
        x: isTop ? x : 0,
        rotate: isTop ? rotate : 0,
        zIndex: index,
        scale: isTop ? 1 : scale,
        y: yOffset,
        cursor: isTop ? 'grab' : 'default',
        transformOrigin: "bottom center"
      }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ 
        scale: isTop ? 1 : scale, 
        opacity: 1,
        y: yOffset
      }}
      exit={{ 
        x: x.get() < 0 ? -200 : 200, 
        opacity: 0,
        rotate: x.get() < 0 ? -20 : 20,
        transition: { duration: 0.2 }
      }}
      className="bg-white rounded-xl shadow-xl border-[8px] border-white overflow-hidden flex items-center justify-center select-none"
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <div className="relative w-full h-full bg-gray-100">
        <Image 
          src={card.src} 
          alt={card.alt} 
          fill 
          className="object-contain pointer-events-none" 
          sizes="(max-width: 768px) 100vw, 400px"
          priority={isTop}
        />
      </div>
      
      {/* Frame Effect Overlay */}
      <div className="absolute inset-0 border-2 border-[#800000]/10 rounded-lg pointer-events-none"></div>
    </motion.div>
  );
};
