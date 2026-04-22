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
        <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter uppercase italic">Voter Blueprint</h2>
        <p className="text-slate-500 font-medium leading-relaxed">Democracy is a process of precise coordination. Analyze the key phases of the electoral lifecycle to ensure informed participation and procedural integrity.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {ELECTION_PHASES.map((phase, index) => {
          const Icon = (LucideIcons as any)[phase.icon] || LucideIcons.HelpCircle;
          return (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50 relative overflow-hidden group hover:border-blue-500/50 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-8 text-white shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
                <Icon size={32} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight uppercase italic">{phase.title}</h3>
              <p className="text-sm text-slate-600 mb-6 leading-relaxed font-medium">{phase.description}</p>
              <ul className="space-y-3">
                {phase.details.map((detail, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs text-slate-500 font-bold">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
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
