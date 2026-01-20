'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Playfair_Display } from 'next/font/google';
import { CheckCircle } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });

export default function OurQualityPage() {
  return (
    <main className={`${playfair.variable} bg-art-texture min-h-screen text-black relative`}>
      {/* Linen Canvas Background Pattern */}
      <style jsx global>{`
        .bg-art-texture {
          background-color: #fdfbf7;
          background-image: url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23800000' fill-opacity='0.03' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E");
        }
      `}</style>

      <div className="container mx-auto px-4 py-12 max-w-6xl relative z-10">
        
        <div className="mb-8">
          <Breadcrumbs items={[{ label: 'Our Quality', href: '/our-quality' }]} />
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16 items-start">
          <div className="flex flex-col h-full">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-8 text-[#800000]">Our Quality</h1>
            
            {/* Introduction */}
            <section className="bg-white/60 p-8 rounded-lg border border-[#800000]/10 backdrop-blur-sm font-serif flex-grow">
              <h2 className="font-serif text-3xl font-bold mb-6 text-[#800000]">Museum-Quality Excellence</h2>
              <p className="text-lg mb-4">
                At ART MASONS, we are committed to delivering nothing less than museum-quality oil painting reproductions. Each piece is meticulously hand-painted by our master artists, ensuring that every brushstroke captures the essence and beauty of the original masterpiece.
              </p>
              <p className="text-lg">
                Our dedication to quality means using only the finest materials and employing time-honored techniques that have been perfected over centuries. When you choose ART MASONS, you&apos;re not just buying a painting—you&apos;re investing in a work of art.
              </p>
            </section>
            <h2 className="font-serif text-3xl font-bold italic mt-8 text-[#800000] text-center">Hand-Painted. Curated. Enduring</h2>
          </div>

          {/* Hero Banner - Portrait Video */}
          <div className="relative w-full max-w-sm mx-auto rounded-lg overflow-hidden shadow-2xl border-4 border-white mt-auto">
            <video 
              src="/video/video_2.mp4" 
              className="w-full h-auto block"
              autoPlay
              muted
              loop
              playsInline
            />
          </div>
        </div>

        <div className="font-serif space-y-16 text-gray-700 leading-relaxed">

          {/* Quality Standards */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <h2 className="font-serif text-3xl font-bold text-[#800000]">Our Quality Standards</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4 p-6 bg-white shadow-sm hover:shadow-md transition-shadow rounded-lg border-2 border-[#800000]">
                <CheckCircle className="text-[#800000] flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-bold text-xl mb-2">100% Hand-Painted</h3>
                  <p>Every painting is created entirely by hand using traditional oil painting techniques. We never use prints or digital reproduction methods.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-6 bg-white shadow-sm hover:shadow-md transition-shadow rounded-lg border-2 border-[#800000]">
                <CheckCircle className="text-[#800000] flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-bold text-xl mb-2">Premium Linen Canvas</h3>
                  <p>We use 100% pure linen canvases that are pre-stretched and triple-primed for superior durability and paint adhesion.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-6 bg-white shadow-sm hover:shadow-md transition-shadow rounded-lg border-2 border-[#800000]">
                <CheckCircle className="text-[#800000] flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-bold text-xl mb-2">Refined Oil Paints</h3>
                  <p>Only the highest quality, lightfast oil paints are used to ensure vibrant colors that will last for generations.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-6 bg-white shadow-sm hover:shadow-md transition-shadow rounded-lg border-2 border-[#800000]">
                <CheckCircle className="text-[#800000] flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-bold text-xl mb-2">Master Artists</h3>
                  <p>Our certified art masons are highly skilled professionals with years of training in classical painting techniques.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-6 bg-white shadow-sm hover:shadow-md transition-shadow rounded-lg border-2 border-[#800000]">
                <CheckCircle className="text-[#800000] flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-bold text-xl mb-2">Original Accuracy</h3>
                  <p>Each painting is 100% original proportional, colour and image accurate.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-6 bg-white shadow-sm hover:shadow-md transition-shadow rounded-lg border-2 border-[#800000]">
                <CheckCircle className="text-[#800000] flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-bold text-xl mb-2">Proper Drying Time</h3>
                  <p>Painting takes approximately 7 weeks plus 1 week to properly dry and cure ensuring longevity and preventing cracking or smudging of paint brushstrokes.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Second Banner */}
          <div className="my-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {[
              {
                src: '/our-quality/quality_paint.png',
                width: 2622,
                height: 1824,
              },
              {
                src: '/our-quality/quality_paint_2.png',
                width: 4000,
                height: 3584,
              },
              {
                src: '/our-quality/quality_paint_3.png',
                width: 3238,
                height: 4000,
              },
            ].map((img, index) => (
              <div
                key={img.src}
                className="relative w-full aspect-square rounded-lg overflow-hidden shadow-2xl border-4 border-white"
              >
                <Image
                  src={img.src}
                  alt={`Artisan at Work ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (min-width: 768px) 33vw"
                  className="object-fill"
                />
              </div>
            ))}
            </div>
          </div>

          {/* Our Process */}
          <section className="p-6 rounded-lg">
            <h2 className="font-serif text-3xl font-bold mb-8 text-[#800000]">Our Creation Process</h2>
            <div className="space-y-6">
              {/* Process steps with white backgrounds */}
              <div className="p-6 bg-white shadow-sm border-2 border-[#800000] rounded-lg">
                <h3 className="font-bold text-xl mb-2 text-[#800000]">1. Selection & Study</h3>
                <p>Our artists carefully study the original masterpiece, analyzing brushwork, color palette, and technique.</p>
              </div>
              
              <div className="p-6 bg-white shadow-sm border-2 border-[#800000] rounded-lg">
                <h3 className="font-bold text-xl mb-2 text-[#800000]">2. Canvas Preparation</h3>
                <p>Premium linen canvas is stretched on wooden frames and treated with multiple layers of primer.</p>
              </div>
              
              <div className="p-6 bg-white shadow-sm border-2 border-[#800000] rounded-lg">
                <h3 className="font-bold text-xl mb-2 text-[#800000]">3. Underpainting</h3>
                <p>The composition is sketched and an underpainting layer is applied to establish values and composition.</p>
              </div>
              
              <div className="p-6 bg-white shadow-sm border-2 border-[#800000] rounded-lg">
                <h3 className="font-bold text-xl mb-2 text-[#800000]">4. Layer by Layer Painting</h3>
                <p>Multiple layers of oil paint are applied using traditional techniques, building depth and richness.</p>
              </div>
              
              <div className="p-6 bg-white shadow-sm border-2 border-[#800000] rounded-lg">
                <h3 className="font-bold text-xl mb-2 text-[#800000]">5. Detail Work & Finishing</h3>
                <p>Fine details are added with precision, and the painting is allowed to dry completely.</p>
              </div>
              
              <div className="p-6 bg-white shadow-sm border-2 border-[#800000] rounded-lg">
                <h3 className="font-bold text-xl mb-2 text-[#800000]">6. Quality Inspection</h3>
                <p>Each painting is inspected for accuracy, quality, and adherence to our museum-grade standards.</p>
              </div>
            </div>
          </section>

          {/* Certification */}
          <section className="bg-white shadow-lg p-8 rounded-lg border-t-4 border-[#800000]">
            <h2 className="font-serif text-3xl font-bold mb-8 text-[#800000] text-center">Certified Excellence</h2>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/3 flex justify-center">
                <div className="relative w-64 h-64 drop-shadow-xl">
                  <Image 
                    src="/our-quality/cert_1.png" 
                    alt="Quality Certificate" 
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              <div className="md:w-2/3 space-y-4">
                <p className="text-lg">
                  Every painting from ART MASONS comes with a certificate of authenticity, guaranteeing that your artwork is a genuine hand-painted oil painting reproduction created by our certified master artists.
                </p>
                <p className="text-lg">
                  This certificate serves as proof of the quality materials used, the traditional techniques employed, and our commitment to delivering museum-quality artwork that will be treasured for generations.
                </p>
                <div className="mt-6 p-6 bg-gray-50 border border-[#800000]/20 rounded-md">
                  <p className="font-bold text-[#800000]">Our Guarantee:</p>
                  <p className="mt-2">We stand behind the quality of every painting we create. If you&apos;re not completely satisfied with your artwork, we offer a comprehensive return policy to ensure your peace of mind.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Premium Materials section removed per request */}

          {/* Call to Action */}
          <section className="text-center py-12">
            <h2 className="font-serif text-3xl font-bold mb-6 text-[#800000]">Experience the Difference</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Discover the beauty and quality that only hand-painted oil reproductions can provide. Browse our collection and find the perfect masterpiece for your space.
            </p>
            <Link 
              href="/"
              className="inline-block bg-[#800000] text-white px-8 py-4 rounded-lg font-bold hover:bg-[#600000] transition-colors text-lg shadow-lg cursor-pointer"
            >
              Explore Our Collection
            </Link>
          </section>

        </div>
      </div>
    </main>
  );
}