import {
  SolidAuth,
  type ISolidAuthHandlerOpts,
} from "@solid-auth/next/handler";
import GitHub from "@auth/core/providers/github";
import { serverEnv } from "~/env/server";
import { type APIEvent } from "solid-start";

const getAuthURL = () => {
  if (serverEnv.NEXTAUTH_URL) {
    return serverEnv.NEXTAUTH_URL;
  }
  return `http://localhost:${process.env.PORT ?? 3000}`;
};
export const authOpts: ISolidAuthHandlerOpts = {
  providers: [
    GitHub({
      clientId: serverEnv.GITHUB_ID,
      clientSecret: serverEnv.GITHUB_SECRET,
    }),
  ],
  failureRedirect: `${getAuthURL()}/`,
  debug: false,
};

const handler = SolidAuth(authOpts);

export async function GET(event: APIEvent) {
  return await handler(event);
}
export async function POST(event: APIEvent) {
  return await handler(event);
}
