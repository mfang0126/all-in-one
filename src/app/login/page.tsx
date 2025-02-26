'use client';

import dynamic from 'next/dynamic';
import { ContentBox } from '@/components/ContentBox';

// Use dynamic import with SSR disabled to prevent useSession errors during prerendering
const LoginForm = dynamic(() => import('@/components/LoginForm'), {
  ssr: false,
  loading: () => (
    <div className='flex justify-center items-center p-8'>
      <div className='animate-pulse'>Loading login form...</div>
    </div>
  )
});

export default function LoginPage() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <div className='w-full max-w-md'>
        <ContentBox title='Login'>
          <LoginForm />
        </ContentBox>
      </div>
    </div>
  );
}
