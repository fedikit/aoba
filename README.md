# Aoba

[![deno.land/x/aoba](https://shield.deno.dev/x/aoba)](https://deno.land/x/aoba)
![deno compatibility](https://shield.deno.dev/deno/^1.38)

🍃 Fediverse Integration for Lume & Hono.

<!-- ```bash
deno run -r https://deno.land/x/fedikit/scripts/generate_key.ts
``` -->

## Setup

Add Aoba to your `deno.json` or `import_map.json` (replace `{{version}}` with
the current version):

```json
{
  "imports": {
    "hono/": "https://deno.land/x/aoba@v{{version}}/"
  }
}
```

## [Lume Integration](/lume/)

### [NodeInfo](/lume/plugins/nodeinfo.ts)

Set up static nodeinfo for your site.

```ts
import nodeinfo from 'aoba/lume/plugins/nodeinfo.ts'
site.use(nodeinfo())
```

### [Webfinger](/lume/plugins/webfinger.ts)

Set up static webfinger for your site.

```ts
import webfinger from 'aoba/lume/plugins/webfinger.ts'
site.use(webfinger())
```

### [Headers](/lume/plugins/headers.ts)

Set up `_headers` file for your site. (Netlify and Cloudflare Pages)

```ts
import headers from 'aoba/lume/plugins/headers.ts'
site.use(headers())
```

### [Redirects](/lume/plugins/redirects.ts)

Set up `_redirects` file for your site. (Netlify and Cloudflare Pages)

```ts
import redirects from 'aoba/lume/plugins/redirects.ts'
site.use(redirects())
```

<!-- ## [Hono Integration](/hono/) -->

## Hatsu Integration

> Hatsu Integration is consistent with the latest version of Hatsu, so it does
> not follow semver.

For [Hatsu](https://github.com/importantimport/hatsu) users.

### [Lume Plugin](/lume/plugins/hatsu.ts)

Copy the `.well-known/*` file from the Hatsu instance and set the link alternate
for matched page.

```ts
import hatsuPlugin from 'aoba/lume/plugins/hatsu.ts'
site.use(
  hatsuPlugin({
    instance: new URL('https://hatsu.local'),
  }),
)
```

### [Lume Server Middleware](/lume/middlewares/hatsu.ts)

Redirecting `.well-known/*` and `activity+json` requests.

```ts
import hatsuMiddleware from 'aoba/lume/middlewares/hatsu.ts'
server.use(
  hatsuMiddleware({
    instance: new URL('https://hatsu.local'),
    location: site.options.location,
  }),
)
```

### [Hono Server Middleware](/hono/middlewares/hatsu.ts)

Redirecting `.well-known/*` and `activity+json` requests.

```ts
import { hatsuObject, hatsuWellKnown } from 'aoba/hono/middlewares/hatsu.ts'
const instance = new URL('https://hatsu.local')
app.use('/.well-known/*', hatsuWellKnown({ instance }))
app.use('/posts/*', hatsuObject({ instance }))
```

## License

Licensed under [MIT](LICENSE.md).
