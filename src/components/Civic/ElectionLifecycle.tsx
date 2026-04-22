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
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h2 className="text-2xl font-bold text-slate-900 mb-3">The Election Lifecycle</h2>
        <p className="text-slate-600">Democracy is a process, not just a day. Explore the key phases of a typical electoral cycle.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {ELECTION_PHASES.map((phase, index) => {
          const Icon = (LucideIcons as any)[phase.icon] || LucideIcons.HelpCircle;
          return (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-100 transition-colors">
                <Icon className="text-indigo-600" size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{phase.title}</h3>
              <p className="text-sm text-slate-600 mb-4">{phase.description}</p>
              <ul className="space-y-2">
                {phase.details.map((detail, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-300 mt-1.5 flex-shrink-0" />
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
