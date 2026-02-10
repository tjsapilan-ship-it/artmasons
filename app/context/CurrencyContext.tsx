"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Currency = 'AED' | 'AUD' | 'GBP' | 'EUR' | 'USD';

interface CurrencyContextType {
    currency: Currency;
    setCurrency: (currency: Currency) => void;
    convertPrice: (priceInAED: number) => number;
    formatPrice: (priceInAED: number) => string;
    getCurrencySymbol: () => string;
}

const CONVERSION_RATES: Record<Currency, number> = {
    AED: 1,
    AUD: 0.41,
    GBP: 0.20,
    EUR: 0.25,
    USD: 0.27,
};

const CURRENCY_SYMBOLS: Record<Currency, string> = {
    AED: 'AED',
    AUD: 'A$',
    GBP: '£',
    EUR: '€',
    USD: '$',
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
    const [currency, setCurrencyState] = useState<Currency>('AED');

    // Load currency from localStorage on mount
    useEffect(() => {
        const savedCurrency = localStorage.getItem('selectedCurrency') as Currency;
        if (savedCurrency && CONVERSION_RATES[savedCurrency]) {
            setCurrencyState(savedCurrency);
        }
    }, []);

    const setCurrency = (newCurrency: Currency) => {
        setCurrencyState(newCurrency);
        localStorage.setItem('selectedCurrency', newCurrency);
    };

    const convertPrice = (priceInAED: number): number => {
        const rate = CONVERSION_RATES[currency];
        return Math.round(priceInAED * rate);
    };

    const getCurrencySymbol = (): string => {
        return CURRENCY_SYMBOLS[currency];
    };

    const formatPrice = (priceInAED: number): string => {
        const convertedPrice = convertPrice(priceInAED);
        const symbol = getCurrencySymbol();

        // Format with thousands separator
        const formattedAmount = convertedPrice.toLocaleString('en-US');

        // For AED, put symbol after the number; for others, before
        if (currency === 'AED') {
            return `${formattedAmount} ${symbol}`;
        }
        return `${symbol}${formattedAmount}`;
    };

    return (
        <CurrencyContext.Provider
            value={{
                currency,
                setCurrency,
                convertPrice,
                formatPrice,
                getCurrencySymbol,
            }}
        >
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    const context = useContext(CurrencyContext);
    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
}
