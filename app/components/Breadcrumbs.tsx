'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-2 text-base md:text-lg text-gray-600 font-serif">
      <Link
        href="/"
        className="flex items-center gap-1 hover:text-[#800000] transition-colors"
      >
        <Home size={16} />
        <span>Home</span>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={index}>
            <ChevronRight size={16} className="text-gray-400" />
            {isLast ? (
              <span className="text-[#800000] font-semibold">{item.label}</span>
            ) : (
              // If navigating to the main Artists A-Z page and the history
              // contains a selectedLetter, prefer going back in history so
              // the previous entry's state (selected letter) is preserved.
              (() => {
                try {
                  if (typeof window !== 'undefined' && item.href === '/artists-a-z' && window.history.state && window.history.state.selectedLetter) {
                    return (
                      <button
                        onClick={() => window.history.back()}
                        className="hover:text-[#800000] transition-colors cursor-pointer"
                      >
                        {item.label}
                      </button>
                    );
                  }
                  // Handle Top 100 Paintings back navigation
                  if (typeof window !== 'undefined' && item.href === '/top-100') {
                    return (
                      <button
                        onClick={() => window.history.back()}
                        className="hover:text-[#800000] transition-colors cursor-pointer"
                      >
                        {item.label}
                      </button>
                    );
                  }
                } catch {
                  // fall back to normal link
                }

                return (
                  <Link
                    href={item.href}
                    className="hover:text-[#800000] transition-colors"
                  >
                    {item.label}
                  </Link>
                );
              })()
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
