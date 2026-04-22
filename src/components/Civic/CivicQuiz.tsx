/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, HelpCircle, ArrowRight, RefreshCcw, CheckCircle2, XCircle } from 'lucide-react';
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
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        >
          <RefreshCcw size={40} className="text-indigo-600" />
        </motion.div>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Generating AI Quiz...</p>
      </div>
    );
  }

  if (isFinished) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto bg-white p-8 rounded-3xl shadow-xl border border-slate-200 text-center"
      >
        <div className="w-20 h-20 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Trophy size={40} className="text-indigo-600" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Quiz Complete!</h2>
        <p className="text-slate-600 mb-8">You scored <span className="text-indigo-600 font-bold text-2xl">{score}</span> out of {questions.length}</p>
        
        <div className="space-y-3">
          <button 
            onClick={fetchQuestions}
            className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
          >
            <RefreshCcw size={18} /> Take New Quiz
          </button>
        </div>
      </motion.div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
            <HelpCircle size={20} />
          </div>
          <div>
            <h2 className="font-bold text-slate-900">Civic Challenge</h2>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Question {currentIndex + 1} of {questions.length}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Current Score</p>
          <p className="text-xl font-bold text-indigo-600">{score}</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200"
        >
          <h3 className="text-xl font-bold text-slate-900 mb-8 leading-relaxed">
            {currentQuestion.question}
          </h3>

          <div className="space-y-4 mb-8">
            {currentQuestion.options.map((option, idx) => {
              const isCorrect = idx === currentQuestion.correctAnswer;
              const isSelected = idx === selectedOption;
              
              let buttonClass = "w-full text-left p-4 rounded-2xl border-2 transition-all font-medium flex items-center justify-between ";
              if (!isAnswered) {
                buttonClass += "border-slate-100 hover:border-indigo-400 hover:bg-indigo-50 text-slate-700";
              } else if (isCorrect) {
                buttonClass += "border-emerald-500 bg-emerald-50 text-emerald-700";
              } else if (isSelected) {
                buttonClass += "border-rose-500 bg-rose-50 text-rose-700";
              } else {
                buttonClass += "border-slate-50 text-slate-400 opacity-50";
              }

              return (
                <button 
                  key={idx} 
                  onClick={() => handleOptionSelect(idx)}
                  disabled={isAnswered}
                  className={buttonClass}
                >
                  <span>{option}</span>
                  {isAnswered && isCorrect && <CheckCircle2 size={20} className="text-emerald-500" />}
                  {isAnswered && isSelected && !isCorrect && <XCircle size={20} className="text-rose-500" />}
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="pt-6 border-t border-slate-100"
              >
                <div className="bg-slate-50 p-4 rounded-2xl mb-6">
                  <p className="text-sm text-slate-600 italic leading-relaxed">
                    <span className="font-bold not-italic text-slate-900 mr-2">Why?</span>
                    {currentQuestion.explanation}
                  </p>
                </div>
                <button 
                  onClick={handleNext}
                  className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
                >
                  Next Question <ArrowRight size={18} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
