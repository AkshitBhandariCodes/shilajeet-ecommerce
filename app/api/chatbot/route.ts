import { NextRequest, NextResponse } from 'next/server';
import { AGNISHILA_KNOWLEDGE_BASE } from '@/lib/agnishila-knowledge-base';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = 'gemma-3-4b-it';

export async function POST(request: NextRequest) {
  try {
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const systemPrompt = `You are Agnishila's premium customer support assistant. You have comprehensive knowledge about Agnishila's products, policies, and services.

IMPORTANT GUIDELINES:
1. Always be helpful, friendly, and professional
2. Provide accurate information based on the knowledge base below
3. Keep responses concise but informative (2-3 sentences typically)
4. If asked about something not in the knowledge base, say "I don't have specific information about that, but our support team can help. Contact us at info@agnishila.in or WhatsApp 8448893545"
5. Always encourage customers to contact support for complex issues
6. Be enthusiastic about Agnishila's products and values
7. Mention Fire Coins loyalty program when relevant
8. Provide specific product details when asked

AGNISHILA KNOWLEDGE BASE:
${AGNISHILA_KNOWLEDGE_BASE}

USER QUESTION: ${message}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: systemPrompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 512,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('Gemini API error:', error);
      return NextResponse.json(
        { error: 'Failed to get response from Gemini' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const botResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 
      'Sorry, I could not generate a response. Please try again.';

    return NextResponse.json({ response: botResponse });
  } catch (error) {
    console.error('Chatbot API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
