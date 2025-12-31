// api/feedback.ts
// Vercel Serverless Function to collect beta tester feedback
// Stores in Vercel KV (Redis) or can be configured for Airtable/Google Sheets

import type { NextApiRequest, NextApiResponse } from 'next';

interface FeedbackData {
  type: 'rating' | 'comment' | 'issue' | 'suggestion';
  conceptId?: string;
  conceptTitle?: string;
  rating?: number; // 1-5 or thumbs up/down (1 or 0)
  comment?: string;
  timestamp: string;
  sessionId: string;
  deviceInfo?: string;
}

// In-memory storage for demo (replace with database in production)
// For production, use Vercel KV, Supabase, or Airtable
const feedbackStore: FeedbackData[] = [];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Handle CORS for browser requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    return handleSubmitFeedback(req, res);
  }

  if (req.method === 'GET') {
    return handleGetFeedback(req, res);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

async function handleSubmitFeedback(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { 
    type, 
    conceptId, 
    conceptTitle, 
    rating, 
    comment, 
    sessionId,
    deviceInfo 
  } = req.body;

  if (!type || !sessionId) {
    return res.status(400).json({ 
      error: 'Missing required fields: type and sessionId' 
    });
  }

  const feedback: FeedbackData = {
    type,
    conceptId,
    conceptTitle,
    rating,
    comment,
    timestamp: new Date().toISOString(),
    sessionId,
    deviceInfo
  };

  // Option 1: Store in memory (demo only)
  feedbackStore.push(feedback);

  // Option 2: Store in Airtable (uncomment and configure)
  // await storeInAirtable(feedback);

  // Option 3: Store in Google Sheets (uncomment and configure)
  // await storeInGoogleSheets(feedback);

  // Option 4: Send to webhook (e.g., Zapier, Make.com)
  // await sendToWebhook(feedback);

  console.log('Feedback received:', feedback);

  return res.status(200).json({ 
    success: true, 
    message: 'Thank you for your feedback!' 
  });
}

async function handleGetFeedback(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Simple auth check for viewing feedback (use proper auth in production)
  const authKey = req.headers['x-admin-key'];
  
  if (authKey !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  return res.status(200).json({ 
    feedback: feedbackStore,
    count: feedbackStore.length 
  });
}

// Airtable integration (optional)
async function storeInAirtable(feedback: FeedbackData) {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableName = process.env.AIRTABLE_TABLE_NAME || 'Feedback';

  if (!apiKey || !baseId) {
    console.warn('Airtable not configured');
    return;
  }

  await fetch(`https://api.airtable.com/v0/${baseId}/${tableName}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      records: [{
        fields: {
          Type: feedback.type,
          ConceptId: feedback.conceptId || '',
          ConceptTitle: feedback.conceptTitle || '',
          Rating: feedback.rating || 0,
          Comment: feedback.comment || '',
          Timestamp: feedback.timestamp,
          SessionId: feedback.sessionId,
          DeviceInfo: feedback.deviceInfo || ''
        }
      }]
    }),
  });
}

// Webhook integration (optional - for Zapier, Make.com, etc.)
async function sendToWebhook(feedback: FeedbackData) {
  const webhookUrl = process.env.FEEDBACK_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn('Webhook URL not configured');
    return;
  }

  await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(feedback),
  });
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50kb',
    },
  },
};
