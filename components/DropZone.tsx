'use client';

import { useCallback, useState } from 'react';

interface DropZoneProps {
  onFileSelect: (file: File) => void;
  file: File | null;
  preview: string | null;
}

export default function DropZone({ onFileSelect, file, preview }: DropZoneProps) {
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragging(false);
      const dropped = e.dataTransfer.files[0];
      if (dropped) onFileSelect(dropped);
    },
    [onFileSelect]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) onFileSelect(selected);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer min-h-[200px]
        ${dragging
          ? 'border-violet-400 bg-violet-900/20 scale-[1.01]'
          : 'border-slate-600 bg-slate-800/40 hover:border-violet-500 hover:bg-slate-800/60'
        }`}
    >
      <input
        type="file"
        accept="image/*,audio/*"
        onChange={handleChange}
        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        aria-label="Upload file"
      />

      {preview ? (
        <img
          src={preview}
          alt="Preview"
          className="max-h-48 max-w-full rounded-lg object-contain pointer-events-none"
        />
      ) : file ? (
        <div className="flex flex-col items-center gap-2 pointer-events-none">
          <span className="text-4xl">🎵</span>
          <p className="text-slate-300 font-medium text-sm">{file.name}</p>
          <p className="text-slate-500 text-xs">{(file.size / 1024).toFixed(1)} KB</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 pointer-events-none px-6 text-center">
          <span className="text-4xl">📂</span>
          <p className="text-slate-300 font-medium">
            Drag & drop your file here
          </p>
          <p className="text-slate-500 text-sm">
            or click to browse — supports images &amp; audio
          </p>
        </div>
      )}
    </div>
  );
}
