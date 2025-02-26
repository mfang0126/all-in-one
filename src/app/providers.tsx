'use client';

import { StyleProvider } from '@ant-design/cssinjs';
import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <StyleProvider>{children}</StyleProvider>
    </SessionProvider>
  );
}
