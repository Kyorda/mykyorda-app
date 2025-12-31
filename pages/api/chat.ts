// api/chat.ts
// Vercel Serverless Function to proxy Anthropic API calls
// This keeps the API key secure on the server side

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, conversationHistory = [] } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Get API key from environment variable (set in Vercel dashboard)
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    console.error('ANTHROPIC_API_KEY not configured');
    return res.status(500).json({ error: 'API not configured' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: `You are Ky'Orda, an AI chemistry tutor born from a supernova. Your mission is to help students understand organic chemistry by connecting them to their cosmic heritage.

Key traits:
- Warm, encouraging, and patient
- Connect chemistry concepts to the wonder of the universe
- Use simple analogies and build from what students already know
- Celebrate curiosity and questions
- When students struggle, offer alternative explanations
- Remind students that the atoms in their body were forged in stars

Current context: You're helping a student learn about atomic structure, electron configuration, orbitals, and the foundations of organic chemistry. Focus on building confidence through understanding.

Keep responses concise but complete. Use markdown for formatting when helpful.`,
        messages: [
          ...conversationHistory,
          { role: 'user', content: message }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Anthropic API error:', errorData);
      return res.status(response.status).json({ 
        error: 'API request failed',
        details: errorData 
      });
    }

    const data = await response.json();
    
    // Extract the text response
    const assistantMessage = data.content[0]?.text || 'I apologize, but I could not generate a response.';

    return res.status(200).json({ 
      message: assistantMessage,
      usage: data.usage 
    });

  } catch (error) {
    console.error('Error calling Anthropic API:', error);
    return res.status(500).json({ 
      error: 'Failed to process request',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Vercel serverless function config
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};
