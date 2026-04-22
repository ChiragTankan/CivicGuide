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
    <div className="space-y-12 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-200 pb-12">
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Civic Lexicon</h2>
          <p className="text-slate-500 font-medium">Objective definitions of electoral terminology with cross-referenced analogies.</p>
        </div>
        <div className="relative group min-w-[320px]">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
          <input
            type="text"
            placeholder="FILTER REGISTRY..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-14 pr-6 py-5 bg-white border border-slate-200 rounded-3xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none w-full transition-all text-xs font-black tracking-widest text-slate-900 uppercase placeholder:text-slate-300 shadow-sm"
          />
        </div>
      </div>

      <div className="grid gap-6">
        {filteredTerms.map((item, index) => (
          <motion.div
            key={item.term}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05, duration: 0.5 }}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-lg shadow-slate-200/40 group hover:border-blue-500/30 transition-all duration-300"
          >
            <div className="flex items-start gap-8">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-inner">
                <BookOpen size={28} />
              </div>
              <div className="space-y-4 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black text-slate-900 italic tracking-tight uppercase group-hover:text-blue-600 transition-colors">{item.term}</h3>
                  <div className="hidden sm:flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full">
                    <span className="w-1 h-1 bg-slate-300 rounded-full" />
                    Verified_Term
                  </div>
                </div>
                <p className="text-slate-600 text-base leading-relaxed font-bold">{item.definition}</p>
                <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100 flex gap-5 items-start relative group/analogy">
                  <Lightbulb size={24} className="text-amber-500 flex-shrink-0 mt-0.5 animate-bounce" />
                  <p className="text-sm text-slate-700 leading-relaxed font-medium">
                    <span className="font-black uppercase tracking-widest text-blue-600 mr-2 text-[11px]">Relational Analogy:</span> {item.analogy}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        {filteredTerms.length === 0 && (
          <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm mb-2">Registry Access Failed</p>
            <p className="text-xs text-slate-300 font-bold">No records matching your query were found in the current dataset.</p>
          </div>
        )}
      </div>
    </div>
  );
}
