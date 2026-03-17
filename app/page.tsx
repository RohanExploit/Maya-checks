'use client';

import { useState, useCallback } from 'react';
import DropZone from '@/components/DropZone';
import ResultCard from '@/components/ResultCard';
import LoadingSpinner from '@/components/LoadingSpinner';

export interface DetectionResult {
  result: 'Fake' | 'Real' | 'Suspicious';
  confidence: number;
  explanation: string[];
  source: 'primary-api' | 'fallback-hf' | 'fallback-heuristic';
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileSelect = useCallback((selectedFile: File) => {
    setFile(selectedFile);
    setResult(null);
    setError(null);

    if (selectedFile.type.startsWith('image/')) {
      const url = URL.createObjectURL(selectedFile);
      setPreview(url);
    } else {
      setPreview(null);
    }
  }, []);

  const handleAnalyze = async () => {
    if (!file) return;

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', file.type.startsWith('audio/') ? 'audio' : 'image');

      const res = await fetch('/api/detect', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `Server error: ${res.status}`);
      }

      setResult(data as DetectionResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setError(null);
    setPreview(null);
  };

  return (
    <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-5xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
          🛡️ DeepShield AI
        </h1>
        <p className="text-lg text-slate-400 font-medium">
          Deepfake Detection — Powered by HuggingFace AI
        </p>
      </div>

      {/* Main card */}
      <div className="w-full max-w-xl bg-slate-900/70 backdrop-blur border border-slate-700/50 rounded-2xl shadow-2xl p-8">
        {!result ? (
          <>
            <DropZone
              onFileSelect={handleFileSelect}
              file={file}
              preview={preview}
            />

            {error && (
              <div className="mt-4 p-4 rounded-lg bg-red-900/40 border border-red-500/50 text-red-300 text-sm">
                ⚠️ {error}
              </div>
            )}

            <div className="mt-6 flex gap-3">
              <button
                onClick={handleAnalyze}
                disabled={!file || loading}
                className="flex-1 py-3 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
              >
                {loading ? <LoadingSpinner /> : 'Analyze'}
              </button>
              {file && (
                <button
                  onClick={handleReset}
                  disabled={loading}
                  className="py-3 px-4 rounded-xl font-semibold text-slate-400 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Clear
                </button>
              )}
            </div>
          </>
        ) : (
          <>
            <ResultCard result={result} fileName={file?.name ?? ''} />
            <button
              onClick={handleReset}
              className="mt-6 w-full py-3 px-6 rounded-xl font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-all duration-200"
            >
              ← Analyze Another File
            </button>
          </>
        )}
      </div>

      {/* Footer */}
      <p className="mt-8 text-slate-600 text-sm text-center">
        DeepShield AI uses{' '}
        <a
          href="https://huggingface.co/dima806/deepfake_vs_real_image_detection"
          target="_blank"
          rel="noopener noreferrer"
          className="text-violet-500 hover:underline"
        >
          dima806/deepfake_vs_real_image_detection
        </a>{' '}
        and fallback models.
      </p>
    </main>
  );
}
