/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, BookOpen, Lightbulb } from 'lucide-react';
import { motion } from 'motion/react';
import { JargonTerm } from '../../types';

const COMMON_TERMS: JargonTerm[] = [
  {
    term: "Constituency",
    definition: "A specific geographic area that an elected official represents.",
    analogy: "Like a specific neighborhood that chooses a captain to represent them at the city-wide council."
  },
  {
    term: "Electoral College",
    definition: "A body of people representing the states of the US, who formally cast votes for the election of the president.",
    analogy: "Like a relay race where individual runners (voters) pass the baton to a captain (elector) who crosses the final finish line for them."
  },
  {
    term: "Proportional Representation",
    definition: "An electoral system in which parties gain seats in proportion to the number of votes they receive.",
    analogy: "If a group of 10 friends orders pizza and 6 want pepperoni while 4 want veggie, you get 6 slices of pepperoni and 4 of veggie, rather than 10 of just one."
  },
  {
    term: "First-Past-The-Post",
    definition: "An electoral system where the candidate with the most votes wins, regardless of whether they have an absolute majority.",
    analogy: "A horse race where the first horse to cross the line wins, even if they won by only an inch and others were very close behind."
  },
  {
    term: "Ballot",
    definition: "A secret device (paper or electronic) used to cast a vote.",
    analogy: "Like a secret envelope where you put your choice so no one else can see what you decided."
  }
];

export default function JargonBuster() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTerms = COMMON_TERMS.filter(t => 
    t.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10">
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">Civic Lexicon</h2>
          <p className="text-slate-400 font-medium">Decoding complex electoral terminology through relational analogies.</p>
        </div>
        <div className="relative group min-w-[320px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
          <input
            type="text"
            placeholder="FILTER TERMINOLOGY..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-4 py-4 bg-white/5 border border-white/5 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:bg-white/[0.08] outline-none w-full transition-all text-xs font-black tracking-widest text-white uppercase placeholder:text-slate-600"
          />
        </div>
      </div>

      <div className="grid gap-6">
        {filteredTerms.map((item, index) => (
          <motion.div
            key={item.term}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="bg-[#111] p-6 rounded-3xl border border-white/5 group hover:border-indigo-500/30 transition-all duration-300"
          >
            <div className="flex items-start gap-6">
              <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center flex-shrink-0 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                <BookOpen size={24} />
              </div>
              <div className="space-y-4 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-white italic tracking-tight uppercase group-hover:text-indigo-400 transition-colors">{item.term}</h3>
                  <div className="h-px flex-1 mx-6 bg-white/5 hidden sm:block" />
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Defined_Record</span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed font-medium">{item.definition}</p>
                <div className="bg-indigo-500/5 p-5 rounded-2xl border border-indigo-500/10 flex gap-4 items-start relative group/analogy">
                  <div className="absolute inset-0 bg-indigo-500/[0.02] opacity-0 group-hover/analogy:opacity-100 transition-opacity rounded-2xl" />
                  <Lightbulb size={20} className="text-indigo-400 flex-shrink-0 mt-0.5 animate-pulse" />
                  <p className="text-xs text-indigo-200 leading-relaxed z-10 relative">
                    <span className="font-black uppercase tracking-widest text-indigo-400 mr-2">Operational Analogy:</span> {item.analogy}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        {filteredTerms.length === 0 && (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
            <p className="text-slate-500 font-black uppercase tracking-widest text-xs mb-2">No matching records found</p>
            <p className="text-[10px] text-slate-600 font-bold">Try searching for broader keywords in our registry.</p>
          </div>
        )}
      </div>
    </div>
  );
}
