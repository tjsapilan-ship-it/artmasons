'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Playfair_Display } from 'next/font/google';
import { Heart, Palette, Users, Sparkles, CheckCircle } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });

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

export default function AboutUsPage() {
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
          <Breadcrumbs items={[{ label: 'About Us', href: '/about-us' }]} />
        </div>

        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-12 text-[#800000]">About Us</h1>

        <div className="font-serif space-y-16 text-gray-700 leading-relaxed">
          
          {/* Our Philosophy */}
          <section className="bg-white/60 p-6 rounded-lg backdrop-blur-sm border border-2 border-[#800000]">
            <div className="flex items-center gap-3 mb-6">
              <Heart className="text-[#800000]" size={32} />
              <h2 className="font-serif text-3xl font-bold text-[#800000]">Our Philosophy</h2>
            </div>
            
            <div className="space-y-6">
              <p className="text-lg">
                At ART MASONS, we believe that art is not merely decoration—it is a profound expression of human culture, emotion, and history. Each brushstroke carries meaning, each composition tells a story, and each masterpiece reflects the genius of its creator.
              </p>
              
              <p className="text-lg">
                Our philosophy is rooted in three fundamental principles that guide everything we do:
              </p>

              <div className="grid md:grid-cols-3 gap-8 mt-8">
                <div className="bg-white shadow-sm p-6 rounded-lg hover:shadow-md transition-shadow border-2 border-[#800000]">
                  <div className="flex items-center gap-3 mb-4">
                    <Palette className="text-[#800000]" size={28} />
                    <h3 className="font-serif text-xl font-bold text-gray-800">Authenticity</h3>
                  </div>
                  <p className="text-base">
                    We commit to creating reproductions that honor the original masterpieces with unwavering fidelity. Every painting is meticulously hand-painted by master artists who understand the techniques, materials, and vision of the original creators.
                  </p>
                </div>

                <div className="bg-white shadow-sm p-6 rounded-lg hover:shadow-md transition-shadow border-2 border-[#800000]">
                  <div className="flex items-center gap-3 mb-4">
                    <Users className="text-[#800000]" size={28} />
                    <h3 className="font-serif text-xl font-bold text-gray-800">Craftsmanship</h3>
                  </div>
                  <p className="text-base">
                    We are a small, highly specialized team of artists, academically trained according to European standards. We never compromise on detail, technique, or materials. Museum-quality excellence is not just our standard—it&apos;s our promise.
                  </p>
                </div>

                <div className="bg-white shadow-sm p-6 rounded-lg hover:shadow-md transition-shadow border-2 border-[#800000]">
                  <div className="flex items-center gap-3 mb-4">
                    <Sparkles className="text-[#800000]" size={28} />
                    <h3 className="font-serif text-xl font-bold text-gray-800">Accessibility</h3>
                  </div>
                  <p className="text-base">
                    Great art should not be confined to museums and private collections. We believe everyone deserves to experience the beauty and inspiration of masterpieces in their own homes, offices, and spaces.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Our Story */}
          <section className="bg-white shadow-sm p-8 rounded-lg border-t-4 border-[#800000]">
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

          {/* Know Your Essence Quiz */}
          <section 
            className="text-white p-8 md:p-12 rounded-lg shadow-xl"
            style={{
              background: '#800000',
              backgroundImage: 'linear-gradient(to bottom right, #800000, #600000)'
            }}
          >
            <div className="text-center mb-8">
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Know Your Essence</h2>
              <p className="text-lg md:text-xl opacity-90">
                Discover your artistic personality and find the perfect masterpieces for your collection
              </p>
            </div>

            {!quizStarted && !showResult && (
              <div className="text-center">
                <p className="text-lg mb-8 max-w-2xl mx-auto">
                  Understanding your artistic essence helps us recommend paintings that truly resonate with your personality and aesthetic preferences. Take our quick 5-question quiz to discover which artistic movement speaks to your soul.
                </p>
                <button
                  onClick={() => setQuizStarted(true)}
                  className="bg-white text-[#800000] px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
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
                        className="w-full text-left p-4 border-2 border-gray-200 rounded-lg hover:border-[#800000] hover:bg-gray-50 transition-all font-serif text-lg"
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
                      className="inline-block bg-[#800000] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#600000] transition-colors shadow-md"
                    >
                      Explore Our Collection
                    </Link>
                    <button
                      onClick={resetQuiz}
                      className="block mx-auto text-gray-600 hover:text-[#800000] transition-colors"
                    >
                      Retake the Quiz
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Contact CTA */}
          <section className="text-center bg-white shadow-sm p-8 rounded-lg border-2 border-[#800000]">
            <h2 className="font-serif text-3xl font-bold mb-4 text-[#800000]">Let&apos;s Create Something Beautiful Together</h2>
            <p className="text-lg mb-6 max-w-2xl mx-auto">
              Whether you have questions about our process, need help selecting the perfect piece, or want to discuss a custom commission, we&apos;re here to help.
            </p>
            <div className="space-y-2">
              <p className="text-lg flex items-center justify-center gap-2">
                <strong>Email:</strong> <a href="mailto:info@artmasons.com" className="text-[#800000] hover:underline">info@artmasons.com</a>
              </p>
              <p className="text-lg flex items-center justify-center gap-2">
                <strong>WhatsApp:</strong> 
                <a href="https://wa.me/971561704788" target="_blank" rel="noopener noreferrer" className="text-[#800000] hover:underline inline-flex items-center gap-1">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
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