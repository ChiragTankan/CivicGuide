/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ElectionPhase } from './types';

export const ELECTION_PHASES: ElectionPhase[] = [
  {
    id: 'registration',
    title: 'Voter Registration',
    description: 'The foundation of voting rights.',
    details: [
      'Eligibility check (Age, Citizenship)',
      'Proof of identity and residence',
      'Joining the Electoral Roll',
      'Updating details if you move'
    ],
    icon: 'UserPlus'
  },
  {
    id: 'nominations',
    title: 'Nomination Phase',
    description: 'When candidates officially enter the race.',
    details: [
      'Candidate eligibility checks',
      'Filing nomination papers',
      'Scrutiny of nominations',
      'Withdrawal period'
    ],
    icon: 'FileText'
  },
  {
    id: 'campaigning',
    title: 'Campaigning Phase',
    description: 'Citizens learn about candidates and platforms.',
    details: [
      'Public meetings and rallies',
      'Manifesto releases',
      'Media coverage and debates',
      'Model Code of Conduct'
    ],
    icon: 'Megaphone'
  },
  {
    id: 'polling',
    title: 'Polling Day',
    description: 'The moment of decision.',
    details: [
      'Finding your polling station',
      'Verifying identity at the booth',
      'Casting the ballot (Physical or EVM)',
      'Special provisions (Postal/Early voting)'
    ],
    icon: 'CheckSquare'
  },
  {
    id: 'counting',
    title: 'Vote Counting',
    description: 'Aggregating the will of the people.',
    details: [
      'Secure transport of ballot boxes/EVMs',
      'Tallying of valid votes',
      'Presence of candidate agents',
      'Handling disputed ballots'
    ],
    icon: 'BarChart'
  },
  {
    id: 'declaration',
    title: 'Declaration of Results',
    description: 'Finalizing the outcome.',
    details: [
      'Official announcement of winners',
      'Gazetting of results',
      'Transition of power procedures',
      'Post-election reports'
    ],
    icon: 'Trophy'
  }
];
