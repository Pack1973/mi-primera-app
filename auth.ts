import NextAuth from "next-auth";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

const tenantId = process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID!;
const clientId = process.env.AUTH_MICROSOFT_ENTRA_ID_ID!;
const clientSecret = process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET!;
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
          clientId,
          clientSecret,
          wellKnown: `https://login.microsoftonline.com/${tenantId}/v2.0/.well-known/openid-configuration`,
          authorization: {
            url: `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize`,
            params: {
              scope: "openid profile email",
              response_type: "code",
            },
          },
          token: `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
          userinfo: `https://graph.microsoft.com/oidc/userinfo`,
          checks: ["pkce", "state"],
          client: {
            token_endpoint_auth_method: "client_secret_post",
          },
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
          clientId,
          clientSecret,
          tenantId,
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