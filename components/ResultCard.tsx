import type { DetectionResult } from '@/app/page';

interface ResultCardProps {
  result: DetectionResult;
  fileName: string;
}

const COLORS = {
  Fake: {
    border: 'border-red-500/60',
    bg: 'bg-red-900/30',
    text: 'text-red-300',
    bar: 'bg-red-500',
    badge: 'bg-red-900/50 text-red-300 border-red-500/40',
    icon: '❌',
  },
  Suspicious: {
    border: 'border-yellow-500/60',
    bg: 'bg-yellow-900/30',
    text: 'text-yellow-300',
    bar: 'bg-yellow-500',
    badge: 'bg-yellow-900/50 text-yellow-300 border-yellow-500/40',
    icon: '⚠️',
  },
  Real: {
    border: 'border-green-500/60',
    bg: 'bg-green-900/30',
    text: 'text-green-300',
    bar: 'bg-green-500',
    badge: 'bg-green-900/50 text-green-300 border-green-500/40',
    icon: '✅',
  },
};

const SOURCE_LABELS: Record<DetectionResult['source'], string> = {
  'primary-api': 'Primary Model',
  'fallback-hf': 'Fallback Model',
  'fallback-heuristic': 'Heuristic',
};

export default function ResultCard({ result, fileName }: ResultCardProps) {
  const colors = COLORS[result.result];

  return (
    <div className={`rounded-xl border ${colors.border} ${colors.bg} p-6 space-y-4`}>
      {/* Result header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{colors.icon}</span>
          <div>
            <p className="text-slate-400 text-xs uppercase tracking-widest font-semibold mb-0.5">
              Detection Result
            </p>
            <p className={`text-3xl font-extrabold ${colors.text}`}>{result.result}</p>
          </div>
        </div>

        {/* Source badge */}
        <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${colors.badge}`}>
          {SOURCE_LABELS[result.source]}
        </span>
      </div>

      {/* File name */}
      <p className="text-slate-500 text-xs truncate">📄 {fileName}</p>

      {/* Confidence bar */}
      <div>
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>Confidence</span>
          <span className={`font-bold ${colors.text}`}>{result.confidence}%</span>
        </div>
        <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${colors.bar}`}
            style={{ width: `${result.confidence}%` }}
          />
        </div>
      </div>

      {/* Explanation bullets */}
      <ul className="space-y-1.5">
        {result.explanation.map((point, i) => (
          <li key={i} className="flex gap-2 text-sm text-slate-300">
            <span className="mt-0.5 text-slate-500 shrink-0">•</span>
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
