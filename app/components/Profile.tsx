"use client";

import React from 'react';

const EducatedMastery = () => {
  return (
    // Outer section has no background color, so it blends into your page
    <section className="w-full max-w-7xl mx-auto p-4 md:p-12 flex flex-col items-center justify-center gap-12 md:gap-16">

      {/* --- THE FRAME --- */}
      {/* 1. Outer Frame Shadow (Floating effect) */}
      <div className="relative shrink-0 drop-shadow-2xl hover:scale-[1.01] transition-transform duration-500 ease-in-out w-full max-w-4xl">
        {/* 2. Dark Wood Outer Rim */}
        <div className="bg-[#000] p-4 rounded-sm shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
          {/* 3. The Accent Rim (Using your #800 Red) */}
          <div className="bg-[#880000] p-1 shadow-md">
            {/* 4. The White Matte (Passe-Partout) */}
            <div className="bg-[#fdfbf7] p-2 md:p-3 shadow-[inset_0_2px_10px_rgba(0,0,0,0.15)]">
              {/* 5. The Video Area */}
              <div className="relative aspect-video shadow-inner border border-gray-200 bg-black overflow-hidden">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/LeSahWVASss"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  style={{ transform: 'translate3d(0, 0, 0)' }}
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- THE INFO --- */}
      <div className="flex-1 w-full max-w-4xl flex flex-col justify-center">

        {/* Track Info */}
        <div className="mb-4 space-y-2 text-center">
          <h2 className="text-5xl md:text-6xl font-serif font-bold text-[#880000] tracking-tight">
            The Founder's Message
          </h2>
          <p className="text-[#000000] font-bold tracking-widest uppercase text-sm">
            Art Masons
          </p>
        </div>
      </div>
    </section>
  );
};

export default EducatedMastery;
