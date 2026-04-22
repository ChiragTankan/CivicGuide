/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Info, Volume2, Image as ImageIcon, X, Mic } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { Message } from '../../types';
import { sendMessageStream, generateSpeech } from '../../services/geminiService';

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I am **CivicGuide**, your advanced educational companion. \n\nI can now: \n- **Analyze documents**: Upload a photo of your voter card or registration form. \n- **Provide live dates**: Ask about upcoming elections in your region. \n- **Speak**: Click the speaker icon to hear my explanations.\n\nHow can I empower your civic journey today?',
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSpeakingId, setIsSpeakingId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
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

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
      imageUrl: selectedImage || undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setSelectedImage(null);
    setIsLoading(true);

    const assistantMsgId = (Date.now() + 1).toString();
    const assistantMessage: Message = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, assistantMessage]);

    try {
      const history = messages.map(m => {
        const parts: any[] = [{ text: m.content || "Analyze this image" }];
        if (m.imageUrl) {
          const [mime, data] = m.imageUrl.split(',');
          parts.push({
            inlineData: {
              data: data,
              mimeType: mime.split(':')[1].split(';')[0]
            }
          });
        }
        return {
          role: m.role === 'user' ? 'user' as const : 'model' as const,
          parts: parts
        };
      });

      const currentParts: any[] = [{ text: input || "What is in this image?" }];
      if (selectedImage) {
        const [mime, data] = selectedImage.split(',');
        currentParts.push({
          inlineData: {
            data: data,
            mimeType: mime.split(':')[1].split(';')[0]
          }
        });
      }
      history.push({ role: 'user', parts: currentParts });

      let fullContent = '';
      const stream = sendMessageStream(history);
      
      for await (const chunk of stream) {
        fullContent += chunk;
        setMessages(prev => prev.map(msg => 
          msg.id === assistantMsgId ? { ...msg, content: fullContent } : msg
        ));
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMsgId ? { ...msg, content: 'Democracy is complex, and so is my processing right now. Please try again!' } : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="chat-container" className="flex flex-col h-full bg-white sm:rounded-2xl shadow-xl border-x sm:border border-slate-200 overflow-hidden -mx-4 sm:mx-0 transition-all">
      {/* Disclaimer Header */}
      <div className="bg-indigo-600 px-4 py-2 flex items-center justify-between text-[10px] text-white font-medium uppercase tracking-widest">
        <div className="flex items-center gap-2">
          <ShieldCheck size={12} />
          <span>Strictly Non-Partisan AI</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          <span>Real-time Grounding Active</span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8 scrollbar-hide bg-slate-50/30">
        <AnimatePresence initial={false}>
          {messages.map((message, idx) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-4 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                  message.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600 border border-slate-200'
                }`}>
                  {message.role === 'user' ? <User size={20} /> : <Bot size={22} />}
                </div>
                <div className="flex flex-col gap-2">
                  <div className={`rounded-2xl px-5 py-4 shadow-sm relative group ${
                    message.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                  }`}>
                    {message.imageUrl && (
                      <div className="mb-3 rounded-lg overflow-hidden border border-white/20">
                        <img src={message.imageUrl} alt="Uploaded civic document" className="max-w-full h-auto max-h-64 object-contain" />
                      </div>
                    )}
                    <div className={`prose prose-sm max-w-none ${message.role === 'user' ? 'prose-invert font-medium' : 'prose-slate'}`}>
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                    
                    {message.role === 'assistant' && message.content && (
                      <button 
                        onClick={() => speakMessage(message)}
                        className={`absolute -right-12 top-0 p-2 rounded-full transition-all ${
                          isSpeakingId === message.id 
                            ? 'bg-indigo-600 text-white scale-110 shadow-lg' 
                            : 'bg-white text-slate-400 hover:text-indigo-600 border border-slate-200 shadow-sm opacity-0 group-hover:opacity-100'
                        }`}
                      >
                        <Volume2 size={16} className={isSpeakingId === message.id ? 'animate-pulse' : ''} />
                      </button>
                    )}
                  </div>
                  <span className={`text-[10px] uppercase font-bold tracking-tighter text-slate-400 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && messages[messages.length - 1].content === '' && (
          <div className="flex justify-start">
             <div className="flex gap-4 max-w-[85%] items-center">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-indigo-600 flex items-center justify-center shadow-sm">
                  <Bot size={22} className="animate-bounce" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none px-5 py-3 flex items-center gap-3">
                  <div className="flex gap-1">
                    <motion.div animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1 bg-indigo-400 rounded-full" />
                    <motion.div animate={{ height: [8, 16, 8] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.1 }} className="w-1 bg-indigo-500 rounded-full" />
                    <motion.div animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1 bg-indigo-400 rounded-full" />
                  </div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Consulting Registry...</span>
                </div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100">
        {selectedImage && (
          <div className="mb-4 relative inline-block">
            <img src={selectedImage} alt="Preview" className="w-20 h-20 object-cover rounded-lg border-2 border-indigo-500 shadow-md" />
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute -top-2 -right-2 bg-indigo-600 text-white rounded-full p-1 shadow-lg hover:bg-indigo-700 transition-colors"
            >
              <X size={12} />
            </button>
          </div>
        )}
        <div className="relative max-w-4xl mx-auto flex items-center gap-3">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageSelect} 
            accept="image/*" 
            className="hidden" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
            title="Upload Document"
          >
            <ImageIcon size={22} />
          </button>
          
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask a civic question..."
              className="w-full pl-5 pr-14 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400 font-medium text-slate-700"
            />
            <button
              onClick={handleSend}
              disabled={(!input.trim() && !selectedImage) || isLoading}
              className={`absolute right-2 top-2 p-2.5 rounded-xl transition-all shadow-sm ${
                (input.trim() || selectedImage) && !isLoading 
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 scale-100 hover:scale-105' 
                  : 'bg-slate-100 text-slate-300 scale-95'
              }`}
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
            </button>
          </div>
          
          <button 
            className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
            title="Voice Command (Coming Soon)"
          >
            <Mic size={22} />
          </button>
        </div>
        <p className="text-center text-[10px] text-slate-400 mt-3 font-semibold uppercase tracking-wider">
          Empowering Citizentry Through Factual Knowledge
        </p>
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
