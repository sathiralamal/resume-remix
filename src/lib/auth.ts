import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import {
  findUserByEmail,
  findOrCreateGoogleUser,
  updateUserLastLogin,
} from "@/lib/firestore-helpers";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const normalizedEmail = credentials.email.toLowerCase().trim();
        const user = await findUserByEmail(normalizedEmail);

        if (!user) {
          return null;
        }

        if (!user.password) {
          // Account was created via Google — cannot sign in with password
          return null;
        }

        // Validate account status
        if (user.status && user.status !== "active") {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password,
        );

        if (!isPasswordValid) {
          return null;
        }

        // Update last login timestamp asynchronously
        try {
          await updateUserLastLogin(user.id);
        } catch (err) {
          console.warn(
            "[Auth] Failed to update lastLoginAt for credentials user:",
            err,
          );
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? "User",
          image: user.profileImage ?? null,
          status: user.status ?? "active",
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        const googleId =
          account.providerAccountId ||
          (profile as { sub?: string } | undefined)?.sub;
        const email =
          user.email || (profile as { email?: string } | undefined)?.email;
        const name =
          user.name || (profile as { name?: string } | undefined)?.name || null;
        const profileImage =
          user.image ||
          (profile as { picture?: string } | undefined)?.picture ||
          null;

        if (!googleId || !email) {
          console.error(
            "[Auth] Missing Google ID or email from OAuth response",
          );
          return "/login?error=OAuthSignin";
        }

        try {
          const firestoreUser = await findOrCreateGoogleUser({
            email,
            name,
            googleId,
            profileImage,
          });

          // Replace NextAuth's opaque user ID with the Firestore document ID
          user.id = firestoreUser.id;
          user.status = firestoreUser.status ?? "active";
          if (firestoreUser.profileImage) {
            user.image = firestoreUser.profileImage;
          }
          return true;
        } catch (error: unknown) {
          console.error("[Auth] Database error during Google sign-in:", error);
          if (error instanceof Error && error.message === "ACCOUNT_INACTIVE") {
            return "/login?error=AccountDisabled";
          }
          // Return database error query param so user isn't stuck or partially authenticated
          return "/login?error=DatabaseError";
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        if (user.image) {
          token.picture = user.image;
        }
        if (user.status) {
          token.status = user.status;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        if (token.picture) {
          session.user.image = token.picture as string;
        }
        if (token.status) {
          session.user.status = token.status as string;
        }
      }
      return session;
    },
  },
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
};
