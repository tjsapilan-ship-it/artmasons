'use client';

import React from 'react';
import { Playfair_Display } from 'next/font/google';
import Breadcrumbs from '../components/Breadcrumbs';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif', display: 'swap', preload: false });

export default function PrivacyPolicyPage() {
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
          <Breadcrumbs items={[{ label: 'Privacy Policy', href: '/privacy-policy' }]} />
        </div>

        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-12 text-[#800000]">Privacy Policy</h1>

        <div className="font-serif space-y-8 text-gray-700 leading-relaxed bg-white/80 p-8 md:p-12 rounded-lg backdrop-blur-sm border border-[#800000]/10 shadow-sm">

          <p className="font-bold">
            At ART MASONS, we take your privacy seriously. This policy explains what information we collect, how we use it, and the measures we take to protect it.
          </p>

          <section>
            <h3 className="font-serif text-2xl font-bold mb-2 text-[#800000]">Order Information</h3>
            <p>
              We only store the information that you choose to provide. Some details, such as your name and delivery address, are required to process your order. Additional information, such as email addresses and phone numbers, helps us communicate effectively with you and manage our business operations.
            </p>
          </section>

          <section>
            <h3 className="font-serif text-2xl font-bold mb-2 text-[#800000]">Email Addresses</h3>
            <p className="mb-2">We use your email address solely to:</p>
            <ul className="list-disc pl-5 mb-2">
              <li>Provide information regarding your order</li>
              <li>Analyse our business history for internal purposes</li>
            </ul>
            <p>We do not disclose email addresses to third parties under any circumstances.</p>
          </section>

          <section>
            <h3 className="font-serif text-2xl font-bold mb-2 text-[#800000]">Confidentiality</h3>
            <p>
              We adhere to a strict confidentiality policy. You will never receive promotional messages or information about new services unless you have explicitly opted in.
            </p>
          </section>

          <section>
            <h3 className="font-serif text-2xl font-bold mb-2 text-[#800000]">Information from Anonymous Users</h3>
            <p className="mb-2">We collect non-identifying statistical data from website visitors, including:</p>
            <ul className="list-disc pl-5 mb-2">
              <li>Country of access</li>
              <li>Most frequently visited pages</li>
              <li>Browser type</li>
              <li>Time spent on the site</li>
            </ul>
            <p>This information helps us improve the functionality and content of our website.</p>
          </section>

          <section>
            <h3 className="font-serif text-2xl font-bold mb-2 text-[#800000]">Cookies</h3>
            <p className="mb-4">
              Our website uses cookies to enhance user experience. By using our site, you consent to the use of cookies in accordance with this policy. A cookie is a small file containing an identifier (a string of letters and numbers) sent by a web server to your browser and stored locally.
            </p>
            <p className="mb-4">
              The identifier is sent back to the server whenever the browser requests a page, allowing the server to track your visit.
            </p>
            <ul className="list-disc pl-5 mb-4">
              <li><strong>Session cookies</strong> expire when you close your browser.</li>
              <li><strong>Persistent cookies</strong> remain on your device until the set expiry date, unless you delete them manually.</li>
            </ul>
            <p>
              Cookies themselves do not contain personally identifiable information, but they may be linked to information you provide voluntarily. They help us identify returning visitors and track usage across different pages. We use both session and persistent cookies to improve site functionality and user experience.
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}