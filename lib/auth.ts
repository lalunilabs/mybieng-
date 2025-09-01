import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

const providers = [] as NextAuthOptions['providers'];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

if (process.env.DEV_CREDENTIALS_PASSWORD) {
  providers.push(
    CredentialsProvider({
      name: 'Dev Login',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toString() || '';
        const password = credentials?.password?.toString() || '';
        if (!email || !password) return null;
        if (password !== process.env.DEV_CREDENTIALS_PASSWORD) return null;
        // Allow any email when password matches; owner-only gates are enforced server-side
        return { id: email, email, name: email.split('@')[0] } as any;
      },
    })
  );
}

export const authOptions: NextAuthOptions = {
  providers,
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt' },
  callbacks: {
    async session({ session }) {
      return session;
    },
  },
};
