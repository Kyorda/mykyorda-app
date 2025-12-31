// hooks/useKyordaAPI.ts
// Custom hooks for Ky'Orda API interactions

import { useState, useCallback, useRef } from 'react';

// ============================================
// TYPES
// ============================================

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface FeedbackData {
  type: 'rating' | 'comment' | 'issue' | 'suggestion';
  conceptId?: string;
  conceptTitle?: string;
  rating?: number;
  comment?: string;
}

// ============================================
// SESSION ID (persists for feedback tracking)
// ============================================

const getSessionId = (): string => {
  if (typeof window === 'undefined') return 'server';
  
  let sessionId = sessionStorage.getItem('kyorda-session-id');
  if (!sessionId) {
    sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('kyorda-session-id', sessionId);
  }
  return sessionId;
};

// ============================================
// CHAT HOOK
// ============================================

export function useChat() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const conversationHistory = useRef<ChatMessage[]>([]);

  const sendMessage = useCallback(async (message: string): Promise<string> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          conversationHistory: conversationHistory.current,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      const data = await response.json();
      
      // Update conversation history
      conversationHistory.current.push(
        { role: 'user', content: message },
        { role: 'assistant', content: data.message }
      );

      // Keep history manageable (last 10 exchanges)
      if (conversationHistory.current.length > 20) {
        conversationHistory.current = conversationHistory.current.slice(-20);
      }

      return data.message;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearHistory = useCallback(() => {
    conversationHistory.current = [];
  }, []);

  return {
    sendMessage,
    clearHistory,
    isLoading,
    error,
  };
}

// ============================================
// TEXT-TO-SPEECH HOOK
// ============================================

export function useTextToSpeech() {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const cacheRef = useRef<Map<string, string>>(new Map());

  const speak = useCallback(async (text: string, useCache = true): Promise<void> => {
    // Check cache first
    const cacheKey = text.slice(0, 100); // Use first 100 chars as key
    if (useCache && cacheRef.current.has(cacheKey)) {
      const cachedAudio = cacheRef.current.get(cacheKey)!;
      return playAudio(cachedAudio);
    }

    setIsLoading(true);
    setError(null);

    try {
      const provider = process.env.NEXT_PUBLIC_TTS_PROVIDER || 'openai';
      
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, provider }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate speech');
      }

      const data = await response.json();
      const audioDataUrl = `data:audio/${data.format};base64,${data.audio}`;
      
      // Cache for reuse
      if (useCache) {
        cacheRef.current.set(cacheKey, audioDataUrl);
      }

      await playAudio(audioDataUrl);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('TTS Error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const playAudio = useCallback((audioDataUrl: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      const audio = new Audio(audioDataUrl);
      audioRef.current = audio;

      audio.onplay = () => setIsPlaying(true);
      audio.onended = () => {
        setIsPlaying(false);
        resolve();
      };
      audio.onerror = (e) => {
        setIsPlaying(false);
        reject(new Error('Failed to play audio'));
      };

      audio.play().catch(reject);
    });
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
      setIsPlaying(false);
    }
  }, []);

  return {
    speak,
    stop,
    isLoading,
    isPlaying,
    error,
  };
}

// ============================================
// FEEDBACK HOOK
// ============================================

export function useFeedback() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitFeedback = useCallback(async (feedback: FeedbackData): Promise<boolean> => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...feedback,
          sessionId: getSessionId(),
          deviceInfo: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit feedback');
      }

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const submitRating = useCallback(async (
    conceptId: string, 
    conceptTitle: string, 
    rating: number
  ): Promise<boolean> => {
    return submitFeedback({
      type: 'rating',
      conceptId,
      conceptTitle,
      rating,
    });
  }, [submitFeedback]);

  const submitComment = useCallback(async (
    comment: string,
    conceptId?: string,
    conceptTitle?: string
  ): Promise<boolean> => {
    return submitFeedback({
      type: 'comment',
      conceptId,
      conceptTitle,
      comment,
    });
  }, [submitFeedback]);

  const submitIssue = useCallback(async (
    comment: string,
    conceptId?: string,
    conceptTitle?: string
  ): Promise<boolean> => {
    return submitFeedback({
      type: 'issue',
      conceptId,
      conceptTitle,
      comment,
    });
  }, [submitFeedback]);

  return {
    submitFeedback,
    submitRating,
    submitComment,
    submitIssue,
    isSubmitting,
    error,
  };
}

// ============================================
// VOICE MODE HOOK (combines TTS with mode toggle)
// ============================================

export function useVoiceMode() {
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const tts = useTextToSpeech();

  const toggleVoice = useCallback(() => {
    if (voiceEnabled) {
      tts.stop();
    }
    setVoiceEnabled(!voiceEnabled);
  }, [voiceEnabled, tts]);

  const speakIfEnabled = useCallback(async (text: string) => {
    if (voiceEnabled && process.env.NEXT_PUBLIC_VOICE_ENABLED === 'true') {
      await tts.speak(text);
    }
  }, [voiceEnabled, tts]);

  return {
    voiceEnabled,
    setVoiceEnabled,
    toggleVoice,
    speakIfEnabled,
    isLoading: tts.isLoading,
    isPlaying: tts.isPlaying,
    stop: tts.stop,
  };
}
