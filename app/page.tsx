"use client";

import React, { useState, useEffect, useSyncExternalStore, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Playfair_Display } from "next/font/google";
import Link from "next/link";
import PageTransition from "./components/PageTransition";
import PopularArtCarousel from "./components/PopularArtCarousel";
import {
  ChevronLeft,
  ChevronRight,
  Palette,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import { ARTWORKS, getArtworkSlug } from "../data/artworks";
import { FAMOUS_ART, TOP_100_PAINTINGS, getFamousArtworkSlug } from "../data/famousAndTop100";

function shuffle<T>(arr: T[]) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// --- Fonts ---
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

// --- DATA ---
const ASSURANCE_POINTS = [
  "Museum Quality",
  "Hand Painted",
  "Certified Art Masons",
  "Refined Oil Paints",
  "100% Linen Canvases",
];

const FUN_FACTS_DATA = [
  "Leonardo da Vinci could write with one hand while drawing with the other",
  "Van Gogh sold only one painting in his lifetime",
  "Michelangelo disliked painting but created the Sistine Chapel ceiling anyway",
  "Picasso could draw before he could speak",
  "Monet painted the same scenes at different times of day to capture light changes",
  "The Mona Lisa has no visible eyelashes or eyebrows",
  "Rembrandt created over 90 self-portraits",
  "Salvador Dalí kept ants and crutches as recurring symbols",
  "Frida Kahlo painted most of her works lying in bed after injuries",
  "Caravaggio was known for bar fights and fleeing authorities",
  "Vermeer used optical devices like a camera obscura for precision",
  "Botticelli’s Birth of Venus was once considered too scandalous to display",
  "The Girl with a Pearl Earring is often called the “Mona Lisa of the North”",
  "Banksy’s identity is still unknown",
  "Klimt covered his studio windows because he preferred working in dim light",
  "Kandinsky believed he could hear colors and see music (synesthesia)",
  "Jackson Pollock’s drip technique came from swinging paint cans over canvas",
  "Rodin was rejected three times by the art school he dreamed of",
  "Raphael died at only 37 but left more than 100 major works",
  "The Scream’s sky was inspired by a real volcanic sunset in Norway",
  "Monet nearly went blind while painting his water lilies series",
  "Degas preferred sculpture but became famous for his ballet dancers",
  "Georgia O’Keeffe painted skyscrapers before she painted flowers",
  "Basquiat started as a graffiti artist under the name SAMO",
  "Andy Warhol kept everything he owned in “time capsules”",
  "Renoir continued painting even when arthritis twisted his hands",
  "Cézanne destroyed many of his own paintings in frustration",
  "Rembrandt went bankrupt despite his fame",
  "Leonardo dissected human bodies to understand anatomy",
  "The Last Supper survived bombings during WWII with only a wall tarp",
  "Van Gogh painted over many canvases—X-rays reveal hidden works",
  "Manet’s exhibitions were repeatedly rejected by the French Academy",
  "Hokusai changed his name more than 30 times",
  "The Thinker was originally part of a much larger doorway sculpture",
  "Botticelli burned some of his own paintings during the “Bonfire of the Vanities”",
  "Michelangelo signed only one sculpture: the Pietà",
  "Caravaggio used real street people as models for saints",
  "The Mona Lisa was stolen in 1911 and became famous because of it",
  "Monet’s garden at Giverny was man-made for his art",
  "Picasso painted over 50,000 artworks in his lifetime",
  "Van Gogh often ate paint, believing it improved his mood",
  "Frida Kahlo kept a pet deer, monkey, and parrot",
  "Klimt’s The Kiss contains real gold leaf",
  "David Hockney embraced digital painting before it was mainstream",
  "Mondrian refused curves in his artworks—even his furniture was geometric",
  "Vermeer used only about 20 pigments in all his works",
  "Turner strapped himself to ship masts during storms for inspiration",
  "Michelangelo wrote secret poems mocking his own backaches from painting ceilings",
  "Warhol survived an assassination attempt in 1968",
  "Basquiat’s crown symbol represented “kings” he admired in art and Black culture",
];

const TESTIMONIALS_DATA = [
  "I ordered a reproduction of a Van Gogh and couldn't believe the quality, every brushstroke felt alive. Truly stunning work!",
  "The team at Art Masons was so patient with my questions. The final piece arrived even more beautiful than I imagined.",
  "Absolutely worth every penny. The reproduction looks like it was painted by the original artist. Obsessed",
  "Fast shipping and excellent packaging, my print arrived perfect and securely wrapped.",
  "I bought art for our living room and have received so many compliments. Incredible attention to detail.",
  "I was nervous ordering online, but the photos don't do justice to the real thing. Gorgeous!",
  "Superb customer service! They helped me choose the right size for my space and it fits perfectly.",
  "The colors are vibrant and true to the original. You can see the texture and depth.",
  "I ordered three pieces for my office and they really elevate the space. Professional and inspiring.",
  "This was my first reproduction purchase, and I'm already planning my next one. Exceptional quality.",
  "The art arrived quickly and exactly as described. Trustworthy and high quality.",
  "You can tell these pieces are made with a lot of care and skill. I love my new artwork!",
  "So happy with my print. It looks as rich and detailed as the original museum piece.",
  "Incredible craftsmanship! Every detail is sharp and beautiful.",
  "I bought a self-portrait for my grandmother's birthday. she cried tears of joy!",
  "Beautiful art, excellent service, and fair pricing. What more could you ask for?",
  "Shipped faster than expected and arrived in perfect condition. Fantastic experience.",
  "The Dubai framing I chose is gorgeous, exactly what I wanted for my living room. Feel like I'm in a gallery!",
  "I've purchased art from several sites, but Art Masons is by far the best quality.",
  "The painting feels like a gallery painting. I'm obsessed with it!",
  "I asked for a custom size and they delivered it perfectly. Highly recommend it!.",
  "I get asked where I bought my art all the time. It's that impressive!",
  "True to the original artist's style and feel. I couldn't be happier.",
  "Exceptional work and attention to detail. This piece feels like the real deal.",
  "My expectations were high and they were exceeded. This is gallery quality.",
  "Beautiful reproduction art at an affordable price. Love it!",
  "Art Masons helped me pick a piece that matches my décor perfectly.",
  "The quality of the canvas and printing is top notch. Very happy customer!",
  "I've never been disappointed with any order. Always excellent!",
  "The colors on my piece are so rich and deep - just wow.",
  "Every guest comments on how amazing this artwork looks. Great choice!",
  "Fantastic craftsmanship and friendly customer support. A+ experience.",
  "Worth every cent. It looks like an original masterpiece on my wall.",
  "The whole process was smooth. from ordering to delivery.",
  "I bought this as a gift and it was absolutely loved. Stunning art!",
  "Beautiful reproduction. I felt like I was hanging a real museum piece.",
  "The detail is incredible. You can see depth and layers like a museum painting.",
  "Art Masons did not disappoint. This piece made my home feel complete.",
  "The texture and finish are phenomenal, truly high-end quality.",
  "I love the authenticity and elegance of this art. It breathes life into the room.",
  "I was hesitant at first, but now I'm a loyal customer. Fantastic work!",
  "Great communication, great product, and great value. Highly recommended.",
  "I'm blown away by how true to the original this reproduction is..  the colours are true to the original and so vibrant!",
  "The painting was perfect and looks professionally done.",
  "So impressed with the craftsmanship. I'll be back for more!  Thinking which other walls I could add art to at this price it's a steal! ",
  "The artwork arrived perfect and is such a statement piece in my home.",
  "Customer service really took care of me, very personal and friendly.",
  "Every detail feels thoughtfully reproduced. Exceptional art!",
  "Beautiful and vibrant, this piece truly stands out on my wall.",
  "Honestly, this is the best piece of art I've ever purchased online.",
  "As an interior designer I'm always hesitant to add art to stage the home because the prints cheapen the final look. Art Masons art really makes it look so high end!",
  "Hotels suffer from mass produced prints - we won't be making that mistake again! Art Masons hand painted art is our choice!",
  "Can't believe I have a Monet of my own, totally lost in the dreamy brushstrokes…",
  "When I scaled my art to fit a feature wall I didn't realize just how impactful it would be. It's all everyone talks about! Thank you!",
  "After discussing the Art with Rosie she gave me a whole backstory of the artist and why this suited my character and decor - a perfect match!",
  "Inspired and captivated thanks Art Masons you have superseded my expectations!",
  "I wouldn't go to any other artists. This is where quality art lives! Art Masons hand painted art is off the charts!!",
  "Did someone say reproduction art? I would say the art I received should be in a gallery!!!",
  "I love how you can see the 3D canvas texture and pigments of paint reflecting in the light. It really is living art",
  "I now understand why hand painted art has been treasured by those who could afford it. Who would have thought I could own my own for just £150, that's AED1500.. It was worth every penny.",
  "Staging a home for sale just became easier, Art Masons raised the bar and added pure luxury and character after I added the art I considered not selling the home!!",
  "I wish I had more walls to add more art to! So beautiful.",
  "I bought Art Masons art and when I redecorated I managed to sell it for double what I paid for it! The new art I purchased to fit the new decor was the same fabulous quality!",
  "I'm not one for shouting compliments unless deserved, Art Masons you really have made museum-grade art accessible to everyone! What a find!",
  "Art Masons 'resize art tool' helped me easily resize the art to a large size to fill my feature wall and wow just wow!",
  "The artist's brushstrokes and quality of care and precision left me astonished!!",
  "Van Gogh in my home??? Who would have thought it possible? Perfection!",
  "Always been a fan of Matisse, now I have my own! Love it!",
  "Rembrandt has forever captivated me, the snapshot of history, the light, the shadows.. I am honored to own one!",
  "Whenever anyone comes to my home they are drawn to the art, it's an instant talking piece. I became more inspired to learn about the art and Monet's back story because of it.",
  "We considered prints but at this price we went for hand-painted art!! Thank you Art Masons I never thought I would own a Matisse! ",
  "My friends think I own a Van Gogh hahaha not going to tell them!",
  "Our Prestigious Hotel needed hand-painted art not flat prints to match the decor,  What started as an idea translated into a master-piece!",
];

// Famous Art collection from PDF data - mapped to display format
const ART_OF_THE_DAY = FAMOUS_ART.map((item) => {
  // Try to find matching artwork in main ARTWORKS collection for slug
  const byTitleArtist = ARTWORKS.find(
    (a) =>
      (a.name ?? "").toLowerCase() === item.title.toLowerCase() &&
      (a.artist ?? "").toLowerCase().replace(/\s+/g, ' ') === item.artist.toLowerCase().replace(/\s+/g, ' '),
  );

  return {
    title: item.title,
    artist: item.artist,
    image: item.image,
    slug: byTitleArtist ? getArtworkSlug(byTitleArtist) : getFamousArtworkSlug(item),
  };
});

// Top 100 Paintings collection from PDF data - mapped to display format
const TOP_100_ARTS = TOP_100_PAINTINGS.map((item) => {
  // Try to find matching artwork in main ARTWORKS collection for slug
  const byTitleArtist = ARTWORKS.find(
    (a) =>
      (a.name ?? "").toLowerCase() === item.title.toLowerCase() &&
      (a.artist ?? "").toLowerCase().replace(/\s+/g, ' ') === item.artist.toLowerCase().replace(/\s+/g, ' '),
  );

  return {
    title: item.title,
    artist: item.artist,
    image: item.image,
    slug: byTitleArtist ? getArtworkSlug(byTitleArtist) : getFamousArtworkSlug(item),
  };
});

// --- QUIZ DATA ---
interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
}

