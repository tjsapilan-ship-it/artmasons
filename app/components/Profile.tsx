"use client";

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

const EducatedMastery = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    isPlaying ? audioRef.current.pause() : audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      if (total) setProgress((current / total) * 100);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;
    const bounds = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const percentage = x / bounds.width;
    audioRef.current.currentTime = percentage * audioRef.current.duration;
  };

  return (
    // Outer section has no background color, so it blends into your page
    <section className="w-full max-w-6xl mx-auto p-4 md:p-12 flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20">
      
      <audio 
        ref={audioRef} 
        src="/image/profile/profile-audio.mp4" 
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />

      {/* --- THE FRAME --- */}
      {/* 1. Outer Frame Shadow (Floating effect) */}
      <div className="relative shrink-0 drop-shadow-2xl hover:scale-[1.01] transition-transform duration-500 ease-in-out">
        {/* 2. Dark Wood Outer Rim */}
        <div className="bg-[#000] p-4 rounded-sm shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
          {/* 3. The Accent Rim (Using your #800 Red) */}
          <div className="bg-[#880000] p-1 shadow-md">
            {/* 4. The White Matte (Passe-Partout) */}
            <div className="bg-[#fdfbf7] p-6 md:p-3 shadow-[inset_0_2px_10px_rgba(0,0,0,0.15)]">
               {/* 5. The Image Area */}
              <div className="relative w-64 h-64 md:w-80 md:h-80 shadow-inner border border-gray-200 bg-white">
                <Image
                  src="/image/profile/profile-image.jpeg"
                  alt="Art Masons"
                  fill
                  className="object-cover contrast-110 saturate-[0.8]"
                  // Multiply blend mode makes the image look "inked" into the paper
                  style={{ mixBlendMode: 'multiply' }} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- THE CONTROLS --- */}
      {/* Minimalist text layout floating to the right */}
      <div className="flex-1 w-full max-w-md flex flex-col justify-center">
        
        {/* Track Info */}
        <div className="mb-8 space-y-2 text-center md:text-left">
          <h2 className="text-4xl md:text-5xl font-serif text-[#880000] tracking-tight">
            The Educated Mastery
          </h2>
          <p className="text-[#000000] font-bold tracking-widest uppercase text-xs">
            Art Masons • Voiceover • 2026
          </p>
        </div>

        {/* Progress Line */}
        <div className="group mb-10 w-full cursor-pointer" onClick={handleSeek}>
          <div className="h-0.5 w-full bg-white/20 relative flex items-center">
            {/* Active Progress (#800 Red) */}
            <div 
              className="absolute top-0 left-0 h-full bg-[#880000] transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
            {/* Draggable Circle (Only visible on hover or active) */}
            <div 
              className="absolute w-3 h-3 bg-[#880000] rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_10px_#800]"
              style={{ left: `${progress}%`, transform: 'translateX(-50%)' }} 
            />
          </div>
          
          <div className="flex justify-between mt-3 text-[10px] text-gray-500 font-mono tracking-widest uppercase">
            <span>Start</span>
            <span>Duration</span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-center md:justify-start gap-8">
           <button className="text-gray-600 hover:text-white transition-colors">
             <SkipBack className="w-6 h-6" />
           </button>

           <button 
            onClick={togglePlay}
            // Red border and hover effect
            className="w-16 h-16 rounded-full border border-[#880000]/40 flex items-center justify-center text-[#880000] hover:bg-[#880000] hover:text-white hover:border-[#880000] transition-all duration-300 shadow-[0_0_20px_rgba(136,0,0,0.1)] hover:shadow-[0_0_30px_rgba(136,0,0,0.4)]"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="ml-1 w-6 h-6 fill-current" />
            )}
          </button>

          <button className="text-gray-600 hover:text-white transition-colors">
             <SkipForward className="w-6 h-6" />
           </button>
        </div>
      </div>
    </section>
  );
};

export default EducatedMastery;