// import {
//   SolidAuth,
//   type ISolidAuthHandlerOpts,
// } from "@solid-auth/next/handler";
import {
  SolidAuth,
  type ISolidAuthHandlerOpts,
} from "../../../../../src/handler";
import GitHub from "@auth/core/providers/github";
import Discord from "@auth/core/providers/discord";
import { serverEnv } from "~/env/server";
import { type APIEvent } from "solid-start";

export const authOpts: ISolidAuthHandlerOpts = {
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        (session.user as any).id = user.id;
      }
      return session;
    },
  },
  providers: [
    GitHub({
      clientId: serverEnv.GITHUB_ID,
      clientSecret: serverEnv.GITHUB_SECRET,
    }),
    Discord({
      clientId: serverEnv.DISCORD_ID,
      clientSecret: serverEnv.DISCORD_SECRET,
    }),
  ],
  debug: false,
};

const handler = SolidAuth(authOpts);

export async function GET(event: APIEvent) {
  return await handler(event);
}
export async function POST(event: APIEvent) {
  return await handler(event);
}
