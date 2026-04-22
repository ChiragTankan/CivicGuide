/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Map, 
  BookMarked, 
  Menu, 
  X, 
  ShieldCheck,
  Trophy,
  BrainCircuit,
  History,
  LogIn,
  LogOut,
  User as UserIcon,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, query, where, orderBy, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, signInWithGoogle, logout, db } from './lib/firebase';
import ChatInterface from './components/Chat/ChatInterface';
import ElectionLifecycle from './components/Civic/ElectionLifecycle';
import JargonBuster from './components/Civic/JargonBuster';
import CivicQuiz from './components/Civic/CivicQuiz';

type View = 'chat' | 'lifecycle' | 'jargon' | 'quiz';

export default function App() {
  const [user, loading] = useAuthState(auth);
  const [currentView, setCurrentView] = useState<View>('chat');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      loadChatHistory();
    }
  }, [user]);

  const loadChatHistory = async () => {
    if (!user) return;
    const q = query(
      collection(db, 'chats'),
      where('userId', '==', user.uid),
      orderBy('updatedAt', 'desc')
    );
    const snapshot = await getDocs(q);
    setChatHistory(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const createNewChat = async () => {
    if (!user) return;
    const docRef = await addDoc(collection(db, 'chats'), {
      userId: user.uid,
      title: 'New Discussion',
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
    setActiveChatId(docRef.id);
    setCurrentView('chat');
    loadChatHistory();
  };

  const navItems = [
    { id: 'chat', label: 'Civic Assistant', icon: MessageSquare, description: 'AI-Powered Guide' },
    { id: 'lifecycle', label: 'Election Blueprint', icon: Map, description: 'Step-by-step process' },
    { id: 'jargon', label: 'Terminology', icon: BookMarked, description: 'Electoral terminology' },
    { id: 'quiz', label: 'Challenges', icon: BrainCircuit, description: 'Civic Knowledge Test' },
  ];

  if (loading) return null;

  return (
    <div className="flex bg-slate-50 overflow-hidden h-[100dvh] w-full text-slate-900 font-sans">
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
          <div className="p-6 flex items-center gap-3 border-b border-slate-100 bg-white sticky top-0 z-20">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight text-slate-900">CivicGuide</h1>
              <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">Democracy Empowered</p>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden ml-auto p-2 text-slate-400 hover:text-slate-600"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8 scrollbar-hide">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-4">Core Sections</p>
              <div className="space-y-1">
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
                        w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group
                        ${isActive 
                          ? 'bg-blue-50 text-blue-700 shadow-sm' 
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                      `}
                    >
                      <div className={`
                        w-8 h-8 rounded-lg flex items-center justify-center transition-colors
                        ${isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'}
                      `}>
                        <item.icon size={16} />
                      </div>
                      <div className="text-left flex-1 min-w-0">
                        <p className="font-bold text-sm truncate">{item.label}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {user && (
              <div>
                <div className="flex items-center justify-between px-2 mb-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recent Activity</p>
                  <button onClick={createNewChat} className="p-1 text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                    <Plus size={14} />
                  </button>
                </div>
                <div className="space-y-1">
                  {chatHistory.length > 0 ? chatHistory.map(chat => (
                    <button
                      key={chat.id}
                      onClick={() => {
                        setActiveChatId(chat.id);
                        setCurrentView('chat');
                        setIsSidebarOpen(false);
                      }}
                      className={`
                        w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left
                        ${activeChatId === chat.id ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}
                      `}
                    >
                      <History size={14} className="flex-shrink-0" />
                      <span className="text-xs font-medium truncate">{chat.title || 'Untitled'}</span>
                    </button>
                  )) : (
                    <p className="px-2 text-[11px] text-slate-400 italic">No history yet</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Section */}
          <div className="p-4 border-t border-slate-100">
            {user ? (
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center overflow-hidden">
                  {user.photoURL ? <img src={user.photoURL} alt="" /> : <UserIcon size={16} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">{user.displayName}</p>
                  <button onClick={logout} className="text-[10px] text-rose-500 font-bold uppercase tracking-wider hover:text-rose-600">Sign Out</button>
                </div>
              </div>
            ) : (
              <button 
                onClick={signInWithGoogle}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
              >
                <LogIn size={18} />
                <span>Get Started</span>
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 lg:h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0 z-30">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg"
            >
              <Menu size={20} />
            </button>
            <div className="flex flex-col">
              <h2 className="font-bold text-lg text-slate-900 capitalize leading-tight">
                {navItems.find(i => i.id === currentView)?.label}
              </h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest hidden sm:block">
                {navItems.find(i => i.id === currentView)?.description}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             {/* Badges removed per user request */}
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-0 sm:p-6 lg:p-8 bg-slate-50/50">
          <div className="max-w-6xl mx-auto h-full px-4 sm:px-0 py-6 sm:py-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentView + (activeChatId || '')}
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.99 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                {!user && currentView === 'chat' && (
                  <div className="flex flex-col items-center justify-center h-full text-center max-w-md mx-auto space-y-8">
                    <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center shadow-xl shadow-blue-50 rotate-6 transition-transform hover:rotate-0">
                      <ShieldCheck size={48} />
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-3 italic uppercase">Civic Intelligence</h3>
                      <p className="text-slate-500 font-medium leading-relaxed">
                        Sign in to access personalized election guidance, saved discussions, and interactive civic challenges.
                      </p>
                    </div>
                    <button 
                      onClick={signInWithGoogle}
                      className="w-full sm:w-auto bg-blue-600 text-white font-black py-4 px-10 rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all hover:-translate-y-1 active:translate-y-0 uppercase tracking-widest text-sm"
                    >
                      Authenticate Now
                    </button>
                  </div>
                )}
                
                {user && currentView === 'chat' && <ChatInterface chatId={activeChatId} onChatCreated={(id) => setActiveChatId(id)} />}
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
