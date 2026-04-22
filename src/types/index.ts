/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  imageUrl?: string;
}

export interface ElectionPhase {
  id: string;
  title: string;
  description: string;
  details: string[];
  icon: string;
}

export interface JargonTerm {
  term: string;
  definition: string;
  analogy: string;
}
