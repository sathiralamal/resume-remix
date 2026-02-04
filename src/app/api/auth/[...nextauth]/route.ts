import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email:    { label: "Email",    type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // TODO: Replace with real DB lookup (Prisma, Mongoose, etc.)
        if (credentials?.email === "user@example.com" && credentials?.password === "password") {
          return { id: "1", email: "user@example.com", name: "Demo User" };
        }
        return null;
      },
    }),
  ],
  pages: { signIn: "/login" },
});

export { handler as GET, handler as POST };
