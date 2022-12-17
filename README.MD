[![Preview](https://user-images.githubusercontent.com/91349014/208177929-07b93c18-b200-4bf9-8b69-008f0439c7b6.png)](https://user-images.githubusercontent.com/91349014/208177946-f24b8797-e9c5-42c3-bc2f-02770734b18f.mp4)

## What is this

This is a SolidStart implementation of [next-auth](https://next-auth.js.org/).

# Getting started

Recommended to use [create-jd-app](https://github.com/OrJDev/create-jd-app)

```bash
npm install @solid-auth/next@latest @auth/core@latest
```

## Setting It Up

[Generate auth secret](https://generate-secret.vercel.app/32), then set it as an environment variable:

```
AUTH_SECRET=your_auth_secret
```

### On Production

Don't forget to trust the host.

```
AUTH_TRUST_HOST=true
```

## Creating the api handler

in this example we are using github so make sure to set the following environment variables:

```
GITHUB_ID=your_github_oatuh_id
GITHUB_SECRET=your_github_oatuh_secret
```

```ts
// routes/api/auth/[...solidauth].ts
import {
  SolidAuth,
  type ISolidAuthHandlerOpts,
} from "@solid-auth/next/handler";
import GitHub from "@auth/core/providers/github";
import { APIEvent } from "solid-start";

export const authOpts: ISolidAuthHandlerOpts = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  debug: false,
};

const handler = SolidAuth(authOpts);

export function GET(event: APIEvent) {
  return await handler(event);
}
export function POST(event: APIEvent) {
  return await handler(event);
}
```

## Signing in and out

```ts
import { signIn, signOut } from "@solid-auth/next/utils";
const login = () => signIn("github");
const logout = () => signOut();
```

## Getting the current session

```ts
import { getSession } from "@solid-auth/next/session";
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
