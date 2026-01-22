"use client";

import React, { useEffect, useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

export default function BackToTop() {
  const [showTop, setShowTop] = useState(false);
  const [showBottom, setShowBottom] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY;
      const viewportHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;

      // Show "Back to top" if scrolled down more than 300px
      setShowTop(scrolled > 300);
      
      // Show "Move to bottom" if not yet at the bottom (buffer of 300px)
      // Also ensure page is actually scrollable (fullHeight > viewportHeight)
      setShowBottom(
        fullHeight > viewportHeight && 
        scrolled + viewportHeight < fullHeight - 300
      );
    };

    // initial check
    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    // Also check on resize as document height might change
    window.addEventListener("resize", onScroll, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
  };

  if (!showTop && !showBottom) return null;

  return (
    <div className="fixed right-4 bottom-4 sm:right-6 sm:bottom-6 z-[10000] flex flex-col gap-3">
      {showTop && (
        <button
          aria-label="Back to top"
          onClick={scrollToTop}
          className="bg-[#800000] text-white p-3 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-transform focus:outline-none focus:ring-2 focus:ring-[#80000099]"
          title="Back to top"
        >
          <ChevronUp size={20} />
        </button>
      )}
      
      {showBottom && (
        <button
          aria-label="Move to bottom"
          onClick={scrollToBottom}
          className="bg-[#800000] text-white p-3 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-transform focus:outline-none focus:ring-2 focus:ring-[#80000099]"
          title="Move to bottom"
        >
          <ChevronDown size={20} />
        </button>
      )}
    </div>
  );
}