interface EssenceResult {
  title: string;
  description: string;
  characteristics: string[];
  artRecommendations: string[];
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "What environment makes you feel most at peace?",
    options: [
      "A grand historical palace or museum",
      "A serene garden or natural landscape",
      "A vibrant city with modern architecture",
      "An intimate, cozy space with warm lighting"
    ]
  },
  {
    id: 2,
    question: "Which color palette resonates with you most?",
    options: [
      "Rich golds, deep reds, and royal blues",
      "Soft pastels and earth tones",
      "Bold primary colors and stark contrasts",
      "Warm ambers, burgundies, and deep browns"
    ]
  },
  {
    id: 3,
    question: "How would you describe your ideal artwork?",
    options: [
      "Detailed, dramatic, and historically significant",
      "Peaceful, impressionistic, and evocative",
      "Bold, abstract, and thought-provoking",
      "Intimate, emotional, and deeply personal"
    ]
  },
  {
    id: 4,
    question: "What draws you to a piece of art?",
    options: [
      "Its historical importance and technical mastery",
      "The mood and atmosphere it creates",
      "Its innovative style and visual impact",
      "The emotional story it tells"
    ]
  },
  {
    id: 5,
    question: "Your ideal room would feature:",
    options: [
      "Statement pieces with ornate frames and dramatic lighting",
      "Soft, flowing imagery that brings nature indoors",
      "Contemporary art that sparks conversation",
      "Personal, meaningful pieces that tell your story"
    ]
  }
];

