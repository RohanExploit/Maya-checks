export default function LoadingSpinner() {
  return (
    <span className="flex items-center justify-center gap-2">
      <span className="text-sm font-semibold">Analyzing</span>
      <span className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="inline-block w-1.5 h-1.5 rounded-full bg-white animate-pulse-dot"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </span>
    </span>
  );
}
