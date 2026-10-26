import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import '@fontsource/fira-sans/400.css';
import '@fontsource/fira-sans/500.css';
import '@fontsource/fira-sans/600.css';
import '@fontsource/fira-sans/700.css';
import '@fontsource/fira-sans/800.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'Campus Hub',
  icons: { icon: 'data:,' },
  description: 'Panel académico para gestionar las tareas de un estudiante.',
};
export const viewport: Viewport = { themeColor: '#EEF3F6' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="es"><body>{children}</body></html>;
}
