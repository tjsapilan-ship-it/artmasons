'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, CheckCircle, Palette } from 'lucide-react';

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

export default function ArtStyleQuiz() {
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
    <div className="bg-[#800000] text-white p-8 md:p-12 rounded-lg shadow-xl relative overflow-hidden" 
         style={{ backgroundImage: 'linear-gradient(to bottom right, #800000, #600000)' }}>
      <div className="relative z-10">
        <div className="text-center mb-8">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Know Your Art Style</h2>
          {!showResult && 
            <p className="text-lg md:text-xl opacity-90">
              Discover your artistic personality and find the perfect masterpieces for your collection
            </p>
          }
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
                    className="w-full text-left p-4 border-2 border-gray-200 rounded-lg hover:border-[#800000] hover:bg-gray-50 transition-all font-serif text-lg cursor-pointer text-gray-800"
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
      </div>
    </div>
  );
}
