/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ELECTION_PHASES } from '../../constants';
import * as LucideIcons from 'lucide-react';

export default function ElectionLifecycle() {
  return (
    <div className="space-y-12">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-4xl font-black text-white mb-4 tracking-tighter uppercase italic">Voter Strategy Map</h2>
        <p className="text-slate-400 font-medium leading-relaxed">Democracy is a high-stakes operational workflow. Analyze the key phases of the electoral lifecycle to ensure maximum participation and integrity.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {ELECTION_PHASES.map((phase, index) => {
          const Icon = (LucideIcons as any)[phase.icon] || LucideIcons.HelpCircle;
          return (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
              className="bg-[#111] p-8 rounded-3xl border border-white/5 relative overflow-hidden group hover:border-indigo-500/50 transition-all duration-500"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl group-hover:scale-150 transition-transform duration-700" />
              <div className="w-14 h-14 bg-indigo-600/10 rounded-2xl flex items-center justify-center mb-8 border border-indigo-500/20 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 relative z-10">
                <Icon size={28} />
              </div>
              <h3 className="text-xl font-black text-white mb-4 tracking-tight uppercase group-hover:text-indigo-400 transition-colors z-10 relative">{phase.title}</h3>
              <p className="text-sm text-slate-400 mb-6 leading-relaxed font-medium z-10 relative">{phase.description}</p>
              <ul className="space-y-3 z-10 relative">
                {phase.details.map((detail, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs text-slate-500 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/50 mt-1.5 flex-shrink-0 group-hover:bg-indigo-500 transition-colors" />
                    {detail}
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
