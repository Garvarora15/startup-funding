/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Grant {
  id: string;
  name: string;
  amount_display: string;
  amount_inr: number | null;
  stage: string[];
  domain: string[];
  eligibility: string;
  deadline: string;
  application_link: string;
  description: string;
  source: string;
  last_scraped: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  reasoningSteps?: Array<{
    tool?: string;
    input?: string;
    output?: string;
  }>;
}

export interface StartupProfile {
  name: string;
  stage: 'idea' | 'prototype' | 'seed' | 'early' | 'growth';
  domain: string;
  incorporationYear: number;
  location: string;
  description: string;
  currentFunding: number;
  pitchFormat?: string;
  pitchLanguage?: string;
  updateFrequency?: string;
}

export interface ProposalRequest {
  startupName: string;
  startupDescription: string;
  stage: string;
  domain: string;
  targetGrantName: string;
  targetGrantDetails: string;
  additionalNotes?: string;
}
