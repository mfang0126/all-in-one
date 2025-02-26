import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { auth } from '@/services/auth';

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Check if user has a valid ID (not empty string)
  const hasValidUserId = !!session?.user?.id;

  // User is authenticated if session status is authenticated AND they have a valid user ID
  const isAuthenticated = status === 'authenticated' && hasValidUserId;

  useEffect(() => {
    // Redirect to login if not authenticated
    if (status === 'unauthenticated' || (status === 'authenticated' && !hasValidUserId)) {
      router.push('/login');
    }
  }, [status, hasValidUserId, router]);

  return {
    isAuthenticated,
    isLoading: status === 'loading',
    user: session?.user,
    logout: auth.logout
  };
}