const essenceResults: { [key: string]: EssenceResult } = {
  classical: {
    title: "The Classical Connoisseur",
    description: "You appreciate timeless beauty, historical significance, and technical mastery. Your aesthetic is rooted in tradition, grandeur, and the enduring power of classical art.",
    characteristics: [
      "Appreciation for historical masterpieces",
      "Love of detailed, realistic compositions",
      "Preference for dramatic and grand presentations",
      "Value for technical excellence and craftsmanship"
    ],
    artRecommendations: [
      "Renaissance masterpieces by Raphael and Leonardo da Vinci",
      "Baroque drama from Caravaggio and Rembrandt",
      "Neoclassical works by Jacques-Louis David",
      "Academic paintings with historical or mythological themes"
    ]
  },
  impressionist: {
    title: "The Impressionist Soul",
    description: "You are drawn to beauty in everyday moments, the play of light, and atmospheric scenes. You appreciate art that captures feelings and impressions rather than precise details.",
    characteristics: [
      "Love of natural light and outdoor scenes",
      "Appreciation for mood and atmosphere",
      "Preference for softer, more fluid compositions",
      "Connection to nature and peaceful settings"
    ],
    artRecommendations: [
      "Monet's water lilies and garden scenes",
      "Renoir's intimate portraits and social gatherings",
      "Pissarro's landscapes and rural life",
      "Sisley's serene countryside vistas"
    ]
  },
  modern: {
    title: "The Modern Visionary",
    description: "You embrace innovation, bold expression, and contemporary aesthetics. You're drawn to art that challenges conventions and makes powerful visual statements.",
    characteristics: [
      "Appreciation for innovative techniques",
      "Love of bold colors and abstract forms",
      "Interest in contemporary perspectives",
      "Desire for art that sparks dialogue"
    ],
    artRecommendations: [
      "Abstract expressionism by Kandinsky and Rothko",
      "Cubist works by Picasso and Braque",
      "Modernist landscapes and still lifes",
      "Contemporary interpretations of classic themes"
    ]
  },
  romantic: {
    title: "The Romantic Heart",
    description: "You connect deeply with emotion, storytelling, and intimate moments. You seek art that speaks to the soul and reflects the depth of human experience.",
    characteristics: [
      "Deep emotional connection to artwork",
      "Appreciation for narrative and storytelling",
      "Love of warm, intimate atmospheres",
      "Value for personal meaning and resonance"
    ],
    artRecommendations: [
      "Vermeer's intimate domestic scenes",
      "Turner's emotional landscapes",
      "Pre-Raphaelite romantic narratives",
      "Dutch Golden Age genre paintings"
    ]
  }
};

