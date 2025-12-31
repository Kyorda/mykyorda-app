// pages/index.tsx
import dynamic from 'next/dynamic';

// Dynamically import the app to avoid SSR issues with Three.js
const KyordaApp = dynamic(() => import('../components/KyordaApp'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 animate-pulse" />
        <h1 className="text-white text-xl font-bold">Ky&apos;Orda</h1>
        <p className="text-purple-300 text-sm mt-2">Loading your cosmic journey...</p>
      </div>
    </div>
  ),
});

export default function Home() {
  return <KyordaApp />;
}
