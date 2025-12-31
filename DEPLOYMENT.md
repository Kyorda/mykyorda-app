# Ky'Orda Deployment Guide

## Quick Start (Beta Testing)

### Prerequisites
- GitHub account
- Vercel account (free at vercel.com)
- Anthropic API key (from console.anthropic.com)
- Optional: OpenAI API key for voice (from platform.openai.com)

---

## Step 1: Prepare the Code

1. Create a new GitHub repository called `kyorda-chemistry`
2. Upload all files from this project folder
3. Make sure NOT to upload `.env.local` (it contains secrets)

---

## Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure the project:
   - Framework Preset: **Next.js**
   - Root Directory: **/** (leave as default)
   - Build Command: `next build`
   - Output Directory: `.next`

5. **Add Environment Variables** (click "Environment Variables"):
   
   | Name | Value |
   |------|-------|
   | `ANTHROPIC_API_KEY` | Your Anthropic API key |
   | `OPENAI_API_KEY` | Your OpenAI API key (for voice) |
   | `ADMIN_KEY` | A random string for admin access |
   | `NEXT_PUBLIC_TTS_PROVIDER` | `openai` |
   | `NEXT_PUBLIC_VOICE_ENABLED` | `true` |
   | `NEXT_PUBLIC_FEEDBACK_ENABLED` | `true` |

6. Click **Deploy**

7. Wait 1-2 minutes for deployment

8. Your app is live at: `https://your-project-name.vercel.app`

---

## Step 3: Generate QR Code

1. Copy your Vercel URL (e.g., `https://kyorda-chemistry.vercel.app`)
2. Go to [qr-code-generator.com](https://www.qr-code-generator.com/) or similar
3. Paste your URL and generate QR code
4. Download or print the QR code

---

## Step 4: Test on Mobile

1. Open camera on your phone
2. Point at QR code
3. Tap the link that appears
4. App loads in browser

**To Install as PWA (looks like real app):**
- **iPhone**: Tap Share button → "Add to Home Screen"
- **Android**: Tap menu (⋮) → "Add to Home Screen" or "Install App"

---

## Beta Testing Protocol

### For Students:
1. Scan QR code with phone camera
2. Optionally install to home screen
3. Work through the concepts
4. Use thumbs up/down to rate each section
5. Use feedback button to report issues or suggestions

### For You (Donald):
1. View feedback at: `https://your-app.vercel.app/api/feedback`
   - Add header: `x-admin-key: your-admin-key`
2. Or check Airtable/webhook if configured

---

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/chat` | POST | Q&A with Ky'Orda AI |
| `/api/tts` | POST | Text-to-speech conversion |
| `/api/feedback` | POST | Submit feedback |
| `/api/feedback` | GET | View feedback (admin only) |

---

## Cost Estimates (Beta Test with 20 students)

| Service | Usage | Cost |
|---------|-------|------|
| Vercel Hosting | Free tier | $0 |
| Anthropic (Q&A) | ~100 questions | ~$1-2 |
| OpenAI TTS | ~50,000 chars | ~$0.75 |
| **Total** | | **~$2-3** |

---

## Troubleshooting

**"API not configured" error:**
- Check that ANTHROPIC_API_KEY is set in Vercel dashboard
- Redeploy after adding environment variables

**Voice not working:**
- Check OPENAI_API_KEY is set
- Check NEXT_PUBLIC_VOICE_ENABLED is `true`

**App not updating:**
- Vercel auto-deploys on git push
- Or manually redeploy from Vercel dashboard

**Students can't install PWA:**
- Make sure they're using HTTPS (Vercel provides this)
- Some browsers need a second visit before showing install prompt

---

## Next Steps After Beta

1. Review student feedback
2. Identify pain points and confusion areas
3. Iterate on content and UX
4. Consider custom domain (e.g., kyorda.com)
5. Scale up if successful!

---

## Support

Questions? Issues? 
- Check Vercel logs for errors
- API issues: Check console.anthropic.com usage dashboard
