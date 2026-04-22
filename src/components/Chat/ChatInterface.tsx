/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Send, User as UserIcon, Bot, Loader2, Info, Volume2, Image as ImageIcon, X, Mic, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { collection, query, orderBy, getDocs, addDoc, onSnapshot, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { Message } from '../../types';
import { sendMessageStream, generateSpeech } from '../../services/geminiService';

interface ChatInterfaceProps {
  chatId: string | null;
  onChatCreated: (id: string) => void;
}

export default function ChatInterface({ chatId, onChatCreated }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSpeakingId, setIsSpeakingId] = useState<string | null>(null);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (chatId) {
      setErrorStatus(null);
      const q = query(collection(db, `chats/${chatId}/messages`), orderBy('timestamp', 'asc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message)));
      }, (err) => {
        console.error("Firestore error:", err);
        setErrorStatus("Service connection interrupted. Please try again.");
      });
      return () => unsubscribe();
    } else {
      setMessages([{
        id: '1',
        role: 'assistant',
        content: 'Welcome to **CivicGuide**. I am here to provide objective, non-partisan educational support regarding electoral processes. \n\nYou can ask about registration, nomination phases, polling procedures, or upload documents for analysis.',
        timestamp: Date.now()
      }]);
    }
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const speakMessage = async (message: Message) => {
    if (isSpeakingId === message.id) {
      audioRef.current?.pause();
      setIsSpeakingId(null);
      return;
    }
    try {
      setIsSpeakingId(message.id);
      const base64Audio = await generateSpeech(message.content.replace(/[*_#]/g, ''));
      if (base64Audio) {
        const audioUrl = `data:audio/mp3;base64,${base64Audio}`;
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current.play();
          audioRef.current.onended = () => setIsSpeakingId(null);
        } else {
          const audio = new Audio(audioUrl);
          audioRef.current = audio;
          audio.play();
          audio.onended = () => setIsSpeakingId(null);
        }
      }
    } catch (error) {
      console.error('Speech error:', error);
      setIsSpeakingId(null);
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return;

    setIsLoading(true);
    setErrorStatus(null);
    let targetChatId = chatId;
    
    try {
      if (!targetChatId) {
        const chatDoc = await addDoc(collection(db, 'chats'), {
          userId: auth.currentUser?.uid,
          title: input.slice(0, 30) || 'New Conversation',
          createdAt: Date.now(),
          updatedAt: Date.now()
        });
        targetChatId = chatDoc.id;
        onChatCreated(targetChatId);
      }

      // Add user message to Firestore
      const userMsgData = {
        role: 'user',
        content: input,
        timestamp: Date.now(),
        imageUrl: selectedImage || null
      };

      await addDoc(collection(db, `chats/${targetChatId}/messages`), userMsgData);
      
      const currentInput = input;
      const currentImage = selectedImage;
      setInput('');
      setSelectedImage(null);

      // Prepare history for AI
      const historyQ = query(collection(db, `chats/${targetChatId}/messages`), orderBy('timestamp', 'asc'));
      const historySnap = await getDocs(historyQ);
      const history = historySnap.docs.map(d => {
        const data = d.data();
        const parts: any[] = [{ text: data.content || "Analyze image" }];
        if (data.imageUrl) {
          const [mimePart, b64] = data.imageUrl.split(',');
          const mime = mimePart.split(':')[1].split(';')[0];
          parts.push({ inlineData: { data: b64, mimeType: mime } });
        }
        return { 
          role: data.role === 'user' ? 'user' as const : 'model' as const, 
          parts 
        };
      });

      // AI Response placeholder
      const assistantMsgRef = await addDoc(collection(db, `chats/${targetChatId}/messages`), {
        role: 'assistant',
        content: 'Analyzing contextual data...',
        timestamp: Date.now()
      });

      let fullContent = '';
      const stream = sendMessageStream(history);
      
      for await (const chunk of stream) {
        fullContent += chunk;
        await updateDoc(doc(db, `chats/${targetChatId}/messages`, assistantMsgRef.id), {
          content: fullContent
        });
      }

      await updateDoc(doc(db, 'chats', targetChatId), { 
        updatedAt: Date.now(),
        title: history[0]?.parts[0]?.text?.slice(0, 40) || 'Conversation'
      });

    } catch (error: any) {
      console.error('Chat error:', error);
      setErrorStatus(error.message || "An error occurred while processing your request.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="chat-container" className="flex flex-col h-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 blur-3xl -mr-32 -mt-32 pointer-events-none" />
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8 scrollbar-hide relative z-10">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-4 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                  message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {message.role === 'user' ? <UserIcon size={18} /> : <Bot size={22} />}
                </div>
                <div className="flex flex-col gap-2">
                  <div className={`rounded-3xl px-6 py-4 shadow-sm group relative ${
                    message.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none font-medium'
                  }`}>
                    {message.imageUrl && (
                      <div className="mb-4 rounded-2xl overflow-hidden border-2 border-white shadow-md">
                        <img src={message.imageUrl} alt="Document" className="max-w-full h-auto max-h-64 object-contain" />
                      </div>
                    )}
                    <div className={`prose prose-sm max-w-none ${message.role === 'user' ? 'prose-invert font-bold' : 'prose-slate'}`}>
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                    
                    {message.role === 'assistant' && (
                      <button 
                        onClick={() => speakMessage(message)}
                        className={`absolute -right-12 top-0 p-2 rounded-full transition-all ${
                          isSpeakingId === message.id 
                            ? 'bg-blue-600 text-white shadow-lg pulse' 
                            : 'bg-white text-slate-400 hover:text-blue-600 border border-slate-100 shadow-sm opacity-0 group-hover:opacity-100'
                        }`}
                      >
                        <Volume2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <div className="flex justify-start">
             <div className="flex gap-4 max-w-[85%] items-center">
                <div className="w-10 h-10 rounded-2xl bg-white border border-slate-100 text-blue-600 flex items-center justify-center shadow-sm">
                  <Bot size={22} className="animate-bounce" />
                </div>
                <div className="bg-white border border-slate-100 rounded-3xl rounded-tl-none px-6 py-3 flex items-center gap-3 shadow-sm">
                  <Sparkles size={16} className="text-blue-500 animate-spin" />
                  <span className="text-xs font-black text-slate-500 uppercase tracking-widest italic">Analyzing Registry...</span>
                </div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 sm:p-6 bg-white border-t border-slate-100 relative z-20">
        <div className="max-w-4xl mx-auto">
          {errorStatus && (
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 text-xs font-bold"
            >
              <Info size={14} />
              <span>{errorStatus}</span>
              <button onClick={() => setErrorStatus(null)} className="ml-auto hover:text-rose-800">
                <X size={14} />
              </button>
            </motion.div>
          )}
          {selectedImage && (
            <div className="mb-4 relative inline-block">
              <img src={selectedImage} alt="Preview" className="w-24 h-24 object-cover rounded-2xl border-4 border-blue-500 shadow-xl" />
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute -top-3 -right-3 bg-rose-500 text-white rounded-full p-1.5 shadow-xl hover:bg-rose-600 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          )}
          
          <div className="relative flex items-center gap-3">
            <input type="file" ref={fileInputRef} onChange={handleImageSelect} accept="image/*" className="hidden" />
            <button onClick={() => fileInputRef.current?.click()} className="p-4 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all shadow-sm border border-slate-100">
              <ImageIcon size={22} />
            </button>
            
            <div className="flex-1 relative group">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Consult the CivicGuide..."
                className="w-full pl-6 pr-16 py-5 bg-slate-50 border border-slate-100 rounded-3xl focus:ring-4 focus:ring-blue-100 focus:bg-white focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 font-bold text-slate-800 shadow-inner"
              />
              <button
                onClick={handleSend}
                disabled={(!input.trim() && !selectedImage) || isLoading}
                className={`absolute right-2 top-2 p-3.5 rounded-2xl transition-all shadow-xl ${
                  (input.trim() || selectedImage) && !isLoading 
                    ? 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 active:scale-95' 
                    : 'bg-slate-200 text-slate-400'
                }`}
              >
                {isLoading ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} />}
              </button>
            </div>
            
            <button className="hidden sm:flex p-4 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all shadow-sm border border-slate-100">
              <Mic size={22} />
            </button>
          </div>
          <div className="mt-4 flex items-center justify-center gap-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
             <span>• Encrypted Data Transmission</span>
             <span className="w-1 h-1 bg-slate-300 rounded-full" />
             <span>• Non-Partisan Protocol Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper icons
function ShieldCheck({ size = 20, className = "" }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
