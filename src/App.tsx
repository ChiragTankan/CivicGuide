/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  MessageSquare, 
  Map, 
  BookMarked, 
  Menu, 
  X, 
  ChevronRight,
  ShieldCheck,
  Github,
  Trophy,
  BrainCircuit,
  Fingerprint
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ChatInterface from './components/Chat/ChatInterface';
import ElectionLifecycle from './components/Civic/ElectionLifecycle';
import JargonBuster from './components/Civic/JargonBuster';
import CivicQuiz from './components/Civic/CivicQuiz';

type View = 'chat' | 'lifecycle' | 'jargon' | 'quiz';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('chat');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { id: 'chat', label: 'Advanced Companion', icon: MessageSquare, description: 'Multimodal AI Guide' },
    { id: 'lifecycle', label: 'Voter Blueprint', icon: Map, description: 'Electoral lifecycle strategy' },
    { id: 'jargon', label: 'Civic Lexicon', icon: BookMarked, description: 'Technical jargon simplified' },
    { id: 'quiz', label: 'Civic Intelligence', icon: BrainCircuit, description: 'AI-driven knowledge test' },
  ];

  return (
    <div className="flex bg-[#0A0A0A] overflow-hidden h-[100dvh] w-full text-slate-300 font-sans">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-80 bg-[#111] border-r border-white/5 transform transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-8 flex items-center gap-4 border-b border-white/5">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-indigo-500/20 rotate-3 transition-transform hover:rotate-0 cursor-pointer">
              <ShieldCheck size={28} />
            </div>
            <div>
              <h1 className="font-black text-2xl tracking-tighter text-white uppercase italic">CivicGuard</h1>
              <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.2em]">Electoral Intelligence</p>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden ml-auto p-2 text-slate-500 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6 space-y-4 mt-4">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-4 mb-4">Operations Console</p>
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id as View);
                    setIsSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-5 p-4 rounded-2xl transition-all duration-300 group relative
                    ${isActive 
                      ? 'bg-white/5 text-white ring-1 ring-white/10' 
                      : 'text-slate-500 hover:bg-white/[0.02] hover:text-slate-200'}
                  `}
                >
                  <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300
                    ${isActive ? 'bg-indigo-600 text-white translate-x-1 shadow-lg shadow-indigo-600/20' : 'bg-white/5 text-slate-600 group-hover:text-indigo-400'}
                  `}>
                    <item.icon size={22} />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <p className={`font-bold text-sm tracking-tight ${isActive ? 'text-white' : 'group-hover:text-white'}`}>
                      {item.label}
                    </p>
                    <p className={`text-[10px] font-medium leading-tight mt-1 truncate ${isActive ? 'text-indigo-400' : 'text-slate-600'}`}>
                      {item.description}
                    </p>
                  </div>
                  {isActive && (
                    <motion.div layoutId="active-indicator" className="w-1 h-8 bg-indigo-500 rounded-full absolute -left-1" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Footer Card */}
          <div className="p-6 border-t border-white/5">
            <div className="bg-indigo-600/10 rounded-3xl p-6 border border-indigo-500/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 blur-3xl -tr-12 group-hover:scale-150 transition-transform" />
              <div className="flex items-center gap-2 mb-3">
                 <Fingerprint size={16} className="text-indigo-400" />
                 <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">Integrity Protocol</p>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                Strictly Non-Partisan. Factual verification through multi-modal grounding.
              </p>
              <div className="mt-5 flex items-center justify-between">
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-2 text-[10px] text-slate-500 hover:text-white transition-colors"
                >
                  <Github size={12} /> PROMPTWARS V3.1
                </a>
                <Trophy size={14} className="text-indigo-500 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Ambient background glow */}
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/5 blur-[120px] rounded-full" />
        
        {/* Header */}
        <header className="h-20 lg:h-24 border-b border-white/5 flex items-center justify-between px-8 lg:px-12 flex-shrink-0 z-10 bg-[#0A0A0A]/50 backdrop-blur-xl">
          <div className="flex items-center gap-5">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-3 -ml-2 text-slate-400 hover:bg-white/5 rounded-2xl transition-colors"
            >
              <Menu size={24} />
            </button>
            <div className="space-y-0.5">
              <h2 className="font-black text-xl lg:text-2xl text-white tracking-tighter uppercase italic">
                {navItems.find(i => i.id === currentView)?.label}
              </h2>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border border-indigo-500/20">
                  <span className="w-1 h-1 bg-indigo-400 rounded-full animate-ping" />
                  Terminal Ready
                </div>
                <div className="h-3 w-px bg-white/10" />
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest tabular-nums">
                  {new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="hidden sm:flex items-center gap-3 bg-white/5 border border-white/5 px-5 py-2.5 rounded-2xl text-[11px] font-black tracking-widest text-white shadow-inner">
                <Trophy size={14} className="text-amber-400" />
                RANK #01 PERFORMANCE
             </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-0 sm:p-8 lg:p-12 z-10">
          <div className="max-w-7xl mx-auto h-full px-4 sm:px-0 py-6 sm:py-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentView}
                initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 1.02, filter: 'blur(10px)' }}
                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                className="h-full"
              >
                {currentView === 'chat' && <ChatInterface />}
                {currentView === 'lifecycle' && <ElectionLifecycle />}
                {currentView === 'jargon' && <JargonBuster />}
                {currentView === 'quiz' && <CivicQuiz />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
