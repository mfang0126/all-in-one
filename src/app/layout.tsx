'use client';

import 'antd/dist/reset.css';
import { Inter } from 'next/font/google';
import './globals.css';
import dynamic from 'next/dynamic';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

// Use dynamic import with SSR disabled to prevent useSession errors during prerendering
const ClientLayout = dynamic(() => import('@/components/ClientLayout').then((mod) => mod.ClientLayout), {
  ssr: false,
  loading: () => (
    <div className='flex justify-center items-center p-8'>
      <div className='animate-pulse'>Loading...</div>
    </div>
  )
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body
        className={inter.className}
        style={{ margin: 0, padding: 0 }}
      >
        <Providers>
          <ClientLayout>{children}</ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
