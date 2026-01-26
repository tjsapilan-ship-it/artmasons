'use client';

import React from 'react';
import { Playfair_Display } from 'next/font/google';
import Breadcrumbs from '../components/Breadcrumbs';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });

export default function FAQsPage() {
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
        
        {/* Breadcrumb / Back */}
        <div className="mb-8">
          <Breadcrumbs items={[{ label: 'FAQs', href: '/faqs' }]} />
        </div>

        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-12 text-[#800000]">Frequently Asked Questions</h1>

        <div className="space-y-12 bg-white/80 p-8 md:p-12 rounded-lg backdrop-blur-sm border border-[#800000]/10 shadow-sm">
          
          {/* Section 1 */}
          <section>
            <h2 className="font-serif text-2xl font-bold mb-4 text-[#800000]">How Do We Create Our Paintings? Hand-Painted Oil Masterpieces</h2>
            <div className="font-serif text-gray-700 leading-relaxed space-y-4">
              <p>
                At ART MASONS, we are driven by a single ambition: to create paintings of true museum quality. We are a small, highly specialised team of artists, academically trained according to European standards, and we never compromise on detail, technique, or materials.
              </p>
              <p>
                All of our reproductions are entirely hand-painted using premium oil paints on linen canvas, never printed, never digitally produced. Each artist in our studio is a master in their discipline: some specialise in Renaissance techniques, others in Baroque or Rococo, while others excel in Impressionism.
              </p>
              <p>
                This depth of expertise enables us not only to replicate the precise details of an original painting, but also to capture the distinctive style, brushwork, and artistic language of every old master. These capabilities are the result of many years of rigorous academic training and hands-on experience. It is for this reason that our ART MASONS art studio proudly holds one of the strongest reputations in the market for master-level reproduction art.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="font-serif text-2xl font-bold mb-4 text-[#800000]">How Long Will It Take to Create My Painting?</h2>
            <div className="font-serif text-gray-700 leading-relaxed space-y-4">
              <p>
                Creating a hand-painted reproduction of museum quality requires patience, precision, and time. Each artwork is painted entirely by hand and must also be allowed to dry fully before it can be safely shipped.
              </p>
              <p>
                On average, we require 8 to 10 weeks from the moment your order and payment are received until your painting is ready for dispatch.
              </p>
              <p>
                The exact timeframe may vary depending on the complexity of the original artwork and, to a lesser extent, the size of the piece. More intricate paintings naturally require additional time to ensure every detail is faithfully reproduced.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="font-serif text-2xl font-bold mb-4 text-[#800000]">What Will Be the Cost of Delivery for My Painting?</h2>
            <div className="font-serif text-gray-700 leading-relaxed space-y-4">
              <p>
                We are delighted to offer free shipping. There are no additional standard delivery charges.
              </p>
              <p>
                Please ensure that the delivery address provided is accurate and that someone is available to receive the shipment, as this is the customer’s responsibility. Any additional delivery costs beyond the original delivery address are not the ART MASONS responsibility and must be paid for by the customer, we appreciate your kind understanding.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="font-serif text-2xl font-bold mb-4 text-[#800000]">How Will My Painting Be Shipped?</h2>
            <div className="font-serif text-gray-700 leading-relaxed space-y-4">
              <p>
                We ship our paintings using globally recognised and reputable courier companies to ensure safe and reliable delivery. If you would like to track your shipment, we will provide an online tracking number via email as soon as your painting has been dispatched.
              </p>
              <p>
                All unframed art reproductions are carefully rolled and placed into secure, protective postal tubes to prevent any damage during transit.
              </p>
              <p>
                Please note that we do not ship to P.O. Boxes. A physical home or business address is required for all deliveries to ensure safe and successful receipt of your artwork.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="font-serif text-2xl font-bold mb-4 text-[#800000]">How Can I Order a Painting in a Different Size From the Options Offered?</h2>
            <div className="font-serif text-gray-700 leading-relaxed space-y-4">
              <p>
                Many websites offering painting reproductions provide standard sizes that often do not match the proportions of the original artwork. Our approach is entirely different. We offer our hand-painted reproductions either in the exact size of the original painting or in a size that maintains perfect original proportional accuracy.
              </p>
              <p>
                If you would like your painting in a size that is not listed on our website, simply <a href="mailto:info@artmasons.com" className="text-[#800000] hover:underline font-normal">email us on info@artmasons.com</a> with your request. We are happy to guide you and offer bespoke sizing options.
              </p>
              <p>
                On the detailed page of each painting, you will find the available size options along with their prices. If you prefer a custom size, we can recommend the most suitable dimensions, always proportional to the original to perfectly complement your space.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="font-serif text-2xl font-bold mb-4 text-[#800000]">Can You Frame the Painting I Have Chosen?</h2>
            <div className="font-serif text-gray-700 leading-relaxed space-y-4">
              <p>
                Our paintings are shipped unstretched and unframed due to international mailing limitations. High-quality oil paintings are valuable and can be easily damaged during transport if shipped already stretched on a frame.
              </p>
              <p>
                However, framing your artwork once it arrives is extremely simple. Any professional frame shop will offer a wide selection of frames to match your style and interior, ranging from wood to metal and high-quality synthetic options. Simply take your rolled canvas to the frame shop, and their specialists will advise you on suitable frame styles, materials, and finishes that best complement your artwork.
              </p>
              <p className="font-bold">Framing Services for Customers in Dubai:</p>
              <p>
                If you are based in Dubai, we are pleased to offer additional assistance with assisting in stretching and framing your artwork. Through our trusted network of professional framing partners, we can help you select the ideal frame and ensure your painting is stretched and finished to the highest standard.
              </p>
              <p>
                We will connect you directly with one of our recommended frame shops, where you can choose from a wide variety of materials, finishes, and styles that complement both your artwork and your interior design. All payments for stretching and framing are made directly to the framing shop, giving you full transparency and flexibility in selecting the service that best meets your needs.
              </p>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}