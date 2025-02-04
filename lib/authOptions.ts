import * as bcrypt from "bcryptjs";
import { DefaultSession, NextAuthOptions, DefaultUser } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { SigninSchema } from "./schema/auth.schema";
import { prismaClient } from "./prismaClient";
import { USER_ROLE } from "@prisma/client/index-browser";

export const authOptions = {
  providers: [
    Credentials({
      name: "signin",
      id: "signin",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Enter Email" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter password",
        },
      },
      async authorize(credentials) {
        const result = SigninSchema.safeParse(credentials);

        if (!result.success) {
          throw new Error(JSON.stringify(result.error.flatten().fieldErrors));
        }

        const { email, password } = result.data;

        // Find user in the database
        const user = await prismaClient.user.findUnique({
          where: {
            email,
            verifiedAt: {
              not: null,
            },
            blockedAt: {
              equals: undefined,
            },
          },
          select: {
            id: true,
            email: true,
            password: true,
            role: true,
            name: true,
            image: true,
          },
        });

        if (!user) {
          throw new Error("User does not exist or is not verified.");
        }

        // Compare password with the hash stored in the database
        const isPwdMatched = await bcrypt.compare(password, user.password!);

        if (!isPwdMatched) {
          throw new Error("Password mismatch");
        }

        // Return user data (omit password for security)

        if (user.password) user.password = "";
        return user;
      },
    }),
  ],

  session: { strategy: "jwt" },
  pages: {
    signIn: "/login", // Custom sign-in page
  },
  callbacks: {
    async session(props) {
      const { session, token } = props;
      if (session.user) session.user = { ...session.user, ...token };
      return session;
    },
    async jwt(props) {
      const { user } = props;
      if (!user) return props.token;

      return { ...props.token, ...user };
    },
  },
} satisfies NextAuthOptions;

declare module "next-auth" {
  interface Session extends User {
    user: { role: USER_ROLE; id: string } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: USER_ROLE;
    id: string;
  }

  interface JWT extends User {}
}
