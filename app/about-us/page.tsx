'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Playfair_Display } from 'next/font/google';
import { Heart, Palette, Users, Sparkles, CheckCircle } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import AboutUsGallery from '../components/AboutUsGallery';
import ArtStyleQuiz from '../components/ArtStyleQuiz';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });

const CAPTURING_LIGHT_IMAGES = [
  { src: "/image/about-us/image_9.png", alt: "Art Masons Light Detail 1" },
  { src: "/image/about-us/image_15.png", alt: "Art Masons Light Detail 7" },
];

const SCALE_WITHOUT_LIMITS_IMAGES = [
  { src: "/image/about-us/image_18.png", alt: "Art Masons Scale Example 2" },
  { src: "/image/about-us/image_19.png", alt: "Art Masons Scale Example 3" },
];

const NEW_STANDARD_IMAGES = [
  { src: "/image/about-us/image_24.png", alt: "Art Masons Access Example 3" },
  { src: "/image/about-us/image_25.png", alt: "Art Masons Access Example 4" },
];

const B2B_IMAGES = [
  { src: "/image/about-us/image_32.png", alt: "Art Masons Commercial Project 7" },
  { src: "/image/about-us/image_31.png", alt: "Art Masons Commercial Project 6" },
  { src: "/image/about-us/image_22.png", alt: "Art Masons Commercial Project" },
];

const OUR_PHILOSOPHY_IMAGES = [
  // { src: "/image/about-us/image_5.png", alt: "Art Masons Masterpiece 5" },
  // { src: "/image/about-us/image_4.png", alt: "Art Masons Masterpiece 4" },
  // { src: "/image/about-us/image_7.png", alt: "Art Masons Masterpiece 7" },
    { src: "/image/about-us/collage/collage_1.png", alt: "Art Masons Masterpiece 7" },
  
];

const COMMITMENT_IMAGES = [
  { src: "/image/about-us/image_34.png", alt: "Art Masons Commitment Detail 2" },
  { src: "/image/about-us/image_33.png", alt: "Art Masons Commitment Detail 1" },
  { src: "/image/about-us/image_35.png", alt: "Art Masons Commitment Detail 3" },
];

const AFTER_QUIZ_IMAGES = [
  { src: "/image/about-us/image_40.png", alt: "Art Masons Gallery Detail 4" },
  { src: "/image/about-us/image_37.png", alt: "Art Masons Gallery Detail 1" },
  { src: "/image/about-us/image_38.png", alt: "Art Masons Gallery Detail 2" },
  { src: "/image/about-us/image_41.png", alt: "Art Masons Gallery Detail 5" },
];

