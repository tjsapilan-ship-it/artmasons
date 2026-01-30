'use client';

import React from 'react';
import { Playfair_Display } from 'next/font/google';
import Breadcrumbs from '../components/Breadcrumbs';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif', display: 'swap' });

export default function ReturnPolicyPage() {
  return (
    <main className={`${playfair.variable} min-h-screen bg-art-texture text-black`}>
      {/* Linen Canvas Background Pattern */}
      <style jsx global>{`
        .bg-art-texture {
          background-color: #fdfbf7;
          background-image: url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23800000' fill-opacity='0.03' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E");
        }
      `}</style>

      <div className="w-full px-4 py-12 relative z-10">

        <div className="mb-8">
          <Breadcrumbs items={[{ label: 'Return Policy', href: '/return-policy' }]} />
        </div>

        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-12 text-[#800000]">Return Policy</h1>

        <div className="font-serif space-y-8 text-gray-700 leading-relaxed bg-white/80 p-8 md:p-12 rounded-lg backdrop-blur-sm border border-[#800000]/10 shadow-sm">

          <p>
            At ART MASONS, we are committed to quality and your satisfaction is 100% guaranteed. If for reasonable reason you are not satisfied with your order, you may return it within 30 days of receipt for corrections or a full refund.
          </p>

          <p>
            Please note that returns are evaluated at our discretion, and a valid reason for the return must be provided. Before returning any item, please contact us by email on <a href="mailto:info@artmasons.com" className="text-[#800000] hover:underline font-normal">info@artmasons.com</a> so we can clarify the issue and guide you through the process. Shipping costs are non-refundable.
          </p>

          <section className="bg-[#fff6f6]/90 border border-[#f2cfcf] p-8 rounded-md">
            <h3 className="font-serif text-2xl font-bold mb-4 text-[#800000]">Damaged Items</h3>
            <p className="mb-4">If your painting arrives damaged during transportation:</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Take a digital photo of the painting and the shipping container.</li>
              <li>
                Email the images to <a href="mailto:info@artmasons.com" className="text-[#800000] hover:underline font-normal">info@artmasons.com</a> along with:
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                  <li>Your order number</li>
                  <li>Painting name</li>
                  <li>A brief description of the issue</li>
                  <li>Whether you would like a correction, free replacement, or refund</li>
                </ul>
              </li>
            </ol>
          </section>

          <section>
            <h3 className="font-serif text-2xl font-bold mb-4 text-[#800000]">Returning Your Painting</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>If you choose to return the painting, pack it carefully in the original postal tube.</li>
              <li>Clearly specify the reason for the return and the action you would like us to take.</li>
              <li>We strongly recommend using a traceable shipping method to ensure safe delivery.</li>
            </ul>
            <p className="mt-4">
              By following these steps, we can quickly and efficiently resolve any issues and ensure your satisfaction with your hand-painted artwork.
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}