/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, HelpCircle, ArrowRight, RefreshCcw, CheckCircle2, XCircle, BrainCircuit, ShieldCheck, Info, ChevronRight } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export default function CivicQuiz() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false);

  const fetchQuestions = async () => {
    setIsLoading(true);
    setQuestions([]);
    setCurrentIndex(0);
    setScore(0);
    setIsFinished(false);

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("API Key missing");
      
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "Generate 5 challenging but educational multiple-choice questions about general election processes, voting rights, and civic duty.",
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctAnswer: { type: Type.INTEGER, description: "0-indexed index of correct option" },
                explanation: { type: Type.STRING }
              },
              required: ["question", "options", "correctAnswer", "explanation"]
            }
          }
        }
      });

      const data = JSON.parse(response.text);
      setQuestions(data);
    } catch (error) {
      console.error("Quiz generation failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleOptionSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    if (index === questions[currentIndex].correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-6">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-100 animate-pulse">
          <BrainCircuit size={32} />
        </div>
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest animate-bounce italic">Generating Intelligence Challenge...</p>
      </div>
    );
  }

  if (isFinished) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl mx-auto bg-white p-12 rounded-[3.5rem] border border-slate-200 shadow-2xl shadow-slate-200/50 text-center space-y-8"
      >
        <div className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center text-white mx-auto shadow-xl shadow-blue-100 rotate-6">
          <Trophy size={48} />
        </div>
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic mb-2">Performance Analysis</h2>
          <p className="text-slate-500 font-bold">Civic IQ Assessment: {Math.round((score / questions.length) * 100)}% Proficiency</p>
        </div>
        <div className="py-8 bg-slate-50 rounded-[2rem] border border-slate-100">
          <p className="text-6xl font-black text-blue-600">{score} / {questions.length}</p>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">Verified Accomplishment</p>
        </div>
        <button 
          onClick={fetchQuestions}
          className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all uppercase tracking-widest text-sm"
        >
          Initialize New Assessment
        </button>
      </motion.div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-100 rotate-3">
             <ShieldCheck size={16} />
           </div>
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Intelligence Sector {currentIndex + 1}</span>
        </div>
        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100 shadow-sm">
          Challenge Progress: {Math.round(((currentIndex + 1) / questions.length) * 100)}%
        </span>
      </div>

      <motion.div 
        key={currentIndex}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-xl shadow-slate-200/50 space-y-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 blur-3xl pointer-events-none" />
        <h3 className="text-2xl font-black text-slate-900 leading-tight italic uppercase tracking-tight relative z-10">{currentQ.question}</h3>
        
        <div className="space-y-3 relative z-10">
          {currentQ.options.map((option, idx) => {
            let state = 'default';
            if (isAnswered) {
              if (idx === currentQ.correctAnswer) state = 'correct';
              else if (idx === selectedOption) state = 'incorrect';
              else state = 'muted';
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionSelect(idx)}
                className={`
                  w-full text-left p-5 rounded-2xl border-2 transition-all duration-300 font-bold relative group
                  ${state === 'default' ? 'border-slate-100 bg-slate-50/50 text-slate-600 hover:border-blue-500 hover:bg-white hover:shadow-lg hover:shadow-blue-50' : ''}
                  ${state === 'correct' ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-lg shadow-emerald-100' : ''}
                  ${state === 'incorrect' ? 'border-rose-500 bg-rose-50 text-rose-700 shadow-lg shadow-rose-100' : ''}
                  ${state === 'muted' ? 'border-slate-50 bg-slate-50 opacity-40 grayscale text-slate-300 scale-98' : ''}
                `}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black uppercase transition-all ${
                    state === 'default' ? 'bg-white border border-slate-200 text-slate-400 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600' : 
                    state === 'correct' ? 'bg-emerald-500 text-white shadow-lg' : 
                    state === 'incorrect' ? 'bg-rose-500 text-white shadow-lg' : 
                    'bg-slate-100 text-slate-400'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span>{option}</span>
                </div>
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex gap-4 items-start shadow-inner"
          >
            <Info size={20} className="text-blue-600 flex-shrink-0 mt-1" />
            <p className="text-sm font-bold text-slate-600 leading-relaxed italic">{currentQ.explanation}</p>
          </motion.div>
        )}

        {isAnswered && (
          <button 
            onClick={handleNext}
            className="w-full bg-slate-900 text-white font-black py-4 rounded-xl shadow-xl hover:bg-black transition-all flex items-center justify-center gap-2 group uppercase tracking-[0.2em] text-xs"
          >
            Advance to Next Phase
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </motion.div>
    </div>
  );
}
