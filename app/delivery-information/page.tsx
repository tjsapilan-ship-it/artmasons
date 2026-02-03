'use client';

import React from 'react';
import Breadcrumbs from '../components/Breadcrumbs';


export default function DeliveryInfoPage() {
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
          <Breadcrumbs items={[{ label: 'Delivery Information', href: '/delivery-information' }]} />
        </div>

        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-12 text-[#800000]">Delivery Information</h1>

        <div className="font-serif space-y-12 text-gray-700 leading-relaxed bg-white/80 p-8 md:p-12 rounded-lg backdrop-blur-sm border border-[#800000]/10 shadow-sm">

          <section>
            <h2 className="font-serif text-2xl font-bold mb-4 text-[#800000]">Cost of Delivery</h2>
            <p>
              We are delighted to offer free shipping. There are no additional standard delivery charges.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold mb-4 text-[#800000]">Delivery Timeframes</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Free Standard Shipping:</strong> 10–14 working days (after the painting is created and dried).</li>
            </ul>
            <p className="mt-4 italic text-sm text-gray-500">
              Note: This shipping time is in addition to the 8–10 weeks required for the creation and drying of your hand-painted artwork.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold mb-4 text-[#800000]">Shipping Method & Packaging</h2>
            <p className="mb-4">
              We ship our paintings using globally recognised and reputable courier companies to ensure safe and reliable delivery. All unframed art reproductions are carefully rolled and placed into secure, protective postal tubes to prevent any damage during transit.
            </p>
            <p>
              If you would like to track your shipment, we will provide an online tracking number via email as soon as your painting has been dispatched.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold mb-4 text-[#800000]">Address Requirements</h2>
            <p className="mb-4">
              Please ensure that the delivery address provided is accurate and that someone is available to receive the shipment, as this is the customer’s responsibility.
            </p>
            <div className="bg-[#fff6f6] border border-[#f2cfcf] p-4 rounded-md text-sm">
              <strong>Important:</strong> Please note that we do not ship to P.O. Boxes. A physical home or business address is required for all deliveries to ensure safe and successful receipt of your artwork.
            </div>
            <p className="mt-4">
              Any additional delivery costs beyond the original delivery address are not the ART MASONS responsibility and must be paid for by the customer, we appreciate your kind understanding.
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}