'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Cookie } from 'lucide-react';
import { useConsent } from '../context/ConsentContext';

export default function CookieConsentBanner() {
  const { isConsentGiven, acceptConsent, rejectConsent } = useConsent();
  const [showBanner, setShowBanner] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Check consent status on mount
  useEffect(() => {
    if (isConsentGiven === null) {
      setShowBanner(true);
      requestAnimationFrame(() => setIsVisible(true));
    } else {
      setIsVisible(false);
    }
  }, [isConsentGiven]);

  // Handle unmounting after animation
  useEffect(() => {
    if (!isVisible && showBanner) {
      const timer = setTimeout(() => setShowBanner(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible, showBanner]);

  if (!showBanner) return null;

  const handleAccept = () => {
    setIsVisible(false);
    acceptConsent();
  };

  const handleReject = () => {
    rejectConsent();
  };

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 z-[10001] transition-all duration-300 ease-in-out transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}
    >
      <div className="bg-[#800000]/95 backdrop-blur-md text-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-5 justify-between">
            {/* Text content */}
            <div className="flex-1 flex gap-4">
              <div className="shrink-0 pt-1">
                <div className="p-2 bg-white/10 rounded-full">
                  <Cookie className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-serif text-lg font-bold leading-none">
                  Cookie Preferences
                </h3>
                <p className="text-white/90 text-sm md:text-base leading-relaxed max-w-3xl">
                  We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies as described in our{' '}
                  <Link
                    href="/privacy-policy"
                    className="underline decoration-white/50 hover:decoration-white transition-all font-semibold"
                  >
                    Privacy Policy
                  </Link>.
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 w-full md:w-auto flex-shrink-0 pl-[3.25rem] md:pl-0 pt-2 md:pt-0">
              <button
                onClick={handleReject}
                className="flex-1 md:flex-none px-6 py-2.5 text-sm font-semibold border border-white/30 rounded-lg hover:bg-white/10 hover:border-white/50 transition-all duration-200 text-white cursor-pointer"
              >
                Decline
              </button>
              <button
                onClick={handleAccept}
                className="flex-1 md:flex-none px-6 py-2.5 text-sm font-semibold bg-white text-[#800000] rounded-lg hover:bg-gray-100 transition-colors duration-200 font-serif cursor-pointer shadow-lg transform active:scale-95"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
