// app/api/auth/[...nextauth]/route.js
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials'; // અથવા Google, etc.

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // તમારી login logic અહીં (e.g., database check)
        if (credentials.email === 'admin@example.com' && credentials.password === 'password') {
          return { id: 1, email: 'admin@example.com', role: 'admin' };
        }
        if (credentials.email === 'user@example.com' && credentials.password === 'password') {
          return { id: 2, email: 'user@example.com', role: 'client' };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      return session;
    },
  },
});

export { handler as GET, handler as POST };