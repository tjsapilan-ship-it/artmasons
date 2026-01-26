"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import Link from 'next/link';

export default function CheckoutSuccess() {
  const { clearCart } = useCart();
  const { addToast } = useToast();
  const [id] = useState(() => {
    if (typeof window === 'undefined') return null;
    const params = new URLSearchParams(window.location.search);
    const urlId = params.get('payment_intent') || params.get('session_id');
    if (urlId) return urlId;
    try {
      const stored = window.sessionStorage.getItem('last_payment_intent');
      return stored || null;
    } catch {
      return null;
    }
  });

  const [status, setStatus] = useState<'checking' | 'paid' | 'pending' | 'not_found' | 'error'>(() =>
    id ? 'checking' : 'not_found'
  );

  const notifiedRef = useRef(false);

  useEffect(() => {
    if (!id) {
      if (!notifiedRef.current) {
        addToast('No payment reference found in return URL', 'error');
        notifiedRef.current = true;
      }
      return;
    }

    (async () => {
      try {
        const queryKey = id.startsWith('pi_') ? 'payment_intent' : 'session_id';
        const res = await fetch(`/api/order-status?${queryKey}=${encodeURIComponent(id)}`);
        const data = await res.json();
        if (res.ok && data.status === 'paid') {
          setStatus('paid');
          clearCart();
          try {
            if (typeof window !== 'undefined') window.sessionStorage.removeItem('last_payment_intent');
          } catch {
            // ignore
          }
          if (!notifiedRef.current) {
            addToast('Payment confirmed — your cart has been cleared', 'success');
            notifiedRef.current = true;
          }
        } else if (data.status === 'pending') {
          setStatus('pending');
          if (!notifiedRef.current) {
            addToast('Payment is pending. We will update your order shortly.', 'info');
            notifiedRef.current = true;
          }
        } else if (data.status === 'not_found' || data.status === 'failed') {
          setStatus('not_found');
          if (!notifiedRef.current) {
            addToast('Order not found on server', 'error');
            notifiedRef.current = true;
          }
        } else {
          setStatus('error');
          if (!notifiedRef.current) {
            addToast('Unable to verify payment status', 'error');
            notifiedRef.current = true;
          }
        }
      } catch (e: unknown) {
        console.error('Status check failed', e);
        setStatus('error');
        if (!notifiedRef.current) {
          addToast('Unable to verify payment status', 'error');
          notifiedRef.current = true;
        }
      }
    })();
  }, [id, clearCart, addToast]);

  return (
    <main className="min-h-screen bg-art-texture flex items-center justify-center">
      {/* Linen Canvas Background Pattern */}
      <style jsx global>{`
        .bg-art-texture {
          background-color: #fdfbf7;
          background-image: url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23800000' fill-opacity='0.03' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E");
        }
      `}</style>

      <div className="w-full px-4 py-12 text-center relative z-10">
        <div className="bg-white p-12 rounded-lg shadow-lg border-2 border-[#800000]">
          <h1 className="font-serif text-4xl font-bold text-[#800000] mb-4">Thank you — Order received</h1>
          {status === 'checking' && <p className="mb-6 text-gray-600 font-serif">Verifying payment...</p>}
          {status === 'paid' && <p className="mb-6 text-gray-700 font-serif text-lg">Your payment was successful. We have received your order and will process it shortly.</p>}
          {status === 'pending' && <p className="mb-6 text-gray-600 font-serif">Payment is pending. If this doesn’t update shortly, contact support.</p>}
          {status === 'not_found' && <p className="mb-6 text-gray-700 font-serif">We couldn&apos;t find your order on the server. If you were charged, contact support.</p>}
          {status === 'error' && <p className="mb-6 text-gray-700 font-serif">There was an error verifying your payment. Contact support if needed.</p>}
          <Link href="/" className="inline-block bg-[#800000] text-white px-8 py-3 rounded-md font-bold font-serif hover:bg-[#600000] transition-colors shadow-md">Return to shop</Link>
        </div>
      </div>
    </main>
  );
}