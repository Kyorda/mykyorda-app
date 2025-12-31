import React, { useState, useEffect, useRef, FC } from 'react';
import { ChevronRight, Star, ArrowRight, CheckCircle, MessageCircle, TrendingUp, Award, Sparkles, Atom, Brain, BarChart3 } from 'lucide-react';
import * as THREE from 'three';

// ============================================
// TYPESCRIPT TYPE DEFINITIONS
// ============================================

interface NebulaColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

interface KnowledgeCheck {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface Concept {
  id: string;
  title: string;
  wisdom: string;
  explanation: string;
  visualType: string;
  orbitalType?: string;
  knowledgeChecks: KnowledgeCheck[];
}

interface Module {
  title: string;
  concepts: Concept[];
}

interface ConceptAttempt {
  timestamp: number;
  confidence: number;
  questionsCorrect: number;
  questionsTotal: number;
  timeSpent: number;
  usedChat: boolean;
  triggeredAdaptiveHelp: boolean;
}

interface ConceptPerformance {
  attempts: ConceptAttempt[];
  totalTime: number;
  averageConfidence: number;
  questionAccuracy: number;
  revisits: number;
}

interface LearnerProfile {
  learningStyle: string | null;
  pacePreference: string | null;
  strengthAreas: string[];
  struggleAreas: string[];
  confidencePattern: number[];
  engagementLevel: string;
  preferredExplanationType: string | null;
}

interface AnalyticsEvent {
  timestamp: number;
  sessionId: string;
  eventType: string;
  data: Record<string, any>;
  timeInSession: number;
}

interface Recommendation {
  type: string;
  message: string;
  priority: string;
}

interface AnalyticsReport {
  sessionId: string;
  sessionDuration: number;
  totalEvents: number;
  conceptPerformance: Record<string, ConceptPerformance>;
  learnerProfile: LearnerProfile;
  recommendations: Recommendation[];
}

interface Progress {
  completedConcepts: number;
  totalConcepts: number;
  confidenceScores: number[];
  strengths: string[];
  needsWork: string[];
  conceptHistory: Array<{
    id: string;
    confidence: number;
    knowledgeCheckScore: number;
    timestamp: string;
  }>;
}

interface AdaptiveHelpContent {
  type: string;
  message: string;
  suggestions: string[];
  alternativeExplanation: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// ============================================
// REALISTIC NEBULA VISUALIZATION (Canvas-based)
// ============================================
interface RealisticNebulaProps {
  size?: number;
}

const RealisticNebula: FC<RealisticNebulaProps> = ({ size = 200 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Clear canvas
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, width, height);
    
    // Create nebula colors (Crab Nebula inspired - blues, oranges, reds, purples)
    const nebulaColors = [
      { r: 255, g: 100, b: 50, a: 0.3 },   // Orange/red filaments
      { r: 100, g: 150, b: 255, a: 0.4 },  // Blue glow
      { r: 255, g: 200, b: 100, a: 0.2 },  // Yellow wisps
      { r: 200, g: 100, b: 255, a: 0.3 },  // Purple haze
      { r: 255, g: 80, b: 80, a: 0.25 },   // Red regions
      { r: 100, g: 255, b: 200, a: 0.2 },  // Teal accents
    ];
    
    // Draw multiple nebula layers
    for (let layer = 0; layer < 8; layer++) {
      const color = nebulaColors[layer % nebulaColors.length];
      
      // Create organic cloud shapes
      for (let i = 0; i < 150; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * (size * 0.45) * (0.3 + Math.random() * 0.7);
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        
        const cloudSize = 5 + Math.random() * 30;
        
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, cloudSize);
        gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`);
        gradient.addColorStop(0.5, `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a * 0.5})`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, cloudSize, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Add filament structures (like the Crab Nebula's famous filaments)
    ctx.lineWidth = 1;
    for (let i = 0; i < 60; i++) {
      const startAngle = Math.random() * Math.PI * 2;
      const startDist = Math.random() * size * 0.2;
      const endDist = startDist + Math.random() * size * 0.3;
      
      const startX = centerX + Math.cos(startAngle) * startDist;
      const startY = centerY + Math.sin(startAngle) * startDist;
      const endX = centerX + Math.cos(startAngle + (Math.random() - 0.5) * 0.5) * endDist;
      const endY = centerY + Math.sin(startAngle + (Math.random() - 0.5) * 0.5) * endDist;
      
      const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
      const color = nebulaColors[Math.floor(Math.random() * nebulaColors.length)];
      gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);
      gradient.addColorStop(0.5, `rgba(${color.r}, ${color.g}, ${color.b}, 0.6)`);
      gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);
      
      ctx.strokeStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      
      // Curved filament
      const controlX = (startX + endX) / 2 + (Math.random() - 0.5) * 30;
      const controlY = (startY + endY) / 2 + (Math.random() - 0.5) * 30;
      ctx.quadraticCurveTo(controlX, controlY, endX, endY);
      ctx.stroke();
    }
    
    // Add bright central pulsar glow
    const pulsarGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, size * 0.15);
    pulsarGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    pulsarGradient.addColorStop(0.2, 'rgba(200, 220, 255, 0.6)');
    pulsarGradient.addColorStop(0.5, 'rgba(100, 150, 255, 0.3)');
    pulsarGradient.addColorStop(1, 'rgba(50, 50, 150, 0)');
    
    ctx.fillStyle = pulsarGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, size * 0.15, 0, Math.PI * 2);
    ctx.fill();
    
    // Add stars
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const starSize = Math.random() * 1.5;
      const brightness = 0.3 + Math.random() * 0.7;
      
      ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
      ctx.beginPath();
      ctx.arc(x, y, starSize, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Add outer glow
    const outerGlow = ctx.createRadialGradient(centerX, centerY, size * 0.3, centerX, centerY, size * 0.5);
    outerGlow.addColorStop(0, 'rgba(100, 50, 150, 0)');
    outerGlow.addColorStop(0.7, 'rgba(80, 40, 120, 0.1)');
    outerGlow.addColorStop(1, 'rgba(20, 10, 40, 0.3)');
    
    ctx.fillStyle = outerGlow;
    ctx.beginPath();
    ctx.arc(centerX, centerY, size * 0.5, 0, Math.PI * 2);
    ctx.fill();
    
  }, [size]);
  
  return (
    <canvas 
      ref={canvasRef} 
      width={size} 
      height={size}
      className="rounded-full shadow-2xl"
      style={{
        boxShadow: '0 0 60px rgba(147, 51, 234, 0.5), 0 0 100px rgba(79, 70, 229, 0.3)'
      }}
    />
  );
};

// ============================================
// ML LEARNING ANALYTICS SYSTEM
// ============================================
class LearningAnalytics {
  sessionId: string;
  startTime: number;
  events: AnalyticsEvent[];
  conceptPerformance: Record<string, ConceptPerformance>;
  learnerProfile: LearnerProfile;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    this.events = [];
    this.conceptPerformance = {};
    this.learnerProfile = {
      learningStyle: null, // visual, reading, kinesthetic
      pacePreference: null, // slow, medium, fast
      strengthAreas: [],
      struggleAreas: [],
      confidencePattern: [],
      engagementLevel: 'medium',
      preferredExplanationType: null
    };
  }

  generateSessionId(): string {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Track every interaction
  trackEvent(eventType: string, data: Record<string, any>): AnalyticsEvent {
    const event = {
      timestamp: Date.now(),
      sessionId: this.sessionId,
      eventType,
      data,
      timeInSession: Date.now() - this.startTime
    };
    this.events.push(event);
    this.analyzePatterns();
    return event;
  }

  // Track concept performance
  trackConceptAttempt(conceptId: string, data: Omit<ConceptAttempt, 'timestamp'>): void {
    if (!this.conceptPerformance[conceptId]) {
      this.conceptPerformance[conceptId] = {
        attempts: [],
        totalTime: 0,
        averageConfidence: 0,
        questionAccuracy: 0,
        revisits: 0
      };
    }

    const perf = this.conceptPerformance[conceptId];
    perf.attempts.push({
      timestamp: Date.now(),
      confidence: data.confidence,
      questionsCorrect: data.questionsCorrect,
      questionsTotal: data.questionsTotal,
      timeSpent: data.timeSpent,
      usedChat: data.usedChat,
      triggeredAdaptiveHelp: data.triggeredAdaptiveHelp
    });

    // Update aggregates
    perf.totalTime += data.timeSpent;
    perf.averageConfidence = perf.attempts.reduce((sum, a) => sum + a.confidence, 0) / perf.attempts.length;
    perf.questionAccuracy = perf.attempts.reduce((sum, a) => sum + (a.questionsCorrect / a.questionsTotal), 0) / perf.attempts.length;
    if (perf.attempts.length > 1) perf.revisits++;

    this.trackEvent('concept_attempt', { conceptId, ...data });
  }

  // Analyze patterns to build learner profile
  analyzePatterns(): void {
    const recentEvents = this.events.slice(-20);
    
    // Analyze time spent patterns
    const avgTimePerConcept = this.calculateAverageTimePerConcept();
    if (avgTimePerConcept > 180000) { // > 3 minutes
      this.learnerProfile.pacePreference = 'slow';
    } else if (avgTimePerConcept < 60000) { // < 1 minute
      this.learnerProfile.pacePreference = 'fast';
    } else {
      this.learnerProfile.pacePreference = 'medium';
    }

    // Analyze visual engagement
    const visualInteractions = this.events.filter(e => 
      e.eventType === 'visual_interaction' || e.eventType === '3d_rotation'
    ).length;
    const chatInteractions = this.events.filter(e => e.eventType === 'chat_message').length;

    if (visualInteractions > chatInteractions * 2) {
      this.learnerProfile.learningStyle = 'visual';
    } else if (chatInteractions > visualInteractions * 2) {
      this.learnerProfile.learningStyle = 'reading';
    } else {
      this.learnerProfile.learningStyle = 'mixed';
    }

    // Identify strength and struggle areas
    this.updateStrengthsAndStruggles();

    // Calculate engagement level
    const recentConfidences = this.events
      .filter(e => e.eventType === 'confidence_set')
      .slice(-5)
      .map(e => e.data.level);
    
    if (recentConfidences.length > 0) {
      const avgConfidence = recentConfidences.reduce((a, b) => a + b, 0) / recentConfidences.length;
      if (avgConfidence >= 4) this.learnerProfile.engagementLevel = 'high';
      else if (avgConfidence <= 2) this.learnerProfile.engagementLevel = 'low';
      else this.learnerProfile.engagementLevel = 'medium';
    }
  }

  calculateAverageTimePerConcept(): number {
    const conceptTimes = Object.values(this.conceptPerformance).map(c => c.totalTime);
    if (conceptTimes.length === 0) return 90000; // default 1.5 min
    return conceptTimes.reduce((a, b) => a + b, 0) / conceptTimes.length;
  }

  updateStrengthsAndStruggles(): void {
    this.learnerProfile.strengthAreas = [];
    this.learnerProfile.struggleAreas = [];

    for (const [conceptId, perf] of Object.entries(this.conceptPerformance)) {
      if (perf.averageConfidence >= 4 && perf.questionAccuracy >= 0.8) {
        this.learnerProfile.strengthAreas.push(conceptId);
      } else if (perf.averageConfidence <= 2 || perf.questionAccuracy < 0.5) {
        this.learnerProfile.struggleAreas.push(conceptId);
      }
    }
  }

  // Get personalized recommendations
  getRecommendations(): Recommendation[] {
    const recommendations = [];

    if (this.learnerProfile.struggleAreas.length > 0) {
      recommendations.push({
        type: 'review',
        message: `Consider reviewing: ${this.learnerProfile.struggleAreas.join(', ')}`,
        priority: 'high'
      });
    }

    if (this.learnerProfile.pacePreference === 'slow') {
      recommendations.push({
        type: 'pace',
        message: 'Take your time - depth of understanding is more important than speed',
        priority: 'medium'
      });
    }

    if (this.learnerProfile.learningStyle === 'visual') {
      recommendations.push({
        type: 'style',
        message: 'You learn well visually - spend more time with 3D models',
        priority: 'low'
      });
    }

    return recommendations;
  }

  // Get full analytics report
  getAnalyticsReport(): AnalyticsReport {
    return {
      sessionId: this.sessionId,
      sessionDuration: Date.now() - this.startTime,
      totalEvents: this.events.length,
      conceptPerformance: this.conceptPerformance,
      learnerProfile: this.learnerProfile,
      recommendations: this.getRecommendations()
    };
  }

  // Export data (for backend sync)
  exportForBackend(): string {
    return JSON.stringify({
      ...this.getAnalyticsReport(),
      events: this.events
    });
  }
}

// ============================================
// D-ID AVATAR INTEGRATION
// ============================================
interface DIDConfig {
  apiUrl: string;
  presenterUrl: string;
  voiceId: string;
}

interface DIDAvatarProps {
  text?: string;
  isVisible?: boolean;
  apiKey?: string | null;
  onSpeakingStart?: () => void;
  onSpeakingEnd?: () => void;
}

const DIDAvatar: FC<DIDAvatarProps> = ({ 
  text, 
  isVisible = true, 
  apiKey = null,
  onSpeakingStart,
  onSpeakingEnd 
}) => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // D-ID API configuration
  const DID_CONFIG: DIDConfig = {
    apiUrl: 'https://api.d-id.com',
    // Default presenter - can be customized
    presenterUrl: 'https://create-images-results.d-id.com/DefaultPresenters/Emma_f/image.png',
    voiceId: 'en-US-JennyNeural', // Microsoft Azure voice
  };

  const generateSpeakingVideo = async (scriptText: string): Promise<string | null> => {
    if (!apiKey) {
      console.log('D-ID API key not configured - using fallback');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Create a talk
      const response = await fetch(`${DID_CONFIG.apiUrl}/talks`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source_url: DID_CONFIG.presenterUrl,
          script: {
            type: 'text',
            input: scriptText,
            provider: {
              type: 'microsoft',
              voice_id: DID_CONFIG.voiceId
            }
          },
          config: {
            stitch: true,
            pad_audio: 0.5
          }
        })
      });

      if (!response.ok) {
        throw new Error(`D-ID API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Poll for completion
      const talkId = data.id;
      let resultUrl = null;
      
      for (let i = 0; i < 30; i++) {
        await new Promise(r => setTimeout(r, 2000));
        
        const statusResponse = await fetch(`${DID_CONFIG.apiUrl}/talks/${talkId}`, {
          headers: { 'Authorization': `Basic ${apiKey}` }
        });
        
        const statusData = await statusResponse.json();
        
        if (statusData.status === 'done') {
          resultUrl = statusData.result_url;
          break;
        } else if (statusData.status === 'error') {
          throw new Error('Video generation failed');
        }
      }

      setVideoUrl(resultUrl);
      return resultUrl;

    } catch (err: any) {
      console.error('D-ID error:', err);
      setError(err?.message || 'Unknown error');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Fallback to browser TTS when D-ID not available
  const speakWithTTS = (text: string): void => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.onstart = onSpeakingStart || null;
      utterance.onend = onSpeakingEnd || null;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    if (text && isVisible) {
      if (apiKey) {
        generateSpeakingVideo(text);
      } else {
        // Use browser TTS as fallback
        speakWithTTS(text);
      }
    }
  }, [text, isVisible, apiKey]);

  if (!isVisible) return null;

  return (
    <div className="relative">
      {isLoading && (
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <span className="ml-2 text-purple-600">Generating avatar...</span>
        </div>
      )}
      
      {videoUrl && (
        <video 
          ref={videoRef}
          src={videoUrl}
          autoPlay
          onPlay={onSpeakingStart}
          onEnded={onSpeakingEnd}
          className="rounded-xl shadow-lg"
        />
      )}
      
      {error && (
        <div className="text-red-500 text-sm p-2">
          Avatar unavailable: {error}
        </div>
      )}
    </div>
  );
};

// Analytics Dashboard Component
interface AnalyticsDashboardProps {
  analytics: LearningAnalytics;
  isVisible: boolean;
  onClose: () => void;
}

