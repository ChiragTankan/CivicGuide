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
  Github
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ChatInterface from './components/Chat/ChatInterface';
import ElectionLifecycle from './components/Civic/ElectionLifecycle';
import JargonBuster from './components/Civic/JargonBuster';

type View = 'chat' | 'lifecycle' | 'jargon';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('chat');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { id: 'chat', label: 'Ask CivicGuide', icon: MessageSquare, description: 'Interactive AI Assistant' },
    { id: 'lifecycle', label: 'Election Lifecycle', icon: Map, description: 'Step-by-step guidance' },
    { id: 'jargon', label: 'Jargon Buster', icon: BookMarked, description: 'Election terms explained' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 flex items-center gap-3 border-b border-slate-100">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight text-slate-900">CivicGuide</h1>
              <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">Education First</p>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden ml-auto p-2 text-slate-400 hover:text-slate-600"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 mt-4">
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
                    w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group
                    ${isActive 
                      ? 'bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-100/50' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                  `}
                >
                  <div className={`
                    w-10 h-10 rounded-lg flex items-center justify-center transition-colors
                    ${isActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'}
                  `}>
                    <item.icon size={20} />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{item.label}</p>
                    <p className={`text-[11px] truncate ${isActive ? 'text-indigo-500' : 'text-slate-400'}`}>
                      {item.description}
                    </p>
                  </div>
                  {isActive && (
                    <motion.div layoutId="active-indicator">
                      <ChevronRight size={14} className="text-indigo-400" />
                    </motion.div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Footer Card */}
          <div className="p-4 border-t border-slate-100">
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <p className="text-[11px] text-slate-500 mb-2 font-medium">STRICTLY NON-PARTISAN</p>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Objective facts only. We never endorse candidates or parties.
              </p>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noreferrer"
                className="mt-4 flex items-center gap-2 text-[11px] text-slate-400 hover:text-slate-600 transition-colors"
              >
                <Github size={14} /> Open Source Project
              </a>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 lg:h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg"
            >
              <Menu size={20} />
            </button>
            <h2 className="font-bold text-lg text-slate-900 capitalize">
              {navItems.find(i => i.id === currentView)?.label}
            </h2>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden sm:flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                EDUCATION ACTIVE
             </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-10">
          <div className="max-w-6xl mx-auto h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentView}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                {currentView === 'chat' && <ChatInterface />}
                {currentView === 'lifecycle' && <ElectionLifecycle />}
                {currentView === 'jargon' && <JargonBuster />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
