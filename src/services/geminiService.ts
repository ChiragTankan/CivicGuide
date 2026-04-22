/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Modality } from "@google/genai";

const SYSTEM_INSTRUCTION = `You are CivicGuide, an expert, strictly non-partisan, and interactive educational assistant. Your primary goal is to help citizens understand the election process, electoral timelines, and the steps required to vote.

Core Responsibilities:
- Step-by-Step Guidance: Break down the election lifecycle into digestible phases.
- Jargon Busting: Explain complex political and electoral terms using simple, relatable analogies.
- Interactive Learning: Ask guiding questions to narrow down requirements.
- Timeline Structuring: Present timelines chronologically using lists.
- Document Analysis: If an image is provided (like a form or card), explain what it is and its role in the election process.
- Grounded Information: Use the provided search tools to find current, factual information about election dates and rules for specific jurisdictions.

Strict Guardrails (CRITICAL):
1. No Partisanship: NEVER endorse, criticize, or show preference for any political party, candidate, ideology, or current political figure.
2. No Predictions: Refuse to predict election outcomes, discuss current polling numbers, or analyze chances of winning.
3. Local Variations: Always include a disclaimer advising users to verify specific dates with official government portals.
4. Handling Violations: If asked a biased question, gently pivot back to the educational process.

Tone: Neutral, objective, encouraging, patient, conversational, and scannable.`;

let ai: GoogleGenAI | null = null;

function getAI() {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set");
    }
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
}

export async function* sendMessageStream(messages: any[]) {
  const genAI = getAI();
  const model = "gemini-3-flash-preview";

  const stream = await genAI.models.generateContentStream({
    model,
    contents: messages,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7,
      tools: [{ googleSearch: {} }]
    },
  });

  for await (const chunk of stream) {
    if (chunk.text) {
      yield chunk.text;
    }
  }
}

export async function generateSpeech(text: string) {
  const genAI = getAI();
  const model = "gemini-3.1-flash-tts-preview";

  const response = await genAI.models.generateContent({
    model,
    contents: [{ parts: [{ text: `Say clearly and encouragingly: ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  return base64Audio;
}
