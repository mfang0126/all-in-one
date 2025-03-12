import { NextAuthOptions } from 'next-auth';
import CognitoProvider from 'next-auth/providers/cognito';

export const authOptions: NextAuthOptions = {
  providers: [
    CognitoProvider({
      clientId: process.env.COGNITO_CLIENT_ID!,
      clientSecret: process.env.COGNITO_CLIENT_SECRET!,
      issuer: process.env.COGNITO_ISSUER
    })
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          accessTokenExpires: account.expires_at! * 1000,
          user
        };
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < (token.accessTokenExpires || 0)) {
        return token;
      }

      // Access token has expired, try to refresh it
      return token;
    },
    async session({ session, token }) {
      // Check if we have a valid token and user with a non-empty ID
      if (token?.user?.id) {
        session.user = token.user;
        session.accessToken = token.accessToken;
        session.error = token.error;
        return session;
      }

      // If no valid user ID, return a session that indicates not authenticated
      return {
        ...session,
        user: { id: '' },
        accessToken: undefined,
        error: undefined
      };
    }
  },
  pages: {
    signIn: '/login',
    error: '/login'
  }
};