export default function ArtMasonsLanding() {
  const [currentArtIndex, setCurrentArtIndex] = useState(0);
  const [playTop100Random] = useState(false);
  const [isTop100AutoPlay, setIsTop100AutoPlay] = useState(true);
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [famousAutoPlay, setFamousAutoPlay] = useState(true);

  // --- QUIZ STATES ---
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<EssenceResult | null>(null);

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers, optionIndex];
    setAnswers(newAnswers);

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (finalAnswers: number[]) => {
    const scores = { classical: 0, impressionist: 0, modern: 0, romantic: 0 };
    
    finalAnswers.forEach(answer => {
      if (answer === 0) scores.classical++;
      else if (answer === 1) scores.impressionist++;
      else if (answer === 2) scores.modern++;
      else if (answer === 3) scores.romantic++;
    });

    const maxScore = Math.max(...Object.values(scores));
    const essenceType = Object.keys(scores).find(key => scores[key as keyof typeof scores] === maxScore) || 'classical';
    
    setResult(essenceResults[essenceType]);
    setShowResult(true);
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
    setResult(null);
  };

  // --- CALCULATOR STATES ---
  const [origW, setOrigW] = useState<number | ''>('');
  const [origH, setOrigH] = useState<number | ''>('');
  const [knownDim, setKnownDim] = useState<'width' | 'height'>('width');
  const [newKnown, setNewKnown] = useState<number | ''>('');

  const computedOtherDim = React.useMemo<number | ''>(() => {
    if (typeof origW !== 'number' || typeof origH !== 'number') return '';
    if (typeof newKnown !== 'number') return knownDim === 'width' ? origH : origW;

    const delta = knownDim === 'width' ? newKnown - origW : newKnown - origH;
    const other = knownDim === 'width' ? origH + delta : origW + delta;
    return Math.max(0, +other.toFixed(2));
  }, [origW, origH, knownDim, newKnown]);

  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const top100Order = React.useMemo(() => {
    const indices = Array.from({ length: TOP_100_ARTS.length }, (_, i) => i);
    return isClient ? shuffle(indices) : indices;
  }, [isClient]);

  const famousArtOrder = React.useMemo(() => {
    const indices = Array.from({ length: ART_OF_THE_DAY.length }, (_, i) => i);
    return isClient ? shuffle(indices) : indices;
  }, [isClient]);

  useEffect(() => {
    const testimonialTimer = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 3) % TESTIMONIALS_DATA.length);
    }, 6000);

    return () => {
      clearInterval(testimonialTimer);
    };
  }, []);

  // --- FUN FACTS: continuous rotation (client-only) ---
  useEffect(() => {
    if (!isClient) return;

    // rotate every 3 seconds
    const intervalId = window.setInterval(() => {
      setCurrentFactIndex((prev) => (prev + 1) % FUN_FACTS_DATA.length);
    }, 3000);

    return () => {
      window.clearInterval(intervalId as number);
    };
  }, [isClient]);

  const currentArray = playTop100Random ? TOP_100_ARTS : ART_OF_THE_DAY;
  const currentArt = playTop100Random
    ? TOP_100_ARTS[top100Order[currentArtIndex] ?? currentArtIndex]
    : ART_OF_THE_DAY[famousArtOrder[currentArtIndex] ?? currentArtIndex];

  // --- CENTRALIZED TRANSITION LOGIC ---
  const triggerArtTransition = useCallback((direction: 'next' | 'prev') => {
    if (direction === 'next') {
       setCurrentArtIndex((prev) => (prev + 1) % currentArray.length);
    } else {
       setCurrentArtIndex((prev) => (prev - 1 + currentArray.length) % currentArray.length);
    }
  }, [currentArray]);

  useEffect(() => {
    if (!isClient) return;
    if (playTop100Random) return;
    if (!famousAutoPlay) return;

    const interval = setInterval(() => {
      triggerArtTransition('next');
    }, 4500);

    return () => clearInterval(interval);
  }, [isClient, playTop100Random, famousAutoPlay, triggerArtTransition]);

  useEffect(() => {
    if (!playTop100Random || !isTop100AutoPlay) return;

    const interval = setInterval(() => {
       triggerArtTransition('next');
    }, 6000);

    return () => clearInterval(interval);
  }, [playTop100Random, isTop100AutoPlay, triggerArtTransition]);

  const currentTestimonials = [0, 1, 2].map((offset) => {
    const index = (testimonialIndex + offset) % TESTIMONIALS_DATA.length;
    return TESTIMONIALS_DATA[index];
  });

  const goPrevArt = () => {
    setIsTop100AutoPlay(false);
    setFamousAutoPlay(false);
    triggerArtTransition('prev');
  };

  const goNextArt = () => {
    setIsTop100AutoPlay(false);
    setFamousAutoPlay(false);
    triggerArtTransition('next');
  };

  return (
    <main
      className={`${playfair.variable} min-h-screen bg-white text-black font-serif lining-nums`}
    >
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
          will-change: scroll-position;
        }
        @supports (-webkit-touch-callout: none) {
          .hide-scrollbar {
            -webkit-transform: translate3d(0, 0, 0);
            transform: translate3d(0, 0, 0);
          }
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

      <PageTransition>
        {/* --- HERO SECTION --- */}
        <section className="flex flex-col md:flex-row w-full min-h-[600px] border-b border-gray-200 md:pr-8 lg:pr-16">
          <div className="w-full order-2 md:order-1 md:w-1/3 bg-white p-8 md:py-12 md:pl-12 md:pr-1 flex flex-col justify-center items-center">
            <div className="w-full max-w-[330px] flex flex-col items-center md:items-start mx-auto">
              <div className="mb-8 text-center md:text-left w-full">
                <h2 className="font-serif text-2xl md:text-3xl font-bold leading-tight mb-2 md:ml-4">
                  ART MASONS
                </h2>
                <h3 className="font-serif text-xl md:text-2xl text-[#800000]">
                  SEAL OF ASSURANCE
                </h3>
              </div>

              <ul className="space-y-4 font-serif text-lg text-gray-800 text-center md:text-left w-full">
                {ASSURANCE_POINTS.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="w-full order-1 md:order-2 md:w-2/3 relative bg-gray-50 group overflow-hidden h-[55vh] min-h-[400px] md:h-auto">
            {/* IMAGE CONTAINER */}
            <div className="absolute inset-0">
              <AnimatePresence>
                <motion.div
                  key={currentArtIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={currentArt.image}
                    alt={currentArt.title}
                    fill
                    className="object-contain z-10 drop-shadow-2xl"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="absolute bottom-0 w-full bg-white py-4 text-center z-20 border-t border-gray-200">
              <div className="flex items-center justify-center gap-3">
                <span className="font-serif text-xs uppercase tracking-[0.2em] block text-[#800000] mb-1">
                  FAMOUS ART
                </span>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentArtIndex}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="font-serif text-2xl text-black">
                    {currentArt?.title ?? ""}
                  </h2>
                  <p className="font-serif text-sm text-gray-600 mt-1">
                    {currentArt?.artist ?? ""}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                goPrevArt();
              }}
              aria-label="Previous art"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-40 p-2 bg-white/70 rounded-full hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft size={28} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                goNextArt();
              }}
              aria-label="Next art"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-40 p-2 bg-white/70 rounded-full hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight size={28} />
            </button>

            <Link
              href={isClient && currentArt.slug ? `/artworks/${currentArt.slug}` : "#"}
              className="absolute inset-0 z-30 cursor-pointer"
            >
              <div className="w-full h-full flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="text-center text-white p-6 border-2 border-white">
                  <p className="font-serif text-3xl italic mb-2">
                    {isClient ? currentArt.title : ""}
                  </p>
                  <p className="font-serif text-xs uppercase tracking-widest">
                    Click to View Details
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href={isClient && currentArt.slug ? `/artworks/${currentArt.slug}` : "#"}
              onClick={(e) => { e.stopPropagation(); }}
              aria-label="Buy now"
              className="absolute z-50 inline-flex items-center justify-center bg-[#800000] text-white w-20 h-20 md:w-24 md:h-24 rounded-full font-bold uppercase tracking-wider shadow-lg hover:bg-[#9a0000] transition-all duration-300 text-xs md:text-sm bottom-23 left-1/2 -translate-x-1/2 md:bottom-[105px] transform scale-100"
            >
              BUY NOW
            </Link>
          </div>
        </section>

        {/* --- POPULAR ART STRIP --- */}
        <PopularArtCarousel />

        {/* --- KNOW YOUR ESSENCE QUIZ --- */}
        <section className="container mx-auto px-4 py-20">
          <section 
            className="text-white p-8 md:p-12 rounded-lg shadow-xl"
            style={{
              background: '#800000',
              backgroundImage: 'linear-gradient(to bottom right, #800000, #600000)'
            }}
          >
            <div className="text-center mb-8">
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Know Your Art Style</h2>
              <p className="text-lg md:text-xl opacity-90">
                Discover your artistic personality and find the perfect masterpieces for your collection
              </p>
            </div>

            {!quizStarted && !showResult && (
              <div className="text-center">
                <p className="text-lg mb-8 max-w-2xl mx-auto">
                  Understanding your artistic essence helps us recommend paintings that truly resonate with your personality and aesthetic preferences. Take our quiz to discover which artistic movement speaks to your character.
                </p>
                <button
                  onClick={() => setQuizStarted(true)}
                  className="bg-white text-[#800000] px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg cursor-pointer"
                >
                  Start the Quiz
                </button>
              </div>
            )}

            {quizStarted && !showResult && (
              <div className="max-w-3xl mx-auto">
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm opacity-75">
                      Question {currentQuestion + 1} of {quizQuestions.length}
                    </span>
                    <span className="text-sm opacity-75">
                      {Math.round(((currentQuestion) / quizQuestions.length) * 100)}% Complete
                    </span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div
                      className="bg-white rounded-full h-2 transition-all duration-300"
                      style={{ width: `${((currentQuestion) / quizQuestions.length) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="bg-white text-gray-800 p-8 rounded-lg shadow-lg">
                  <h3 className="font-serif text-2xl font-bold mb-6 text-[#800000]">
                    {quizQuestions[currentQuestion].question}
                  </h3>
                  <div className="space-y-3">
                    {quizQuestions[currentQuestion].options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswer(index)}
                        className="w-full text-left p-4 border-2 border-gray-200 rounded-lg hover:border-[#800000] hover:bg-gray-50 transition-all font-serif text-lg cursor-pointer"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {showResult && result && (
              <div className="max-w-3xl mx-auto">
                <div className="bg-white text-gray-800 p-8 md:p-12 rounded-lg shadow-lg">
                  <div className="text-center mb-8">
                    <div className="inline-block p-4 bg-[#800000] text-white rounded-full mb-4 shadow-md">
                      <Sparkles size={40} />
                    </div>
                    <h3 className="font-serif text-3xl font-bold mb-4 text-[#800000]">
                      You are: {result.title}
                    </h3>
                    <p className="text-lg text-gray-700">
                      {result.description}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <div>
                      <h4 className="font-serif text-xl font-bold mb-4 text-[#800000]">Your Characteristics</h4>
                      <ul className="space-y-2">
                        {result.characteristics.map((char, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle size={20} className="text-[#800000] mt-1 flex-shrink-0" />
                            <span>{char}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-serif text-xl font-bold mb-4 text-[#800000]">Recommended Art</h4>
                      <ul className="space-y-2">
                        {result.artRecommendations.map((rec, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Palette size={20} className="text-[#800000] mt-1 flex-shrink-0" />
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="text-center space-y-4">
                    <Link
                      href="/artists-a-z"
                      className="inline-block bg-[#800000] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#600000] transition-colors shadow-md cursor-pointer"
                    >
                      Explore Our Collection
                    </Link>
                    <button
                      onClick={resetQuiz}
                      className="block mx-auto text-gray-600 hover:text-[#800000] transition-colors cursor-pointer"
                    >
                      Retake the Quiz
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
        </section>

        {/* --- FUN FACTS & IMAGE ASPECT CALCULATOR --- */}
        <section className="container mx-auto px-4 py-20 flex flex-col md:flex-row gap-12">
          {/* FUN FACTS */}
          <div className="w-full md:w-1/2">
            <div className="flex items-center justify-center gap-4 mb-6">
               <div className="h-px bg-[#800000] flex-grow"></div>
               <h3 className="font-serif text-3xl font-bold text-center uppercase text-black tracking-widest">
                 FUN FACTS
               </h3>
               <div className="h-px bg-[#800000] flex-grow"></div>
            </div>
            <div className="p-8 md:p-12 min-h-[300px] flex items-center justify-center text-center relative bg-white shadow-sm border-2 border-[#800000] rounded-lg">
              <div className="absolute top-2 left-4 md:top-8 md:left-8 text-[#800000] opacity-90 select-none">
                <span className="font-serif text-6xl md:text-8xl leading-none">“</span>
              </div>

              {isClient && (
                <AnimatePresence mode="wait">
                  <motion.p
                    key={currentFactIndex}
                    initial={{ opacity: 0, y: 6, scale: 0.995 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.995 }}
                    transition={{ duration: 0.4 }}
                    className="font-serif text-xl md:text-3xl leading-relaxed text-gray-700 relative z-10 px-2 md:px-8"
                  >
                    {FUN_FACTS_DATA[currentFactIndex]}
                  </motion.p>
                </AnimatePresence>
              )}

              <div className="absolute bottom-2 right-4 md:bottom-8 md:right-8 text-[#800000] opacity-90 select-none">
                <span className="font-serif text-6xl md:text-8xl leading-none">”</span>
              </div>
            </div>

            {/* Logos below Fun Facts */}
            <div className="mt-12">
              <div className="flex items-center justify-center gap-4 mb-6">
                 <div className="h-px bg-[#800000] flex-grow"></div>
                 <h3 className="font-serif text-3xl font-bold text-center uppercase text-black tracking-widest">
                   SEALS OF EXCELLENCE
                 </h3>
                 <div className="h-px bg-[#800000] flex-grow"></div>
              </div>
              <div className="p-8 bg-white border-2 border-[#800000] rounded-lg shadow-sm flex flex-col items-center gap-6">
                {/* First Row */}
                <div className="w-full flex justify-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative w-32 h-32 sm:w-44 sm:h-44 md:w-56 md:h-56">
                      <Image
                        src="/image/icons/logo_1.png"
                        alt="Logo 1"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <p className="font-serif text-lg sm:text-xl font-bold text-[#800000] text-center">
                      Hand Painted - Museum Quality
                    </p>
                  </div>
                </div>
                {/* Second Row */}
                <div className="w-full flex justify-center gap-8 sm:gap-12 items-start">
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative w-32 h-32 sm:w-44 sm:h-44 md:w-56 md:h-56">
                      <Image
                        src="/image/icons/logo_5.png"
                        alt="Logo 5"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <p className="font-serif text-base sm:text-lg font-bold text-[#800000] text-center max-w-[150px] sm:max-w-none">
                      Free Worldwide Shipping
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative w-32 h-32 sm:w-44 sm:h-44 md:w-56 md:h-56">
                      <Image
                        src="/image/icons/logo_6.png"
                        alt="Logo 6"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <p className="font-serif text-base sm:text-lg font-bold text-[#800000] text-center max-w-[150px] sm:max-w-none">
                      100% Money Guarantee
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- IMAGE ASPECT CALCULATOR --- */}
          <div className="w-full md:w-1/2 flex flex-col">
            <div className="flex items-center justify-center gap-4 mb-6">
               <div className="h-px bg-[#800000] flex-grow"></div>
               <h3 className="font-serif text-3xl font-bold text-center uppercase text-black tracking-widest">
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
                    <p className="text-base text-black">Measure your wall to decide how large you want the piece to be.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="bg-[#800000] text-white text-sm font-bold px-3 py-1 rounded-full shrink-0 mt-0.5">STEP 3</span>
                    <p className="text-base text-black">Enter either your new Height OR Width.</p>
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
                  Enter either the new desired Height <span className="text-[#800000] font-extrabold">OR</span> Width
                </label>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
                   <label className="flex items-center gap-2 cursor-pointer group">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${knownDim === 'height' ? 'border-[#800000]' : 'border-gray-400'}`}>
                        {knownDim === 'height' && <div className="w-2.5 h-2.5 rounded-full bg-[#800000]" />}
                      </div>
                      <input type="radio" name="known" checked={knownDim === 'height'} onChange={() => setKnownDim('height')} className="hidden" />
                      <span className="text-base font-medium text-black group-hover:text-[#800000] transition-colors">New Height</span>
                   </label>

                   <span className="bg-[#800000] text-white text-sm font-bold px-3 py-1 rounded-full shadow-sm">OR</span>

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
        </section>

        {/* --- TESTIMONIALS --- */}
        <section className="bg-gray-50 py-20">
          <div className="container mx-auto px-4">
            <h3 className="font-serif text-3xl text-center mb-12">
              Collector Testimonials
            </h3>

            <div className="min-h-[250px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={testimonialIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                  {currentTestimonials.map((text, i) => (
                    <div
                      key={i}
                      className="bg-white p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex text-[#800000] mb-4">★★★★★</div>
                        <p className="font-serif italic text-gray-700">
                          “{text}”
                        </p>
                      </div>
                      <p className="mt-4 font-serif text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Verified Collector
                      </p>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </section>
      </PageTransition>
    </main>
  );
}