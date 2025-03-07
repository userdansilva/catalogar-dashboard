import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next"
import type { Account, DefaultSession, NextAuthOptions } from "next-auth"
import { getServerSession } from "next-auth"
import AzureADB2C from "next-auth/providers/azure-ad-b2c"

const tenantId = process.env.NEXT_PUBLIC_AD_B2C_TENANT_NAME;
const clientId = process.env.NEXT_PUBLIC_AD_B2C_CLIENT_ID as string;
const clientSecret = process.env.AD_B2C_CLIENT_SECRET as string;
const primaryUserFlow = process.env.NEXT_PUBLIC_AD_B2C_PRIMARY_USER_FLOW;
const publicBaseUrl = process.env.PUBLIC_BASE_URL;

export const config = {
  providers: [
    AzureADB2C({
      tenantId,
      clientId,
      clientSecret,
      primaryUserFlow,
      authorization: { params: { scope: "offline_access openid" } },
    })
  ],
  pages: {
    signIn: "/entrar"
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) {
        return baseUrl + url
      }

      if (new URL(url).origin === `https://${tenantId}.b2clogin.com`
        || new URL(url).origin === baseUrl) {
        return url
      }

      return ""
    },

    async jwt({ account, token }) {
      const getExpireDate = (expiresIn: number) => Date.now()
        + (expiresIn * 1_000)

      if (account) {
        const tokenExpiresAt = getExpireDate(
          account.id_token_expires_in
        )

        const refreshTokenExpiresAt = getExpireDate(
          account.refresh_token_expires_in as number
        )

        token.accessToken = account.id_token as string
        token.refreshToken = account.refresh_token as string
        token.tokenExpiresAt = tokenExpiresAt
        token.refreshTokenExpiresAt = refreshTokenExpiresAt

        return token
      }

      const isAdB2CTokenValid = (token.tokenExpiresAt as number
        - (60 * 5 * 1_000)) /* 5 min */ > Date.now()

      if (isAdB2CTokenValid) {
        return token
      }

      const isAdB2CRefreshTokenValid = (token.refreshTokenExpiresAt as number
        - (60 * 5 * 1_000)) /* 5 min */ > Date.now()

      if (!isAdB2CRefreshTokenValid) {
        return {
          ...token,
          error: "SessionEnd"
        }
      }

      try {
        const tokenEndpoint = `https://${tenantId}.b2clogin.com/${tenantId}.onmicrosoft.com/oauth2/v2.0/token?p=${primaryUserFlow}`

        const response = await fetch(tokenEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: new URLSearchParams({
            grant_type: "refresh_token",
            client_id: clientId,
            client_secret: clientSecret,
            refresh_token: token.refreshToken as string,
          })
        })

        const tokens = await response.json() as Account

        const tokenExpiresAt = getExpireDate(tokens.id_token_expires_in)

        const refreshTokenExpiresAt = getExpireDate(tokens.refresh_token_expires_in)

        token.accessToken = tokens.id_token
        token.refreshToken = tokens.refresh_token
        token.tokenExpiresAt = tokenExpiresAt
        token.refreshTokenExpiresAt = refreshTokenExpiresAt

        return token
      } catch (e) {
        console.error(e)

        return {
          ...token,
          error: "UnableToUpdateToken"
        }
      }
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken

      if (token.error) {
        session.error = token.error
      }

      return session
    }
  }
} satisfies NextAuthOptions

export function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, config)
}

export const signOutUrl = `https://${tenantId}.b2clogin.com/${tenantId}.onmicrosoft.com/oauth2/v2.0/logout?p=${primaryUserFlow}&post_logout_redirect_uri=${publicBaseUrl}/saiu`;

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"]
    accessToken: string
    error?: "SessionEnd" | "UnableToUpdateToken"
  }

  interface Account {
    id_token: string
    id_token_expires_in: number
    refresh_token: string
    refresh_token_expires_in: number
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string
    refreshToken: string
    tokenExpiresAt: number
    refreshTokenExpiresAt: number
    error?: "SessionEnd" | "UnableToUpdateToken"
  }
}
