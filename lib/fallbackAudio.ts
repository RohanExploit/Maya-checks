export interface AudioHeuristicResult {
  result: 'Suspicious';
  confidence: number;
  explanation: string[];
  source: 'fallback-heuristic';
}

export function heuristicAudioAnalysis(fileName: string): AudioHeuristicResult {
  const ext = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();
  return {
    result: 'Suspicious',
    confidence: 60,
    explanation: [
      `Audio deepfake detection for "${ext}" files is in beta`,
      'Automated AI audio analysis requires specialized models not yet integrated',
      'Please use a visual deepfake detection service for reliable audio results',
    ],
    source: 'fallback-heuristic',
  };
}
