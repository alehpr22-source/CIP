
import type { Metadata } from 'next';
import { Geist, Geist_Mono, Sora } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/hooks';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const sora = Sora({
  variable: '--font-sora',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'GI - Gremio de Ingenieros',
  description:
    'Solicita tu carnet de ingeniero para medio pasaje :v.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='es'>
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          ${sora.variable}
          antialiased
        `}
      >
        <AuthProvider>

              {children}

        </AuthProvider>
      </body>
    </html>
  );
}
