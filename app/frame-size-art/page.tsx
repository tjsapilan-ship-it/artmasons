'use client';

import React, { useState, useMemo } from 'react';
import { Playfair_Display } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import Breadcrumbs from '../components/Breadcrumbs';
import { Ruler, Truck, ShieldCheck, Palette, Hammer, Mail, CheckCircle2 } from 'lucide-react';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif', display: 'swap' });

export default function FrameSizeArtPage() {
  const [origW, setOrigW] = useState<number | ''>('');
  const [origH, setOrigH] = useState<number | ''>('');
  const [knownDim, setKnownDim] = useState<'width' | 'height'>('width');
  const [newKnown, setNewKnown] = useState<number | ''>('');

  const computedOtherDim = useMemo<number | ''>(() => {
    if (typeof origW !== 'number' || typeof origH !== 'number') return '';
    if (typeof newKnown !== 'number') return knownDim === 'width' ? origH : origW;

    const delta = knownDim === 'width' ? newKnown - origW : newKnown - origH;
    const other = knownDim === 'width' ? origH + delta : origW + delta;
    return Math.max(0, +other.toFixed(2));
  }, [origW, origH, knownDim, newKnown]);

  return (
    <main className={`${playfair.variable} bg-art-texture min-h-screen text-black relative`}>
      {/* Linen Canvas Background Pattern */}
      <style jsx global>{`
        .bg-art-texture {
          background-color: #fdfbf7;
          background-image: url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23800000' fill-opacity='0.03' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E");
        }
        input[type=number]::-webkit-inner-spin-button, 
        input[type=number]::-webkit-outer-spin-button { 
          -webkit-appearance: none; 
          margin: 0; 
        }
        input[type=number] {
          -moz-appearance: textfield;
        }
      `}</style>

      {/* Hero & Find Size Section */}
      <section className="px-4 py-12 md:py-16 relative overflow-hidden">
        <div className="w-full relative z-10">

          <div className="mb-8">
            <Breadcrumbs items={[{ label: 'Frame & Art Size', href: '/frame-size-art' }]} />
          </div>

          <div className="text-center md:text-left mb-16">
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-[#800000] mb-6">Frame & Art Size</h1>
            <p className="font-serif text-xl text-gray-700 w-full">
              Ensure your masterpiece fits perfectly and arrives safely. Follow our comprehensive guide to sizing, shipping, and framing.
            </p>
          </div>

          <div className="bg-white p-8 md:p-12 rounded-xl shadow-sm border-2 border-[#800000] relative">

            <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-6">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#800000]">FIND THE PERFECT SIZE</h2>
            </div>

            <div className="max-w-4xl mx-auto">

              <div className="flex flex-col">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="h-px bg-[#800000] flex-grow"></div>
                  <h3 id="resize-tool" className="font-serif text-3xl font-bold text-center uppercase text-black tracking-widest">
                    ART RESIZE TOOL
                  </h3>
                  <div className="h-px bg-[#800000] flex-grow"></div>
                </div>

                <div className="font-serif bg-white p-8 border-2 border-[#800000] rounded-lg shadow-sm flex flex-col text-black text-lg relative flex-grow justify-between gap-6">

                  <div>
                    <p className="mb-2 text-lg text-black">Keep your art perfectly proportional while fitting it to your space.</p>
                    <p className="mb-6 text-base text-black">Note: All artwork across our site is listed as Height x Width in <span className="font-bold text-black">centimeters (cm)</span></p>

                    <div className="bg-[#800000] text-white p-4 rounded text-center font-medium shadow-sm">
                      Your artwork will always remain perfectly proportional – never stretched or distorted.
                    </div>
                  </div>

                  <div>
                    <p className="mb-4 font-semibold text-black">Follow these 3 simple steps:</p>

                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <span className="bg-[#800000] text-white text-sm font-bold px-3 py-1 rounded-full shrink-0 mt-0.5">STEP 1</span>
                        <p className="text-base text-black">Enter the original Height and Width found on the product page.</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="bg-[#800000] text-white text-sm font-bold px-3 py-1 rounded-full shrink-0 mt-0.5">STEP 2</span>
                        <p className="text-base text-black">Measure your wall Width to decide how large you want the art to be, allowing ideally 15cm frame and &quot;breathing space&quot; around both sides of your art.</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="bg-[#800000] text-white text-sm font-bold px-3 py-1 rounded-full shrink-0 mt-0.5">STEP 3</span>
                        <p className="text-base text-black">Enter your new Width – 30cm (15cm space both sides).</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <p className="text-sm text-gray-500 mb-3 italic">Example: 60 x 90 cm</p>
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                      <div className="w-full sm:w-1/2">
                        <label className="text-base font-bold text-black block mb-2">Enter Original Height</label>
                        <input
                          type="number"
                          value={origH}
                          onChange={(e) => setOrigH(e.target.value === '' ? '' : Number(e.target.value))}
                          className="w-full p-3 border border-gray-300 rounded focus:border-[#800000] outline-none bg-white text-black transition-colors"
                          placeholder="60"
                        />
                      </div>
                      <div className="w-full sm:w-1/2">
                        <label className="text-base font-bold text-black block mb-2">Enter Original Width</label>
                        <input
                          type="number"
                          value={origW}
                          onChange={(e) => setOrigW(e.target.value === '' ? '' : Number(e.target.value))}
                          className="w-full p-3 border border-gray-300 rounded focus:border-[#800000] outline-none bg-white text-black transition-colors"
                          placeholder="90"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <label className="text-base font-bold text-black block mb-4">
                      Enter either the new desired Height <span className="bg-[#800000] text-white text-sm font-bold px-3 py-1 rounded-full mx-1">OR</span> Width
                    </label>

                    <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${knownDim === 'height' ? 'border-[#800000]' : 'border-gray-400'}`}>
                          {knownDim === 'height' && <div className="w-2.5 h-2.5 rounded-full bg-[#800000]" />}
                        </div>
                        <input type="radio" name="known" checked={knownDim === 'height'} onChange={() => setKnownDim('height')} className="hidden" />
                        <span className="text-base font-medium text-black group-hover:text-[#800000] transition-colors">New Height</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer group">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${knownDim === 'width' ? 'border-[#800000]' : 'border-gray-400'}`}>
                          {knownDim === 'width' && <div className="w-2.5 h-2.5 rounded-full bg-[#800000]" />}
                        </div>
                        <input type="radio" name="known" checked={knownDim === 'width'} onChange={() => setKnownDim('width')} className="hidden" />
                        <span className="text-base font-medium text-black group-hover:text-[#800000] transition-colors">New Width</span>
                      </label>
                    </div>

                    <div className="mb-4">
                      <input
                        type="number"
                        value={newKnown}
                        onChange={(e) => setNewKnown(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full p-3 border border-gray-300 rounded focus:border-[#800000] outline-none bg-white text-black transition-colors"
                        placeholder={knownDim === 'width' ? 'Enter new width' : 'Enter new height'}
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center border border-gray-200 rounded bg-white overflow-hidden shadow-sm">
                      <div className="px-4 py-3 text-black text-base border-b sm:border-b-0 sm:border-r border-gray-200 bg-gray-50 w-full sm:w-auto sm:min-w-[180px] font-medium">
                        Behold your new {knownDim === 'width' ? 'Height' : 'Width'}
                      </div>
                      <div className="px-4 py-3 font-bold text-[#800000] text-lg flex-grow">
                        {typeof computedOtherDim === 'number' ? `${computedOtherDim} cm` : ''}
                      </div>
                    </div>
                  </div>

                  <div className="border-2 border-[#800000] rounded p-4">
                    <p className="font-bold text-base mb-1 text-black">Need a hand?</p>
                    <p className="text-base text-black">
                      We&apos;re happy to help — contact us at <a href="mailto:info@artmasons.com" className="text-[#800000] underline font-medium">info@artmasons.com</a>
                    </p>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Shipping & Care Section */}
      <section className="py-12 md:py-16 relative z-10">
        <div className="w-full px-4">

          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#800000]">Shipping & Care</h2>
            </div>
            <p className="text-lg text-gray-700 font-serif leading-relaxed max-w-2xl">
              Delivered safely, ready for your custom framing choice. We ensure your artwork arrives in pristine condition.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white shadow-sm p-6 rounded-lg border-2 border-[#800000]">
              <div className="flex gap-4">
                <div>
                  <h3 className="font-serif font-bold text-xl text-gray-900 mb-3">Pristine Arrival</h3>
                  <p className="text-base text-gray-700 leading-relaxed">Shipped rolled in protective, heavy-duty tubes along with the authenticity certificate — the gold standard for fine art handling.</p>
                </div>
              </div>
            </div>
            <div className="bg-white shadow-sm p-6 rounded-lg border-2 border-[#800000]">
              <div className="flex gap-4">
                <div>
                  <h3 className="font-serif font-bold text-xl text-gray-900 mb-3">Safe & Flexible</h3>
                  <p className="text-base text-gray-700 leading-relaxed">Shipping unframed eliminates the risk of glass breakage or frame damage in transit, giving you full control over the final look.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((num) => (
              <div key={num} className="group relative rounded-lg overflow-hidden shadow-lg border-4 border-white aspect-[4/5] bg-gray-100">
                <Image
                  src={`/image/frame-art-size/image_${num}.webp`}
                  alt={`Shipping care step ${num}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Style Guide Section */}
      <section className="py-12 md:py-16 relative z-10">
        <div className="w-full px-4">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#800000]">Choose Your Style</h2>
            </div>
            <p className="text-lg text-gray-700 font-serif leading-relaxed max-w-2xl">
              A guide to framing options that complement your space.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden border-2 border-[#800000]">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-[#800000] text-white">
                    <th className="p-6 font-serif text-xl font-semibold w-1/3">Frame Style</th>
                    <th className="p-6 font-serif text-xl font-semibold w-1/3 border-l border-white/20">Best For</th>
                    <th className="p-6 font-serif text-xl font-semibold w-1/3 border-l border-white/20">Visual Impact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="p-6 text-lg font-bold text-gray-800">Modern Black</td>
                    <td className="p-6 text-lg text-gray-600 border-l border-gray-100">Minimalist Interiors</td>
                    <td className="p-6 text-lg text-gray-600 border-l border-gray-100">Bold & Defined</td>
                  </tr>
                  <tr className="bg-[#f9f7f4] hover:bg-[#f0ece6] transition-colors">
                    <td className="p-6 text-lg font-bold text-gray-800">Natural Oak</td>
                    <td className="p-6 text-lg text-gray-600 border-l border-gray-200">Scandi / Organic styles</td>
                    <td className="p-6 text-lg text-gray-600 border-l border-gray-200">Warm & Soft</td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="p-6 text-lg font-bold text-gray-800">Classic White</td>
                    <td className="p-6 text-lg text-gray-600 border-l border-gray-100">Bright, Airy Spaces</td>
                    <td className="p-6 text-lg text-gray-600 border-l border-gray-100">Clean & Seamless</td>
                  </tr>
                  <tr className="bg-[#f9f7f4] hover:bg-[#f0ece6] transition-colors">
                    <td className="p-6 text-lg font-bold text-gray-800">Gallery Gold</td>
                    <td className="p-6 text-lg text-gray-600 border-l border-gray-200">Statement / Antique</td>
                    <td className="p-6 text-lg text-gray-600 border-l border-gray-200">Elegant & Timeless</td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="p-6 text-lg font-bold text-gray-800">Champagne Metallic</td>
                    <td className="p-6 text-lg text-gray-600 border-l border-gray-100">High-End Minimalist</td>
                    <td className="p-6 text-lg text-gray-600 border-l border-gray-100">Sleek & Contemporary</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-12 md:py-16 relative z-10">
        <div className="w-full px-4">

          <div className="flex items-center gap-3 mb-10">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#800000]">The Process</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {[
              { step: 1, title: "Order", desc: "Select your artwork and choose a standard or custom size online." },
              { step: 2, title: "Creation", desc: "Your artwork is hand-painted by our academically trained artists. Production takes approximately 8 weeks, including proper drying time." },
              { step: 3, title: "Delivery", desc: "Once complete, we ship your artwork directly to your framer of choice for a seamless transition. Estimated delivery time: 1 week." },
              { step: 4, title: "Consult", desc: "Work with your framer to select materials that best complement your interior and artwork." },
              { step: 5, title: "Preparation", desc: "Your framer professionally stretches and frames the canvas to museum standards." },
              { step: 6, title: "Hang & Enjoy", desc: "Install your masterpiece and enjoy art created exclusively for your space." }
            ].map((item) => (
              <div key={item.step} className="p-6 rounded-lg bg-white shadow-sm border-2 border-[#800000]">
                <div className="w-10 h-10 bg-[#800000] text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">
                  {item.step}
                </div>
                <h3 className="font-serif font-bold text-xl mb-2 text-gray-900">{item.title}</h3>
                <p className="text-gray-700 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Dubai Service Block */}
          <div className="relative rounded-lg overflow-hidden shadow-lg bg-white border-2 border-[#800000]">
            <div className="grid md:grid-cols-2">
              <div className="p-10 md:p-12 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 bg-[#800000] text-white w-fit px-3 py-1 rounded-full text-sm font-medium mb-6">
                  <span className="uppercase tracking-wider">Dubai Exclusive</span>
                </div>
                <h3 className="font-serif text-3xl font-bold mb-6 text-gray-900">
                  Professional Framing Service
                </h3>
                <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                  Based in Dubai? We connect you directly with the city’s leading professional framers for a seamless, trusted experience. Museum standard craftmanship, handled with care from start to finish.
                </p>

                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <CheckCircle2 className="text-[#800000] flex-shrink-0" size={28} />
                  <div>
                    <p className="font-bold text-gray-900">Direct Payment</p>
                    <p className="text-sm text-gray-600">Pay the framing studio directly for complete transparency and peace of mind.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-100 relative min-h-[300px] md:min-h-full">
                {/* Grid of images */}
                <div className="absolute inset-0 p-4 grid grid-cols-2 gap-4">
                  <div className="relative h-full w-full rounded-lg overflow-hidden shadow-md border-4 border-white">
                    <Image
                      src="/image/frame-art-size/image_4.webp"
                      alt="Dubai framing example 1"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="relative h-full w-full rounded-lg overflow-hidden shadow-md border-4 border-white">
                    <Image
                      src="/image/frame-art-size/image_7.webp"
                      alt="Dubai framing example 2"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Need Assistance Section */}
      <section className="py-12 md:py-16 relative z-10">
        <div className="w-full px-4">
          <div className="bg-[#800000] text-white p-10 md:p-16 rounded-lg shadow-xl border-2 border-[#800000] text-center">
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">Need Assistance?</h2>
            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
              Our team is here to help you choose the perfect size and provide guidance on framing options that will beautifully showcase your artwork.
            </p>

            <p className="text-xl mb-2">
              <span className="font-semibold">Email us at:</span> <a href="mailto:info@artmasons.com" className="underline hover:text-white/80 transition-colors font-medium">info@artmasons.com</a>
            </p>
            <p className="text-white/90">We typically respond within 24 hours</p>
          </div>
        </div>
      </section>

      {/* Explore Our Collection CTA */}
      <section className="text-center py-12 md:py-16 bg-white relative z-10 border-t border-gray-100">
        <div className="w-full px-4">
          <h2 className="font-serif text-3xl font-bold mb-6 text-[#800000]">Experience the Difference</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto font-serif text-gray-700">
            Discover the beauty and quality that only hand-painted oil reproductions can provide. Browse our collection and find the perfect masterpiece for your space.
          </p>
          <Link
            href="/"
            className="inline-block bg-[#800000] text-white px-8 py-4 rounded-lg font-bold hover:bg-[#600000] transition-colors text-lg shadow-lg cursor-pointer font-serif"
          >
            Explore Our Collection
          </Link>
        </div>
      </section>
    </main>
  );
}