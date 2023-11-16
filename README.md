# Aoba

🍃 Fediverse Integration for Lume & Hono.

## Getting Started

Unlike FediKit, Aoba is only published in [`deno.land/x`](https://deno.land/x/aoba).

```bash
deno run -r https://deno.land/x/fedikit/scripts/generate_key.ts
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

<!-- ## [Hono Integration](/hono/) -->

## Hatsu Integration

> Hatsu Integration is consistent with the latest version of Hatsu, so it does not
> follow semver.

For [Hatsu](https://github.com/importantimport/hatsu) users. it currently provides:

- [Lume Plugin](/lume/plugins/hatsu.ts)
  - Copy the `.well-known/*` file from the Hatsu instance and set the link alternate for matched page.
- [Lume Server Middleware](/lume/middlewares/hatsu.ts)
  - Redirecting `.well-known/*` and `activity+json` requests.
<!-- - [Hono Server Middleware](/hono/middlewares/hatsu.ts)
  - Redirecting `.well-known/*` and `activity+json` requests. -->

## License

Licensed under [MIT](LICENSE.md).
