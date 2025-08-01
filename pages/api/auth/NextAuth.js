import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // For demo purposes, accept any username/password combination
        // In a real app, you would validate against a database
        if (credentials.username && credentials.password) {
          return {
            id: `user_${Date.now()}`,
            username: credentials.username,
            email: `${credentials.username}@example.com`,
            name: credentials.username
          };
        }
        return null;
      }
    })
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
});
