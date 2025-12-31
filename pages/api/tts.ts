// api/tts.ts
// Vercel Serverless Function for Text-to-Speech
// Supports both OpenAI TTS and ElevenLabs

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text, provider = 'openai' } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  // Limit text length to control costs
  if (text.length > 2000) {
    return res.status(400).json({ error: 'Text too long. Maximum 2000 characters.' });
  }

  try {
    if (provider === 'elevenlabs') {
      return await handleElevenLabs(text, res);
    } else {
      return await handleOpenAI(text, res);
    }
  } catch (error) {
    console.error('TTS Error:', error);
    return res.status(500).json({ 
      error: 'Failed to generate speech',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function handleOpenAI(text: string, res: NextApiResponse) {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ error: 'OpenAI API key not configured' });
  }

  const response = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'tts-1',
      input: text,
      voice: 'nova', // Options: alloy, echo, fable, onyx, nova, shimmer
      response_format: 'mp3'
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`OpenAI TTS failed: ${JSON.stringify(error)}`);
  }

  // Get the audio as a buffer
  const audioBuffer = await response.arrayBuffer();
  
  // Send as base64 encoded audio
  const base64Audio = Buffer.from(audioBuffer).toString('base64');
  
  return res.status(200).json({ 
    audio: base64Audio,
    format: 'mp3',
    provider: 'openai'
  });
}

async function handleElevenLabs(text: string, res: NextApiResponse) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ error: 'ElevenLabs API key not configured' });
  }

  // Using "Rachel" voice - calm, clear, good for education
  // You can change this voice ID or make it configurable
  const voiceId = process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM'; // Rachel

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.0,
          use_speaker_boost: true
        }
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`ElevenLabs TTS failed: ${error}`);
  }

  const audioBuffer = await response.arrayBuffer();
  const base64Audio = Buffer.from(audioBuffer).toString('base64');
  
  return res.status(200).json({ 
    audio: base64Audio,
    format: 'mp3',
    provider: 'elevenlabs'
  });
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '100kb',
    },
  },
};