export default function AboutUsPage() {

  return (
    <main className={`${playfair.variable} bg-art-texture min-h-screen text-black relative`}>
      {/* Linen Canvas Background Pattern */}
      <style jsx global>{`
        .bg-art-texture {
          background-color: #fdfbf7;
          background-image: url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23800000' fill-opacity='0.03' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E");
        }
      `}</style>

      <div className="w-full px-4 py-12 relative z-10">

        <div className="mb-8">
          <Breadcrumbs items={[{ label: 'About Us', href: '/about-us' }]} />
        </div>

        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-[#800000]">Art Masons</h1>
        <p className="text-2xl md:text-3xl font-serif mb-12 text-[#800000]">Museum Grade Quality. Hand-Painted to Fit Your Space.</p>

        <div className="font-serif space-y-16 text-gray-700 leading-relaxed">

          {/* Our Philosophy & Gallery Combined */}
<section className="space-y-6">
  <div className="bg-white p-6 md:p-8 rounded-xl border-2 border-[#800000]">
    {/* Text Content */}
    <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#800000] mb-4">Our Philosophy</h2>
    <p className="text-lg text-gray-700 leading-relaxed">
      The world's greatest masterpieces shouldn't be trapped behind velvet ropes or pixelated on cheap paper. Art Masons was founded by a collective of classically trained artists and art historians who grew tired of the flat print culture. We believe that if you love a masterpiece, you deserve to own the <em>soul</em> of it: the texture of the oil paint, the original colour accuracy, the high quality grain of the linen canvas, and the physical weight of the brushstroke.
    </p>
  </div>

  {/* Single Image Display */}
  <div className="w-full flex justify-center p-[20px]">
    <Image
      // accessing the first image in the array
      src={OUR_PHILOSOPHY_IMAGES[0].src} 
      alt={OUR_PHILOSOPHY_IMAGES[0].alt}
      width={1200}
      height={800}
      // Class breakdown:
      // w-full: takes maximum available width
      // h-auto: scales height automatically to maintain aspect ratio
      // rounded-xl: (Optional) keeps styling consistent with the text box above
      className="w-full h-auto object-contain rounded-xl"
      sizes="100vw"
    />
  </div>

</section>

          {/* Educated Mastery */}
          <section className="space-y-6">
            <div className="bg-white p-6 md:p-8 rounded-xl border-2 border-[#800000]">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#800000] mb-4">Educated Mastery</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Every Art Masons art piece is hand-painted by artists who have spent years studying the specific chemistry and techniques of the masters. We don't just copy; we deeply understand how Vermeer or Monet captured light and how Van Gogh layered emotion. Our artists speak the language of the greats.
              </p>
            </div>
            <div className="relative w-full rounded-lg overflow-hidden border border-[#800000]/10 shadow-md">
              <Image
                src="/image/about-us/image_8.png"
                alt="Art Masons Artist at Work"
                width={1200}
                height={800}
                className="w-full h-auto hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 80vw"
              />
            </div>
          </section>

          {/* Capturing Light In Every Brushstroke */}
          <section className="space-y-6">
            <div className="bg-white p-6 md:p-8 rounded-xl border-2 border-[#800000]">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#800000] mb-4">Capturing Light In Every Brushstroke</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Digital prints are flat, but our work is three-dimensional. We use only the finest pigment oil paints and professional-grade linen canvases. The result is museum-grade quality that you can feel—art that lives, breathes, and ages with your home.
              </p>
            </div>

            {/* Stack Gallery (Below) */}
            {/* FIX: Added flex-wrap */}
            <div className="w-full mt-8 flex flex-col md:flex-row md:flex-wrap justify-center items-center gap-4">
              {CAPTURING_LIGHT_IMAGES.map((image, index) => (
                <div key={index} className="relative w-full md:w-auto flex-shrink-0">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={1000}
                    height={700}
                    className="w-full md:w-auto h-auto md:h-[700px] object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              ))}
            </div>

          </section>

          {/* Scale Without Limits */}
          <section className="space-y-6">
            <div className="bg-white p-6 md:p-8 rounded-xl border-2 border-[#800000]">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#800000] mb-4">Scale Without Limits</h2>
              <div className="space-y-4">
                <p className="text-lg text-gray-700 leading-relaxed">
                  <strong>Big is beautiful.</strong> If you have a grand wall, we paint the masterpiece to command it.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  <strong>Small is intimate.</strong> If you have a quiet corner, we scale the work for a private moment to lean in. We resize the classics to fit your architecture—ensuring the composition remains perfect and proportional to the original, regardless of the dimensions.
                </p>
              </div>
            </div>

            {/* Stack Gallery (Right) */}
            {/* FIX: Added flex-wrap */}
            <div className="w-full mt-8 flex flex-col md:flex-row md:flex-wrap justify-center items-center gap-4">
              {SCALE_WITHOUT_LIMITS_IMAGES.map((image, index) => (
                <div key={index} className="relative w-full md:w-auto flex-shrink-0">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={1000}
                    height={700}
                    className="w-full md:w-auto h-auto md:h-[700px] object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              ))}
            </div>

          </section>

          {/* The New Standard of Access */}
          <section className="space-y-6">
            <div className="bg-white p-6 md:p-8 rounded-xl border-2 border-[#800000]">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#800000] mb-4">The New Standard of Access</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                We've removed the gatekeepers to make museum-level quality affordable. We believe that living with great art is a right, not a reserved luxury. We bridge the gap between historical mastery and modern accessibility.
              </p>
            </div>

            {/* Stack Gallery (Left on desktop) */}
            {/* FIX: Added flex-wrap */}
            <div className="w-full mt-8 flex flex-col md:flex-row md:flex-wrap justify-center items-center gap-4">
              {NEW_STANDARD_IMAGES.map((image, index) => (
                <div key={index} className="relative w-full md:w-auto flex-shrink-0">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={1000}
                    height={700}
                    className="w-full md:w-auto h-auto md:h-[700px] object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              ))}
            </div>

          </section>

          {/* B2B: The Designer's Secret Weapon */}
          <section className="space-y-6">
            <div className="bg-white p-6 md:p-8 rounded-xl border-2 border-[#800000]">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#800000] mb-4">B2B: The Designer's Secret Weapon</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                We serve as the silent partner for interior designers and architects. Whether it's a single statement piece for a residential project or a curated collection, we are delighted to assist. For luxury hotels, staging homes or new development marketing, we deliver hand-painted authenticity at the scale and accessible luxury your projects demand. Remove the mass produced appearance of printed art and benefit instead from hand painted, inspiring, museum-grade art which compliments, elevates and enriches your interiors.
              </p>
            </div>

            {/* Stack Gallery (Right) */}
            <div className="w-full mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              {B2B_IMAGES.map((image, index) => (
                <div key={index} className="w-full">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={1000}
                    height={750}
                    className="w-full h-auto object-contain"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              ))}
            </div>

          </section>

          {/* Our Story */}
          <section className="bg-white shadow-sm p-8 rounded-lg border border-2 border-[#800000]">
            <h2 className="font-serif text-3xl font-bold mb-6 text-[#800000]">Our Story</h2>
            <div className="space-y-4">
              <p className="text-lg">
                ART MASONS was born from a simple yet powerful vision: to make the world&apos;s greatest artistic masterpieces accessible to art lovers everywhere, without compromising on quality or authenticity.
              </p>
              <p className="text-lg">
                Founded by a collective of classically trained artists and art historians, we recognized a gap in the market. While museums house priceless originals and mass production churns out soulless prints, there was a need for something in between—authentic, hand-painted reproductions that capture the true essence of the masters.
              </p>
              <p className="text-lg">
                Every member of our team brings years of academic training and practical experience in fine art. We study the techniques of the masters, understand their materials and methods, and apply this knowledge to create reproductions that are as close to the originals as possible.
              </p>
              <p className="text-lg">
                Today, we serve collectors, interior designers, art enthusiasts, and anyone who appreciates the transformative power of great art. Each piece we create is a labor of love, a testament to centuries of artistic tradition, and a bridge between the past and present.
              </p>
            </div>
          </section>

          {/* Our Commitment */}
          <section className="bg-white/40 p-6 rounded-lg border border-2 border-[#800000]">
            <h2 className="font-serif text-3xl font-bold mb-6 text-[#800000]">Our Commitment to You</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3 bg-white p-4 rounded-md shadow-sm border-2 border-[#800000]">
                <CheckCircle size={24} className="text-[#800000] mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-serif text-xl font-semibold mb-2 text-gray-800">Museum-Quality Materials</h3>
                  <p className="text-base">
                    We use only the finest Belgian linen canvases and professional-grade oil paints to ensure longevity and color accuracy.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white p-4 rounded-md shadow-sm border-2 border-[#800000]">
                <CheckCircle size={24} className="text-[#800000] mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-serif text-xl font-semibold mb-2 text-gray-800">Master Artisans</h3>
                  <p className="text-base">
                    Every painting is created by academically trained artists with years of experience in classical techniques.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white p-4 rounded-md shadow-sm border-2 border-[#800000]">
                <CheckCircle size={24} className="text-[#800000] mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-serif text-xl font-semibold mb-2 text-gray-800">Proportional Accuracy</h3>
                  <p className="text-base">
                    We maintain exact proportions to the originals, ensuring visual integrity and authentic composition.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white p-4 rounded-md shadow-sm border-2 border-[#800000]">
                <CheckCircle size={24} className="text-[#800000] mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-serif text-xl font-semibold mb-2 text-gray-800">Personalized Service</h3>
                  <p className="text-base">
                    From custom sizing to framing advice, we&apos;re here to help you find the perfect artwork for your space.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Commitment Gallery Scroll */}
          <section className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
            {COMMITMENT_IMAGES.map((image, index) => (
              <div key={index} className="w-full">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={800}
                  height={600}
                  className="w-full h-auto"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            ))}
          </section>

          {/* Art Style Quiz */}
          <section className="mb-8">
            <ArtStyleQuiz />
          </section>

          {/* After Quiz Gallery Scroll */}
          <section className="w-full grid grid-cols-2 md:grid-cols-4 gap-4">
             {AFTER_QUIZ_IMAGES.map((image, index) => (
              <div key={index} className="w-full">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={400}
                  height={300}
                  className="w-full h-auto"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            ))}
          </section>


          {/* Contact CTA */}
          <section className="text-center bg-white shadow-sm p-8 rounded-lg border-2 border-[#800000]">
            <h2 className="font-serif text-3xl font-bold mb-4 text-[#800000]">Let&apos;s Create Something Beautiful Together</h2>
            <p className="text-lg mb-6 max-w-2xl mx-auto">
              Whether you have questions about our process, need help selecting the perfect piece, or want to discuss a custom commission, we&apos;re here to help.
            </p>
            <div className="space-y-2">
              <p className="text-lg flex items-center justify-center gap-2">
                <strong>Email:</strong> <a href="mailto:info@artmasons.com" className="text-[#800000] hover:underline cursor-pointer">info@artmasons.com</a>
              </p>
              <p className="text-lg flex items-center justify-center gap-2">
                <strong>WhatsApp:</strong>
                <a href="https://wa.me/971561704788" target="_blank" rel="noopener noreferrer" className="text-[#800000] hover:underline inline-flex items-center gap-1 cursor-pointer">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  +971 56 170 4788
                </a>
              </p>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}