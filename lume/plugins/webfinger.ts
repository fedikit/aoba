import type { Webfinger } from 'fedikit/src/webfinger/lib/types.ts'
import type { Site } from 'lume/core.ts'
import { merge } from 'lume/core/utils.ts'
import { Page } from 'lume/core/filesystem.ts'

export const defaults = (site: Site): Webfinger => ({
  subject:
    `acct:${site.options.location.hostname}@${site.options.location.hostname}`,
  aliases: [
    new URL('/actor', site.options.location).href,
    site.options.location.href,
  ],
  links: [
    {
      href: site.options.location.href,
      rel: 'http://webfinger.net/rel/profile-page',
      type: 'text/html',
    },
    {
      href: new URL('/actor', site.options.location).href,
      rel: 'self',
      type: 'application/activity+json',
    },
  ],
})

export default (webfinger?: Partial<Webfinger>) => (site: Site) =>
  site.addEventListener('beforeRender', (event) =>
    event.pages.push(
      Page.create(
        '/.well-known/webfinger',
        JSON.stringify(
          merge(
            defaults(site),
            webfinger,
          ),
          null,
          2,
        ),
      ),
    ))
