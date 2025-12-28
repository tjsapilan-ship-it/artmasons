"use client";

import React, { useState, useEffect, useRef, useSyncExternalStore, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Playfair_Display } from "next/font/google";
import Link from "next/link";
import PageTransition from "./components/PageTransition";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ARTWORKS, getArtworkSlug } from "../data/artworks";

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
  "Art Masons delivered a masterpiece far beyond what I imagined.",
  "The quality from Art Masons is simply unmatched.",
  "Everyone who visits my home compliments my Art Masons painting.",
  "Art Masons truly sets the standard for museum-quality work.",
  "I’ve never seen replicas done this perfectly — Art Masons is elite.",
  "The attention to detail from Art Masons is extraordinary.",
  "Art Masons turned my space into a gallery.",
  "The colors from Art Masons feel alive — absolutely stunning.",
  "My home finally feels complete thanks to Art Masons.",
  "Art Masons delivered flawless craftsmanship.",
  "I trust Art Masons with every commission — they never disappoint.",
  "Art Masons brings old masterpieces back to life.",
  "The texture and realism from Art Masons are unbelievable.",
  "Art Masons exceeded all my expectations.",
  "I feel like I own a museum piece — thank you, Art Masons.",
  "Art Masons has the very best artists I’ve ever worked with.",
  "Every stroke shows the passion behind Art Masons.",
  "Brilliant work — Art Masons truly understands fine art.",
  "Art Masons delivered my painting in perfect condition and perfect quality.",
  "You can immediately see the expertise at Art Masons.",
  "My Art Masons piece is now the centerpiece of my living room.",
  "Exceptional craftsmanship — Art Masons is world class.",
  "The painting looks identical to the original reference — Art Masons nailed it.",
  "If you want premium art, Art Masons is the only choice.",
  "Art Masons created a piece that feels alive with emotion.",
  "I trust Art Masons because their quality is consistent and outstanding.",
  "My Art Masons painting has transformed the entire room.",
  "The realism is so powerful — Art Masons are true masters.",
  "Art Masons made the entire process smooth and professional.",
  "Every detail is perfect. Art Masons is the real deal.",
  "The texture, color, and depth from Art Masons is incredible.",
  "Art Masons delivered exactly what I envisioned and more.",
  "A truly luxurious experience — Art Masons understands art lovers.",
  "I own three pieces from Art Masons and each one is perfection.",
  "The quality from Art Masons rivals any gallery I’ve visited.",
  "Art Masons captured the spirit of the original painting beautifully.",
  "The craftsmanship at Art Masons is second to none.",
  "I am blown away by the accuracy of my Art Masons replica.",
  "Professional, talented, and reliable — Art Masons is exceptional.",
  "My Art Masons artwork feels like a treasure I will keep forever.",
  "The gold-leaf work from Art Masons is absolutely exquisite.",
  "Art Masons makes art collectors out of everyone.",
  "From communication to delivery, Art Masons was perfect.",
  "This is the best replica art I’ve ever purchased — thank you, Art Masons.",
  "Every Art Masons painting feels rich, elegant, and timeless.",
  "I can’t stop staring at my Art Masons piece — it’s mesmerizing.",
  "Art Masons delivers gallery-level quality at an incredible standard.",
  "I instantly knew my Art Masons artwork was something special.",
  "Art Masons brings luxury and authenticity together beautifully.",
];

const POPULAR_ARTISTS = [
  { name: "MONET", image: "/popular-art/monet.jpg" },
  { name: "KLIMT", image: "/popular-art/klimt.jpg" },
  { name: "MATISSE", image: "/popular-art/matisse.jpg" },
  { name: "VAN GOGH", image: "/popular-art/gogh.webp" },
  { name: "PICASSO", image: "/popular-art/picasso.jpg" },
  { name: "DA VINCI", image: "/popular-art/davinci.jpg" },
  { name: "STILL LIFES", image: "/popular-art/still-life.jpg" },
  { name: "LANDSCAPES", image: "/popular-art/landscape.jpg" },
  { name: "PORTRAITS", image: "/popular-art/portrait.jpg" },
];

const generateSlug = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();

