import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Scan Skill — Conformité HSE',
  description: 'Vérification instantanée des habilitations et conformité des engins sur chantier',
  manifest: '/manifest.json',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <meta name="theme-color" content="#1D253C" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
