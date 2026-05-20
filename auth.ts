import NextAuth from "next-auth";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

const tenantId = process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID!;
const isProduction = process.env.NODE_ENV === "production";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    isProduction
      ? {
          id: "microsoft-entra-id",
          name: "Microsoft",
          type: "oidc",
          issuer: `https://login.microsoftonline.com/${tenantId}/v2.0`,
          clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID!,
          clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET!,
          authorization: {
            params: {
              scope: "openid profile email",
            },
          },
          idToken: true,
          checks: ["pkce", "state"],
          profile(profile: any) {
            return {
              id: profile.sub,
              name: profile.name,
              email: profile.email ?? profile.preferred_username,
              image: null,
            };
          },
        }
      : MicrosoftEntraID({
          clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID!,
          clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET!,
          tenantId: tenantId,
        } as any),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});