const AnalyticsDashboard: FC<AnalyticsDashboardProps> = ({ analytics, isVisible, onClose }) => {
  if (!isVisible) return null;
  
  const report = analytics.getAnalyticsReport();
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto shadow-2xl">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-white">
              <Brain className="w-6 h-6" />
              <h3 className="font-bold text-lg">Learning Analytics</h3>
            </div>
            <button onClick={onClose} className="text-white text-2xl">×</button>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          {/* Learner Profile */}
          <div className="bg-purple-50 rounded-lg p-4">
            <h4 className="font-bold text-purple-900 mb-2 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Your Learning Profile
            </h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-600">Learning Style:</span>
                <span className="ml-2 font-semibold text-purple-700 capitalize">
                  {report.learnerProfile.learningStyle || 'Analyzing...'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Pace:</span>
                <span className="ml-2 font-semibold text-purple-700 capitalize">
                  {report.learnerProfile.pacePreference || 'Analyzing...'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Engagement:</span>
                <span className="ml-2 font-semibold text-purple-700 capitalize">
                  {report.learnerProfile.engagementLevel}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Session Time:</span>
                <span className="ml-2 font-semibold text-purple-700">
                  {Math.round(report.sessionDuration / 60000)}m
                </span>
              </div>
            </div>
          </div>

          {/* Strengths */}
          {report.learnerProfile.strengthAreas.length > 0 && (
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-bold text-green-900 mb-2">💪 Your Strengths</h4>
              <div className="flex flex-wrap gap-2">
                {report.learnerProfile.strengthAreas.map((area, idx) => (
                  <span key={idx} className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-sm">
                    {area}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Areas to Improve */}
          {report.learnerProfile.struggleAreas.length > 0 && (
            <div className="bg-orange-50 rounded-lg p-4">
              <h4 className="font-bold text-orange-900 mb-2">🎯 Focus Areas</h4>
              <div className="flex flex-wrap gap-2">
                {report.learnerProfile.struggleAreas.map((area, idx) => (
                  <span key={idx} className="bg-orange-200 text-orange-800 px-2 py-1 rounded-full text-sm">
                    {area}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {report.recommendations.length > 0 && (
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-bold text-blue-900 mb-2">💡 Recommendations</h4>
              <ul className="space-y-2 text-sm text-blue-800">
                {report.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="mr-2">•</span>
                    {rec.message}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Concept Performance */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-bold text-gray-900 mb-2">📊 Concept Performance</h4>
            <div className="space-y-2">
              {Object.entries(report.conceptPerformance).map(([conceptId, perf]) => (
                <div key={conceptId} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">{conceptId}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-yellow-600">★ {perf.averageConfidence.toFixed(1)}</span>
                    <span className="text-green-600">{Math.round(perf.questionAccuracy * 100)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-gray-500 text-center">
            This data is stored privately and used only to personalize your learning experience.
          </p>
        </div>
      </div>
    </div>
  );
};

// Nebula Avatar Component
interface NebulaAvatarProps {
  size?: 'small' | 'normal' | 'large';
  isThinking?: boolean;
  speaking?: boolean;
}

const NebulaAvatar: FC<NebulaAvatarProps> = ({ size = 'normal', isThinking = false, speaking = false }) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    
    const sizeMap = { small: 64, normal: 96, large: 200 };
    const pixelSize = sizeMap[size];
    renderer.setSize(pixelSize, pixelSize);
    
    const geometry = new THREE.BufferGeometry();
    const particles = 800;
    const positions = new Float32Array(particles * 3);
    const colors = new Float32Array(particles * 3);
    
    for (let i = 0; i < particles * 3; i += 3) {
      const radius = Math.random() * 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = radius * Math.cos(phi);
      
      const colorChoice = Math.random();
      if (colorChoice < 0.4) {
        colors[i] = 0.6 + Math.random() * 0.4;
        colors[i + 1] = 0.2 + Math.random() * 0.3;
        colors[i + 2] = 0.8 + Math.random() * 0.2;
      } else if (colorChoice < 0.7) {
        colors[i] = 0.2 + Math.random() * 0.3;
        colors[i + 1] = 0.4 + Math.random() * 0.4;
        colors[i + 2] = 0.9 + Math.random() * 0.1;
      } else {
        colors[i] = 1.0;
        colors[i + 1] = 0.7 + Math.random() * 0.3;
        colors[i + 2] = 0.2 + Math.random() * 0.2;
      }
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    
    const nebula = new THREE.Points(geometry, material);
    scene.add(nebula);
    
    camera.position.z = 5;
    
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      nebula.rotation.y += isThinking ? 0.02 : 0.005;
      nebula.rotation.x += isThinking ? 0.01 : 0.002;
      renderer.render(scene, camera);
    };
    animate();
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [size, isThinking, speaking]);
  
  return (
    <div className={`relative ${speaking ? 'animate-pulse' : ''}`}>
      <canvas ref={canvasRef} className="rounded-full" />
      {speaking && (
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse" />
      )}
    </div>
  );
};

// Atomic Structure Visualization (Protons, Neutrons, Electrons)
const AtomicStructureVisual = () => {
  return (
    <div className="space-y-6">
      {/* Carbon Atom Diagram */}
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-6 border-2 border-slate-300">
        <h4 className="text-center font-bold text-gray-900 mb-2">The Carbon Atom</h4>
        <p className="text-center text-gray-600 text-sm mb-4">6 Protons • 6 Neutrons • 6 Electrons</p>
        <div className="flex justify-center items-center" style={{ minHeight: '280px' }}>
          <div className="relative" style={{ width: '260px', height: '260px' }}>
            {/* Nucleus with 6 protons and 6 neutrons */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-br from-orange-200 to-orange-300 rounded-full flex items-center justify-center shadow-lg border-4 border-orange-400 z-10">
              <div className="flex flex-wrap justify-center gap-1 p-2">
                {/* 6 Protons (red with +) */}
                <div className="w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold shadow">+</div>
                <div className="w-5 h-5 bg-gray-500 rounded-full text-white text-xs flex items-center justify-center font-bold shadow">n</div>
                <div className="w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold shadow">+</div>
                <div className="w-5 h-5 bg-gray-500 rounded-full text-white text-xs flex items-center justify-center font-bold shadow">n</div>
                <div className="w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold shadow">+</div>
                <div className="w-5 h-5 bg-gray-500 rounded-full text-white text-xs flex items-center justify-center font-bold shadow">n</div>
                <div className="w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold shadow">+</div>
                <div className="w-5 h-5 bg-gray-500 rounded-full text-white text-xs flex items-center justify-center font-bold shadow">n</div>
                <div className="w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold shadow">+</div>
                <div className="w-5 h-5 bg-gray-500 rounded-full text-white text-xs flex items-center justify-center font-bold shadow">n</div>
                <div className="w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold shadow">+</div>
                <div className="w-5 h-5 bg-gray-500 rounded-full text-white text-xs flex items-center justify-center font-bold shadow">n</div>
              </div>
            </div>
            
            {/* Inner shell (n=1) - 2 electrons */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border-2 border-blue-400 rounded-full" />
            {[0, 180].map((angle, i) => {
              const radian = (angle * Math.PI) / 180;
              const x = Math.cos(radian) * 70;
              const y = Math.sin(radian) * 70;
              return (
                <div
                  key={`inner-${i}`}
                  className="absolute w-6 h-6 bg-blue-500 rounded-full border-2 border-blue-700 flex items-center justify-center text-white text-xs font-bold shadow-lg"
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  −
                </div>
              );
            })}
            
            {/* Outer shell (n=2) - 4 electrons */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 border-2 border-dashed border-blue-300 rounded-full" />
            {[45, 135, 225, 315].map((angle, i) => {
              const radian = (angle * Math.PI) / 180;
              const x = Math.cos(radian) * 115;
              const y = Math.sin(radian) * 115;
              return (
                <div
                  key={`outer-${i}`}
                  className="absolute w-6 h-6 bg-blue-500 rounded-full border-2 border-blue-700 flex items-center justify-center text-white text-xs font-bold shadow-lg animate-pulse"
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                    transform: 'translate(-50%, -50%)',
                    animationDelay: `${i * 0.2}s`
                  }}
                >
                  −
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Shell Labels */}
        <div className="flex justify-center gap-6 mt-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-blue-400 rounded-full" />
            <span className="text-gray-700">Shell 1: 2 electrons</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-dashed border-blue-300 rounded-full" />
            <span className="text-gray-700">Shell 2: 4 electrons</span>
          </div>
        </div>
      </div>

      {/* Particle Legend */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-red-50 rounded-lg p-4 border-2 border-red-300">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg">+</div>
            <span className="font-bold text-red-900">Proton</span>
          </div>
          <ul className="text-sm text-red-800 space-y-1">
            <li>• Positive charge (+1)</li>
            <li>• In nucleus</li>
            <li>• Defines element</li>
            <li>• Carbon has 6</li>
          </ul>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-300">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white font-bold text-lg">n</div>
            <span className="font-bold text-gray-900">Neutron</span>
          </div>
          <ul className="text-sm text-gray-800 space-y-1">
            <li>• No charge (0)</li>
            <li>• In nucleus</li>
            <li>• Adds stability</li>
            <li>• Carbon has 6</li>
          </ul>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-400 ring-2 ring-blue-300">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg animate-pulse">−</div>
            <span className="font-bold text-blue-900">Electron</span>
          </div>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Negative charge (-1)</li>
            <li>• Orbits nucleus</li>
            <li>• <strong>KEY TO BONDING!</strong></li>
            <li>• Carbon has 6</li>
          </ul>
        </div>
      </div>

      {/* Key Message */}
      <div className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-500">
        <p className="text-yellow-900 font-semibold text-center">
          ⚡ Protons & neutrons are locked in the nucleus. <strong>ELECTRONS</strong> are what move, share, and create bonds!
        </p>
      </div>
    </div>
  );
};

// Electron Properties Visualization
const ElectronPropertiesVisual = () => {
  return (
    <div className="space-y-6">
      {/* Electron Hero */}
      <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl p-6 border-2 border-blue-400">
        <div className="flex items-center justify-center mb-4">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl animate-pulse">
            <span className="text-white text-5xl font-bold">e⁻</span>
          </div>
        </div>
        <h4 className="text-center font-bold text-gray-900 text-xl mb-2">The Electron</h4>
        <p className="text-center text-gray-700">Chemistry's Main Character</p>
      </div>

      {/* Key Properties */}
      <div className="space-y-4">
        {/* Charge */}
        <div className="bg-white rounded-lg p-4 shadow border-l-4 border-blue-500">
          <h5 className="font-bold text-gray-900 mb-2">1. Negative Charge (-1)</h5>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">+</div>
              <span className="text-2xl">↔️</span>
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">−</div>
            </div>
            <p className="text-sm text-gray-700">Opposite charges attract! Electrons are pulled toward the positive nucleus.</p>
          </div>
        </div>

        {/* Quantum */}
        <div className="bg-white rounded-lg p-4 shadow border-l-4 border-purple-500">
          <h5 className="font-bold text-gray-900 mb-2">2. Quantum Behavior</h5>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-purple-400 rounded-full relative">
                <div className="absolute inset-0 bg-purple-300 rounded-full opacity-30 animate-ping" />
              </div>
            </div>
            <p className="text-sm text-gray-700">Electrons exist in "probability clouds" - specific energy levels, not fixed orbits like planets.</p>
          </div>
        </div>

        {/* Electronegativity */}
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-4 shadow border-l-4 border-orange-500 ring-2 ring-orange-300">
          <h5 className="font-bold text-gray-900 mb-2">3. Electronegativity 🔮 CRITICAL FOR LATER!</h5>
          <div className="space-y-3">
            <p className="text-sm text-gray-700">Different atoms attract electrons with different strengths:</p>
            <div className="flex items-center justify-between bg-white rounded-lg p-3">
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center font-bold text-gray-700 mx-auto">C</div>
                <p className="text-xs mt-1">Carbon</p>
                <p className="text-xs text-gray-500">EN: 2.5</p>
              </div>
              <div className="text-2xl">⟵ e⁻ ⟶</div>
              <div className="text-center">
                <div className="w-12 h-12 bg-red-400 rounded-full flex items-center justify-center font-bold text-white mx-auto">O</div>
                <p className="text-xs mt-1">Oxygen</p>
                <p className="text-xs text-red-600 font-bold">EN: 3.5 (stronger!)</p>
              </div>
            </div>
            <div className="bg-orange-100 rounded-lg p-3 mt-2">
              <p className="text-sm text-orange-900">
                <strong>Preview:</strong> Oxygen pulls electrons harder than carbon → creates <strong>polar bonds</strong> → determines <strong>molecular shape</strong> → that is why a water molecule has its unique structure and shape!
              </p>
            </div>
            
            {/* Water Molecule Visual - 3D Interactive Model */}
            <div className="bg-white rounded-lg p-4 mt-3 border-2 border-blue-200">
              <h6 className="text-center font-bold text-gray-800 mb-3">Water (H₂O): Covalent Bonding Through Electron Sharing</h6>
              <WaterMolecule3D />
              
              {/* Legend */}
              <div className="flex justify-center gap-4 mt-3 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Oxygen</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Hydrogen</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-700 rounded-full"></div>
                  <span>Electrons</span>
                </div>
              </div>
              
              {/* Caption */}
              <p className="text-center text-gray-700 text-sm mt-2 font-semibold">
                Fig 1. Chemical Structure of Water
              </p>
              <p className="text-center text-gray-600 text-xs mt-1">
                Transparent shells show electron sharing in the overlap regions (104.5° bond angle)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-blue-900 text-white rounded-xl p-4">
        <p className="text-center font-semibold">
          Master electrons = Master chemistry. They are shared in bonds, determine shape, and control reactivity.
        </p>
      </div>
    </div>
  );
};

// Octet Rule Visualization
const OctetRuleVisual: FC = () => {
  return (
    <div className="space-y-4">
      {/* FIRST: Show Carbon's COMPLETE electron structure */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-300">
        <h4 className="text-center font-bold text-blue-900 mb-4">Carbon's Complete Electron Structure</h4>
        <div className="flex justify-center items-center" style={{ minHeight: '200px' }}>
          <div className="relative" style={{ width: '180px', height: '180px' }}>
            {/* Nucleus - centered */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold text-lg z-10">
              C
            </div>
            {/* Inner shell (n=1) - 2 electrons */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 border-2 border-blue-400 rounded-full">
              {[0, 1].map((i) => {
                const angle = (i * 180);
                const radian = (angle * Math.PI) / 180;
                const x = Math.cos(radian) * 42;
                const y = Math.sin(radian) * 42;
                return (
                  <div
                    key={`inner-${i}`}
                    className="absolute w-4 h-4 bg-blue-600 rounded-full border-2 border-blue-800"
                    style={{
                      left: `calc(50% + ${x}px)`,
                      top: `calc(50% + ${y}px)`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  />
                );
              })}
            </div>
            {/* Outer shell (n=2) - 4 electrons */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 border-2 border-dashed border-yellow-500 rounded-full">
              {[0, 1, 2, 3].map((i) => {
                const angle = (i * 90) + 45;
                const radian = (angle * Math.PI) / 180;
                const x = Math.cos(radian) * 80;
                const y = Math.sin(radian) * 80;
                return (
                  <div
                    key={`outer-${i}`}
                    className="absolute w-5 h-5 bg-yellow-500 rounded-full border-2 border-yellow-700"
                    style={{
                      left: `calc(50% + ${x}px)`,
                      top: `calc(50% + ${y}px)`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
        {/* Labels */}
        <div className="mt-4 grid grid-cols-2 gap-4 text-center">
          <div className="bg-blue-100 rounded-lg p-2">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              <span className="text-blue-900 font-semibold text-sm">Inner Shell: 2e⁻</span>
            </div>
            <p className="text-xs text-blue-700">(Core electrons - not for bonding)</p>
          </div>
          <div className="bg-yellow-100 rounded-lg p-2">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-yellow-900 font-semibold text-sm">Outer Shell: 4e⁻</span>
            </div>
            <p className="text-xs text-yellow-700">(VALENCE electrons - for bonding!)</p>
          </div>
        </div>
        <div className="mt-3 bg-gray-100 rounded-lg p-3 text-center">
          <p className="text-gray-800 font-bold">Carbon has 6 total electrons: 2 core + 4 valence</p>
          <p className="text-gray-600 text-sm">Only the 4 valence electrons participate in bonding</p>
        </div>
      </div>

      {/* Noble Gas - Already Stable */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-300">
        <h4 className="text-center font-bold text-green-900 mb-4">Noble Gas (Neon) - Already Stable ✓</h4>
        <div className="flex justify-center items-center" style={{ minHeight: '200px' }}>
          <div className="relative" style={{ width: '180px', height: '180px' }}>
            {/* Nucleus - centered */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white font-bold z-10">
              Ne
            </div>
            {/* Inner shell - 2 electrons */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 border-2 border-green-400 rounded-full">
              {[0, 1].map((i) => {
                const angle = (i * 180);
                const radian = (angle * Math.PI) / 180;
                const x = Math.cos(radian) * 42;
                const y = Math.sin(radian) * 42;
                return (
                  <div
                    key={`inner-${i}`}
                    className="absolute w-4 h-4 bg-blue-500 rounded-full border-2 border-blue-700"
                    style={{
                      left: `calc(50% + ${x}px)`,
                      top: `calc(50% + ${y}px)`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  />
                );
              })}
            </div>
            {/* Outer shell with 8 electrons */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 border-4 border-green-500 rounded-full">
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
                const angle = (i * 360) / 8;
                const radian = (angle * Math.PI) / 180;
                const x = Math.cos(radian) * 80;
                const y = Math.sin(radian) * 80;
                return (
                  <div
                    key={i}
                    className="absolute w-5 h-5 bg-blue-500 rounded-full border-2 border-blue-700 animate-pulse"
                    style={{
                      left: `calc(50% + ${x}px)`,
                      top: `calc(50% + ${y}px)`,
                      transform: 'translate(-50%, -50%)',
                      animationDelay: `${i * 0.1}s`
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
        <p className="text-center text-green-800 font-semibold mt-4">
          8 electrons in outer shell = <span className="text-green-900 text-lg">LOW ENERGY</span> (Stable!)
        </p>
      </div>

      {/* Carbon - Incomplete */}
      <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border-2 border-orange-300">
        <h4 className="text-center font-bold text-orange-900 mb-4">Carbon's Outer Shell - Incomplete ⚠️</h4>
        <div className="flex justify-center items-center" style={{ minHeight: '200px' }}>
          <div className="relative" style={{ width: '180px', height: '180px' }}>
            {/* Nucleus - centered */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold z-10">
              C
            </div>
            {/* Outer shell with only 4 electrons + 4 empty spots */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 border-4 border-dashed border-orange-400 rounded-full">
              {[0, 2, 4, 6].map((i) => {
                const angle = (i * 360) / 8;
                const radian = (angle * Math.PI) / 180;
                const x = Math.cos(radian) * 80;
                const y = Math.sin(radian) * 80;
                return (
                  <div
                    key={i}
                    className="absolute w-5 h-5 bg-yellow-500 rounded-full border-2 border-yellow-700"
                    style={{
                      left: `calc(50% + ${x}px)`,
                      top: `calc(50% + ${y}px)`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  />
                );
              })}
              {/* Empty slots - just empty circles, no question marks */}
              {[1, 3, 5, 7].map((i) => {
                const angle = (i * 360) / 8;
                const radian = (angle * Math.PI) / 180;
                const x = Math.cos(radian) * 80;
                const y = Math.sin(radian) * 80;
                return (
                  <div
                    key={`empty-${i}`}
                    className="absolute w-5 h-5 border-2 border-dashed border-red-400 rounded-full bg-red-50"
                    style={{
                      left: `calc(50% + ${x}px)`,
                      top: `calc(50% + ${y}px)`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-4 mt-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded-full border-2 border-yellow-700" />
            <span className="text-gray-700">Electron (4)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-dashed border-red-400 rounded-full bg-red-50" />
            <span className="text-gray-700">Empty slot (4)</span>
          </div>
        </div>
        <p className="text-center text-orange-800 font-semibold mt-3">
          Only 4 of 8 spots filled = <span className="text-red-600 text-lg">HIGH ENERGY</span> (Unstable!)
        </p>
        <p className="text-center text-orange-900 mt-2 text-sm">
          Carbon needs 4 more electrons to complete its octet
        </p>
      </div>

      {/* WHY 8? - The Science Behind the Rule */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-300">
        <h4 className="text-center font-bold text-purple-900 mb-4">🔬 Why Exactly 8?</h4>
        <div className="space-y-3">
          <div className="bg-white rounded-lg p-4">
            <p className="text-gray-800 mb-2"><strong>The valence shell has two types of orbitals:</strong></p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 rounded p-2 text-center">
                <p className="font-bold text-blue-800">s orbital</p>
                <p className="text-blue-600 text-sm">Holds 2 electrons</p>
              </div>
              <div className="bg-orange-50 rounded p-2 text-center">
                <p className="font-bold text-orange-800">p orbitals (3)</p>
                <p className="text-orange-600 text-sm">Hold 6 electrons</p>
              </div>
            </div>
            <p className="text-center font-bold text-purple-900 mt-3 text-lg">2 + 6 = 8 electrons for a full valence shell!</p>
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <p className="text-gray-800 font-semibold mb-2">Does the octet rule apply to all atoms?</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-start space-x-2">
                <span className="text-green-600">✓</span>
                <p><strong>C, N, O, F</strong> - Always follow octet rule</p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-yellow-600">⚠️</span>
                <p><strong>H</strong> - Only needs 2 (duet rule - just 1s orbital)</p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-yellow-600">⚠️</span>
                <p><strong>P, S</strong> - Can exceed 8 (have d orbitals available)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Energy Diagram */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-300">
        <h4 className="text-center font-bold text-gray-900 mb-4">Energy States</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="bg-red-500 h-12 rounded-l-lg flex items-center justify-center text-white font-bold">
                Incomplete Shell
              </div>
            </div>
            <div className="px-4 text-red-600 font-bold text-lg">HIGH ENERGY ↑</div>
          </div>
          
          <div className="flex items-center justify-center">
            <div className="text-purple-600 font-bold text-2xl">⬇️ BONDING ⬇️</div>
          </div>
          <div className="text-center text-sm text-gray-700 -mt-2 mb-2">
            (Energy Released!)
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="bg-green-500 h-12 rounded-l-lg flex items-center justify-center text-white font-bold">
                Complete Shell (8e⁻)
              </div>
            </div>
            <div className="px-4 text-green-600 font-bold text-lg">LOW ENERGY ↓</div>
          </div>
        </div>
        <div className="mt-4 p-3 bg-blue-100 rounded-lg">
          <p className="text-blue-900 text-sm font-semibold text-center">
            💡 Nature always moves toward lower energy → This is why atoms bond!
          </p>
        </div>
      </div>
    </div>
  );
};

// Quantum Orbital Visualization Component
interface QuantumOrbitalProps {
  orbitalType?: '1s' | '2s' | '2p';
}

const QuantumOrbital: FC<QuantumOrbitalProps> = ({ orbitalType = '1s' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(300, 300);
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    const group = new THREE.Group();
    
    // Create orbital based on type
    if (orbitalType === '1s') {
      // Spherical s-orbital
      const geometry = new THREE.SphereGeometry(1.5, 32, 32);
      const material = new THREE.MeshPhongMaterial({
        color: 0x4488ff,
        transparent: true,
        opacity: 0.6,
        shininess: 100
      });
      const sphere = new THREE.Mesh(geometry, material);
      group.add(sphere);
      
      // Add nucleus
      const nucleusGeom = new THREE.SphereGeometry(0.2, 16, 16);
      const nucleusMat = new THREE.MeshPhongMaterial({ color: 0xff0000 });
      const nucleus = new THREE.Mesh(nucleusGeom, nucleusMat);
      group.add(nucleus);
      
    } else if (orbitalType === '2s') {
      // Larger s-orbital with node
      const innerGeometry = new THREE.SphereGeometry(0.8, 32, 32);
      const innerMaterial = new THREE.MeshPhongMaterial({
        color: 0x6666ff,
        transparent: true,
        opacity: 0.4,
        shininess: 100
      });
      const innerSphere = new THREE.Mesh(innerGeometry, innerMaterial);
      group.add(innerSphere);
      
      const outerGeometry = new THREE.SphereGeometry(2, 32, 32);
      const outerMaterial = new THREE.MeshPhongMaterial({
        color: 0x4488ff,
        transparent: true,
        opacity: 0.3,
        shininess: 100
      });
      const outerSphere = new THREE.Mesh(outerGeometry, outerMaterial);
      group.add(outerSphere);
      
      const nucleusGeom = new THREE.SphereGeometry(0.2, 16, 16);
      const nucleusMat = new THREE.MeshPhongMaterial({ color: 0xff0000 });
      const nucleus = new THREE.Mesh(nucleusGeom, nucleusMat);
      group.add(nucleus);
      
    } else if (orbitalType === '2p') {
      // Dumbbell-shaped p-orbital
      const lobeGeometry = new THREE.SphereGeometry(1.2, 32, 32);
      const lobeMaterial = new THREE.MeshPhongMaterial({
        color: 0xff6644,
        transparent: true,
        opacity: 0.6,
        shininess: 100
      });
      
      const lobe1 = new THREE.Mesh(lobeGeometry, lobeMaterial);
      lobe1.scale.set(0.7, 0.7, 1.5);
      lobe1.position.z = 1.2;
      group.add(lobe1);
      
      const lobe2 = new THREE.Mesh(lobeGeometry, lobeMaterial.clone());
      lobe2.scale.set(0.7, 0.7, 1.5);
      lobe2.position.z = -1.2;
      group.add(lobe2);
      
      const nucleusGeom = new THREE.SphereGeometry(0.2, 16, 16);
      const nucleusMat = new THREE.MeshPhongMaterial({ color: 0xff0000 });
      const nucleus = new THREE.Mesh(nucleusGeom, nucleusMat);
      group.add(nucleus);
    }
    
    scene.add(group);
    camera.position.z = 5;
    
    let animationFrameId: number;
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    
    const getEventPosition = (e: MouseEvent | TouchEvent) => {
      if ('touches' in e) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
      return { x: e.clientX, y: e.clientY };
    };
    
    const onMouseDown = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      isDragging = true;
      previousMousePosition = getEventPosition(e);
    };
    
    const onMouseMove = (e: MouseEvent | TouchEvent) => {
      if (isDragging) {
        const pos = getEventPosition(e);
        const deltaX = pos.x - previousMousePosition.x;
        const deltaY = pos.y - previousMousePosition.y;
        group.rotation.y += deltaX * 0.01;
        group.rotation.x += deltaY * 0.01;
        previousMousePosition = pos;
      }
    };
    
    const onMouseUp = () => {
      isDragging = false;
    };
    
    // Mouse events - attach move/up to window for better drag tracking
    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    
    // Touch events for mobile
    canvas.addEventListener('touchstart', onMouseDown, { passive: false });
    window.addEventListener('touchmove', onMouseMove, { passive: false });
    window.addEventListener('touchend', onMouseUp);
    
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isDragging) {
        group.rotation.y += 0.005;
      }
      renderer.render(scene, camera);
    };
    animate();
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('touchstart', onMouseDown);
      window.removeEventListener('touchmove', onMouseMove);
      window.removeEventListener('touchend', onMouseUp);
      scene.traverse((object: any) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) object.material.dispose();
      });
      renderer.dispose();
    };
  }, [orbitalType]);
  
  return (
    <div className="flex flex-col items-center">
      <canvas 
        ref={canvasRef} 
        className={`rounded-lg shadow-lg ${orbitalType === '2p' ? 'cursor-grab active:cursor-grabbing' : ''}`} 
        style={{ touchAction: 'none' }} 
      />
      <p className="text-xs text-gray-600 mt-2">
        {orbitalType === '2p' ? 'Drag to rotate • ' : ''}{orbitalType} orbital{orbitalType === '2p' ? 's' : ''}
      </p>
    </div>
  );
};

// 3D Water Molecule Visualization Component
const WaterMolecule3D: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(320, 320);
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    const group = new THREE.Group();
    
    // Water molecule geometry - 104.5 degree angle
    const bondAngle = 104.5 * (Math.PI / 180);
    const bondLength = 2.0;
    
    // Oxygen atom (center) - red nucleus
    const oNucleusGeom = new THREE.SphereGeometry(0.5, 32, 32);
    const oNucleusMat = new THREE.MeshPhongMaterial({ color: 0xef4444 });
    const oNucleus = new THREE.Mesh(oNucleusGeom, oNucleusMat);
    oNucleus.position.set(0, 0, 0);
    group.add(oNucleus);
    
    // Oxygen outer electron shell (transparent) - this overlaps with H shells
    const oOuterShellGeom = new THREE.SphereGeometry(1.8, 32, 32);
    const oOuterShellMat = new THREE.MeshPhongMaterial({
      color: 0x9ca3af,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide
    });
    const oOuterShell = new THREE.Mesh(oOuterShellGeom, oOuterShellMat);
    group.add(oOuterShell);
    
    // Hydrogen 1 position (upper left)
    const h1X = -bondLength * Math.sin(bondAngle / 2);
    const h1Y = bondLength * Math.cos(bondAngle / 2);
    
    // Hydrogen 1 nucleus
    const h1NucleusGeom = new THREE.SphereGeometry(0.3, 32, 32);
    const h1NucleusMat = new THREE.MeshPhongMaterial({ color: 0x3b82f6 });
    const h1Nucleus = new THREE.Mesh(h1NucleusGeom, h1NucleusMat);
    h1Nucleus.position.set(h1X, h1Y, 0);
    group.add(h1Nucleus);
    
    // Hydrogen 1 electron shell (overlaps with O outer shell)
    const h1ShellGeom = new THREE.SphereGeometry(0.9, 32, 32);
    const h1ShellMat = new THREE.MeshPhongMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide
    });
    const h1Shell = new THREE.Mesh(h1ShellGeom, h1ShellMat);
    h1Shell.position.set(h1X, h1Y, 0);
    group.add(h1Shell);
    
    // Hydrogen 2 position (upper right)
    const h2X = bondLength * Math.sin(bondAngle / 2);
    const h2Y = bondLength * Math.cos(bondAngle / 2);
    
    // Hydrogen 2 nucleus
    const h2Nucleus = new THREE.Mesh(h1NucleusGeom.clone(), h1NucleusMat.clone());
    h2Nucleus.position.set(h2X, h2Y, 0);
    group.add(h2Nucleus);
    
    // Hydrogen 2 electron shell
    const h2Shell = new THREE.Mesh(h1ShellGeom.clone(), h1ShellMat.clone());
    h2Shell.position.set(h2X, h2Y, 0);
    group.add(h2Shell);
    
    // Electrons - small bright spheres
    const electronGeom = new THREE.SphereGeometry(0.12, 16, 16);
    const electronMat = new THREE.MeshPhongMaterial({ 
      color: 0x1d4ed8,
      emissive: 0x1d4ed8,
      emissiveIntensity: 0.3
    });
    
    // Oxygen outer shell non-bonding electrons (4) - lone pairs at back
    const oOuterE1 = new THREE.Mesh(electronGeom, electronMat);
    oOuterE1.position.set(-0.5, -1.5, 0.5);
    group.add(oOuterE1);
    
    const oOuterE2 = new THREE.Mesh(electronGeom, electronMat);
    oOuterE2.position.set(0.5, -1.5, 0.5);
    group.add(oOuterE2);
    
    const oOuterE3 = new THREE.Mesh(electronGeom, electronMat);
    oOuterE3.position.set(-0.5, -1.5, -0.5);
    group.add(oOuterE3);
    
    const oOuterE4 = new THREE.Mesh(electronGeom, electronMat);
    oOuterE4.position.set(0.5, -1.5, -0.5);
    group.add(oOuterE4);
    
    // Shared electrons (in overlap region between O and H1)
    const shared1a = new THREE.Mesh(electronGeom, electronMat);
    shared1a.position.set(h1X * 0.5, h1Y * 0.5 + 0.15, 0.1);
    group.add(shared1a);
    
    const shared1b = new THREE.Mesh(electronGeom, electronMat);
    shared1b.position.set(h1X * 0.5, h1Y * 0.5 - 0.15, -0.1);
    group.add(shared1b);
    
    // Shared electrons (in overlap region between O and H2)
    const shared2a = new THREE.Mesh(electronGeom, electronMat);
    shared2a.position.set(h2X * 0.5, h2Y * 0.5 + 0.15, 0.1);
    group.add(shared2a);
    
    const shared2b = new THREE.Mesh(electronGeom, electronMat);
    shared2b.position.set(h2X * 0.5, h2Y * 0.5 - 0.15, -0.1);
    group.add(shared2b);
    
    // Bond lines (cylinders connecting nuclei)
    const bondMat = new THREE.MeshPhongMaterial({ color: 0x6b7280 });
    
    // Bond 1: O to H1
    const bond1Geom = new THREE.CylinderGeometry(0.08, 0.08, bondLength * 0.7, 16);
    const bond1 = new THREE.Mesh(bond1Geom, bondMat);
    bond1.position.set(h1X * 0.35, h1Y * 0.35, 0);
    bond1.rotation.z = Math.PI / 2 + bondAngle / 2;
    group.add(bond1);
    
    // Bond 2: O to H2
    const bond2 = new THREE.Mesh(bond1Geom.clone(), bondMat);
    bond2.position.set(h2X * 0.35, h2Y * 0.35, 0);
    bond2.rotation.z = Math.PI / 2 - bondAngle / 2;
    group.add(bond2);
    
    scene.add(group);
    camera.position.z = 6;
    
    let animationFrameId: number;
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    
    const getEventPosition = (e: MouseEvent | TouchEvent) => {
      if ('touches' in e) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
      return { x: e.clientX, y: e.clientY };
    };
    
    const onMouseDown = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      isDragging = true;
      previousMousePosition = getEventPosition(e);
    };
    
    const onMouseMove = (e: MouseEvent | TouchEvent) => {
      if (isDragging) {
        const pos = getEventPosition(e);
        const deltaX = pos.x - previousMousePosition.x;
        const deltaY = pos.y - previousMousePosition.y;
        group.rotation.y += deltaX * 0.01;
        group.rotation.x += deltaY * 0.01;
        previousMousePosition = pos;
      }
    };
    
    const onMouseUp = () => {
      isDragging = false;
    };
    
    // Mouse events - attach move/up to window for better drag tracking
    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    
    // Touch events for mobile
    canvas.addEventListener('touchstart', onMouseDown, { passive: false });
    window.addEventListener('touchmove', onMouseMove, { passive: false });
    window.addEventListener('touchend', onMouseUp);
    
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isDragging) {
        group.rotation.y += 0.005;
      }
      renderer.render(scene, camera);
    };
    animate();
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('touchstart', onMouseDown);
      window.removeEventListener('touchmove', onMouseMove);
      window.removeEventListener('touchend', onMouseUp);
      scene.traverse((object: any) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) object.material.dispose();
      });
      renderer.dispose();
    };
  }, []);
  
  return (
    <div className="flex flex-col items-center">
      <canvas 
        ref={canvasRef} 
        className="rounded-lg shadow-lg cursor-grab active:cursor-grabbing" 
        style={{ touchAction: 'none' }} 
      />
      <p className="text-xs text-gray-600 mt-2">Drag to rotate • Water (H₂O) molecule</p>
    </div>
  );
};

// Carbon Quantum Orbital Structure - Shows all orbitals with explanation
const CarbonQuantumStructure: FC = () => {
  return (
    <div className="space-y-4">
      {/* Introduction */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border-2 border-indigo-300">
        <h4 className="text-center font-bold text-indigo-900 mb-2">Carbon's Quantum Orbital Structure</h4>
        <p className="text-center text-indigo-700 text-sm">
          Electrons don't orbit like planets — they exist in 3D probability clouds called <strong>orbitals</strong>
        </p>
        <div className="bg-white/60 rounded-lg p-3 mt-3">
          <p className="text-indigo-800 text-xs">
            <strong>🤔 Wait — "orbitals" but they don't orbit?</strong> Good catch! The term "orbital" is a historical artifact from when scientists thought electrons literally orbited the nucleus like planets. By the time we discovered electrons exist as probability clouds, the word was already embedded in scientific language. Think of it like how we still say the sun "rises" and "sets" even though we know Earth rotates — language sometimes lags behind understanding!
          </p>
        </div>
      </div>

      {/* Orbital Diagrams */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1s orbital */}
        <div className="bg-white rounded-xl p-4 border-2 border-blue-300 shadow">
          <h5 className="text-center font-bold text-blue-800 mb-1">1s Orbital</h5>
          <p className="text-center text-gray-500 text-xs mb-2">(probability cloud)</p>
          <div className="flex justify-center mb-3">
            <div className="relative w-20 h-20">
              {/* Spherical 1s orbital representation */}
              <div className="absolute inset-0 bg-blue-400 rounded-full opacity-40"></div>
              <div className="absolute inset-2 bg-blue-500 rounded-full opacity-50"></div>
              <div className="absolute inset-4 bg-blue-600 rounded-full opacity-60"></div>
              {/* Nucleus */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
          </div>
          <div className="text-center">
            <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded font-bold text-sm">2 electrons</span>
          </div>
          <p className="text-xs text-gray-600 text-center mt-2">Spherical shape, closest to nucleus</p>
        </div>

        {/* 2s orbital */}
        <div className="bg-white rounded-xl p-4 border-2 border-purple-300 shadow">
          <h5 className="text-center font-bold text-purple-800 mb-1">2s Orbital</h5>
          <p className="text-center text-gray-500 text-xs mb-2">(probability cloud)</p>
          <div className="flex justify-center mb-3">
            <div className="relative w-20 h-20">
              {/* Larger spherical 2s orbital */}
              <div className="absolute inset-0 bg-purple-300 rounded-full opacity-30"></div>
              <div className="absolute inset-1 bg-purple-400 rounded-full opacity-40"></div>
              {/* Node (gap) */}
              <div className="absolute inset-4 bg-white rounded-full"></div>
              <div className="absolute inset-5 bg-purple-500 rounded-full opacity-50"></div>
              {/* Nucleus */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
          </div>
          <div className="text-center">
            <span className="inline-block bg-purple-100 text-purple-800 px-2 py-1 rounded font-bold text-sm">2 electrons</span>
          </div>
          <p className="text-xs text-gray-600 text-center mt-2">Larger sphere, higher energy</p>
        </div>

        {/* 2p orbitals */}
        <div className="bg-white rounded-xl p-4 border-2 border-orange-300 shadow">
          <h5 className="text-center font-bold text-orange-800 mb-1">2p Orbitals</h5>
          <p className="text-center text-gray-500 text-xs mb-2">(probability clouds)</p>
          <div className="flex justify-center mb-3">
            <div className="relative w-24 h-24">
              {/* py orbital - vertical (orange, most visible) */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-9 bg-orange-400 rounded-full opacity-70"></div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-9 bg-orange-400 rounded-full opacity-70"></div>
              
              {/* px orbital - horizontal (yellow, behind) */}
              <div className="absolute top-1/2 left-0 -translate-y-1/2 w-9 h-6 bg-yellow-400 rounded-full opacity-50"></div>
              <div className="absolute top-1/2 right-0 -translate-y-1/2 w-9 h-6 bg-yellow-400 rounded-full opacity-50"></div>
              
              {/* pz orbital - depth axis shown as smaller/faded (red-orange, furthest back) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-red-400 rounded-full opacity-40" style={{ transform: 'translate(-50%, -80%)' }}></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-red-400 rounded-full opacity-40" style={{ transform: 'translate(-50%, 30%)' }}></div>
              
              {/* Nucleus */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full z-10"></div>
            </div>
          </div>
          {/* Axis legend */}
          <div className="flex justify-center gap-2 text-xs mb-2">
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-orange-400 rounded-full"></span>py</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-yellow-400 rounded-full"></span>px</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-red-400 rounded-full"></span>pz</span>
          </div>
          <div className="text-center">
            <span className="inline-block bg-orange-100 text-orange-800 px-2 py-1 rounded font-bold text-sm">2 electrons</span>
          </div>
          <p className="text-xs text-gray-600 text-center mt-2">3 dumbbell-shaped orbitals along x, y, z axes</p>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-4 text-white">
        <div className="flex justify-center items-center gap-2 flex-wrap">
          <span className="bg-blue-500 px-3 py-1 rounded-full text-sm font-bold">1s²</span>
          <span className="text-xl">+</span>
          <span className="bg-purple-500 px-3 py-1 rounded-full text-sm font-bold">2s²</span>
          <span className="text-xl">+</span>
          <span className="bg-orange-500 px-3 py-1 rounded-full text-sm font-bold">2p²</span>
          <span className="text-xl">=</span>
          <span className="bg-green-500 px-3 py-1 rounded-full text-sm font-bold">6 electrons</span>
        </div>
        <p className="text-center text-gray-300 text-sm mt-2">
          Carbon's complete electron configuration: <strong>1s² 2s² 2p²</strong>
        </p>
      </div>

      {/* Key insight */}
      <div className="bg-yellow-50 rounded-lg p-3 border-l-4 border-yellow-500">
        <p className="text-yellow-900 text-sm">
          <strong>💡 Key Insight:</strong> The 4 outer electrons (2s² + 2p²) are the <strong>valence electrons</strong> — these are what carbon uses to form 4 covalent bonds!
        </p>
      </div>

      {/* Shorthand Notation */}
      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-4 border-2 border-teal-300">
        <h5 className="font-bold text-teal-900 mb-2">📝 Shorthand Notation</h5>
        <p className="text-teal-800 text-sm mb-3">
          Scientists use a shortcut! Since <strong>helium (He)</strong> already has the configuration 1s², we can represent carbon's inner electrons with [He]:
        </p>
        <div className="bg-white rounded-lg p-3 flex items-center justify-center gap-3 flex-wrap">
          <div className="text-center">
            <span className="text-gray-600 text-sm">Full notation:</span>
            <p className="font-mono font-bold text-gray-800">1s² 2s² 2p²</p>
          </div>
          <span className="text-2xl text-teal-600">=</span>
          <div className="text-center">
            <span className="text-gray-600 text-sm">Shorthand:</span>
            <p className="font-mono font-bold text-teal-700">[He] 2s² 2p²</p>
          </div>
        </div>
        <p className="text-teal-700 text-xs mt-3 text-center">
          The [He] represents the filled inner shell (1s²). You'll see this "noble gas shorthand" used for larger atoms too — like [Ne] for elements after neon!
        </p>
      </div>

      {/* Hybridization - Why all 4 electrons bond */}
      <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-4 border-2 border-pink-300">
        <h5 className="font-bold text-pink-900 mb-2">🔀 But Wait — If 2s² is Full, Why Does It Bond?</h5>
        <p className="text-pink-800 text-sm mb-3">
          Great question! If the 2s orbital is already filled with 2 electrons, why doesn't carbon just form 2 bonds using only the 2p electrons?
        </p>
        <div className="bg-white rounded-lg p-4 mb-3">
          <p className="text-gray-800 text-sm mb-2">
            <strong>The answer: Hybridization!</strong>
          </p>
          <p className="text-gray-700 text-sm mb-3">
            When carbon bonds, the 2s and 2p orbitals <strong>blend together</strong> — like remixing songs into something new. The one 2s orbital (holding 2 electrons) mixes with the three 2p orbitals (holding 2 electrons) to create <strong>four equivalent hybrid orbitals</strong>.
          </p>
          <div className="flex items-center justify-center gap-2 flex-wrap text-sm">
            <div className="text-center">
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded font-mono">2s²</span>
              <p className="text-xs text-gray-500">(1 orbital, 2e⁻)</p>
            </div>
            <span className="text-gray-500">+</span>
            <div className="text-center">
              <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded font-mono">2p²</span>
              <p className="text-xs text-gray-500">(3 orbitals, 2e⁻)</p>
            </div>
            <span className="text-gray-500">→</span>
            <span className="text-pink-600 font-bold">remix!</span>
            <span className="text-gray-500">→</span>
            <div className="text-center">
              <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded font-bold">4 hybrids</span>
              <p className="text-xs text-gray-500">(1e⁻ each)</p>
            </div>
          </div>
          <div className="mt-3 bg-yellow-50 rounded p-2">
            <p className="text-yellow-800 text-xs text-center">
              <strong>Key:</strong> Each hybrid orbital now has <strong>1 electron</strong> wanting to bond with another electron to complete a stable 2-electron pair!
            </p>
          </div>
        </div>
        <p className="text-pink-700 text-xs text-center">
          Scientists call these "sp³ hybrids" — one <strong>s</strong> + three <strong>p</strong> orbitals blended. That's why carbon forms <strong>four</strong> bonds!
        </p>
      </div>
    </div>
  );
};

// Carbon Atom Electron Configuration Visualization
const ElectronConfiguration = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 shadow-inner">
      <h4 className="text-center font-bold text-gray-900 mb-4">Carbon's Electron Configuration</h4>
      
      <div className="space-y-4">
        {/* 1s orbital */}
        <div className="flex items-center space-x-4 bg-white rounded-lg p-3 shadow">
          <div className="flex-shrink-0 w-16 text-center">
            <span className="text-lg font-bold text-blue-600">1s²</span>
          </div>
          <div className="flex space-x-2">
            <div className="w-8 h-8 border-2 border-blue-500 rounded-lg flex items-center justify-center bg-blue-100">
              <span className="text-blue-600">↑↓</span>
            </div>
          </div>
          <div className="flex-1 text-sm text-gray-700">
            2 electrons (filled)
          </div>
        </div>
        
        {/* 2s orbital */}
        <div className="flex items-center space-x-4 bg-white rounded-lg p-3 shadow">
          <div className="flex-shrink-0 w-16 text-center">
            <span className="text-lg font-bold text-purple-600">2s²</span>
          </div>
          <div className="flex space-x-2">
            <div className="w-8 h-8 border-2 border-purple-500 rounded-lg flex items-center justify-center bg-purple-100">
              <span className="text-purple-600">↑↓</span>
            </div>
          </div>
          <div className="flex-1 text-sm text-gray-700">
            2 electrons (filled)
          </div>
        </div>
        
        {/* 2p orbitals */}
        <div className="flex items-center space-x-4 bg-white rounded-lg p-3 shadow border-2 border-orange-300">
          <div className="flex-shrink-0 w-16 text-center">
            <span className="text-lg font-bold text-orange-600">2p²</span>
          </div>
          <div className="flex space-x-2">
            <div className="w-8 h-8 border-2 border-orange-500 rounded-lg flex items-center justify-center bg-orange-100">
              <span className="text-orange-600">↑</span>
            </div>
            <div className="w-8 h-8 border-2 border-orange-500 rounded-lg flex items-center justify-center bg-orange-100">
              <span className="text-orange-600">↑</span>
            </div>
            <div className="w-8 h-8 border-2 border-orange-300 rounded-lg flex items-center justify-center bg-orange-50">
              <span className="text-gray-400">—</span>
            </div>
          </div>
          <div className="flex-1 text-sm text-gray-700 font-semibold">
            2 unpaired valence electrons!
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-4 bg-orange-100 rounded-lg border-l-4 border-orange-500">
        <p className="text-sm text-orange-900 font-semibold">
          ⚡ These 4 valence electrons (2s² 2p²) are carbon's bonding superpower! They can form 4 covalent bonds.
        </p>
      </div>
    </div>
  );
};

// Schrödinger Equation Conceptual Visualization
const SchrodingerConceptual: FC = () => {
  const [step, setStep] = useState(0);
  const [showMath, setShowMath] = useState(false);
  const [showQuantumNumbers, setShowQuantumNumbers] = useState(false);
  const [animationFrame, setAnimationFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationFrame(f => (f + 1) % 60);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const totalSteps = 5;

  const stepTitles = [
    'The Big Idea',
    'What Goes In',
    'What Comes Out',
    'Why a Sphere?',
    'The 1s Orbital!'
  ];

  return (
    <div className="space-y-4">
      <p className="text-center text-gray-600 text-sm">
        How Schrödinger's equation creates the 1s orbital
      </p>

      {/* Progress Bar */}
      <div className="flex items-center px-2">
        {stepTitles.map((title, i) => (
          <React.Fragment key={i}>
            <div 
              onClick={() => setStep(i)}
              className="flex flex-col items-center cursor-pointer flex-1"
            >
              <div 
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all text-white ${step >= i ? 'bg-blue-500' : 'bg-gray-400'}`}
              >
                {i + 1}
              </div>
              <span className={`text-[9px] text-center mt-1 max-w-[55px] ${step >= i ? 'text-gray-800' : 'text-gray-400'}`}>
                {title}
              </span>
            </div>
            {i < totalSteps - 1 && (
              <div className={`flex-[0.5] h-0.5 transition-all ${step > i ? 'bg-blue-500' : 'bg-gray-300'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-5 min-h-[280px] text-white">
        
        {/* Step 0: The Big Idea */}
        {step === 0 && (
          <div className="text-center">
            <p className="text-slate-300 mb-4 text-sm">
              In 1926, physicist <strong className="text-blue-400">Erwin Schrödinger</strong> discovered an equation that answers:
            </p>
            
            <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-4 rounded-xl mb-4 border border-purple-500/30">
              <p className="text-lg text-white font-medium italic">
                "Where is an electron likely to be found around an atom?"
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs text-center">
              <div className="bg-green-500/15 p-3 rounded-lg">
                <div className="text-xl mb-1">🎯</div>
                <div className="text-green-400 font-bold">It Predicts</div>
                <div className="text-slate-300 text-[10px] mt-1">Probability at any point</div>
              </div>
              <div className="bg-blue-500/15 p-3 rounded-lg">
                <div className="text-xl mb-1">🔮</div>
                <div className="text-blue-400 font-bold">It Reveals</div>
                <div className="text-slate-300 text-[10px] mt-1">Orbital shapes (1s, 2p...)</div>
              </div>
              <div className="bg-purple-500/15 p-3 rounded-lg">
                <div className="text-xl mb-1">✨</div>
                <div className="text-purple-400 font-bold">It's Real</div>
                <div className="text-slate-300 text-[10px] mt-1">Matches experiments!</div>
              </div>
            </div>

            {/* Expandable Math */}
            <div className="mt-4">
              <button
                onClick={() => setShowMath(!showMath)}
                className="text-slate-400 text-xs hover:text-slate-300 cursor-pointer underline"
              >
                {showMath ? '▼ Hide the actual equation' : '▶ Want to see the actual equation?'}
              </button>
              {showMath && (
                <div className="mt-3 bg-black/30 p-3 rounded-lg">
                  <div className="text-2xl font-serif mb-2">
                    <span className="text-blue-400">Ĥ</span>
                    <span className="text-purple-400">ψ</span>
                    <span> = </span>
                    <span className="text-orange-400">E</span>
                    <span className="text-purple-400">ψ</span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    These symbols are just a "map" of reality:
                  </div>
                  <div className="flex justify-center gap-2 mt-2 text-[10px]">
                    <div className="bg-blue-500/20 px-2 py-1 rounded">
                      <span className="text-blue-400 font-serif">Ĥ</span>
                      <span className="text-slate-300"> = energy situation</span>
                    </div>
                    <div className="bg-purple-500/20 px-2 py-1 rounded">
                      <span className="text-purple-400 font-serif">ψ</span>
                      <span className="text-slate-300"> = electron description</span>
                    </div>
                    <div className="bg-orange-500/20 px-2 py-1 rounded">
                      <span className="text-orange-400 font-serif">E</span>
                      <span className="text-slate-300"> = energy level</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 1: What Goes In */}
        {step === 1 && (
          <div className="text-center">
            <p className="text-slate-300 mb-3 text-sm">
              For the <strong className="text-green-400">1s orbital</strong> of hydrogen, we tell the equation:
            </p>
            
            <div className="flex flex-col gap-3">
              {/* The atom */}
              <div className="bg-green-500/15 p-4 rounded-xl border-l-4 border-green-500">
                <div className="font-bold text-green-400 mb-2">⚛️ "Here's the atom"</div>
                <div className="flex items-center justify-center gap-6 mb-2">
                  <div className="text-center">
                    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center font-bold mx-auto shadow-lg shadow-red-500/30">+1</div>
                    <div className="text-[10px] text-slate-400 mt-1">Proton</div>
                  </div>
                  <div className="text-yellow-400 text-xl">⟷</div>
                  <div className="text-center">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center font-bold text-sm mx-auto shadow-lg shadow-blue-500/30">-1</div>
                    <div className="text-[10px] text-slate-400 mt-1">Electron</div>
                  </div>
                </div>
                <div className="text-slate-300 text-xs">They attract — that holds the atom together!</div>
              </div>

              {/* Which orbital */}
              <div className="bg-blue-500/15 p-4 rounded-xl border-l-4 border-blue-400">
                <div className="font-bold text-blue-400 mb-2">🔢 "Find me the 1s orbital"</div>
                <div className="flex justify-center gap-3">
                  <div className="bg-black/30 px-4 py-2 rounded-lg text-center">
                    <div className="text-blue-400 font-bold text-lg">1</div>
                    <div className="text-[10px] text-slate-400">First shell</div>
                  </div>
                  <div className="bg-black/30 px-4 py-2 rounded-lg text-center">
                    <div className="text-purple-400 font-bold text-lg">s</div>
                    <div className="text-[10px] text-slate-400">Spherical type</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: What Comes Out */}
        {step === 2 && (
          <div className="text-center">
            <p className="text-slate-300 mb-3 text-sm">
              The equation tells us the <strong className="text-orange-400">probability</strong> at each distance:
            </p>

            {/* Conceptual explanation */}
            <div className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 p-4 rounded-xl mb-4">
              <div className="text-sm mb-2">
                📍 <strong className="text-orange-400">Closer</strong> = <strong className="text-green-400">Higher probability</strong>
              </div>
              <div className="text-sm">
                📍 <strong className="text-orange-400">Farther</strong> = <strong className="text-slate-400">Lower probability</strong>
              </div>
            </div>

            {/* Visual graph */}
            <div className="bg-black/30 rounded-xl p-3 mb-3">
              <div className="text-slate-400 text-[10px] mb-1">Probability vs. Distance:</div>
              <svg width="100%" height="100" viewBox="0 0 280 100">
                <line x1="30" y1="80" x2="260" y2="80" stroke="#64748b" strokeWidth="2" />
                <line x1="30" y1="80" x2="30" y2="15" stroke="#64748b" strokeWidth="2" />
                <text x="145" y="97" fill="#94a3b8" fontSize="9" textAnchor="middle">Distance from nucleus →</text>
                
                <defs>
                  <linearGradient id="probGradApp" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="100%" stopColor="#64748b" />
                  </linearGradient>
                </defs>
                
                <path d="M 30 20 Q 55 25, 80 40 Q 120 60, 160 72 Q 200 78, 260 79" fill="none" stroke="url(#probGradApp)" strokeWidth="3" />
                
                <text x="55" y="15" fill="#22c55e" fontSize="9">High!</text>
                <text x="210" y="68" fill="#94a3b8" fontSize="9">Low</text>
              </svg>
            </div>

            <div className="text-slate-300 text-xs">
              Electron <strong>prefers</strong> being near the nucleus, but <em>could</em> be anywhere!
            </div>

            {/* Expandable Math */}
            <div className="mt-3">
              <button
                onClick={() => setShowMath(!showMath)}
                className="text-slate-400 text-[10px] hover:text-slate-300 cursor-pointer underline"
              >
                {showMath ? '▼ Hide formula' : '▶ See the actual formula'}
              </button>
              {showMath && (
                <div className="mt-2 bg-black/30 p-3 rounded-lg text-left">
                  <div className="text-sm font-serif text-purple-400 mb-2 text-center">
                    ψ = (const) × <span className="text-green-400">e<sup>-r/a₀</sup></span>
                  </div>
                  <div className="text-[10px] text-slate-300">
                    <span className="text-green-400 font-bold">e<sup>-r/a₀</sup></span> just means "fades as distance (r) increases" — that's it!
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Why a Sphere? */}
        {step === 3 && (
          <div className="text-center">
            <p className="text-slate-300 mb-3 text-sm">
              The key insight that gives us a <strong className="text-green-400">sphere</strong>:
            </p>

            <div className="bg-gradient-to-r from-green-500/20 to-teal-500/20 p-4 rounded-xl mb-4 border border-green-500/30">
              <p className="text-sm text-white mb-1">
                Probability only depends on <strong className="text-green-400">distance</strong>
              </p>
              <p className="text-slate-300 text-xs">
                — not on which direction you look!
              </p>
            </div>

            {/* Visual demonstration */}
            <div className="flex justify-center items-center gap-4 mb-4">
              <div className="text-center">
                <div className="text-slate-400 text-[10px] mb-1">Same distance...</div>
                <div className="relative w-20 h-20">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full" />
                  <div className="absolute top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-green-400 rounded-full" />
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-green-400 rounded-full" />
                  <div className="absolute left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-green-400 rounded-full" />
                  <div className="absolute right-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-green-400 rounded-full" />
                  <div className="absolute inset-2 border-2 border-dashed border-green-400/50 rounded-full" />
                </div>
                <div className="text-green-400 text-[10px] mt-1">...same probability!</div>
              </div>

              <div className="text-xl text-blue-400">→</div>

              <div className="text-center">
                <div className="text-slate-400 text-[10px] mb-1">In 3D...</div>
                <div 
                  className="w-20 h-20 rounded-full mx-auto"
                  style={{
                    background: `radial-gradient(circle at 40% 40%, 
                      rgba(74, 222, 128, 0.9) 0%, 
                      rgba(74, 222, 128, 0.5) 30%, 
                      rgba(74, 222, 128, 0.2) 60%,
                      transparent 80%)`,
                    boxShadow: '0 0 15px rgba(74, 222, 128, 0.3)'
                  }}
                />
                <div className="text-green-400 text-[10px] mt-1">...it's a sphere!</div>
              </div>
            </div>

            <div className="bg-yellow-500/15 p-3 rounded-lg border-l-4 border-yellow-500 text-left">
              <span className="text-yellow-400 font-bold text-xs">💡 Like a lamp:</span>
              <span className="text-slate-300 text-xs"> Standing 1 meter away, brightness is the same in all directions. Same distance = same value!</span>
            </div>
          </div>
        )}

        {/* Step 4: The Orbital */}
        {step === 4 && (
          <div className="text-center">
            <p className="text-slate-300 mb-3 text-sm">
              The <strong className="text-green-400">1s orbital</strong>: a spherical probability cloud!
            </p>

            {/* Animated orbital */}
            <div className="flex justify-center mb-4">
              <div 
                className="w-32 h-32 rounded-full relative"
                style={{
                  background: `radial-gradient(circle at ${45 + Math.sin(animationFrame * 0.1) * 5}% ${45 + Math.cos(animationFrame * 0.1) * 5}%, 
                    rgba(74, 222, 128, 0.95) 0%, 
                    rgba(74, 222, 128, 0.7) 15%, 
                    rgba(74, 222, 128, 0.4) 35%, 
                    rgba(74, 222, 128, 0.15) 55%,
                    rgba(74, 222, 128, 0.05) 75%,
                    transparent 90%)`,
                  boxShadow: '0 0 30px rgba(74, 222, 128, 0.4)'
                }}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full shadow-lg shadow-red-500/50" />
                
                {[...Array(6)].map((_, i) => {
                  const angle = (i * 60 + animationFrame * 2) * Math.PI / 180;
                  const radius = 28 + Math.sin(animationFrame * 0.15 + i) * 14;
                  return (
                    <div 
                      key={i} 
                      className="absolute w-1.5 h-1.5 bg-blue-400 rounded-full shadow-sm shadow-blue-400/70"
                      style={{
                        top: `calc(50% + ${Math.sin(angle) * radius}px)`,
                        left: `calc(50% + ${Math.cos(angle) * radius}px)`,
                        transform: 'translate(-50%, -50%)',
                        opacity: 0.8
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Key takeaway */}
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-3 rounded-xl border border-purple-500/30 mb-3">
              <p className="text-white text-sm font-medium">
                ✨ The equation <em>predicts</em> this shape — and experiments confirm it!
              </p>
            </div>

            {/* What about 2p */}
            <div className="bg-slate-700/50 p-3 rounded-lg text-xs text-left">
              <strong className="text-orange-400">What about 2p orbitals?</strong>
              <span className="text-slate-300"> When we solve for 2p, the equation includes <strong>direction</strong> → dumbbell shapes!</span>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-center gap-3">
        <button
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className={`px-5 py-2 rounded-lg font-bold text-sm text-white transition-colors ${step === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 cursor-pointer'}`}
        >
          ← Back
        </button>
        <button
          onClick={() => setStep(Math.min(totalSteps - 1, step + 1))}
          disabled={step === totalSteps - 1}
          className={`px-5 py-2 rounded-lg font-bold text-sm text-white transition-colors ${step === totalSteps - 1 ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 cursor-pointer'}`}
        >
          Next →
        </button>
      </div>

      {/* Quantum Numbers Reference */}
      <div>
        <button
          onClick={() => setShowQuantumNumbers(!showQuantumNumbers)}
          className="w-full p-2 rounded-lg border border-gray-300 bg-transparent text-gray-600 cursor-pointer text-xs hover:bg-gray-50 transition-colors"
        >
          {showQuantumNumbers ? '▼' : '▶'} Reference: Quantum Numbers & Orbital Shapes
        </button>
        
        {showQuantumNumbers && (
          <div className="mt-2 p-3 bg-gray-100 rounded-lg text-xs">
            <p className="text-gray-600 mb-2">Different quantum numbers → different shapes:</p>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 bg-green-100 p-2 rounded">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600" />
                <div>
                  <strong className="text-green-700">s orbitals</strong>
                  <span className="text-gray-500"> (l = 0) — Spherical</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 bg-orange-100 p-2 rounded">
                <div className="w-8 h-8 relative">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-gradient-to-b from-orange-400 to-orange-600" />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-gradient-to-t from-orange-400 to-orange-600" />
                </div>
                <div>
                  <strong className="text-orange-700">p orbitals</strong>
                  <span className="text-gray-500"> (l = 1) — Dumbbell</span>
                </div>
              </div>
            </div>

            <div className="mt-2 p-2 bg-yellow-100 rounded text-[10px]">
              <strong className="text-yellow-700">Pattern:</strong>
              <span className="text-gray-600"> Higher l = more complex angular dependence = more complex shape!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Covalent Bonding Visualization
const CovalentBondingVisual = () => {
  return (
    <div className="space-y-6">
      {/* Before Bonding */}
      <div className="bg-red-50 rounded-xl p-6 border-2 border-red-300">
        <h4 className="text-center font-bold text-red-900 mb-4">BEFORE Bonding - Unstable</h4>
        <div className="flex justify-around items-center">
          {/* Carbon with 4 electrons */}
          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 border-4 border-dashed border-red-400 rounded-full" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-700">C</span>
              </div>
              {/* 4 electrons */}
              {[0, 90, 180, 270].map((angle, i) => {
                const radian = (angle * Math.PI) / 180;
                const x = Math.cos(radian) * 40;
                const y = Math.sin(radian) * 40;
                return (
                  <div
                    key={i}
                    className="absolute w-4 h-4 bg-yellow-500 rounded-full border-2 border-yellow-700"
                    style={{
                      left: `calc(50% + ${x}px)`,
                      top: `calc(50% + ${y}px)`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  />
                );
              })}
            </div>
            <p className="text-sm text-red-700 font-semibold mt-2">Carbon: 4e⁻ (needs 4 more!)</p>
          </div>

          {/* 4 Hydrogens */}
          <div className="grid grid-cols-2 gap-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="text-center">
                <div className="relative w-12 h-12 mx-auto">
                  <div className="absolute inset-0 border-2 border-dashed border-red-300 rounded-full" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-gray-600">H</span>
                  </div>
                  <div className="absolute w-3 h-3 bg-blue-400 rounded-full border border-blue-600" style={{left: '50%', top: '10%', transform: 'translateX(-50%)'}} />
                </div>
                <p className="text-xs text-red-600 mt-1">1e⁻</p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-center text-red-700 font-bold mt-4 text-lg">HIGH ENERGY ⚡ Unstable!</p>
      </div>

      {/* Arrow */}
      <div className="text-center">
        <div className="text-4xl text-purple-600 font-bold">⬇️</div>
        <p className="text-purple-600 font-semibold">ELECTRON SHARING</p>
        <p className="text-sm text-purple-500">(Energy Released!)</p>
      </div>

      {/* After Bonding */}
      <div className="bg-green-50 rounded-xl p-6 border-2 border-green-400">
        <h4 className="text-center font-bold text-green-900 mb-4">AFTER Bonding - Stable ✓</h4>
        <div className="flex justify-center">
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto">
              {/* Carbon nucleus */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-gray-700">C</span>
              </div>
              {/* Complete outer shell */}
              <div className="absolute inset-0 border-4 border-green-500 rounded-full" />
              
              {/* 8 electrons around carbon */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
                const radian = (angle * Math.PI) / 180;
                const x = Math.cos(radian) * 55;
                const y = Math.sin(radian) * 55;
                const isShared = i % 2 === 0;
                return (
                  <div
                    key={i}
                    className={`absolute w-4 h-4 rounded-full border-2 ${
                      isShared 
                        ? 'bg-gradient-to-br from-yellow-400 to-blue-400 border-purple-600 animate-pulse' 
                        : 'bg-yellow-500 border-yellow-700'
                    }`}
                    style={{
                      left: `calc(50% + ${x}px)`,
                      top: `calc(50% + ${y}px)`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  />
                );
              })}
              
              {/* H labels around */}
              {[0, 90, 180, 270].map((angle, i) => {
                const radian = (angle * Math.PI) / 180;
                const x = Math.cos(radian) * 75;
                const y = Math.sin(radian) * 75;
                return (
                  <div
                    key={`h-${i}`}
                    className="absolute text-blue-700 font-bold text-lg"
                    style={{
                      left: `calc(50% + ${x}px)`,
                      top: `calc(50% + ${y}px)`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    H
                  </div>
                );
              })}
            </div>
            <p className="text-sm text-green-800 font-semibold mt-2">Carbon: 8e⁻ (COMPLETE OCTET!)</p>
            <p className="text-xs text-green-700 mt-1">Each H also has 2e⁻ (stable)</p>
          </div>
        </div>
        <p className="text-center text-green-700 font-bold mt-4 text-lg">LOW ENERGY ✓ Stable!</p>
      </div>

      {/* Legend */}
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-500 rounded-full border-2 border-yellow-700" />
            <span className="text-gray-700">Carbon's electrons</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-400 rounded-full border-2 border-blue-600" />
            <span className="text-gray-700">Hydrogen's electrons</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gradient-to-br from-yellow-400 to-blue-400 rounded-full border-2 border-purple-600" />
            <span className="text-gray-700">Shared electrons</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Glucose Molecule Visualization
const GlucoseMoleculeVisual: FC = () => {
  return (
    <div className="space-y-6">
      {/* Oxygen Introduction Card */}
      <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border-2 border-red-300">
        <div className="flex items-center justify-center mb-4">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center shadow-xl">
            <span className="text-white text-3xl font-bold">O</span>
          </div>
        </div>
        <h4 className="text-center font-bold text-red-900 text-xl mb-2">Oxygen</h4>
        <p className="text-center text-red-700 mb-4">The Electron Magnet</p>
        
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-white rounded-lg p-3 text-center">
            <p className="font-bold text-red-800">Atomic #</p>
            <p className="text-2xl font-bold text-gray-900">8</p>
          </div>
          <div className="bg-white rounded-lg p-3 text-center">
            <p className="font-bold text-red-800">Valence e⁻</p>
            <p className="text-2xl font-bold text-gray-900">6</p>
          </div>
          <div className="bg-white rounded-lg p-3 text-center">
            <p className="font-bold text-red-800">Bonds</p>
            <p className="text-2xl font-bold text-gray-900">2</p>
          </div>
          <div className="bg-white rounded-lg p-3 text-center">
            <p className="font-bold text-red-800">EN</p>
            <p className="text-2xl font-bold text-gray-900">3.5</p>
          </div>
        </div>
        
        <div className="mt-4 bg-red-100 rounded-lg p-3">
          <p className="text-red-900 text-sm text-center">
            <strong>Needs 2 more electrons</strong> for octet → Forms 2 bonds + has 2 lone pairs
          </p>
        </div>
      </div>

      {/* Oxygen Electron Structure */}
      <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
        <h4 className="text-center font-bold text-gray-900 mb-4">Oxygen's Electron Structure</h4>
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
              O
            </div>
            {/* Inner shell - 2 electrons */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 border-2 border-gray-400 rounded-full">
              {[0, 1].map((i) => {
                const angle = (i * 180);
                const radian = (angle * Math.PI) / 180;
                const x = Math.cos(radian) * 42;
                const y = Math.sin(radian) * 42;
                return (
                  <div
                    key={`inner-${i}`}
                    className="absolute w-3 h-3 bg-blue-500 rounded-full"
                    style={{
                      left: `calc(50% + ${x}px)`,
                      top: `calc(50% + ${y}px)`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  />
                );
              })}
            </div>
            {/* Outer shell - 6 electrons */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 border-2 border-red-400 rounded-full">
              {[0, 1, 2, 3, 4, 5].map((i) => {
                const angle = (i * 60);
                const radian = (angle * Math.PI) / 180;
                const x = Math.cos(radian) * 80;
                const y = Math.sin(radian) * 80;
                return (
                  <div
                    key={`outer-${i}`}
                    className="absolute w-4 h-4 bg-red-500 rounded-full border-2 border-red-700"
                    style={{
                      left: `calc(50% + ${x}px)`,
                      top: `calc(50% + ${y}px)`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  />
                );
              })}
              {/* Empty slots */}
              {[6, 7].map((i) => {
                const angle = (i * 45);
                const radian = (angle * Math.PI) / 180;
                const x = Math.cos(radian) * 80;
                const y = Math.sin(radian) * 80;
                return (
                  <div
                    key={`empty-${i}`}
                    className="absolute w-4 h-4 border-2 border-dashed border-red-300 rounded-full bg-white"
                    style={{
                      left: `calc(50% + ${x}px)`,
                      top: `calc(50% + ${y}px)`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <span className="text-red-400 text-xs flex items-center justify-center h-full">?</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <p className="text-center text-gray-700 mt-4">2 core + 6 valence = 8 total electrons</p>
        <p className="text-center text-red-600 font-semibold">Needs 2 more to complete octet!</p>
      </div>

      {/* Glucose Structure */}
      <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-6 border-2 border-amber-300">
        <h4 className="text-center font-bold text-amber-900 mb-2">Glucose: C₆H₁₂O₆</h4>
        <p className="text-center text-amber-700 mb-4">The Energy Currency of Life</p>
        
        {/* Simplified Glucose Ring */}
        <div className="flex justify-center mb-4">
          <svg viewBox="0 0 200 160" className="w-64 h-48">
            {/* Ring structure */}
            <polygon points="100,20 160,50 160,110 100,140 40,110 40,50" fill="none" stroke="#d97706" strokeWidth="3"/>
            
            {/* Carbon atoms */}
            <circle cx="100" cy="20" r="12" fill="#374151"/>
            <text x="100" y="25" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">C</text>
            
            <circle cx="160" cy="50" r="12" fill="#374151"/>
            <text x="160" y="55" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">C</text>
            
            <circle cx="160" cy="110" r="12" fill="#374151"/>
            <text x="160" y="115" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">C</text>
            
            <circle cx="100" cy="140" r="12" fill="#374151"/>
            <text x="100" y="145" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">C</text>
            
            <circle cx="40" cy="110" r="12" fill="#374151"/>
            <text x="40" y="115" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">C</text>
            
            {/* Oxygen in ring */}
            <circle cx="40" cy="50" r="12" fill="#ef4444"/>
            <text x="40" y="55" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">O</text>
            
            {/* CH₂OH group */}
            <line x1="100" y1="20" x2="100" y2="0" stroke="#d97706" strokeWidth="2"/>
            <text x="100" y="-5" textAnchor="middle" fill="#374151" fontSize="10">CH₂OH</text>
            
            {/* OH groups */}
            <line x1="172" y1="50" x2="190" y2="50" stroke="#ef4444" strokeWidth="2"/>
            <text x="195" y="55" fill="#ef4444" fontSize="10">OH</text>
            
            <line x1="172" y1="110" x2="190" y2="110" stroke="#ef4444" strokeWidth="2"/>
            <text x="195" y="115" fill="#ef4444" fontSize="10">OH</text>
            
            <line x1="100" y1="152" x2="100" y2="160" stroke="#ef4444" strokeWidth="2"/>
            <text x="100" y="170" textAnchor="middle" fill="#ef4444" fontSize="10">OH</text>
            
            <line x1="28" y1="110" x2="10" y2="110" stroke="#ef4444" strokeWidth="2"/>
            <text x="5" y="115" fill="#ef4444" fontSize="10" textAnchor="end">OH</text>
          </svg>
        </div>
        
        <div className="grid grid-cols-3 gap-2 text-center text-sm">
          <div className="bg-gray-100 rounded p-2">
            <span className="font-bold text-gray-700">6 Carbons</span>
            <p className="text-xs text-gray-600">4 bonds each</p>
          </div>
          <div className="bg-red-100 rounded p-2">
            <span className="font-bold text-red-700">6 Oxygens</span>
            <p className="text-xs text-red-600">2 bonds each</p>
          </div>
          <div className="bg-blue-100 rounded p-2">
            <span className="font-bold text-blue-700">12 Hydrogens</span>
            <p className="text-xs text-blue-600">1 bond each</p>
          </div>
        </div>
      </div>

      {/* Biology Connection */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-300">
        <h4 className="text-center font-bold text-green-900 mb-3">🔬 The Biology Connection</h4>
        <div className="bg-white rounded-lg p-4 mb-3">
          <p className="text-center font-mono text-sm text-gray-800">
            C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + <span className="text-green-600 font-bold">ENERGY</span>
          </p>
        </div>
        <p className="text-green-800 text-sm text-center">
          Every cell in your body burns glucose using this exact reaction. The energy released powers everything you do!
        </p>
      </div>
    </div>
  );
};

// Glycine Molecule Visualization
const GlycineMoleculeVisual: FC = () => {
  return (
    <div className="space-y-6">
      {/* Nitrogen Introduction Card */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-300">
        <div className="flex items-center justify-center mb-4">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-xl">
            <span className="text-white text-3xl font-bold">N</span>
          </div>
        </div>
        <h4 className="text-center font-bold text-blue-900 text-xl mb-2">Nitrogen</h4>
        <p className="text-center text-blue-700 mb-4">The Three-Bond Wonder</p>
        
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-white rounded-lg p-3 text-center">
            <p className="font-bold text-blue-800">Atomic #</p>
            <p className="text-2xl font-bold text-gray-900">7</p>
          </div>
          <div className="bg-white rounded-lg p-3 text-center">
            <p className="font-bold text-blue-800">Valence e⁻</p>
            <p className="text-2xl font-bold text-gray-900">5</p>
          </div>
          <div className="bg-white rounded-lg p-3 text-center">
            <p className="font-bold text-blue-800">Bonds</p>
            <p className="text-2xl font-bold text-gray-900">3</p>
          </div>
          <div className="bg-white rounded-lg p-3 text-center">
            <p className="font-bold text-blue-800">Lone Pairs</p>
            <p className="text-2xl font-bold text-gray-900">1</p>
          </div>
        </div>
        
        <div className="mt-4 bg-blue-100 rounded-lg p-3">
          <p className="text-blue-900 text-sm text-center">
            <strong>5 valence e⁻:</strong> Forms 3 bonds + keeps 1 lone pair (2 electrons)
          </p>
        </div>
      </div>

      {/* Nitrogen Electron Structure */}
      <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
        <h4 className="text-center font-bold text-gray-900 mb-4">Nitrogen's Electron Structure</h4>
        <div className="flex justify-center items-center" style={{ minHeight: '200px' }}>
          <div className="relative" style={{ width: '180px', height: '180px' }}>
            {/* Nucleus - centered */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl z-10">
              N
            </div>
            {/* Inner shell - 2 electrons */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 border-2 border-gray-400 rounded-full">
              {[0, 1].map((i) => {
                const angle = (i * 180);
                const radian = (angle * Math.PI) / 180;
                const x = Math.cos(radian) * 42;
                const y = Math.sin(radian) * 42;
                return (
                  <div
                    key={`inner-${i}`}
                    className="absolute w-4 h-4 bg-gray-500 rounded-full border-2 border-gray-700"
                    style={{
                      left: `calc(50% + ${x}px)`,
                      top: `calc(50% + ${y}px)`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  />
                );
              })}
            </div>
            {/* Outer shell - 5 valence electrons */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 border-2 border-blue-400 rounded-full">
              {/* Lone pair - 2 electrons together at top */}
              <div
                className="absolute w-5 h-5 bg-purple-600 rounded-full border-2 border-purple-800"
                style={{
                  left: 'calc(50% - 8px)',
                  top: '0px',
                  transform: 'translateY(-50%)'
                }}
              />
              <div
                className="absolute w-5 h-5 bg-purple-600 rounded-full border-2 border-purple-800"
                style={{
                  left: 'calc(50% + 8px)',
                  top: '0px',
                  transform: 'translate(-100%, -50%)'
                }}
              />
              {/* 3 bonding electrons evenly spaced */}
              {[0, 1, 2].map((i) => {
                const angle = 120 + (i * 80);
                const radian = (angle * Math.PI) / 180;
                const x = Math.cos(radian) * 80;
                const y = Math.sin(radian) * 80;
                return (
                  <div
                    key={`bond-${i}`}
                    className="absolute w-5 h-5 bg-blue-500 rounded-full border-2 border-blue-700"
                    style={{
                      left: `calc(50% + ${x}px)`,
                      top: `calc(50% + ${y}px)`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-500 rounded-full border-2 border-gray-700" />
            <span className="text-gray-700">Core (2e⁻)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-600 rounded-full border-2 border-purple-800" />
            <span className="text-gray-700">Lone pair (2e⁻)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-blue-700" />
            <span className="text-gray-700">Bonding (3e⁻)</span>
          </div>
        </div>
        <p className="text-center text-gray-600 text-sm mt-3">Total: 7 electrons (2 core + 5 valence)</p>
      </div>

      {/* Glycine Structure */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-300">
        <h4 className="text-center font-bold text-purple-900 mb-2">Glycine: C₂H₅NO₂</h4>
        <p className="text-center text-purple-700 mb-4">The Simplest Amino Acid</p>
        
        {/* Glycine Structural Formula - Cleaner version */}
        <div className="bg-white rounded-lg p-6 mb-4">
          <div className="flex justify-center items-center">
            <div className="flex items-center space-x-1">
              {/* Amino group - show as H₂N with subscript */}
              <div className="flex items-center">
                <span className="text-gray-700 font-bold text-lg">H<sub>2</sub>N</span>
              </div>
              
              {/* Bond to alpha carbon */}
              <div className="w-4 h-1 bg-gray-700 mx-1"></div>
              
              {/* Alpha carbon with 2 H shown as CH₂ */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">C</span>
                </div>
                <span className="text-gray-700 font-bold text-sm">H<sub>2</sub></span>
              </div>
              
              {/* Bond to carboxyl carbon */}
              <div className="w-4 h-1 bg-gray-700 mx-1"></div>
              
              {/* Carboxyl group - COOH */}
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">O</span>
                </div>
                <span className="text-red-500 font-bold text-sm">||</span>
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">C</span>
                </div>
                <span className="text-gray-400">|</span>
                <div className="flex items-center">
                  <span className="text-gray-700 font-bold">OH</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex justify-center gap-6 mt-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Nitrogen</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gray-700 rounded-full"></div>
              <span>Carbon</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Oxygen</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-gray-500 font-bold">H</span>
              <span>Hydrogen</span>
            </div>
          </div>
        </div>
        
        {/* Functional Groups */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-100 rounded-lg p-3 text-center">
            <p className="font-bold text-blue-800">Amino Group</p>
            <p className="text-xl font-mono text-blue-900">-NH₂</p>
            <p className="text-xs text-blue-700 mt-1">Makes it a BASE</p>
          </div>
          <div className="bg-red-100 rounded-lg p-3 text-center">
            <p className="font-bold text-red-800">Carboxyl Group</p>
            <p className="text-xl font-mono text-red-900">-COOH</p>
            <p className="text-xs text-red-700 mt-1">Makes it an ACID</p>
          </div>
        </div>
      </div>

      {/* Bond Count Verification */}
      <div className="bg-green-50 rounded-xl p-4 border-2 border-green-300">
        <h4 className="text-center font-bold text-green-900 mb-3">✓ All Atoms Satisfy Octet Rule</h4>
        <div className="grid grid-cols-4 gap-2 text-center text-sm">
          <div className="bg-white rounded p-2">
            <span className="font-bold text-gray-700">2 C</span>
            <p className="text-xs">4 bonds ✓</p>
          </div>
          <div className="bg-white rounded p-2">
            <span className="font-bold text-blue-700">1 N</span>
            <p className="text-xs">3 bonds ✓</p>
          </div>
          <div className="bg-white rounded p-2">
            <span className="font-bold text-red-700">2 O</span>
            <p className="text-xs">2 bonds ✓</p>
          </div>
          <div className="bg-white rounded p-2">
            <span className="font-bold text-gray-500">5 H</span>
            <p className="text-xs">1 bond ✓</p>
          </div>
        </div>
      </div>

      {/* Biology Connection */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-300">
        <h4 className="text-center font-bold text-amber-900 mb-2">🧬 The Protein Connection</h4>
        <p className="text-amber-800 text-sm text-center">
          Glycine is one of 20 amino acids. The amino group of one bonds to the carboxyl group of another, 
          forming <strong>peptide bonds</strong> that create all proteins in your body!
        </p>
      </div>
    </div>
  );
};

// Grand Connection Visualization
const GrandConnectionVisual: FC = () => {
  return (
    <div className="space-y-6">
      {/* Celebration Header */}
      <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl p-6 text-center text-white">
        <div className="text-5xl mb-3">🎉</div>
        <h3 className="text-2xl font-bold mb-2">Congratulations!</h3>
        <p className="text-purple-100">You've completed the Quantum Foundation Module</p>
      </div>

      {/* What You Learned */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-300">
        <h4 className="text-center font-bold text-indigo-900 mb-4">🧠 What You Now Understand</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-lg p-3 flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">e⁻</div>
            <span className="text-sm text-gray-800">Electrons drive bonding</span>
          </div>
          <div className="bg-white rounded-lg p-3 flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">8</div>
            <span className="text-sm text-gray-800">Octet = Stability</span>
          </div>
          <div className="bg-white rounded-lg p-3 flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold text-sm">C</div>
            <span className="text-sm text-gray-800">Carbon: 4 bonds</span>
          </div>
          <div className="bg-white rounded-lg p-3 flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">O</div>
            <span className="text-sm text-gray-800">Oxygen: 2 bonds</span>
          </div>
          <div className="bg-white rounded-lg p-3 flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">N</div>
            <span className="text-sm text-gray-800">Nitrogen: 3 bonds</span>
          </div>
          <div className="bg-white rounded-lg p-3 flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold text-sm">H</div>
            <span className="text-sm text-gray-800">Hydrogen: 1 bond</span>
          </div>
        </div>
      </div>

      {/* Hierarchy of Life */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-300">
        <h4 className="text-center font-bold text-green-900 mb-4">🌿 The Hierarchy of Life</h4>
        <div className="space-y-2">
          {[
            { level: 'ATOMS', desc: 'C, H, O, N, S, P...', color: 'bg-blue-500' },
            { level: 'MOLECULES', desc: 'glucose, glycine, water...', color: 'bg-green-500' },
            { level: 'MACROMOLECULES', desc: 'proteins, DNA, carbohydrates...', color: 'bg-yellow-500' },
            { level: 'CELLS', desc: 'the building blocks of life', color: 'bg-orange-500' },
            { level: 'YOU', desc: 'consciousness from chemistry', color: 'bg-purple-500' }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center space-x-3">
              <div className={`w-4 h-4 ${item.color} rounded-full`} />
              <div className="flex-1 bg-white rounded-lg p-2 flex justify-between items-center">
                <span className="font-bold text-gray-800">{item.level}</span>
                <span className="text-xs text-gray-600">{item.desc}</span>
              </div>
              {idx < 4 && <div className="text-gray-400 text-xl">↓</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Profound Truth */}
      <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-6 border-2 border-amber-400">
        <div className="text-center mb-4">
          <Sparkles className="w-10 h-10 text-amber-600 mx-auto" />
        </div>
        <p className="text-amber-900 text-center leading-relaxed font-medium">
          Every carbon atom in your body was forged in a star billions of years ago. 
          When you eat an apple, you rearrange those ancient atoms. When you think a thought, 
          electrons flow through molecules following these exact quantum rules.
        </p>
        <p className="text-amber-800 text-center mt-4 text-lg font-bold">
          You are not separate from chemistry. You ARE chemistry in motion.
        </p>
      </div>

      {/* What's Next */}
      <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl p-6 border-2 border-purple-300">
        <h4 className="text-center font-bold text-purple-900 mb-3">🚀 What's Next?</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="bg-white rounded-lg p-2 text-center">
            <span className="text-purple-800">Functional Groups</span>
          </div>
          <div className="bg-white rounded-lg p-2 text-center">
            <span className="text-purple-800">Reaction Mechanisms</span>
          </div>
          <div className="bg-white rounded-lg p-2 text-center">
            <span className="text-purple-800">Stereochemistry</span>
          </div>
          <div className="bg-white rounded-lg p-2 text-center">
            <span className="text-purple-800">Biomolecules</span>
          </div>
        </div>
        <p className="text-center text-purple-700 mt-4 text-sm">
          The universe is written in the language of atoms. You're now learning to read it.
        </p>
      </div>
    </div>
  );
};

// Progress Tracker Component
interface ProgressTrackerProps {
  progress: Progress;
}

const ProgressTracker: FC<ProgressTrackerProps> = ({ progress }) => {
  const { completedConcepts, totalConcepts, confidenceScores, strengths, needsWork } = progress;
  const percentage = totalConcepts > 0 ? Math.round((completedConcepts / totalConcepts) * 100) : 0;
  const avgConfidence = confidenceScores.length > 0 
    ? (confidenceScores.reduce((a, b) => a + b, 0) / confidenceScores.length).toFixed(1)
    : 0;
  
  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl shadow-lg p-6 space-y-4">
      <div className="flex items-center space-x-3">
        <TrendingUp className="w-8 h-8 text-purple-600" />
        <h3 className="text-xl font-bold text-gray-900">Your Journey Progress</h3>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium text-gray-700">Concepts Explored</span>
          <span className="font-bold text-purple-600">{completedConcepts} / {totalConcepts}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-3 text-center">
          <Star className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
          <p className="text-xs text-gray-600">Avg Confidence</p>
          <p className="text-2xl font-bold text-gray-900">{avgConfidence}</p>
        </div>
        <div className="bg-white rounded-lg p-3 text-center">
          <Award className="w-6 h-6 text-green-500 mx-auto mb-1" />
          <p className="text-xs text-gray-600">Strengths</p>
          <p className="text-2xl font-bold text-gray-900">{strengths.length}</p>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const KyOrdaApp: FC = () => {
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'learning' | 'complete'>('welcome');
  const [currentModule, setCurrentModule] = useState<number>(0);
  const [currentConcept, setCurrentConcept] = useState<number>(0);
  const [showChat, setShowChat] = useState<boolean>(false);
  const [chatInput, setChatInput] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);
  const [confidenceLevel, setConfidenceLevel] = useState<number>(3);
  const [knowledgeCheckAnswers, setKnowledgeCheckAnswers] = useState<Record<string, number>>({});
  const [showAdaptiveHelp, setShowAdaptiveHelp] = useState<boolean>(false);
  const [adaptiveHelpContent, setAdaptiveHelpContent] = useState<AdaptiveHelpContent | null>(null);
  const [showAnalytics, setShowAnalytics] = useState<boolean>(false);
  const [conceptStartTime, setConceptStartTime] = useState<number>(Date.now());
  
  // Voice Mode State
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [voiceLoading, setVoiceLoading] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Feedback State
  const [showFeedbackModal, setShowFeedbackModal] = useState<boolean>(false);
  const [feedbackType, setFeedbackType] = useState<'rating' | 'comment' | 'issue'>('rating');
  const [feedbackComment, setFeedbackComment] = useState<string>('');
  const [feedbackSubmitting, setFeedbackSubmitting] = useState<boolean>(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState<boolean>(false);
  const [conceptRatings, setConceptRatings] = useState<Record<string, number>>({});
  
  // D-ID Configuration (set your API key here)
  const [didApiKey, setDidApiKey] = useState<string | null>(null); // Set to your D-ID API key
  
  // Initialize ML Analytics System
  const [analytics] = useState<LearningAnalytics>(() => new LearningAnalytics());
  
  const [progress, setProgress] = useState<Progress>({
    completedConcepts: 0,
    totalConcepts: 0,
    confidenceScores: [],
    strengths: [],
    needsWork: [],
    conceptHistory: []
  });
  
  // Ref for scrolling to top
  const topRef = useRef<HTMLDivElement>(null);
  
  // Track concept start time
  useEffect(() => {
    setConceptStartTime(Date.now());
  }, [currentConcept, currentModule]);
  
  // Scroll to top when concept or module changes
  useEffect(() => {
    if (currentScreen === 'learning') {
      // Multiple scroll methods for maximum compatibility
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      if (topRef.current) {
        topRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [currentConcept, currentModule, currentScreen]);
  
  // Track confidence changes
  useEffect(() => {
    if (confidenceLevel) {
      analytics.trackEvent('confidence_set', { 
        level: confidenceLevel, 
        conceptId: modules[currentModule]?.concepts[currentConcept]?.id 
      });
    }
  }, [confidenceLevel]);
  
  const modules = [
    {
      title: 'The Quantum Foundation: Carbon Atom Deep Dive',
      concepts: [
        {
          id: 'building-blocks',
          title: 'The Building Blocks: Protons, Neutrons, and Electrons',
          wisdom: "All matter in the universe is built from just three tiny particles - understanding them unlocks all of chemistry.",
          explanation: `Before we explore carbon and bonding, let's clearly define the three fundamental particles that make up every atom:

**THE NUCLEUS (center of the atom):**

**Protons (+)**
- **Positive charge** (+1)
- Located in the nucleus
- **Defines the element** - the number of protons IS the atomic number
- Carbon ALWAYS has 6 protons (that's what makes it carbon!)
- Relatively heavy (mass ≈ 1 atomic mass unit)

**Neutrons (neutral)**
- **No charge** (neutral)
- Located in the nucleus alongside protons
- Add mass but don't affect charge
- Different numbers create isotopes (Carbon-12 vs Carbon-14)
- Relatively heavy (mass ≈ 1 atomic mass unit)

**OUTSIDE THE NUCLEUS:**

**Electrons (-) ⚡ THE STAR OF CHEMISTRY**
- **Negative charge** (-1)
- Orbit the nucleus in specific energy levels (shells)
- **Extremely light** (1/1836 the mass of a proton - almost negligible!)
- **ELECTRONS ARE WHAT CHEMISTRY IS ALL ABOUT**

**Why electrons matter most:**
In a neutral atom, # of electrons = # of protons. But unlike protons (locked in nucleus), electrons can be **shared, transferred, or rearranged**. This is the basis of ALL chemical reactions and bonding!`,
          visualType: 'atomicStructure',
          knowledgeChecks: [
            {
              id: 'bb1',
              question: "Which particle defines what element an atom is?",
              options: ["Electrons", "Neutrons", "Protons", "All three equally"],
              correct: 2,
              explanation: "Protons define the element! Carbon always has 6 protons. If you change the number of protons, you change the element entirely."
            },
            {
              id: 'bb2',
              question: "Which particle is most important for chemical bonding and reactions?",
              options: ["Protons", "Neutrons", "Electrons", "The nucleus"],
              correct: 2,
              explanation: "Electrons! They're the only particles that can be shared or transferred between atoms. All of chemistry is essentially the story of electron behavior."
            }
          ]
        },
        {
          id: 'electron-deep-dive',
          title: 'The Electron: Chemistry\'s Main Character',
          wisdom: "The electron's negative charge and quantum behavior determine how all atoms interact - it is the architect of molecular structure.",
          explanation: `Let's dive deeper into the **electron** - understanding this particle is the key to understanding all of organic chemistry.

**What IS an electron?**

An electron is a **fundamental particle** - it cannot be broken down into smaller parts. It carries a negative charge (-1) and has almost no mass compared to protons and neutrons.

**Key Properties of Electrons:**

**1. Negative Charge (-1)**
- Electrons are attracted to the positive protons in the nucleus
- This attraction keeps electrons bound to the atom
- Electrons repel other electrons (like charges repel)

**2. Quantum Behavior**
- Electrons don't orbit like planets - they exist in "probability clouds" called **orbitals**
- They occupy specific **energy levels** (shells) around the nucleus
- They can only exist at certain energy states, not in between

**3. Electronegativity (CRITICAL for later!)**
- Different atoms attract electrons with different strengths
- This property is called **electronegativity**
- **Foreshadowing:** When atoms with different electronegativities bond, electrons aren't shared equally - this creates **polar bonds** and determines **molecular shape**
- Example: Oxygen pulls electrons harder than carbon → gives water its unique structure and shape!

**Why electrons determine everything:**
- **Bonding:** Electrons are shared between atoms
- **Molecular shape:** Electron pairs repel each other, determining geometry
- **Reactivity:** Available electrons determine how molecules interact
- **Properties:** Electron distribution determines if a molecule is polar or nonpolar

**Bottom line:** Master electrons, master chemistry.`,
          visualType: 'electronProperties',
          knowledgeChecks: [
            {
              id: 'ed1',
              question: "What charge does an electron carry?",
              options: ["Positive (+1)", "Negative (-1)", "Neutral (0)", "Variable"],
              correct: 1,
              explanation: "Electrons carry a negative charge of -1. This is why they're attracted to the positive protons in the nucleus."
            },
            {
              id: 'ed2',
              question: "What is electronegativity?",
              options: ["The mass of an electron", "How many electrons an atom has", "How strongly an atom attracts electrons", "The speed of electrons"],
              correct: 2,
              explanation: "Electronegativity is how strongly an atom attracts electrons. This will be crucial later - it determines bond polarity and molecular shape!"
            }
          ]
        },
        {
          id: 'stability-rule',
          title: 'The Universal Rule: 8 Electrons = Stability',
          wisdom: "Nature's most fundamental drive: atoms seek the stable configuration of 8 valence electrons.",
          explanation: `Now that you understand electrons, let's learn **the most important rule in all of chemistry**: 

**The Octet Rule: Atoms are most stable and energy-efficient when they have 8 electrons in their outer shell.**

Think of it like this: Noble gases (helium, neon, argon) are the "happy" elements - they don't react with anything because they already have full outer shells. **They have achieved perfect stability.**

All other atoms are "incomplete" - they're in a **higher energy state** and naturally want to reach that same stable, low-energy configuration.

**How do atoms achieve 8 electrons?**

Atoms **share electrons** with other atoms through **covalent bonding**. This sharing allows both atoms to "feel" like they have a full outer shell.

**Why is this energetically favorable?**

- **High energy = unstable** (atoms with incomplete outer shells)
- **Bonding releases energy** → atoms drop to lower energy state  
- **Low energy = stable** (atoms with full outer shells)

**The thermodynamic truth:** Nature always moves toward lower energy states. Bonding happens because it's thermodynamically favorable - it releases energy and creates stability.

**Connection to electrons:** Remember, electrons are the particles doing all the work here! The octet rule is really about electrons arranging themselves in the most stable configuration.

This principle drives **ALL of organic chemistry**. Every bond carbon forms, every molecule that exists, follows this fundamental rule.`,
          visualType: 'octetRule',
          knowledgeChecks: [
            {
              id: 'sr1',
              question: "How many electrons in the outer shell create maximum stability?",
              options: ["4", "6", "8", "10"],
              correct: 2,
              explanation: "8 electrons in the outer (valence) shell is the magic number! This is called the octet rule and it's why noble gases are so stable - they already have 8."
            },
            {
              id: 'sr2',
              question: "How do atoms achieve a full outer shell of 8 electrons?",
              options: ["By gaining protons", "By sharing electrons with other atoms", "By losing their nucleus", "By changing elements"],
              correct: 1,
              explanation: "Atoms share electrons through covalent bonding! This allows both atoms to 'count' the shared electrons as part of their outer shell, achieving the stable octet."
            }
          ]
        },
        {
          id: 'carbon-nucleus',
          title: 'Carbon: Born in Stellar Cores',
          wisdom: "Every carbon atom in your body was forged in the heart of a dying star through nuclear fusion.",
          explanation: `Now let's meet the star of organic chemistry: **Carbon**

**Carbon's Atomic Structure:**
- **6 protons** (this defines it as carbon)
- **6 neutrons** (in Carbon-12, the most common isotope)
- **6 electrons** (neutral atom: protons = electrons)

**Stellar Origins:**
Carbon-12 was forged in the hearts of ancient stars through nuclear fusion. When those stars exploded as supernovas, they scattered carbon across the universe - eventually forming you!

**Why Carbon is Special:**

The number 6 is magical. Those 6 protons create a nuclear charge that holds 6 electrons in specific quantum states. But here's the key:

- **2 electrons** fill the first shell (inner, core electrons)
- **4 electrons** in the second shell (outer, **valence electrons**)

**Why does this matter for bonding?**

With 6 electrons total, carbon has only **4 electrons in its outer shell**. Remember the octet rule - it needs **8 to be stable**. This means carbon is **4 electrons short** of stability, which is why it forms bonds!

**Carbon's electronegativity:** Carbon has moderate electronegativity (2.5 on the Pauling scale). This means it shares electrons fairly equally with many other atoms, forming stable covalent bonds.`,
          visualType: 'carbonQuantum',
          knowledgeChecks: [
            {
              id: 'nc1',
              question: "How many protons does carbon have?",
              options: ["4", "6", "8", "12"],
              correct: 1,
              explanation: "Carbon always has 6 protons - this defines it as carbon! The number 12 in Carbon-12 refers to the total of protons + neutrons."
            },
            {
              id: 'nc2',
              question: "Why does carbon form bonds?",
              options: ["It has too many electrons", "It needs 4 more electrons to complete its outer shell", "It wants to lose protons", "It's naturally unstable"],
              correct: 1,
              explanation: "Carbon has only 4 valence electrons but needs 8 for stability (octet rule). By forming bonds and sharing electrons, carbon can achieve that stable octet!"
            }
          ]
        },
        {
          id: 'electron-shells',
          title: 'Quantum Shells: Where Electrons Live',
          wisdom: "Electrons don't orbit randomly - they occupy specific energy levels defined by quantum mechanics.",
          explanation: `Carbon's 6 electrons are arranged in **shells** or **energy levels**:
          
          **Shell 1 (n=1):** Contains the **1s orbital** - holds 2 electrons closest to nucleus (lowest energy)
          
          **Shell 2 (n=2):** Contains **2s and 2p orbitals** - holds the remaining 4 electrons (higher energy)
          
          This arrangement follows the **Aufbau Principle**: electrons fill the lowest energy orbitals first. The 1s orbital fills completely before electrons enter the 2s orbital.`,
          visualType: 'orbital',
          orbitalType: '2s',
          knowledgeChecks: [
            {
              id: 'es1',
              question: "How many electrons can the first shell (n=1) hold?",
              options: ["1", "2", "4", "8"],
              correct: 1,
              explanation: "The first shell can only hold 2 electrons in its 1s orbital. The formula is 2n², so for n=1: 2(1)² = 2 electrons maximum."
            },
            {
              id: 'es2',
              question: "What principle says electrons fill lowest energy orbitals first?",
              options: ["Pauli Exclusion", "Aufbau Principle", "Hund's Rule", "Heisenberg Principle"],
              correct: 1,
              explanation: "The Aufbau Principle (German for 'building up') states that electrons fill the lowest available energy levels first, like filling seats from the front of a theater."
            }
          ]
        },
        {
          id: 'orbital-shapes',
          title: 'Orbital Shapes: The Quantum Geography',
          wisdom: "Orbitals are not circular orbits - they are 3D probability clouds predicted by the Schrödinger equation.",
          explanation: `In 1926, physicist Erwin Schrödinger discovered an equation that predicts **exactly where electrons are likely to be found**. The orbital shapes we use in chemistry come directly from solving this equation!
          
          **S-orbitals** are **spherical** because the equation says probability only depends on distance from the nucleus — not direction.
          
          **P-orbitals** are **dumbbell-shaped** because the equation includes directional terms — probability varies with angle.
          
          Explore the interactive visualization below to see how the Schrödinger equation creates these shapes!`,
          visualType: 'schrodinger',
          knowledgeChecks: [
            {
              id: 'os1',
              question: "What shape are s-orbitals?",
              options: ["Dumbbell", "Spherical", "Linear", "Tetrahedral"],
              correct: 1,
              explanation: "S-orbitals are perfectly spherical! The Schrödinger equation shows that probability only depends on distance — the same in all directions — creating a sphere."
            },
            {
              id: 'os2',
              question: "Why are s-orbitals spherical?",
              options: ["Random chance", "Probability only depends on distance, not direction", "Electrons prefer circles", "The nucleus is round"],
              correct: 1,
              explanation: "The Schrödinger equation for s-orbitals only contains distance (r), no angles. Same distance = same probability in all directions = sphere!"
            }
          ]
        },
        {
          id: 'electron-configuration',
          title: 'Carbon\'s Electron Configuration: 1s² 2s² 2p²',
          wisdom: "Carbon's electron configuration 1s² 2s² 2p² is the blueprint for all organic chemistry.",
          explanation: `**1s²**: 2 electrons in the inner 1s orbital (core electrons - not involved in bonding)
          
          **2s²**: 2 electrons in the 2s orbital (valence electrons - participate in bonding)
          
          **2p²**: 2 electrons in 2p orbitals (valence electrons - partially filled!)
          
          **Key insight:** Carbon has **4 valence electrons** (2s² 2p²) but can hold up to 8 in its outer shell. This means carbon **needs 4 more electrons** to achieve a stable octet. This is why carbon forms **4 covalent bonds**!`,
          visualType: 'electronConfig',
          knowledgeChecks: [
            {
              id: 'ec1',
              question: "What is carbon's complete electron configuration?",
              options: ["1s² 2s² 2p⁴", "1s² 2s² 2p²", "1s² 2p⁴", "1s² 2s⁴"],
              correct: 1,
              explanation: "Carbon's configuration is 1s² 2s² 2p². This accounts for all 6 electrons: 2 in 1s, 2 in 2s, and 2 in 2p orbitals."
            },
            {
              id: 'ec2',
              question: "How many valence electrons does carbon have?",
              options: ["2", "4", "6", "8"],
              correct: 1,
              explanation: "Carbon has 4 valence electrons - the 2 electrons in 2s and the 2 electrons in 2p. These are the electrons that participate in chemical bonding!"
            }
          ]
        },
        {
          id: 'valence-electrons',
          title: 'Valence Electrons: The Bonding Champions',
          wisdom: "The 4 valence electrons in carbon's outer shell are the architects of life's molecular complexity.",
          explanation: `**Valence electrons** are the electrons in the outermost shell that participate in chemical bonding.
          
          Carbon's 4 valence electrons can:
          - Form **4 single bonds** (like in methane CH₄)
          - Form **2 double bonds** (like in carbon dioxide CO₂)
          - Form **1 triple bond + 1 single bond** (like in hydrogen cyanide HCN)
          - Form **chains, rings, and complex 3D structures**
          
          This versatility is **unique to carbon**. No other element can form such diverse, stable structures. This is why carbon is the foundation of **all biological molecules**: proteins, DNA, carbohydrates, and lipids.`,
          visualType: 'electronConfig',
          knowledgeChecks: [
            {
              id: 've1',
              question: "What makes carbon unique among elements?",
              options: ["It has 6 protons", "It can form 4 stable bonds in many arrangements", "It's the most abundant element", "It only forms single bonds"],
              correct: 1,
              explanation: "Carbon's ability to form 4 stable bonds in countless arrangements makes it unique. It can create chains, rings, branches, and 3D structures - the basis of all organic chemistry!"
            },
            {
              id: 've2',
              question: "In methane (CH₄), how many bonds does carbon form?",
              options: ["2", "3", "4", "6"],
              correct: 2,
              explanation: "Carbon forms 4 single bonds in methane - one to each hydrogen atom. This uses all 4 of carbon's valence electrons."
            }
          ]
        },
        {
          id: 'bonding-power',
          title: 'Covalent Bonding: Sharing to Achieve Stability',
          wisdom: "Covalent bonds are nature's solution: atoms share electrons to both achieve the stable octet.",
          explanation: `Now that you understand the octet rule, let's see how carbon actually achieves that stable configuration of 8 electrons.

**Covalent Bonding = Electron Sharing**

Rather than transferring electrons completely (like in ionic bonds), atoms can **share electrons**. Each shared pair of electrons counts toward BOTH atoms' octets.

**Example: Methane (CH₄)**

Carbon starts with 4 valence electrons (needs 4 more for octet)
Each hydrogen has 1 electron (needs 1 more for stability)

When carbon shares electrons with 4 hydrogens:
- Carbon shares 1 electron with each H
- Each H shares its electron back with carbon
- **Result:** Carbon now "feels" 8 electrons around it (4 of its own + 4 shared) = **STABLE!**
- Each H "feels" 2 electrons (its own + the shared one from C) = **STABLE!**

**The Energy Story:**

Before bonding: **High energy** (incomplete shells)
During bonding: **Energy is RELEASED** (exothermic process)  
After bonding: **Low energy** (complete shells = stable)

This energy release is what makes bonding thermodynamically favorable. Bonded molecules are at a **lower, more stable energy state** than separated atoms.

**Why this matters:** Every molecule in your body - proteins, DNA, carbohydrates - exists because covalent bonds create stability by achieving the octet rule through electron sharing.`,
          visualType: 'covalentBonding',
          knowledgeChecks: [
            {
              id: 'bp1',
              question: "In covalent bonding, what do atoms do with electrons?",
              options: ["Transfer them completely", "Share them", "Destroy them", "Create new ones"],
              correct: 1,
              explanation: "In covalent bonds, atoms SHARE electron pairs! This allows both atoms to count the shared electrons toward their octet, so both achieve stability."
            },
            {
              id: 'bp2',
              question: "When atoms form covalent bonds, is energy released or absorbed?",
              options: ["Released (exothermic)", "Absorbed (endothermic)", "Neither", "It varies randomly"],
              correct: 0,
              explanation: "Bond formation releases energy (exothermic)! This is why bonding happens - it creates a more stable, lower-energy state. Breaking bonds requires energy input."
            }
          ]
        },
        {
          id: 'oxygen-glucose',
          title: 'Meet Oxygen & Build Glucose: The Energy of Life',
          wisdom: "Oxygen is the electron-hungry atom that makes water wet and lets you breathe. Combined with carbon and hydrogen, it builds the sugar that powers every cell.",
          explanation: `Now let's meet **Oxygen** - another essential element for life - and use everything we've learned to build a real organic molecule: **Glucose (C₆H₁₂O₆)**.

**Oxygen: The Electron Magnet**

• **Atomic Number:** 8 (8 protons, 8 electrons)
• **Valence Electrons:** 6 (needs 2 more for octet)
• **Bonds Formed:** 2 (forms 2 single bonds OR 1 double bond)
• **Electronegativity:** 3.5 (very strong electron pull!)
• **Lone Pairs:** 2 (two unshared electron pairs)

**Why Oxygen is Special:**

Oxygen's high electronegativity (3.5) means it pulls shared electrons toward itself. When oxygen bonds with carbon (EN 2.5) or hydrogen (EN 2.1), the electrons aren't shared equally - they spend more time near oxygen. This creates **polar bonds** and explains why water has its unique properties!

**Building Glucose Step by Step:**

Glucose (C₆H₁₂O₆) is built using the same rules we've learned:

1. **Carbon (C):** 4 valence e⁻ → forms 4 bonds ✓
2. **Oxygen (O):** 6 valence e⁻ → forms 2 bonds ✓  
3. **Hydrogen (H):** 1 valence e⁻ → forms 1 bond ✓

In glucose:
- 6 carbons form the backbone (ring structure)
- 6 oxygens provide the -OH groups and ring oxygen
- 12 hydrogens complete all the octets

**The Biology Connection:**

Every cell in your body burns glucose for energy:
**C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ENERGY (ATP)**

This reaction works because of the same electron principles you just learned!`,
          visualType: 'glucoseMolecule',
          knowledgeChecks: [
            {
              id: 'og1',
              question: "How many bonds does oxygen typically form?",
              options: ["1 bond", "2 bonds", "3 bonds", "4 bonds"],
              correct: 1,
              explanation: "Oxygen has 6 valence electrons and needs 2 more for an octet. It forms 2 covalent bonds (either 2 single bonds or 1 double bond) to complete its octet."
            },
            {
              id: 'og2',
              question: "Why do electrons in a C-O bond spend more time near oxygen?",
              options: ["Oxygen is larger", "Oxygen has higher electronegativity", "Carbon repels electrons", "Random chance"],
              correct: 1,
              explanation: "Oxygen's electronegativity (3.5) is much higher than carbon's (2.5). This means oxygen pulls the shared electrons more strongly, creating a polar bond where electrons spend more time near oxygen."
            }
          ]
        },
        {
          id: 'nitrogen-glycine',
          title: 'Meet Nitrogen & Build Glycine: The Simplest Amino Acid',
          wisdom: "Nitrogen is the key to life's information and structure. With its lone pair and three bonds, it builds the amino acids that become your proteins.",
          explanation: `Now let's meet **Nitrogen** - the element that makes amino acids and DNA possible - and build **Glycine (C₂H₅NO₂)**, the simplest amino acid.

**Nitrogen: The Three-Bond Wonder**

• **Atomic Number:** 7 (7 protons, 7 electrons)
• **Valence Electrons:** 5 (needs 3 more for octet)
• **Bonds Formed:** 3 (forms 3 single bonds usually)
• **Electronegativity:** 3.0 (strong electron pull)
• **Lone Pairs:** 1 (one unshared electron pair)

**Why Nitrogen is Essential:**

Nitrogen's lone pair is critical for chemistry! This unshared pair:
- Makes nitrogen **basic** (can accept a proton H⁺)
- Creates the **amino group (-NH₂)** in amino acids
- Allows nitrogen to form **hydrogen bonds** with other molecules

**Building Glycine Step by Step:**

Glycine (C₂H₅NO₂) has two functional groups:

**1. Amino Group (-NH₂):** Nitrogen + 2 Hydrogens
- N forms 3 bonds: 2 to H atoms, 1 to carbon
- N keeps 1 lone pair
- This group makes the molecule **basic**

**2. Carboxyl Group (-COOH):** Carbon + 2 Oxygens + Hydrogen
- C forms 4 bonds: double bond to one O, single bonds to another O and the chain
- This group makes the molecule **acidic**

**The Structure:** See the colorful diagram above! It shows:
- Blue N (nitrogen) bonded to 2 H's = amino group
- Gray C (carbon) in the middle with 2 H's = alpha carbon  
- Gray C bonded to red O's = carboxyl group (one O double-bonded, one O-H)

**Counting the Bonds:**
- 2 Carbons: each forms 4 bonds ✓
- 1 Nitrogen: forms 3 bonds (+ 1 lone pair) ✓
- 2 Oxygens: each forms 2 bonds ✓
- 5 Hydrogens: each forms 1 bond ✓

**Every atom satisfies the octet rule!**

**The Biology Connection:**

Glycine is one of 20 amino acids that link together to form proteins. The amino group of one glycine bonds to the carboxyl group of another, creating **peptide bonds** - the backbone of all proteins in your body!`,
          visualType: 'glycineMolecule',
          knowledgeChecks: [
            {
              id: 'ng1',
              question: "How many bonds does nitrogen typically form?",
              options: ["1 bond", "2 bonds", "3 bonds", "4 bonds"],
              correct: 2,
              explanation: "Nitrogen has 5 valence electrons and needs 3 more for an octet. It forms 3 covalent bonds and keeps 1 lone pair (2 electrons). 5 + 3 shared = 8 electrons total!"
            },
            {
              id: 'ng2',
              question: "What makes the amino group (-NH₂) act as a base?",
              options: ["The hydrogen atoms", "Nitrogen's lone pair can accept H⁺", "The bonds are weak", "It has extra protons"],
              correct: 1,
              explanation: "Nitrogen's lone pair (the 2 unshared electrons) can accept a proton (H⁺), which is the definition of a base. This lone pair is crucial for amino acid chemistry!"
            }
          ]
        },
        {
          id: 'grand-connection',
          title: 'The Grand Connection: From Stardust to Life',
          wisdom: "You have learned the language of atoms. Every molecule in your body - every thought, every heartbeat - follows these same quantum rules.",
          explanation: `**Congratulations!** You've completed a journey from subatomic particles to the molecules of life.

**What You Now Understand:**

🔹 **Electrons** are the key to all chemistry - they determine how atoms bond

🔹 **The Octet Rule** (8 electrons = stability) drives all bonding behavior

🔹 **Electronegativity** determines how electrons are shared (polar vs. nonpolar bonds)

🔹 **Carbon** (4 bonds) is the backbone of organic molecules

🔹 **Oxygen** (2 bonds, high EN) creates polar bonds and reactive groups

🔹 **Nitrogen** (3 bonds + lone pair) enables amino acids and bases

🔹 **Hydrogen** (1 bond) completes molecules and enables hydrogen bonding

**The Hierarchy of Life:**

\`\`\`
ATOMS (C, H, O, N, S, P...)
    ↓ covalent bonding
MOLECULES (glucose, glycine, water...)
    ↓ molecular interactions  
MACROMOLECULES (proteins, DNA, carbohydrates...)
    ↓ assembly
CELLS
    ↓ organization
YOU
\`\`\`

**The Profound Truth:**

Every carbon atom in your body was forged in a star billions of years ago. When you eat an apple, you're rearranging those ancient atoms into new configurations. When you think a thought, electrons are flowing through molecules that obey these exact quantum rules.

**You are not separate from chemistry. You ARE chemistry in motion.**

The octet rule isn't just a fact to memorize - it's the principle that makes your heart beat, your neurons fire, and your cells divide. Now when you see organic chemistry reactions, you'll understand the "why" behind every arrow and every bond.

**This is just the beginning.**

With these foundations, you're ready to explore:
- Functional groups and their reactivities
- Reaction mechanisms (how bonds break and form)
- Stereochemistry (3D molecular shapes)
- Biomolecules (proteins, nucleic acids, lipids)

The universe is written in the language of atoms. You're now learning to read it.`,
          visualType: 'grandConnection',
          knowledgeChecks: [
            {
              id: 'gc1',
              question: "What fundamental rule drives why atoms form bonds?",
              options: ["They want to be heavier", "They seek 8 valence electrons (octet rule)", "They want to share protons", "Random attraction"],
              correct: 1,
              explanation: "The octet rule is the foundation! Atoms form bonds to achieve 8 valence electrons (or 2 for hydrogen), which is the stable, low-energy configuration. This single principle explains why all molecules exist."
            },
            {
              id: 'gc2',
              question: "In living organisms, which elements are the primary building blocks of organic molecules?",
              options: ["Iron, Copper, Zinc, Lead", "Carbon, Hydrogen, Oxygen, Nitrogen", "Gold, Silver, Platinum, Mercury", "Helium, Neon, Argon, Krypton"],
              correct: 1,
              explanation: "Carbon (4 bonds), Hydrogen (1 bond), Oxygen (2 bonds), and Nitrogen (3 bonds) are the primary elements of organic chemistry. Together with sulfur and phosphorus, they build all the molecules of life!"
            }
          ]
        }
      ]
    }
  ];
  
  useEffect(() => {
    const total = modules.reduce((sum, module) => sum + module.concepts.length, 0);
    setProgress(prev => ({ ...prev, totalConcepts: total }));
  }, []);
  
  const currentModuleData = modules[currentModule];
  const currentConceptData = currentModuleData?.concepts[currentConcept];
  
  // WORKING AI CHAT HANDLER - Using Backend Proxy
  const handleAiChat = async () => {
    if (!chatInput.trim() || isAiThinking) return;
    
    const userMessage = chatInput.trim();
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsAiThinking(true);
    
    // Track chat interaction with analytics
    analytics.trackEvent('chat_message', {
      conceptId: currentConceptData?.id,
      messageLength: userMessage.length,
      questionType: userMessage.includes('?') ? 'question' : 'statement'
    });
    
    try {
      // Build context-aware message
      const contextualMessage = `The student is learning about: "${currentConceptData.title}".

Context: ${currentConceptData.explanation.slice(0, 500)}...

Student's question: ${userMessage}

Respond with warmth, clarity, and scientific accuracy. Use analogies when helpful. Keep responses concise (2-3 paragraphs).`;
      
      // Call our backend proxy (keeps API key secure)
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: contextualMessage,
          conversationHistory: chatHistory.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API Error: ${response.status}`);
      }
      
      const data = await response.json();
      const aiResponse = data.message;
      
      setChatHistory(prev => [...prev, { role: 'assistant', content: aiResponse }]);
      
    } catch (error) {
      console.error('AI Chat Error:', error);
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm experiencing a moment of cosmic interference. The connection to my knowledge realm is disrupted. Could you try asking again?" 
      }]);
    } finally {
      setIsAiThinking(false);
    }
  };

  // ============================================
  // VOICE/TEXT-TO-SPEECH HANDLERS
  // ============================================
  
  const speakText = async (text: string) => {
    if (!voiceEnabled || voiceLoading) return;
    
    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsSpeaking(false);
    }
    
    setVoiceLoading(true);
    
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: text.slice(0, 1500), // Limit text length
          provider: 'openai' 
        })
      });
      
      if (!response.ok) {
        throw new Error('TTS request failed');
      }
      
      const data = await response.json();
      const audioDataUrl = `data:audio/${data.format};base64,${data.audio}`;
      
      const audio = new Audio(audioDataUrl);
      audioRef.current = audio;
      
      audio.onplay = () => setIsSpeaking(true);
      audio.onended = () => {
        setIsSpeaking(false);
        audioRef.current = null;
      };
      audio.onerror = () => {
        setIsSpeaking(false);
        audioRef.current = null;
      };
      
      await audio.play();
      
    } catch (error) {
      console.error('TTS Error:', error);
    } finally {
      setVoiceLoading(false);
    }
  };
  
  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
      setIsSpeaking(false);
    }
  };
  
  const toggleVoice = () => {
    if (voiceEnabled) {
      stopSpeaking();
    }
    setVoiceEnabled(!voiceEnabled);
  };
  
  // Auto-speak when entering a new concept (if voice enabled)
  useEffect(() => {
    if (voiceEnabled && currentScreen === 'learning' && currentConceptData) {
      // Clean text for speech (remove markdown)
      const cleanText = currentConceptData.explanation
        .replace(/\*\*/g, '')
        .replace(/\n\n/g, '. ')
        .replace(/\n/g, ' ');
      
      // Speak the wisdom first, then explanation
      const speechText = `${currentConceptData.wisdom}. ${cleanText}`;
      speakText(speechText);
    }
    
    return () => {
      // Stop speaking when leaving concept
      stopSpeaking();
    };
  }, [currentConcept, currentModule, voiceEnabled, currentScreen]);

  // ============================================
  // FEEDBACK HANDLERS
  // ============================================
  
  const submitFeedback = async (type: string, rating?: number, comment?: string) => {
    setFeedbackSubmitting(true);
    
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          conceptId: currentConceptData?.id,
          conceptTitle: currentConceptData?.title,
          rating,
          comment,
          sessionId: analytics.sessionId,
          deviceInfo: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown'
        })
      });
      
      if (response.ok) {
        setFeedbackSuccess(true);
        setTimeout(() => {
          setFeedbackSuccess(false);
          setShowFeedbackModal(false);
          setFeedbackComment('');
        }, 1500);
      }
    } catch (error) {
      console.error('Feedback error:', error);
    } finally {
      setFeedbackSubmitting(false);
    }
  };
  
  const handleThumbsRating = async (isPositive: boolean) => {
    const rating = isPositive ? 1 : 0;
    setConceptRatings(prev => ({ ...prev, [currentConceptData.id]: rating }));
    await submitFeedback('rating', rating);
  };
  
  const handleCommentSubmit = async () => {
    if (!feedbackComment.trim()) return;
    await submitFeedback(feedbackType, undefined, feedbackComment.trim());
  };
  
  const handleConceptComplete = () => {
    const conceptId = currentConceptData.id;
    const knowledgeCheckScore = calculateKnowledgeCheckScore();
    
    // Track with ML Analytics system
    const timeSpent = Date.now() - conceptStartTime;
    const checks = currentConceptData.knowledgeChecks || [];
    const questionsCorrect = checks.filter(c => knowledgeCheckAnswers[c.id] === c.correct).length;
    
    analytics.trackConceptAttempt(conceptId, {
      confidence: confidenceLevel,
      questionsCorrect,
      questionsTotal: checks.length,
      timeSpent,
      usedChat: chatHistory.length > 0,
      triggeredAdaptiveHelp: false
    });
    
    setProgress(prev => {
      const newHistory = [...prev.conceptHistory, {
        id: conceptId,
        confidence: confidenceLevel,
        knowledgeCheckScore: knowledgeCheckScore,
        timestamp: new Date().toISOString()
      }];
      
      const newConfidenceScores = [...prev.confidenceScores, confidenceLevel];
      const completed = prev.completedConcepts + 1;
      
      const strengths = confidenceLevel >= 4 && knowledgeCheckScore >= 0.8 
        ? [...prev.strengths, currentConceptData.title] 
        : prev.strengths;
      const needsWork = confidenceLevel <= 2 || knowledgeCheckScore < 0.5
        ? [...prev.needsWork, currentConceptData.title] 
        : prev.needsWork;
      
      return {
        ...prev,
        completedConcepts: completed,
        conceptHistory: newHistory,
        confidenceScores: newConfidenceScores,
        strengths,
        needsWork
      };
    });
  };
  
  const calculateKnowledgeCheckScore = () => {
    const checks = currentConceptData.knowledgeChecks || [];
    if (checks.length === 0) return 1;
    
    let correct = 0;
    checks.forEach(check => {
      if (knowledgeCheckAnswers[check.id] === check.correct) {
        correct++;
      }
    });
    
    return correct / checks.length;
  };
  
  const triggerAdaptiveHelp = (score: number) => {
    const missedQuestions = (currentConceptData.knowledgeChecks || []).filter(
      check => knowledgeCheckAnswers[check.id] !== check.correct
    );
    
   let helpContent: { type: string; message: string; suggestions: string[]; alternativeExplanation: string } = {
  type: 'struggling',
  message: '',
  suggestions: [],
  alternativeExplanation: ''
};
    
    if (confidenceLevel <= 2 && score < 0.5) {
      helpContent.message = "I notice you're feeling confused and some concepts aren't clicking yet. That's completely normal - quantum chemistry is challenging! Let me help you.";
      helpContent.suggestions = [
        "Would it help to see a simpler analogy?",
        "Should we review the previous concept first?",
        "Would you like me to explain this in a different way?"
      ];
      
      // Provide alternative explanation based on concept
      if (currentConceptData.id === 'building-blocks') {
        helpContent.alternativeExplanation = "Think of an atom like a tiny solar system. At the center is the 'sun' (the nucleus) made of protons (+) and neutrons. Orbiting around it are 'planets' (electrons with - charge). Here's the key: protons are LOCKED in the nucleus and can't move. But electrons? They're free to be shared between atoms - and THAT is what chemistry is all about! When we talk about bonding, reactions, or molecules, we're really talking about what electrons are doing.";
      } else if (currentConceptData.id === 'electron-deep-dive') {
        helpContent.alternativeExplanation = "The electron is like the 'worker' of the atom - it does all the actual work of bonding! It has a negative charge, so it's attracted to the positive nucleus (like magnets). Here's something important for later: different atoms are like different magnets - some pull on electrons harder than others. This 'pulling power' is called electronegativity. Oxygen pulls harder than carbon, which is why a water molecule has its unique structure and shape! We'll see this in action soon.";
      } else if (currentConceptData.id === 'stability-rule') {
        helpContent.alternativeExplanation = "Think of atoms like people who feel most comfortable in groups of 8. Noble gases (like neon) already have their group of 8 friends and are perfectly happy - they don't need anyone else! But carbon only has 4 friends. It feels 'incomplete' and uncomfortable (high energy). When carbon bonds with other atoms and shares electrons, it gets to feel like it has 8 friends total (low energy = stable and comfortable). It's like how being in a complete team feels better than being short-handed - that's the octet rule!";
      } else if (currentConceptData.id === 'carbon-nucleus') {
        helpContent.alternativeExplanation = "Think of carbon's nucleus like the sun at the center of a tiny solar system. It has 6 protons (positively charged) that act like a magnet, pulling 6 electrons (negatively charged) to orbit around it. The number 6 is carbon's ID card - it's what makes carbon, carbon!";
      } else if (currentConceptData.id === 'electron-shells') {
        helpContent.alternativeExplanation = "Imagine electron shells like floors in a building. The ground floor (n=1) is smallest and closest to the nucleus - it can only fit 2 electrons. The second floor (n=2) is bigger and can hold 8 electrons total. Electrons always 'move in' to the lowest available floor first, because it takes less energy.";
      } else if (currentConceptData.id === 'orbital-shapes') {
        helpContent.alternativeExplanation = "Orbitals are like 3D 'cloud zones' where you're most likely to find an electron. S-orbitals are like spherical bubbles. P-orbitals are like balloons twisted in the middle to make a figure-8 shape. These aren't paths electrons follow - they're probability clouds showing where electrons 'hang out'!";
      } else if (currentConceptData.id === 'electron-configuration') {
        helpContent.alternativeExplanation = "Think of 1s² 2s² 2p² like an address: 1s² means '2 electrons living in the 1s orbital', 2s² means '2 electrons in the 2s orbital', and 2p² means '2 electrons in the 2p orbitals'. The superscript numbers tell you how many electrons are at each address!";
      } else if (currentConceptData.id === 'valence-electrons') {
        helpContent.alternativeExplanation = "Valence electrons are like carbon's 'hands' - it has 4 of them! Just like you can hold hands with 4 different people in a circle, carbon can bond with 4 other atoms. This is why carbon can build such complex molecules - it's like having 4 connection points to build with!";
      } else if (currentConceptData.id === 'bonding-power') {
        helpContent.alternativeExplanation = "Think of covalent bonding like sharing toys at a playdate. If you have 4 toys and need 8 to feel happy, and your friend also has 4 toys and needs 8, you can put your toys in the middle and SHARE them! Now you both 'feel' like you have 8 toys. That's exactly what atoms do with electrons - they share to make everyone stable and happy!";
      } else if (currentConceptData.id === 'oxygen-glucose') {
        helpContent.alternativeExplanation = "Oxygen is like that friend who ALWAYS wants to borrow your stuff - it has really strong 'electron-pulling power' (electronegativity of 3.5). When oxygen bonds with carbon or hydrogen, the electrons spend more time near oxygen, like a tug-of-war where oxygen is stronger. Glucose is just carbon, hydrogen, and oxygen playing by the same rules - each atom gets its preferred number of bonds (C gets 4, O gets 2, H gets 1), and everyone follows the octet rule!";
      } else if (currentConceptData.id === 'nitrogen-glycine') {
        helpContent.alternativeExplanation = "Nitrogen is special because it forms 3 bonds but keeps one 'lone pair' of electrons to itself (like keeping a secret stash). This lone pair is super important - it can grab onto a hydrogen ion (H⁺), which is why the amino group (-NH₂) acts as a base. Glycine is just the simplest amino acid: a nitrogen with its amino group on one end, and a carboxyl group (with oxygen) on the other. Every protein in your body is built by linking amino acids like glycine together!";
      } else if (currentConceptData.id === 'grand-connection') {
        helpContent.alternativeExplanation = "Here's the mind-blowing truth: everything you've learned in this module explains why you exist! The carbon atoms in your body were literally made inside ancient stars. The octet rule determines how those atoms bond into molecules. Those molecules become proteins, DNA, and sugars. And those become YOU - a thinking, feeling being made entirely of atoms following quantum rules. Chemistry isn't just something you study - it's what you ARE!";
      } else {
        helpContent.alternativeExplanation = "Atoms are like people at a party who feel most comfortable in groups of 8 (the octet rule). Carbon only has 4 friends (valence electrons) but wants 8 total. So it 'shares' friends with other atoms through bonding. When carbon bonds with 4 hydrogens in methane, it gets to 'feel' like it has 8 friends total!";
      }
      
    } else if (confidenceLevel <= 2) {
      helpContent.message = "You're feeling confused but you got most of the questions right! Sometimes we understand more than we think. What specific part is confusing?";
      helpContent.suggestions = [
        "Ask me about the specific part that's unclear",
        "See the concept explained differently",
        "Review the visual again"
      ];
      
      // Still provide alternative explanation
      if (currentConceptData.id === 'building-blocks') {
        helpContent.alternativeExplanation = "Think of an atom like a tiny solar system. At the center is the 'sun' (the nucleus) made of protons (+) and neutrons. Orbiting around it are 'planets' (electrons with - charge). Here's the key: protons are LOCKED in the nucleus and can't move. But electrons? They're free to be shared between atoms - and THAT is what chemistry is all about! When we talk about bonding, reactions, or molecules, we're really talking about what electrons are doing.";
      } else if (currentConceptData.id === 'electron-deep-dive') {
        helpContent.alternativeExplanation = "The electron is like the 'worker' of the atom - it does all the actual work of bonding! It has a negative charge, so it's attracted to the positive nucleus (like magnets). Here's something important for later: different atoms are like different magnets - some pull on electrons harder than others. This 'pulling power' is called electronegativity. Oxygen pulls harder than carbon, which is why a water molecule has its unique structure and shape! We'll see this in action soon.";
      } else if (currentConceptData.id === 'stability-rule') {
        helpContent.alternativeExplanation = "Think of atoms like people who feel most comfortable in groups of 8. Noble gases (like neon) already have their group of 8 friends and are perfectly happy - they don't need anyone else! But carbon only has 4 friends. It feels 'incomplete' and uncomfortable (high energy). When carbon bonds with other atoms and shares electrons, it gets to feel like it has 8 friends total (low energy = stable and comfortable). It's like how being in a complete team feels better than being short-handed - that's the octet rule!";
      } else if (currentConceptData.id === 'carbon-nucleus') {
        helpContent.alternativeExplanation = "Think of carbon's nucleus like the sun at the center of a tiny solar system. It has 6 protons (positively charged) that act like a magnet, pulling 6 electrons (negatively charged) to orbit around it. The number 6 is carbon's ID card - it's what makes carbon, carbon!";
      } else if (currentConceptData.id === 'electron-shells') {
        helpContent.alternativeExplanation = "Imagine electron shells like floors in a building. The ground floor (n=1) is smallest and closest to the nucleus - it can only fit 2 electrons. The second floor (n=2) is bigger and can hold 8 electrons total. Electrons always 'move in' to the lowest available floor first, because it takes less energy.";
      } else if (currentConceptData.id === 'orbital-shapes') {
        helpContent.alternativeExplanation = "Orbitals are like 3D 'cloud zones' where you're most likely to find an electron. S-orbitals are like spherical bubbles. P-orbitals are like balloons twisted in the middle to make a figure-8 shape. These aren't paths electrons follow - they're probability clouds showing where electrons 'hang out'!";
      } else if (currentConceptData.id === 'electron-configuration') {
        helpContent.alternativeExplanation = "Think of 1s² 2s² 2p² like an address: 1s² means '2 electrons living in the 1s orbital', 2s² means '2 electrons in the 2s orbital', and 2p² means '2 electrons in the 2p orbitals'. The superscript numbers tell you how many electrons are at each address!";
      } else if (currentConceptData.id === 'valence-electrons') {
        helpContent.alternativeExplanation = "Valence electrons are like carbon's 'hands' - it has 4 of them! Just like you can hold hands with 4 different people in a circle, carbon can bond with 4 other atoms. This is why carbon can build such complex molecules - it's like having 4 connection points to build with!";
      } else if (currentConceptData.id === 'bonding-power') {
        helpContent.alternativeExplanation = "Think of covalent bonding like sharing toys at a playdate. If you have 4 toys and need 8 to feel happy, and your friend also has 4 toys and needs 8, you can put your toys in the middle and SHARE them! Now you both 'feel' like you have 8 toys. That's exactly what atoms do with electrons - they share to make everyone stable and happy!";
      } else if (currentConceptData.id === 'oxygen-glucose') {
        helpContent.alternativeExplanation = "Oxygen is like that friend who ALWAYS wants to borrow your stuff - it has really strong 'electron-pulling power' (electronegativity of 3.5). When oxygen bonds with carbon or hydrogen, the electrons spend more time near oxygen, like a tug-of-war where oxygen is stronger. Glucose is just carbon, hydrogen, and oxygen playing by the same rules - each atom gets its preferred number of bonds (C gets 4, O gets 2, H gets 1), and everyone follows the octet rule!";
      } else if (currentConceptData.id === 'nitrogen-glycine') {
        helpContent.alternativeExplanation = "Nitrogen is special because it forms 3 bonds but keeps one 'lone pair' of electrons to itself (like keeping a secret stash). This lone pair is super important - it can grab onto a hydrogen ion (H⁺), which is why the amino group (-NH₂) acts as a base. Glycine is just the simplest amino acid: a nitrogen with its amino group on one end, and a carboxyl group (with oxygen) on the other. Every protein in your body is built by linking amino acids like glycine together!";
      } else if (currentConceptData.id === 'grand-connection') {
        helpContent.alternativeExplanation = "Here's the mind-blowing truth: everything you've learned in this module explains why you exist! The carbon atoms in your body were literally made inside ancient stars. The octet rule determines how those atoms bond into molecules. Those molecules become proteins, DNA, and sugars. And those become YOU - a thinking, feeling being made entirely of atoms following quantum rules. Chemistry isn't just something you study - it's what you ARE!";
      } else {
        helpContent.alternativeExplanation = "Atoms are like people at a party who feel most comfortable in groups of 8 (the octet rule). Carbon only has 4 friends (valence electrons) but wants 8 total. So it 'share' friends with other atoms through bonding. When carbon bonds with 4 hydrogens in methane, it gets to 'feel' like it has 8 friends total!";
      }
      
    } else if (score < 0.5) {
      helpContent.message = `You missed ${missedQuestions.length} question(s). Let's make sure these concepts are clear before moving on.`;
      helpContent.suggestions = missedQuestions.map(q => `Revisit: ${q.question}`);
    }
    
    setAdaptiveHelpContent(helpContent);
    setShowAdaptiveHelp(true);
  };
  
  const handleNext = () => {
    // Check if student struggled - if so, show adaptive help instead of advancing
    const knowledgeCheckScore = calculateKnowledgeCheckScore();
    const isStruggling = confidenceLevel <= 2 || knowledgeCheckScore < 0.5;
    
    if (isStruggling) {
      // Trigger adaptive help and DON'T advance
      triggerAdaptiveHelp(knowledgeCheckScore);
      return;
    }
    
    // Student is doing well - record progress and advance
    handleConceptComplete();
    
    if (currentConcept < currentModuleData.concepts.length - 1) {
      setCurrentConcept(currentConcept + 1);
    } else if (currentModule < modules.length - 1) {
      setCurrentModule(currentModule + 1);
      setCurrentConcept(0);
    } else {
      setCurrentScreen('complete');
    }
    
    setConfidenceLevel(3);
    setChatHistory([]);
    setKnowledgeCheckAnswers({});
    setShowAdaptiveHelp(false);
    setAdaptiveHelpContent(null);
    
    // Scroll to top when advancing
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handlePrevious = () => {
    if (currentConcept > 0) {
      setCurrentConcept(currentConcept - 1);
    } else if (currentModule > 0) {
      const prevModule = currentModule - 1;
      setCurrentModule(prevModule);
      setCurrentConcept(modules[prevModule].concepts.length - 1);
    }
    
    setConfidenceLevel(3);
    setChatHistory([]);
    setKnowledgeCheckAnswers({});
    setShowAdaptiveHelp(false);
    setAdaptiveHelpContent(null);
    
    // Scroll to top when going back
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Welcome Screen
  if (currentScreen === 'welcome') {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 text-white p-6">
        <div className="text-center space-y-6">
          <h1 className="text-5xl font-bold tracking-wide drop-shadow-lg">KY'ORDA</h1>
          <p className="text-purple-200 text-lg">From Confidence to Competency</p>
          
          {/* Realistic Nebula Visualization */}
          <div className="relative my-8 flex flex-col items-center">
            <RealisticNebula size={220} />
            <p className="text-xs text-purple-300 mt-4 italic">
              The Crab Nebula - Where carbon atoms are forged in stellar fire
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-left space-y-4">
            <p className="text-purple-100 leading-relaxed">
              Welcome, stellar traveler. You are made of stardust, forged in the hearts of ancient stars like the nebula above.
            </p>
            <p className="text-purple-100 leading-relaxed">
              I am Ky'Orda, your guide through the quantum realm. Together, we'll explore carbon - 
              the cosmic element that makes life possible. We'll journey from electron orbitals to 
              the bonds that build DNA itself.
            </p>
            <p className="text-purple-100 leading-relaxed font-semibold">
              Ask me anything, anytime. I'm here to help you truly understand.
            </p>
          </div>
          
          <button 
            onClick={() => {
              setCurrentScreen('learning');
              analytics.trackEvent('session_start', { screen: 'learning' });
            }}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 font-bold py-4 px-6 rounded-xl shadow-lg transition-all transform hover:scale-105"
          >
            Begin Quantum Journey <ArrowRight className="w-5 h-5 ml-2 inline" />
          </button>
          
          {/* D-ID API Key Input (for demo) */}
          <div className="mt-4 p-3 bg-white/5 rounded-lg">
            <p className="text-xs text-purple-300 mb-2">Optional: Enter D-ID API key for speaking avatar</p>
            <input
              type="password"
              placeholder="D-ID API Key (optional)"
              value={didApiKey || ''}
              onChange={(e) => setDidApiKey(e.target.value || null)}
              className="w-full px-3 py-2 bg-white/10 border border-purple-400/30 rounded-lg text-white text-sm placeholder-purple-300/50"
            />
          </div>
        </div>
      </div>
    );
  }
  
  // Completion Screen
  if (currentScreen === 'complete') {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
        {/* Analytics Dashboard Modal - available on completion screen too */}
        <AnalyticsDashboard 
          analytics={analytics} 
          isVisible={showAnalytics} 
          onClose={() => setShowAnalytics(false)} 
        />
        
        <div className="text-center space-y-6">
          <NebulaAvatar size="large" />
          <h1 className="text-3xl font-bold text-gray-900">Quantum Milestone Reached!</h1>
          
          <ProgressTracker progress={progress} />
          
          <div className="bg-white rounded-2xl shadow-lg p-6 text-left">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Your Achievement</h3>
            <p className="text-gray-700 leading-relaxed">
              You've completed the quantum foundation module! You now understand carbon at the 
              deepest level - from electron orbitals to bonding capacity. This knowledge is the 
              bedrock of all organic chemistry.
            </p>
          </div>
          
          {/* Learning Analytics Button */}
          <button
            onClick={() => setShowAnalytics(true)}
            className="w-full flex items-center justify-center space-x-3 bg-white border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 text-purple-700 font-medium py-3 px-4 rounded-xl shadow-sm transition-all"
          >
            <Brain className="w-5 h-5 text-purple-600" />
            <span>View My Learning Analytics</span>
            <BarChart3 className="w-4 h-4 text-purple-400" />
          </button>
          
          <button 
            onClick={() => {
              setCurrentScreen('welcome');
              setCurrentModule(0);
              setCurrentConcept(0);
            }}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg"
          >
            Explore Again
          </button>
        </div>
      </div>
    );
  }
  
  // Main Learning Screen
  return (
    <div className="max-w-md mx-auto min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-20">
      {/* Scroll anchor */}
      <div ref={topRef} />
      {/* Adaptive Help Modal */}
      {showAdaptiveHelp && adaptiveHelpContent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="bg-gradient-to-r from-amber-400 to-orange-500 p-6 rounded-t-2xl">
              <div className="flex items-center space-x-3 mb-2">
                <NebulaAvatar size="normal" />
                <h3 className="text-xl font-bold text-white">Ky'Orda Notices You Need Support</h3>
              </div>
              <p className="text-white/90 text-sm">{adaptiveHelpContent.message}</p>
            </div>
            
            <div className="p-6 space-y-4">
              {adaptiveHelpContent.alternativeExplanation && (
                <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-4">
                  <h4 className="font-bold text-blue-900 mb-2 flex items-center">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Let's Try This Another Way
                  </h4>
                  <p className="text-blue-800 leading-relaxed">
                    {adaptiveHelpContent.alternativeExplanation}
                  </p>
                </div>
              )}
              
              {adaptiveHelpContent.suggestions.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-bold text-gray-900">What Would Help You Most?</h4>
                  {adaptiveHelpContent.suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setShowAdaptiveHelp(false);
                        setShowChat(true);
                        setChatInput(suggestion);
                      }}
                      className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors border border-purple-200"
                    >
                      <p className="text-purple-900 text-sm">{suggestion}</p>
                    </button>
                  ))}
                </div>
              )}
              
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-green-900 text-sm font-semibold mb-2">
                  💡 Remember: Struggling is part of learning!
                </p>
                <p className="text-green-800 text-sm">
                  Even Einstein had to work through confusion. Every question you ask makes you stronger. 
                  You've got this!
                </p>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowAdaptiveHelp(false);
                    setShowChat(true);
                  }}
                  className="flex-1 py-3 bg-purple-500 text-white font-semibold rounded-xl hover:bg-purple-600 transition-colors"
                >
                  Ask Ky'Orda Questions
                </button>
                <button
                  onClick={() => {
                    setShowAdaptiveHelp(false);
                  }}
                  className="flex-1 py-3 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition-colors"
                >
                  Review Again
                </button>
              </div>
              
              <button
                onClick={() => {
                  setShowAdaptiveHelp(false);
                  // Record that they reviewed, then advance
                  handleConceptComplete();
                  if (currentConcept < currentModuleData.concepts.length - 1) {
                    setCurrentConcept(currentConcept + 1);
                  } else if (currentModule < modules.length - 1) {
                    setCurrentModule(currentModule + 1);
                    setCurrentConcept(0);
                  } else {
                    setCurrentScreen('complete');
                  }
                  setConfidenceLevel(3);
                  setChatHistory([]);
                  setKnowledgeCheckAnswers({});
                }}
                className="w-full py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-colors mt-2"
              >
                I'm Ready - Continue to Next Concept
              </button>
              
              <button
                onClick={() => {
                  setShowAdaptiveHelp(false);
                  handleConceptComplete();
                  if (currentConcept < currentModuleData.concepts.length - 1) {
                    setCurrentConcept(currentConcept + 1);
                  } else if (currentModule < modules.length - 1) {
                    setCurrentModule(currentModule + 1);
                    setCurrentConcept(0);
                  } else {
                    setCurrentScreen('complete');
                  }
                  setConfidenceLevel(3);
                  setChatHistory([]);
                  setKnowledgeCheckAnswers({});
                }}
                className="w-full py-2 text-gray-600 text-sm hover:text-gray-800 transition-colors"
              >
                Skip Anyway (Not Recommended) →
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Analytics Dashboard Modal */}
      <AnalyticsDashboard 
        analytics={analytics} 
        isVisible={showAnalytics} 
        onClose={() => setShowAnalytics(false)} 
      />
      
      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Share Your Feedback</h3>
                <button 
                  onClick={() => {
                    setShowFeedbackModal(false);
                    setFeedbackComment('');
                    setFeedbackSuccess(false);
                  }}
                  className="text-white/80 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              <p className="text-white/80 text-sm">Help us improve Ky'Orda!</p>
            </div>
            
            {feedbackSuccess ? (
              <div className="p-8 text-center">
                <div className="text-5xl mb-4">✨</div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Thank You!</h4>
                <p className="text-gray-600">Your feedback helps us improve.</p>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {/* Feedback Type Tabs */}
                <div className="flex space-x-2">
                  {[
                    { type: 'comment', label: '💬 Comment', color: 'blue' },
                    { type: 'issue', label: '🐛 Issue', color: 'red' },
                  ].map(({ type, label, color }) => (
                    <button
                      key={type}
                      onClick={() => setFeedbackType(type as 'comment' | 'issue')}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                        feedbackType === type
                          ? `bg-${color}-100 text-${color}-700 border-2 border-${color}-300`
                          : 'bg-gray-100 text-gray-600 border-2 border-transparent'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                
                {/* Current Context */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">About:</p>
                  <p className="text-sm font-medium text-gray-700">{currentConceptData?.title}</p>
                </div>
                
                {/* Comment Input */}
                <textarea
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  placeholder={
                    feedbackType === 'issue' 
                      ? "Describe the issue you encountered..."
                      : "Share your thoughts, suggestions, or what's working well..."
                  }
                  className="w-full p-3 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={4}
                />
                
                {/* Submit Button */}
                <button
                  onClick={handleCommentSubmit}
                  disabled={!feedbackComment.trim() || feedbackSubmitting}
                  className={`w-full py-3 rounded-xl font-bold text-white transition-all ${
                    !feedbackComment.trim() || feedbackSubmitting
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:shadow-lg'
                  }`}
                >
                  {feedbackSubmitting ? 'Sending...' : 'Submit Feedback'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Floating Feedback Button */}
      <button
        onClick={() => setShowFeedbackModal(true)}
        className="fixed bottom-24 right-4 bg-white shadow-lg rounded-full p-3 border border-gray-200 hover:shadow-xl transition-all z-40"
        title="Send Feedback"
      >
        <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
      </button>
      
      {/* Chat Modal */}
      {showChat && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl">
            <div className="flex items-center space-x-3 p-4 border-b">
              <NebulaAvatar size="small" isThinking={isAiThinking} />
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">Ky'Orda</h3>
                <p className="text-xs text-gray-600">Your quantum guide</p>
              </div>
              <button 
                onClick={() => setShowChat(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatHistory.length === 0 && (
                <div className="text-center text-gray-500 text-sm py-8">
                  <Sparkles className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                  <p>Ask me anything about {currentConceptData?.title}</p>
                  <p className="text-xs mt-2">I'm here to help you understand at the quantum level</p>
                </div>
              )}
              
              {chatHistory.map((msg, idx) => (
                <div 
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="flex-shrink-0 mr-2">
                      <NebulaAvatar size="small" />
                    </div>
                  )}
                  <div 
                    className={`max-w-[75%] p-3 rounded-2xl ${
                      msg.role === 'user' 
                        ? 'bg-purple-500 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              
              {isAiThinking && (
                <div className="flex justify-start">
                  <div className="flex-shrink-0 mr-2">
                    <NebulaAvatar size="small" isThinking={true} />
                  </div>
                  <div className="bg-gray-100 p-3 rounded-2xl">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}} />
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}} />
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAiChat()}
                  placeholder="Ask Ky'Orda..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={isAiThinking}
                />
                <button
                  onClick={handleAiChat}
                  disabled={!chatInput.trim() || isAiThinking}
                  className="px-4 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-sm font-bold text-gray-900">{currentModuleData?.title}</h2>
              <p className="text-xs text-gray-600">{currentConceptData?.title}</p>
            </div>
            <div className="flex items-center space-x-2">
              {/* Voice Toggle */}
              <button
                onClick={toggleVoice}
                className={`p-2 rounded-full transition-all ${
                  voiceEnabled 
                    ? 'bg-purple-500 text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                } ${isSpeaking ? 'animate-pulse' : ''}`}
                title={voiceEnabled ? 'Voice On (tap to mute)' : 'Voice Off (tap to enable)'}
              >
                {voiceLoading ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : voiceEnabled ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </svg>
                )}
              </button>
              <NebulaAvatar size="small" speaking={isSpeaking} />
            </div>
          </div>
          
          {/* Voice Mode Indicator */}
          {voiceEnabled && (
            <div className="mt-2 flex items-center justify-center space-x-2 text-xs text-purple-600 bg-purple-50 rounded-lg py-1">
              <span>🎧 Voice Mode On</span>
              {isSpeaking && <span className="animate-pulse">• Speaking...</span>}
            </div>
          )}
        </div>
        
        {/* Progress Bar */}
        <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-purple-900 font-medium">
              Concept {currentConcept + 1} of {currentModuleData?.concepts.length}
            </span>
            <span className="text-purple-900 font-bold">
              {Math.round(((currentConcept + 1) / currentModuleData?.concepts.length) * 100)}%
            </span>
          </div>
          
          {/* Visual Progress Bar */}
          <div className="mt-2 h-2 bg-purple-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${((currentConcept + 1) / currentModuleData?.concepts.length) * 100}%` }}
            />
          </div>
        </div>
        
        {/* Learning Analytics Button - Clearly Labeled */}
        <button
          onClick={() => setShowAnalytics(true)}
          className="w-full flex items-center justify-center space-x-3 bg-white border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 text-purple-700 font-medium py-3 px-4 rounded-xl shadow-sm transition-all"
        >
          <Brain className="w-5 h-5 text-purple-600" />
          <span>View My Learning Analytics</span>
          <BarChart3 className="w-4 h-4 text-purple-400" />
        </button>
        
        {/* Chat Button */}
        <button
          onClick={() => setShowChat(true)}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
        >
          <MessageCircle className="w-5 h-5 inline mr-2" />
          Ask Ky'Orda a Question
        </button>
        
        {/* Wisdom Card */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-lg p-6">
          <div className="flex items-center space-x-2 mb-3">
            <Sparkles className="w-6 h-6 text-amber-600" />
            <h3 className="text-lg font-bold text-gray-900">Cosmic Wisdom</h3>
          </div>
          <p className="text-gray-700 italic leading-relaxed">"{currentConceptData?.wisdom}"</p>
        </div>
        
        {/* Quantum Visualization */}
        {currentConceptData?.visualType === 'atomicStructure' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 text-center flex items-center justify-center">
              <Atom className="w-6 h-6 mr-2 text-blue-600" />
              Atomic Structure
            </h3>
            <AtomicStructureVisual />
          </div>
        )}
        
        {currentConceptData?.visualType === 'electronProperties' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 text-center flex items-center justify-center">
              <Sparkles className="w-6 h-6 mr-2 text-purple-600" />
              Understanding Electrons
            </h3>
            <ElectronPropertiesVisual />
          </div>
        )}
        
        {currentConceptData?.visualType === 'octetRule' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 text-center flex items-center justify-center">
              <Sparkles className="w-6 h-6 mr-2 text-purple-600" />
              The Stability Rule Visualized
            </h3>
            <OctetRuleVisual />
          </div>
        )}
        
        {currentConceptData?.visualType === 'orbital' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 text-center flex items-center justify-center">
              <Atom className="w-6 h-6 mr-2 text-blue-600" />
              Quantum Orbital Visualization
            </h3>
            <QuantumOrbital orbitalType={currentConceptData.orbitalType as "1s" | "2s" | "2p" | undefined} />
          </div>
        )}
        
        {currentConceptData?.visualType === 'schrodinger' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 text-center flex items-center justify-center">
              <Sparkles className="w-6 h-6 mr-2 text-purple-600" />
              Where Do Orbital Shapes Come From?
            </h3>
            <SchrodingerConceptual />
          </div>
        )}
        
        {currentConceptData?.visualType === 'carbonQuantum' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 text-center flex items-center justify-center">
              <Atom className="w-6 h-6 mr-2 text-indigo-600" />
              Carbon's Quantum Structure
            </h3>
            <CarbonQuantumStructure />
          </div>
        )}
        
        {currentConceptData?.visualType === 'electronConfig' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 text-center flex items-center justify-center">
              <Atom className="w-6 h-6 mr-2 text-blue-600" />
              Electron Configuration
            </h3>
            <ElectronConfiguration />
          </div>
        )}
        
        {currentConceptData?.visualType === 'covalentBonding' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 text-center flex items-center justify-center">
              <Sparkles className="w-6 h-6 mr-2 text-purple-600" />
              Covalent Bonding in Action
            </h3>
            <CovalentBondingVisual />
          </div>
        )}
        
        {currentConceptData?.visualType === 'glucoseMolecule' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 text-center flex items-center justify-center">
              <Atom className="w-6 h-6 mr-2 text-red-500" />
              Oxygen & Glucose
            </h3>
            <GlucoseMoleculeVisual />
          </div>
        )}
        
        {currentConceptData?.visualType === 'glycineMolecule' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 text-center flex items-center justify-center">
              <Atom className="w-6 h-6 mr-2 text-blue-500" />
              Nitrogen & Glycine
            </h3>
            <GlycineMoleculeVisual />
          </div>
        )}
        
        {currentConceptData?.visualType === 'grandConnection' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <GrandConnectionVisual />
          </div>
        )}
        
        {/* Explanation */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Deep Dive</h3>
          <div className="text-gray-700 leading-relaxed space-y-3 whitespace-pre-line">
            {currentConceptData?.explanation}
          </div>
          
          {/* Thumbs Up/Down Rating */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Was this helpful?</span>
              <div className="flex items-center space-x-2">
                {conceptRatings[currentConceptData?.id] === undefined ? (
                  <>
                    <button
                      onClick={() => handleThumbsRating(true)}
                      className="p-2 rounded-full hover:bg-green-100 transition-colors group"
                      title="Yes, this was helpful"
                    >
                      <svg className="w-6 h-6 text-gray-400 group-hover:text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleThumbsRating(false)}
                      className="p-2 rounded-full hover:bg-red-100 transition-colors group"
                      title="No, I need more help"
                    >
                      <svg className="w-6 h-6 text-gray-400 group-hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                      </svg>
                    </button>
                  </>
                ) : (
                  <div className="flex items-center space-x-2">
                    {conceptRatings[currentConceptData?.id] === 1 ? (
                      <span className="text-green-500 flex items-center">
                        <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                        </svg>
                        Thanks!
                      </span>
                    ) : (
                      <span className="text-orange-500 flex items-center text-sm">
                        <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                        </svg>
                        We'll improve this!
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Knowledge Check Questions */}
        {currentConceptData?.knowledgeChecks && currentConceptData.knowledgeChecks.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <CheckCircle className="w-8 h-8 text-teal-500" />
              <h3 className="text-lg font-bold text-gray-900">Knowledge Check</h3>
            </div>
            
            <div className="space-y-6">
              {currentConceptData.knowledgeChecks.map((check, checkIdx) => {
                const userAnswer = knowledgeCheckAnswers[check.id];
                const isAnswered = userAnswer !== undefined;
                const isCorrect = userAnswer === check.correct;
                
                return (
                  <div key={check.id} className="bg-teal-50 rounded-lg p-4">
                    <p className="text-teal-900 font-semibold mb-3">
                      {checkIdx + 1}. {check.question}
                    </p>
                    
                    <div className="space-y-2">
                      {check.options.map((option, optIdx) => {
                        const isThisCorrect = optIdx === check.correct;
                        const isSelected = userAnswer === optIdx;
                        
                        let buttonClass = "w-full text-left px-4 py-3 rounded-lg transition-all ";
                        
                        if (!isAnswered) {
                          buttonClass += "bg-white hover:bg-teal-100 border-2 border-teal-200 text-gray-900";
                        } else if (isSelected && isCorrect) {
                          buttonClass += "bg-green-200 border-2 border-green-500 text-green-900 font-semibold";
                        } else if (isSelected && !isCorrect) {
                          buttonClass += "bg-red-200 border-2 border-red-500 text-red-900";
                        } else if (isThisCorrect) {
                          buttonClass += "bg-green-100 border-2 border-green-400 text-green-900";
                        } else {
                          buttonClass += "bg-gray-100 text-gray-500 opacity-60";
                        }
                        
                        return (
                          <button
                            key={optIdx}
                            onClick={() => {
                              if (!isAnswered) {
                                setKnowledgeCheckAnswers(prev => ({
                                  ...prev,
                                  [check.id]: optIdx
                                }));
                              }
                            }}
                            disabled={isAnswered}
                            className={buttonClass}
                          >
                            <div className="flex items-center justify-between">
                              <span>{option}</span>
                              {isAnswered && isThisCorrect && (
                                <span className="text-green-600 font-bold">✓</span>
                              )}
                              {isAnswered && isSelected && !isCorrect && (
                                <span className="text-red-600 font-bold">✗</span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    
                    {isAnswered && (
                      <div className={`mt-3 p-3 rounded-lg ${isCorrect ? 'bg-green-100' : 'bg-orange-100'}`}>
                        <p className={`text-sm font-semibold ${isCorrect ? 'text-green-800' : 'text-orange-800'}`}>
                          {isCorrect ? '✓ Correct!' : 'Not quite right.'}
                        </p>
                        <p className={`text-sm mt-1 ${isCorrect ? 'text-green-700' : 'text-orange-700'}`}>
                          {check.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Confidence Tracker */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Star className="w-8 h-8 text-yellow-500" />
            <h3 className="text-lg font-bold text-gray-900">How Well Do You Understand This?</h3>
          </div>
          
          <div className="flex justify-between gap-2">
            {[1, 2, 3, 4, 5].map((level) => (
              <button
                key={level}
                onClick={() => setConfidenceLevel(level)}
                className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                  confidenceLevel === level
                    ? level <= 2 
                      ? 'bg-red-500 text-white shadow-lg scale-105'
                      : level === 3
                      ? 'bg-yellow-500 text-white shadow-lg scale-105'
                      : 'bg-green-500 text-white shadow-lg scale-105'
                    : level <= 2
                    ? 'bg-red-100 text-red-800 hover:bg-red-200'
                    : level === 3
                    ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                    : 'bg-green-100 text-green-800 hover:bg-green-200'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
          
          <div className="flex justify-between text-xs text-gray-600 mt-2 px-1">
            <span>Confused</span>
            <span>Getting it</span>
            <span>Mastered</span>
          </div>
        </div>
        
        {/* Navigation */}
        <div className="flex justify-between gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentModule === 0 && currentConcept === 0}
            className="flex-1 py-3 bg-gray-200 text-gray-800 font-semibold rounded-xl shadow-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={currentConceptData?.knowledgeChecks && 
                     currentConceptData.knowledgeChecks.length > 0 && 
                     Object.keys(knowledgeCheckAnswers).length < currentConceptData.knowledgeChecks.length}
            className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentConcept === currentModuleData?.concepts.length - 1 && currentModule === modules.length - 1
              ? 'Complete'
              : 'Next'}
          </button>
        </div>
        
        {currentConceptData?.knowledgeChecks && 
         currentConceptData.knowledgeChecks.length > 0 && 
         Object.keys(knowledgeCheckAnswers).length < currentConceptData.knowledgeChecks.length && (
          <div className="text-center">
            <p className="text-sm text-orange-600 font-semibold">
              ⚠️ Please answer all knowledge check questions before continuing
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KyOrdaApp;
export { KyOrdaApp as App };
