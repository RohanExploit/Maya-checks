import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DeepShield AI — Deepfake Detection',
  description: 'AI-powered deepfake detection for images and audio using HuggingFace models.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
