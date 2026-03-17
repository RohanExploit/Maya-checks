const SUPPORTED_IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff'];

export interface HeuristicResult {
  result: 'Fake' | 'Real' | 'Suspicious';
  confidence: number;
  explanation: string[];
  source: 'fallback-heuristic';
}

export function heuristicImageAnalysis(
  fileName: string,
  fileSizeBytes: number
): HeuristicResult {
  const ext = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();
  const isKnownImageType = SUPPORTED_IMAGE_EXTS.includes(ext);

  if (!isKnownImageType) {
    return {
      result: 'Suspicious',
      confidence: 55,
      explanation: [
        'Fallback mode: API unavailable',
        `Unrecognized image extension "${ext}" — result may be unreliable`,
        'Please retry or use a standard image format (JPEG, PNG, WebP)',
      ],
      source: 'fallback-heuristic',
    };
  }

  // Very small files are unlikely to be meaningful images
  if (fileSizeBytes < 1024) {
    return {
      result: 'Suspicious',
      confidence: 60,
      explanation: [
        'Fallback mode: API unavailable',
        'File is extremely small — could not perform reliable analysis',
        'Please upload a higher-quality image',
      ],
      source: 'fallback-heuristic',
    };
  }

  return {
    result: 'Suspicious',
    confidence: 60,
    explanation: [
      'Fallback mode: network/API unavailable',
      'Please retry or test with another file',
    ],
    source: 'fallback-heuristic',
  };
}
