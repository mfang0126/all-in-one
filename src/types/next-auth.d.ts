import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id?: string;
      email?: string;
      name?: string;
      type?: 'admin' | 'api';
    };
    accessToken?: string;
    error?: string;
  }

  interface User {
    id: string;
    email?: string;
    name?: string;
    type?: 'admin' | 'api';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    user?: User;
    error?: string;
  }
}
