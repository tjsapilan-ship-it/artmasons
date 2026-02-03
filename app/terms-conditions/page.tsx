'use client';

import React from 'react';
import Breadcrumbs from '../components/Breadcrumbs';


export default function TermsConditionsPage() {
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
               <Breadcrumbs items={[{ label: 'Terms & Conditions', href: '/terms-conditions' }]} />
            </div>

            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-12 text-[#800000]">Terms and Conditions</h1>

            <div className="font-serif space-y-10 text-gray-700 leading-relaxed bg-white/80 p-8 md:p-12 rounded-lg backdrop-blur-sm border border-[#800000]/10 shadow-sm">

               <section>
                  <h3 className="font-serif text-2xl font-bold mb-2 text-[#800000]">Website Access</h3>
                  <p className="mb-2">We grant you limited, personal access to our website as a customer. You may not reproduce, duplicate, copy, sell, or otherwise exploit any content from the website for commercial purposes.</p>
                  <p className="mb-2">This includes, but is not limited to: product images, listings, descriptions, videos, pricing, page layout, design, trade dress, trademarks, and logos.</p>
                  <p>You may not use any meta tags, search terms, or key terms that contain the website’s name or trademarks.</p>
               </section>

               <section>
                  <h3 className="font-serif text-2xl font-bold mb-2 text-[#800000]">Copyright</h3>
                  <p>
                     All website content is either our property, in the public domain, or provided by content suppliers, and is protected by international copyright laws. Content not owned by us is used with permission.
                  </p>
               </section>

               <section>
                  <h3 className="font-serif text-2xl font-bold mb-2 text-[#800000]">Pricing and Availability</h3>
                  <p>
                     The price you pay for products is the price shown on the website at the time of purchase. Despite our best efforts, some items may occasionally be unavailable. We reserve the right to update product prices at any time.
                  </p>
               </section>

               <section>
                  <h3 className="font-serif text-2xl font-bold mb-2 text-[#800000]">Product Descriptions</h3>
                  <p>
                     We strive to describe our products accurately and completely. If a purchased product does not match its description, your sole remedy is to return it in unused condition for a replacement.
                  </p>
               </section>

               <section>
                  <h3 className="font-serif text-2xl font-bold mb-2 text-[#800000]">Invoicing</h3>
                  <p>Customers will receive a purchase confirmation email upon completing an order.</p>
               </section>

               <section>
                  <h3 className="font-serif text-2xl font-bold mb-2 text-[#800000]">Time for Creation – Hand-Painted Fine Art Reproductions</h3>
                  <p>
                     Hand-painted art reproductions require careful craftsmanship and sufficient drying time. We require 8–10 weeks from the moment of order to prepare your painting for shipment. The timeframe varies depending on complexity and size of the artwork.
                  </p>
               </section>

               <section>
                  <h3 className="font-serif text-2xl font-bold mb-2 text-[#800000]">Delivery Information</h3>
                  <p>Customers are responsible for providing accurate delivery details.</p>
                  <ul className="list-disc pl-5 mt-2">
                     <li>We offer Free standard shipping: 10–14 working days</li>
                  </ul>
               </section>

               <section>
                  <h3 className="font-serif text-2xl font-bold mb-2 text-[#800000]">Return Rights</h3>
                  <p>
                     ART MASONS is committed to quality and your satisfaction. If you are not satisfied with your order, you may return it within 30 days of receipt for adjustments or corrections.
                  </p>
                  <div className="mt-4 mb-4">
                     <strong>Please note:</strong>
                     <ul className="list-disc pl-5 mt-2">
                        <li>Returns are assessed at our discretion, and a valid reason must be provided.</li>
                        <li>Contact us by email on <a href="mailto:info@artmasons.com" className="text-[#800000] hover:underline font-normal">info@artmasons.com</a> before returning the item to clarify the issue.</li>
                        <li>Shipping costs are non-refundable.</li>
                     </ul>
                  </div>
                  <p className="font-bold">Damaged Items:</p>
                  <p>If your painting arrives damaged:</p>
                  <ol className="list-decimal pl-5 mt-2 mb-4">
                     <li>Take a digital photo of the painting and the shipping container.</li>
                     <li>Email these images with your order number, painting name, and description of the issue to <a href="mailto:info@artmasons.com" className="text-[#800000] hover:underline font-normal">info@artmasons.com</a></li>
                     <li>Indicate the areas you would like us to address.</li>
                  </ol>
                  <p>
                     If you choose to return the painting, please pack it in the original postal tube. We strongly encourage shipping via a traceable method.
                  </p>
               </section>

               <section>
                  <h3 className="font-serif text-2xl font-bold mb-2 text-[#800000]">Conclusion</h3>
                  <p>
                     These terms are governed by DIFC law. Any contract for the purchase of goods from this website, and any dispute arising from it, will also be governed by DIFC law.
                  </p>
               </section>

            </div>
         </div>
      </main>
   );
}