const ART_OF_THE_DAY = [
  { title: "Mona Lisa", artist: "Leonardo da Vinci", image: "/image/famous-art/mona_lisa.webp" },
  { title: "Starry Night", artist: "Vincent van Gogh", image: "/image/famous-art/starry_night.webp" },
  { title: "The Scream", artist: "Edvard Munch", image: "/image/famous-art/the_scream.webp" },
  { title: "Girl With A Pearl Earring", artist: "Johannes Vermeer", image: "/image/famous-art/pearl_earing.jpg" },
  { title: "The Kiss", artist: "Gustav Klimt", image: "/image/famous-art/the_kiss.jpg" },
  { title: "The Birth of Venus", artist: "Sandro Botticelli", image: "/image/famous-art/primavera.webp" },
  { title: "Impression Sunrise", artist: "Claude Monet", image: "/image/famous-art/impression_sunrise.jpg" },
  { title: "Water Lilies", artist: "Claude Monet", image: "/image/famous-art/water_lilies.jpg" },
  { title: "The Last Supper", artist: "Leonardo da Vinci", image: "/image/famous-art/calling_matthew.jpg" },
  { title: "The Creation of Adam", artist: "Michelangelo", image: "/image/famous-art/sistine_madonna.jpg" },
  { title: "Guernica", artist: "Pablo Picasso", image: "/image/famous-art/picasso054.jpg" },
  { title: "American Gothic", artist: "Grant Wood", image: "/image/famous-art/horse_head.jpg" },
  { title: "The Persistence of Memory", artist: "Salvador Dalí", image: "/image/famous-art/the_dream.jpg" },
  { title: "The Night Watch", artist: "Rembrandt", image: "/image/famous-art/wanderer_mist.jpg" },
  { title: "Las Meninas", artist: "Diego Velázquez", image: "/image/famous-art/lady_godiva.jpg" },
  { title: "The Great Wave off Kanagawa", artist: "Katsushika Hokusai", image: "/image/famous-art/sea_gaiilee.jpg" },
  { title: "Sunflowers", artist: "Vincent van Gogh", image: "/image/famous-art/fourteen_sunflowers.webp" },
  { title: "Irises", artist: "Vincent van Gogh", image: "/image/famous-art/irises.jpg" },
  { title: "Café Terrace at Night", artist: "Vincent van Gogh", image: "/image/famous-art/cafe_terrace.webp" },
  { title: "Wheat Field with Crows", artist: "Vincent van Gogh", image: "/image/famous-art/wheat_field.webp" },
  { title: "Portrait of Joseph Roulin", artist: "Vincent van Gogh", image: "/image/famous-art/joseph_roulin.jpg" },
  { title: "A Pair of Shoes", artist: "Vincent van Gogh", image: "/image/famous-art/shoes.jpg" },
  { title: "Vase with Irises", artist: "Vincent van Gogh", image: "/image/famous-art/vase_irises.jpg" },
  { title: "Vase with Roses", artist: "Vincent van Gogh", image: "/image/famous-art/vase_roses.jpg" },
  { title: "The Dance", artist: "Henri Matisse", image: "/image/famous-art/the_dance.jpg" },
  { title: "Red Room (Harmony in Red)", artist: "Henri Matisse", image: "/image/famous-art/red_room.jpg" },
  { title: "Goldfish", artist: "Henri Matisse", image: "/image/famous-art/goldfish.jpg" },
  { title: "The Red Nude", artist: "Henri Matisse", image: "/image/famous-art/red_nude.jpg" },
  { title: "Open Window", artist: "Henri Matisse", image: "/image/famous-art/open_window.jpg" },
  { title: "The Tree of Life", artist: "Gustav Klimt", image: "/image/famous-art/tree_life.jpg" },
  { title: "Hope II", artist: "Gustav Klimt", image: "/image/famous-art/hope_II.jpg" },
  { title: "Music I", artist: "Gustav Klimt", image: "/image/famous-art/music_I.jpg" },
  { title: "The Dancer", artist: "Gustav Klimt", image: "/image/famous-art/the_dancer_1.jpg" },
  { title: "Composition VIII", artist: "Wassily Kandinsky", image: "/image/famous-art/composition_8.jpg" },
  { title: "The Garden of Earthly Delights", artist: "Hieronymus Bosch", image: "/image/famous-art/earthly_delights.jpg" },
  { title: "Luncheon on the Grass", artist: "Édouard Manet", image: "/image/famous-art/lunch_grass.jpg" },
  { title: "A Bar at the Folies-Bergère", artist: "Édouard Manet", image: "/image/famous-art/folies_begere.jpg" },
  { title: "The Swing", artist: "Jean-Honoré Fragonard", image: "/image/famous-art/the_swing.webp" },
  { title: "Bal du Moulin de la Galette", artist: "Pierre-Auguste Renoir", image: "/image/famous-art/moulin_galette.jpg" },
  { title: "Two Sisters (On the Terrace)", artist: "Pierre-Auguste Renoir", image: "/image/famous-art/two_sisters.jpg" },
  { title: "The Skiff", artist: "Pierre-Auguste Renoir", image: "/image/famous-art/the_skiff.jpg" },
  { title: "Madame Monet and Her Son", artist: "Pierre-Auguste Renoir", image: "/image/famous-art/madame_monet.webp" },
  { title: "Haystacks", artist: "Claude Monet", image: "/image/famous-art/hay_stacks.jpg" },
  { title: "Water Lily Pond", artist: "Claude Monet", image: "/image/famous-art/water_lily.webp" },
  { title: "The Grand Canal Venice", artist: "Claude Monet", image: "/image/famous-art/grand_canal.jpg" },
  { title: "Flaming June", artist: "Frederic Leighton", image: "/image/famous-art/flaming_june.jpg" },
  { title: "The Lady of Shalott", artist: "John William Waterhouse", image: "/image/famous-art/lady_shalotte.webp" },
  { title: "Lady Godiva", artist: "John Collier", image: "/image/famous-art/lady_godiva.jpg" },
  { title: "Wanderer Above the Sea of Fog", artist: "Caspar David Friedrich", image: "/image/famous-art/wanderer_mist.jpg" },
  { title: "The Sleeping Gypsy", artist: "Henri Rousseau", image: "/image/famous-art/sleeping_gypsy.jpg" },
  { title: "The Dream", artist: "Henri Rousseau", image: "/image/famous-art/the_dream.jpg" },
  { title: "The Hunt in the Forest", artist: "Claude Monet", image: "/image/famous-art/the_hunt.jpg" },
  { title: "Madame X", artist: "John Singer Sargent", image: "/image/famous-art/madame_x.jpg" },
  { title: "The Angelus", artist: "Jean-François Millet", image: "/image/famous-art/the_angelus.jpg" },
  { title: "Napoleon Crossing the Alps", artist: "Jacques-Louis David", image: "/image/famous-art/napoleon_crossing.jpg" },
  { title: "View of Toledo", artist: "El Greco", image: "/image/famous-art/view_toledo.jpg" },
  { title: "Storm on the Sea of Galilee", artist: "Rembrandt", image: "/image/famous-art/sea_gaiilee.jpg" },
  { title: "The Calling of Saint Matthew", artist: "Caravaggio", image: "/image/famous-art/calling_matthew.jpg" },
  { title: "Nude Descending a Staircase", artist: "Marcel Duchamp", image: "/image/famous-art/nude_descending.jpg" },
  { title: "Dancers in Blue", artist: "Edgar Degas", image: "/image/famous-art/dancers_blue.jpg" },
  { title: "Crouching Woman", artist: "Egon Schiele", image: "/image/famous-art/crouching_woman.jpg" },
].map((item) => {
  const byImage = ARTWORKS.find((a) => a.image === item.image);
  const byTitleArtist =
    byImage ||
    ARTWORKS.find(
      (a) =>
        (a.title ?? "").toLowerCase() === item.title.toLowerCase() &&
        (a.artist ?? "").toLowerCase() === item.artist.toLowerCase(),
    );

  return {
    ...item,
    slug: byTitleArtist ? getArtworkSlug(byTitleArtist) : undefined,
  };
});

