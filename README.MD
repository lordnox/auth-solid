## Note

This isn't published on npm yet, its just posted in here so that next-auth creators can add it to their `frameworks` list and publish it under the `@auth/` org.

## What is this

This is a SolidStart implementation of [next-auth](https://next-auth.js.org/).

# Getting started

Recommended to use [create-jd-app](https://github.com/OrJDev/create-jd-app)

```bash
npm install @auth/solid@latest @auth/core@latest
```

## Setting It Up

[Generate auth secret](https://generate-secret.vercel.app/32), then set it as an environment variable:

```bash
export AUTH_SECRET=your-secret
export AUTH_TRUST_HOST=true
```

## Creating the api handler

in this example we are using github so make sure to set the following environment variables:

```bash
export GITHUB_ID=your-github-id
export GITHUB_SECRET=your-github-secret
```

```ts
// routes/api/auth/[...solidauth].ts
import { type ISolidAuthHandlerOpts, SolidAuth } from "@auth/solid/handler";
import GitHub from "@auth/core/providers/github";

export const authOpts: ISolidAuthHandlerOpts = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  failureRedirect: "/",
  debug: false,
};

const handler = SolidAuth(authOpts);

export const GET = handler;
export const POST = handler;
```

## Signing in and out

```ts
import { signIn, signOut } from "@auth/solid/utils";
const login = () => signIn("github");
const logout = () => signOut();
```

## Getting the current session

```ts
import { getSession } from "@auth/solid/session";
import { createServerData$ } from "solid-start/server";
import { authOpts } from "~/routes/api/auth/[...solidauth]";

export const useSession = () => {
  return createServerData$(
    async (_, { request }) => {
      return await getSession(request, authOpts);
    },
    { key: () => ["auth_user"] }
  );
};

// useSession is a resource:
const session = useSession();
const loading = session.loading;
const user = () => session()?.user;
```
