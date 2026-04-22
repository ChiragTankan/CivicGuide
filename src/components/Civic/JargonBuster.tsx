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
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Jargon Buster</h2>
          <p className="text-slate-600">Explaining complex terms with simple analogies.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search terms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none w-full md:w-64 transition-all"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredTerms.map((item, index) => (
          <motion.div
            key={item.term}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0 text-indigo-600">
                <BookOpen size={20} />
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-slate-900">{item.term}</h3>
                <p className="text-slate-600 text-sm">{item.definition}</p>
                <div className="bg-amber-50 p-3 rounded-lg flex gap-2 items-start">
                  <Lightbulb size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800 italic">
                    <span className="font-bold not-italic mr-1">Analogy:</span> {item.analogy}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        {filteredTerms.length === 0 && (
          <div className="text-center py-10 text-slate-400">
            No terms found matching "{searchTerm}". Try another word!
          </div>
        )}
      </div>
    </div>
  );
}
