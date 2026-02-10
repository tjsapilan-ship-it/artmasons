'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface ConsentContextType {
  isConsentGiven: boolean | null;
  acceptConsent: () => void;
  rejectConsent: () => void;
  consentExpired: boolean;
  resetConsent: () => void;
}

const ConsentContext = createContext<ConsentContextType | undefined>(undefined);

const STORAGE_KEY = 'artmasons_cookie_consent';
const CONSENT_EXPIRY_DAYS = 30;

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [isConsentGiven, setIsConsentGiven] = useState<boolean | null>(null);
  const [consentExpired, setConsentExpired] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Initialize on client-side only
  useEffect(() => {
    setIsClient(true);
    const storedConsent = localStorage.getItem(STORAGE_KEY);
    
    if (storedConsent) {
      try {
        const { accepted, timestamp } = JSON.parse(storedConsent);
        const expiryTime = new Date(timestamp).getTime() + CONSENT_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
        
        if (Date.now() > expiryTime) {
          // Consent has expired
          localStorage.removeItem(STORAGE_KEY);
          setConsentExpired(true);
          setIsConsentGiven(null);
        } else {
          setIsConsentGiven(accepted);
          setConsentExpired(false);
        }
      } catch (error) {
        console.error('Failed to parse stored consent:', error);
        localStorage.removeItem(STORAGE_KEY);
        setIsConsentGiven(null);
      }
    } else {
      setIsConsentGiven(null);
    }
  }, []);

  // Save consent preference
  const saveConsent = (accepted: boolean) => {
    const consentData = {
      accepted,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consentData));
    setIsConsentGiven(accepted);
    setConsentExpired(false);
  };

  const acceptConsent = () => {
    saveConsent(true);
  };

  const rejectConsent = () => {
    saveConsent(false);
  };

  const resetConsent = () => {
    localStorage.removeItem(STORAGE_KEY);
    setIsConsentGiven(null);
    setConsentExpired(true);
  };

  return (
    <ConsentContext.Provider
      value={{
        isConsentGiven,
        acceptConsent,
        rejectConsent,
        consentExpired,
        resetConsent,
      }}
    >
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent() {
  const context = useContext(ConsentContext);
  if (context === undefined) {
    throw new Error('useConsent must be used within a ConsentProvider');
  }
  return context;
}
