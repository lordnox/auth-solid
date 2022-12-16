import { AuthHandler, type AuthAction, type AuthOptions } from "@auth/core";
import {
  isRedirectResponse,
  json,
  redirect,
  type APIEvent,
} from "solid-start/api";
import parseCookie, {
  parseString,
  splitCookiesString,
} from "set-cookie-parser";
import { serialize } from "cookie";
export interface SoliduthOptions extends AuthOptions {
  /**
   * Defines the base path for the auth routes.
   * @default '/auth'
   */
  prefix?: string;
}

const actions: AuthAction[] = [
  "providers",
  "session",
  "csrf",
  "signin",
  "signout",
  "callback",
  "verify-request",
  "error",
  "_log",
];

export type ISolidAuthHandlerOpts = AuthOptions & {
  failureRedirect?: string;
};

function SolidAuthHandler(prefix: string, authOptions: ISolidAuthHandlerOpts) {
  return async (event: APIEvent) => {
    const { request } = event;
    const url = new URL(request.url);
    const [action] = url.pathname.slice(prefix.length + 1).split("/");
    if (
      actions.includes(action as AuthAction) &&
      url.pathname.startsWith(prefix + "/")
    ) {
      const res = await AuthHandler(request, authOptions);
      if (action === "callback" && isRedirectResponse(res)) {
        // currently multiple cookies are not supported, so we keep the next-auth.pkce.code_verifier cookie for now:
        // because it gets updated anyways
        // src: https://github.com/solidjs/solid-start/issues/293
        const cook = res.headers.get("Set-Cookie");
      if(cook){
        const cookName = "next-auth.session-token";
        const sessToken = parseString(
          splitCookiesString(cook).find((e) => e.startsWith(`${cookName}=`)) ?? ""
        );
        res.headers.set(
          "Set-Cookie",
          serialize(cookName, sessToken.value, sessToken as any)
        );
      }
      }
      return res;
    }
    const h = authOptions.failureRedirect ?? "/";
    const error = url.searchParams.get("error");
    const error_description = url.searchParams.get("error_description");
    const error_uri = url.searchParams.get("error_uri");
    throw redirect(
      `${h}?error=${error}&error_description=${error_description}&error_uri=${error_uri}`,
      {
        status: 302,
      }
    );
  };
}

export function SolidAuth(options: SoliduthOptions) {
  const { prefix = "/api/auth", ...authOptions } = options;
  authOptions.secret ??= process.env.AUTH_SECRET;
  authOptions.trustHost ??= !!(
    process.env.AUTH_TRUST_HOST ??
    process.env.VERCEL ??
    process.env.NODE_ENV !== "production"
  );
  return SolidAuthHandler(prefix, authOptions);
}
