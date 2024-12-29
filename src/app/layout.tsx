import './globals.css';
import { Inter } from 'next/font/google';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Speech-to-Text Website',
  description: 'A website for speech-to-text and text-to-speech conversion'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <nav className='bg-gray-800 text-white p-4'>
          <ul className='flex space-x-4'>
            <li>
              <Link href='/'>Multi-language Speech-to-Text</Link>
            </li>
            <li>
              <Link href='/compare'>Compare with Google Translate</Link>
            </li>
            <li>
              <Link href='/text-to-speech'>Text-to-Speech</Link>
            </li>
          </ul>
        </nav>
        <main className='container mx-auto p-4'>{children}</main>
      </body>
    </html>
  );
}
