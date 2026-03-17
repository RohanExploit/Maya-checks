import { NextRequest, NextResponse } from 'next/server';
import { withRetry } from '@/lib/apiClient';
import { heuristicImageAnalysis } from '@/lib/fallbackImage';
import { heuristicAudioAnalysis } from '@/lib/fallbackAudio';

const HF_API_KEY = process.env.HF_API_KEY ?? '';

const PRIMARY_MODEL =
  'https://api-inference.huggingface.co/models/dima806/deepfake_vs_real_image_detection';
const FALLBACK_MODEL =
  'https://api-inference.huggingface.co/models/haywoodsloan/ai-image-detector-deploy';

interface HFLabel {
  label: string;
  score: number;
}

function normalizeLabel(label: string): 'Fake' | 'Real' | 'Suspicious' {
  const l = label.toLowerCase();
  if (l.includes('fake') || l.includes('deepfake') || l.includes('artificial') || l.includes('ai')) {
    return 'Fake';
  }
  if (l.includes('real') || l.includes('human')) {
    return 'Real';
  }
  return 'Suspicious';
}

async function callHFModel(
  url: string,
  buffer: ArrayBuffer,
  mimeType: string
): Promise<{ result: 'Fake' | 'Real' | 'Suspicious'; confidence: number }> {
  const response = await withRetry(async () => {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        'Content-Type': mimeType,
      },
      body: buffer,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HF API error ${res.status}: ${text}`);
    }

    return res.json() as Promise<HFLabel[]>;
  }, 3);

  if (!Array.isArray(response) || response.length === 0) {
    throw new Error('Invalid response from HF API');
  }

  const best = response.reduce((a, b) => (a.score > b.score ? a : b));
  const result = normalizeLabel(best.label);
  const confidence = Math.round(best.score * 100);

  return { result, confidence };
}

function buildExplanation(
  result: 'Fake' | 'Real' | 'Suspicious',
  confidence: number,
  source: string
): string[] {
  const explanations: string[] = [];

  if (result === 'Fake') {
    explanations.push(`Model detected deepfake/AI-generated content with ${confidence}% confidence`);
    explanations.push('Anomalies consistent with synthetic media generation were found');
  } else if (result === 'Real') {
    explanations.push(`Model classified content as authentic with ${confidence}% confidence`);
    explanations.push('No significant deepfake markers detected');
  } else {
    explanations.push(`Classification inconclusive — confidence ${confidence}%`);
    explanations.push('Consider using a higher-resolution file for better results');
  }

  if (source === 'fallback-hf') {
    explanations.push('Note: Primary model unavailable; result from fallback model');
  }

  return explanations;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const mediaType = (formData.get('type') as string) ?? 'image';

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const mime = file.type;
    const isImage = mime.startsWith('image/');
    const isAudio = mime.startsWith('audio/');

    if (!isImage && !isAudio) {
      return NextResponse.json(
        { error: 'Unsupported file type. Please upload an image or audio file.' },
        { status: 400 }
      );
    }

    // Audio files use heuristic (image models won't process audio)
    if (isAudio || mediaType === 'audio') {
      const heuristic = heuristicAudioAnalysis(file.name);
      return NextResponse.json(heuristic);
    }

    const arrayBuffer = await file.arrayBuffer();

    // Try primary model
    try {
      const { result, confidence } = await callHFModel(PRIMARY_MODEL, arrayBuffer, mime);
      return NextResponse.json({
        result,
        confidence,
        explanation: buildExplanation(result, confidence, 'primary-api'),
        source: 'primary-api',
      });
    } catch {
      // Primary failed — try fallback HF model
    }

    try {
      const { result, confidence } = await callHFModel(FALLBACK_MODEL, arrayBuffer, mime);
      return NextResponse.json({
        result,
        confidence,
        explanation: buildExplanation(result, confidence, 'fallback-hf'),
        source: 'fallback-hf',
      });
    } catch {
      // Fallback HF also failed — use heuristic
    }

    const heuristic = heuristicImageAnalysis(file.name, arrayBuffer.byteLength);
    return NextResponse.json(heuristic);
  } catch (err) {
    console.error('[detect] Unhandled error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
