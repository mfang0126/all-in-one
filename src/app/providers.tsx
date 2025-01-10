'use client';

import { StyleProvider } from '@ant-design/cssinjs';
import { ReactNode } from 'react';

export function AntdProvider({ children }: { children: ReactNode }) {
  return <StyleProvider>{children}</StyleProvider>;
}