const TOP_100_ARTS = Array.from({ length: 100 }).map((_, i) => ({
  title: `Artwork #${i + 1}`,
  artist: `Artist #${i + 1}`,
  image: `/image/placeholder-${(i % 10) + 1}.webp`,
  slug: `artwork-${i + 1}`,
}));

export default function ArtMasonsLanding() {
  const [currentArtIndex, setCurrentArtIndex] = useState(0);
  const [playTop100Random] = useState(false);
  const [isTop100AutoPlay, setIsTop100AutoPlay] = useState(true);
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [famousAutoPlay, setFamousAutoPlay] = useState(true);

  // --- CALCULATOR STATES ---
  const [origW, setOrigW] = useState<number | ''>(90);
  const [origH, setOrigH] = useState<number | ''>(60);
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

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const extendedArtists = [...POPULAR_ARTISTS, ...POPULAR_ARTISTS];

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
    : ART_OF_THE_DAY[currentArtIndex];

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

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    const container = scrollContainerRef.current;
    if (!container) return;

    let animationFrameId: number | null = null;
    let lastTime = 0;
    const speed = 40;
    let isRunning = true;

    const step = (time: number) => {
      if (!isRunning) return;
      
      if (document.hidden || isCarouselPaused) {
        lastTime = time;
        animationFrameId = requestAnimationFrame(step);
        return;
      }

      if (!lastTime) lastTime = time;
      const delta = (time - lastTime) / 1000;
      const deltaPx = speed * delta;

      if (container.scrollLeft >= container.scrollWidth / 2) {
        container.scrollLeft = 0;
      } else {
        container.scrollLeft += deltaPx;
      }

      lastTime = time;
      animationFrameId = requestAnimationFrame(step);
    };

    const handleVisibility = () => {
      if (!document.hidden && isRunning) {
        lastTime = performance.now();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    
    // Ensure animation starts with a slight delay for Safari compatibility
    const startAnimation = () => {
      lastTime = performance.now();
      animationFrameId = requestAnimationFrame(step);
    };
    
    // Use setTimeout to ensure DOM is ready, especially for Safari/macOS
    const timeoutId = setTimeout(startAnimation, 100);

    return () => {
      isRunning = false;
      clearTimeout(timeoutId);
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [isCarouselPaused]);

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

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
          <div className="w-full md:w-1/3 bg-white p-8 md:py-12 md:pl-12 md:pr-1 flex flex-col justify-center items-center">
            <div className="w-full max-w-[330px] text-left mx-auto">
              <div className="mb-8">
                <h2 className="font-serif text-2xl md:text-3xl font-bold leading-tight mb-2 ml-2 md:ml-4">
                  ART MASONS
                </h2>
                <h3 className="font-serif text-xl md:text-2xl text-[#800000]">
                  SEAL OF ASSURANCE
                </h3>
              </div>

              <ul className="space-y-4 font-serif text-lg text-gray-800">
                {ASSURANCE_POINTS.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="w-full md:w-2/3 relative bg-gray-50 group overflow-hidden">
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
              className="absolute left-4 top-1/2 -translate-y-1/2 z-40 p-2 bg-white/70 rounded-full hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
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
              className="absolute right-4 top-1/2 -translate-y-1/2 z-40 p-2 bg-white/70 rounded-full hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
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
                    {isClient ? currentArt.artist : ""}
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
              className="absolute z-50 inline-flex items-center justify-center bg-[#800000] text-white w-24 h-24 rounded-full font-bold uppercase tracking-wider shadow-lg hover:bg-[#9a0000] transition-all duration-300 text-sm bottom-24 right-6 md:left-1/2 md:bottom-[105px] md:transform md:-translate-x-1/2 opacity-100 scale-100"
            >
              BUY NOW
            </Link>
          </div>
        </section>

        {/* --- POPULAR ART STRIP --- */}
        <section className="bg-gray-50 py-8 border-b border-gray-200">
          <div className="container mx-auto px-4">
            <h3 className="font-serif text-2xl font-bold mb-6 text-center uppercase">
              POPULAR ART
            </h3>
            <div className="relative w-full">
              <button
                onClick={handleScrollLeft}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 transition-colors hover:text-[#800000]"
                onMouseEnter={() => setIsCarouselPaused(true)}
                onMouseLeave={() => setIsCarouselPaused(false)}
              >
                <ChevronLeft size={32} />
              </button>

              <div
                ref={scrollContainerRef}
                className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar w-full"
                onMouseEnter={() => setIsCarouselPaused(true)}
                onMouseLeave={() => setIsCarouselPaused(false)}
                onTouchStart={() => setIsCarouselPaused(true)}
                onTouchEnd={() => setIsCarouselPaused(false)}
              >
                {extendedArtists.map((artist, i) => (
                  <Link
                    key={`${artist.name}-${i}`}
                    href={`/popular-art/${generateSlug(artist.name)}`}
                    className="flex-shrink-0 w-40 h-40 relative rounded-lg overflow-hidden group"
                    onMouseEnter={() => setIsCarouselPaused(true)}
                    onMouseLeave={() => setIsCarouselPaused(false)}
                  >
                    <Image
                      src={artist.image}
                      alt={artist.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 pointer-events-none flex flex-col justify-end pb-3">
                      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <span className="relative z-10 text-white font-serif font-bold tracking-wider text-sm text-center">
                        {artist.name}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              <button
                onClick={handleScrollRight}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 transition-colors hover:text-[#800000]"
                onMouseEnter={() => setIsCarouselPaused(true)}
                onMouseLeave={() => setIsCarouselPaused(false)}
              >
                <ChevronRight size={32} />
              </button>
            </div>
          </div>
        </section>

        {/* --- FUN FACTS & IMAGE ASPECT CALCULATOR --- */}
        <section className="container mx-auto px-4 py-20 flex flex-col md:flex-row gap-12">
          {/* FUN FACTS */}
          <div className="w-full md:w-1/2">
            <h3 className="font-serif text-3xl font-bold mb-6 text-center md:text-left uppercase tracking-widest">
              FUN FACTS
            </h3>
            <div className="p-8 md:p-12 min-h-[300px] flex items-center justify-center text-center relative bg-white shadow-sm border-2 border-[#800000] rounded-lg">
              <div
                className="absolute left-6 text-[#800000] opacity-90"
                style={{ top: '30%', transform: 'translateY(-50%)' }}
              >
                <span className="font-serif text-6xl leading-none">“</span>
              </div>

              {isClient && (
                <AnimatePresence mode="wait">
                  <motion.p
                    key={currentFactIndex}
                    initial={{ opacity: 0, y: 6, scale: 0.995 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.995 }}
                    transition={{ duration: 0.4 }}
                    className="font-serif text-2xl md:text-3xl leading-relaxed text-gray-700 -mt-3"
                  >
                    {FUN_FACTS_DATA[currentFactIndex]}
                  </motion.p>
                </AnimatePresence>
              )}

              <div
                className="absolute right-6 text-[#800000] opacity-90"
                style={{ top: '70%', transform: 'translateY(-50%)' }}
              >
                <span className="font-serif text-6xl leading-none">”</span>
              </div>
            </div>

            {/* Logos below Fun Facts */}
            <div className="mt-12">
              <h3 className="font-serif text-3xl font-bold mb-6 text-center md:text-left uppercase tracking-widest">
                ART MASON&apos;S QUALITY PROMISE
              </h3>
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

              <div className="flex gap-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="w-1/2">
                  <label className="text-base font-bold text-black block mb-2">Enter Original Height</label>
                  <input
                    type="number"
                    value={origH}
                    onChange={(e) => setOrigH(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded focus:border-[#800000] outline-none bg-white text-black transition-colors"
                    placeholder="60"
                  />
                </div>
                <div className="w-1/2">
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

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <label className="text-base font-bold text-black block mb-4">
                  Enter either the new desired Height <span className="text-[#800000] font-extrabold">OR</span> Width
                </label>
                
                <div className="flex items-center gap-4 mb-4">
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

                <div className="flex items-center border border-gray-200 rounded bg-white overflow-hidden shadow-sm">
                   <div className="px-4 py-3 text-black text-base border-r border-gray-200 bg-gray-50 min-w-[180px] font-medium">
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