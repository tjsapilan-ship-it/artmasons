'use client';

import React from 'react';
import { Playfair_Display } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import Breadcrumbs from '../components/Breadcrumbs';
import { Ruler, Truck, ShieldCheck, Palette, Hammer, Info, Mail, ChevronRight, CheckCircle2 } from 'lucide-react';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });

export default function FrameSizeArtPage() {
  return (
    <main className={`${playfair.variable} bg-art-texture min-h-screen text-black relative`}>
      {/* Linen Canvas Background Pattern */}
      <style jsx global>{`
        .bg-art-texture {
          background-color: #fdfbf7;
          background-image: url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23800000' fill-opacity='0.03' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E");
        }
      `}</style>
      
      {/* Hero & Find Size Section */}
      <section className="px-4 py-12 md:py-16 relative overflow-hidden">
        <div className="container mx-auto max-w-6xl relative z-10">
          
          <div className="mb-8">
            <Breadcrumbs items={[{ label: 'Frame & Size Art', href: '/frame-size-art' }]} />
          </div>

          <div className="text-center md:text-left mb-16">
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-[#800000] mb-6">FRAMING & ART SIZE</h1>
            <p className="font-serif text-xl text-gray-700 max-w-2xl">
              Ensure your masterpiece fits perfectly and arrives safely. Follow our comprehensive guide to sizing, shipping, and framing.
            </p>
          </div>

          <div className="bg-white p-8 md:p-12 rounded-xl shadow-sm border-2 border-[#800000] relative">
            
            <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-6">
              <div className="p-3 bg-[#800000]/5 rounded-full">
                <Ruler className="text-[#800000]" size={36} />
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#800000]">FIND THE PERFECT SIZE</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <p className="text-xl mb-8 leading-relaxed text-gray-800">
                  Don&apos;t guess. Use our <Link href="/resize-art-tool" className="text-[#800000] hover:underline font-bold decoration-2 underline-offset-4">Resize Art Tool</Link> to preserve proportions without distortion.
                </p>

                <div className="space-y-6">
                  {[
                    { step: "Step 1", text: "Measure the total width of your wall.", icon: <Ruler className="text-[#800000]" size={20} /> },
                    { step: "Step 2", text: 'Subtract 40cm (allows 20cm "breathing room" per side).', icon: <CheckCircle2 className="text-[#800000]" size={20} /> },
                    { step: "Step 3", text: "Enter the result into our resize tool.", icon: <ChevronRight className="text-[#800000]" size={20} /> }
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-start">
                      <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-[#800000]/10 flex items-center justify-center">
                        {item.icon}
                      </div>
                      <div>
                        <span className="block text-[#800000] font-bold text-sm uppercase tracking-wider mb-1">{item.step}</span>
                        <span className="text-lg text-gray-700 font-medium">{item.text}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

               <div className="bg-[#f0ece6] p-8 rounded-lg flex flex-col justify-center border border-[#800000]/10">
                  <div className="flex items-start gap-4 mb-6">
                    <Info className="text-[#800000] flex-shrink-0 mt-1" size={28} />
                    <div>
                      <p className="text-xl font-bold text-[#800000] mb-2 font-serif">Pro Tip</p>
                      <p className="text-lg text-gray-700 leading-relaxed">If your wall is 200cm wide, your ideal art width is 160cm.</p>
                    </div>
                  </div>
                  <div className="text-center pt-6 border-t border-gray-300">
                    <p className="text-gray-600 mb-4 font-serif italic">Need something specific?</p>
                    <a href="mailto:info@artmasons.com" className="inline-flex items-center gap-2 text-[#800000] font-bold hover:opacity-80 transition-opacity">
                      <Mail size={18} />
                      Email for Custom Sizes
                    </a>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shipping & Care Section - White Background */}
      <section className="bg-white py-20 border-t border-[#800000]/10">
        <div className="container mx-auto max-w-6xl px-4">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
             <div className="flex items-center gap-4">
               <div className="p-3 bg-[#800000]/5 rounded-full">
                  <Truck className="text-[#800000]" size={36} />
               </div>
               <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#800000]">SHIPPING & CARE</h2>
             </div>
             <p className="text-lg text-gray-500 font-serif italic max-w-md md:text-right">
               Delivered safely, ready for your custom framing choice.
             </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-[#fdfbf7] p-8 rounded-xl border border-[#800000]/20 hover:shadow-md transition-shadow">
              <div className="flex gap-5">
                <ShieldCheck className="text-[#800000] flex-shrink-0" size={40} />
                <div>
                    <h3 className="font-serif font-bold text-2xl text-gray-900 mb-3">Pristine Arrival</h3>
                    <p className="text-lg text-gray-600 leading-relaxed">Shipped rolled in protective, heavy-duty tubes along with the authenticity certificate — the gold standard for fine art handling.</p>
                </div>
              </div>
            </div>
            <div className="bg-[#fdfbf7] p-8 rounded-xl border border-[#800000]/20 hover:shadow-md transition-shadow">
              <div className="flex gap-5">
                 <Palette className="text-[#800000] flex-shrink-0" size={40} />
                <div>
                     <h3 className="font-serif font-bold text-2xl text-gray-900 mb-3">Safe & Flexible</h3>
                     <p className="text-lg text-gray-600 leading-relaxed">Shipping unframed eliminates the risk of glass breakage or frame damage in transit, giving you full control over the final look.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((num) => (
              <div key={num} className="group relative rounded-xl overflow-hidden shadow-sm aspect-[4/5] bg-gray-100">
                 <Image
                    src={`/image/frame-art-size/image_${num}.jpg`}
                    alt={`Shipping care step ${num}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-[#800000]/10 mix-blend-multiply group-hover:opacity-0 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Style Guide Section - Linen Background */}
      <section className="py-20 bg-art-texture">
         <div className="container mx-auto max-w-6xl px-4">
             <div className="text-center mb-16">
                <span className="text-[#800000] font-bold tracking-widest uppercase text-sm mb-2 block">Aesthetic Guide</span>
                <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#800000] mb-6 inline-flex items-center gap-4 justify-center flex-wrap">
                  <Palette size={40} className="text-[#800000]" />
                  CHOOSE YOUR STYLE
                </h2>
                <div className="h-1 w-20 bg-[#800000] mx-auto rounded-full opacity-20" />
            </div>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-[#800000]/10">
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

      {/* Framing Process Section - White Background */}
      <section className="bg-white py-20 border-t border-[#800000]/10">
         <div className="container mx-auto max-w-6xl px-4">
            
            <div className="flex items-center gap-4 mb-12">
               <div className="p-3 bg-[#800000]/5 rounded-full">
                  <Hammer className="text-[#800000]" size={36} />
               </div>
               <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#800000]">THE PROCESS</h2>
            </div>
            
            <div className="grid md:grid-cols-4 gap-6 mb-16">
               {[
                   { step: 1, title: "Delivery", desc: "We ship directly to your framer of choice." },
                   { step: 2, title: "Consult", desc: "Select materials with your local expert." },
                   { step: 3, title: "Install", desc: "They stretch and fit your canvas professionally." },
                   { step: 4, title: "Hang", desc: "Enjoy your masterpiece in your home." }
               ].map((item) => (
                   <div key={item.step} className="p-6 rounded-lg border border-gray-200 bg-white hover:border-[#800000] transition-colors group shadow-sm hover:shadow-md">
                       <div className="w-10 h-10 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center font-bold text-lg mb-4 group-hover:bg-[#800000] group-hover:text-white transition-colors">
                           {item.step}
                       </div>
                       <h3 className="font-serif font-bold text-xl mb-2 text-gray-900">{item.title}</h3>
                       <p className="text-gray-600">{item.desc}</p>
                   </div>
               ))}
            </div>

            {/* Dubai Service Block */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-[#1a1a1a] text-white">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#800000] rounded-full blur-[120px] opacity-20 translate-x-1/3 -translate-y-1/3" />
                
                <div className="grid md:grid-cols-2">
                    <div className="p-10 md:p-16 relative z-10 flex flex-col justify-center">
                        <div className="inline-flex items-center gap-2 bg-white/10 w-fit px-3 py-1 rounded-full text-sm font-medium mb-6 backdrop-blur-md">
                          <span>🇦🇪</span> <span className="uppercase tracking-wider">Dubai Exclusive</span>
                        </div>
                        <h3 className="font-serif text-3xl md:text-4xl font-bold mb-6">
                           Professional Framing Service
                        </h3>
                        <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                            Living in Dubai? We connect you directly with the city&apos;s top professional framers for a seamless experience. No markup, just art.
                        </p>
                        
                         <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                            <CheckCircle2 className="text-[#800000] flex-shrink-0" size={28} />
                            <div>
                                <p className="font-bold text-white">Direct Payment</p>
                                <p className="text-sm text-gray-400">Pay the shop directly. Zero markup.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-[#252525] relative min-h-[300px] md:min-h-full">
                       {/* Grid of images for the Dubai service */}
                        <div className="absolute inset-0 p-4 grid grid-cols-2 gap-4">
                           <div className="relative h-full w-full rounded-lg overflow-hidden bg-gray-800">
                              <Image 
                                src="/image/frame-art-size/image_4.jpg"
                                alt="Dubai framing example 1"
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-cover opacity-80"
                              />
                           </div>
                           <div className="grid grid-rows-2 gap-4">
                              <div className="relative h-full w-full rounded-lg overflow-hidden bg-gray-800">
                                <Image 
                                  src="/image/frame-art-size/image_5.jpg"
                                  alt="Dubai framing example 2"
                                  fill
                                  sizes="(max-width: 768px) 100vw, 50vw"
                                  className="object-cover opacity-80"
                                />
                              </div>
                              <div className="relative h-full w-full rounded-lg overflow-hidden bg-gray-800">
                                <Image 
                                  src="/image/frame-art-size/image_6.jpg"
                                  alt="Dubai framing example 3"
                                  fill
                                  sizes="(max-width: 768px) 100vw, 50vw"
                                  className="object-cover opacity-80"
                                />
                              </div>
                           </div>
                        </div>
                    </div>
                </div>
            </div>
         </div>
      </section>

      {/* CTA Section - Dark Footer Style */}
      <section className="bg-[#800000] py-20 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
        }} />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-8">Ready to Frame Your Masterpiece?</h2>
            <p className="text-xl md:text-2xl text-white/90 mb-10 font-serif italic max-w-2xl mx-auto">
              Our experts are just an email away to guide you through the process.
            </p>
            <a 
              href="mailto:info@artmasons.com" 
              className="inline-flex items-center gap-3 bg-white text-[#800000] px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              <Mail className="w-5 h-5" />
              Contact Our Team
            </a>
            <p className="mt-6 text-white/60 text-sm">Response within 24 hours.</p>
        </div>
      </section>
    </main>
  );
}