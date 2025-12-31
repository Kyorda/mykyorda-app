# Ky'Orda Chemistry

**AI-powered chemistry learning - connecting you to your cosmic heritage**

Ky'Orda is an adaptive learning app that helps students master organic chemistry by connecting atomic concepts to their cosmic origins. Every atom in your body was forged in the heart of dying stars!

## Features

- 🌟 **Interactive 3D Visualizations** - Quantum orbitals, molecular structures
- 🤖 **AI Tutor (Ky'Orda)** - Ask questions, get personalized explanations  
- 📊 **Adaptive Learning** - System adapts to your pace and style
- 🎯 **Knowledge Checks** - Test understanding with immediate feedback
- 🔊 **Voice Mode** - Listen to explanations (optional)
- 📱 **PWA** - Install as an app on your phone

## Quick Start

### Prerequisites
- Node.js 18+
- Anthropic API key

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/kyorda-chemistry.git
cd kyorda-chemistry

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Edit .env.local and add your API keys
# ANTHROPIC_API_KEY=sk-ant-...

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment instructions.

### Quick Deploy to Vercel

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

## Project Structure

```
kyorda-app/
├── components/
│   └── KyordaApp.tsx      # Main app component
├── hooks/
│   └── useKyordaAPI.ts    # API hooks for chat, TTS, feedback
├── pages/
│   ├── _app.tsx           # App wrapper with PWA setup
│   ├── index.tsx          # Main page
│   └── api/
│       ├── chat.ts        # Anthropic API proxy
│       ├── tts.ts         # Text-to-speech API
│       └── feedback.ts    # Beta feedback collection
├── public/
│   ├── manifest.json      # PWA manifest
│   └── sw.js              # Service worker
├── styles/
│   └── globals.css        # Global styles + Tailwind
└── DEPLOYMENT.md          # Deployment guide
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/chat` | POST | Chat with Ky'Orda AI |
| `/api/tts` | POST | Text-to-speech |
| `/api/feedback` | POST | Submit feedback |
| `/api/feedback` | GET | View feedback (admin) |

## Environment Variables

See `.env.example` for all available configuration options.

Required:
- `ANTHROPIC_API_KEY` - For AI chat functionality

Optional:
- `OPENAI_API_KEY` - For voice/TTS
- `ELEVENLABS_API_KEY` - Alternative TTS provider

## Curriculum

1. **Building Blocks** - Atoms, protons, neutrons, electrons
2. **Electrons** - Properties and behavior  
3. **Stability Rule** - The octet rule explained
4. **Carbon** - The star of organic chemistry
5. **Quantum Mechanics** - Shells, orbitals, Schrödinger
6. **Bonding** - Covalent bonds, electron sharing
7. **Real Molecules** - Water, glucose, glycine
8. **The Grand Connection** - From stars to you

## Credits

Created by Donald Murphy and the Ky'Orda team.

Built with:
- Next.js
- React
- Three.js
- Tailwind CSS
- Anthropic Claude API

## License

Proprietary - Ky'Orda Inc.
