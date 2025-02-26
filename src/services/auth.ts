import { signIn, signOut } from 'next-auth/react';

interface LoginResult {
  error?: string;
  ok: boolean;
  url?: string;
}

export const auth = {
  login: async (username: string, password: string): Promise<LoginResult> => {
    try {
      const result = await signIn('cognito', {
        username,
        password,
        redirect: false
      });

      if (!result) {
        throw new Error('Authentication failed');
      }

      if (result.error) {
        return {
          error: result.error,
          ok: false
        };
      }

      return {
        ok: true,
        url: result.url || undefined
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Authentication failed',
        ok: false
      };
    }
  },

  logout: async () => {
    await signOut({ callbackUrl: '/login' });
  }
};
