import { Page } from 'lume/core/file.ts'
import { merge } from 'lume/core/utils/object.ts'

import type { Webfinger } from '../../deps/fedikit/webfinger.ts'

export interface Options {
  /**
   * If false, then output `/.well-known/*` files to `/well-known/*`.
   * @defaultValue `true`
   */
  dotdir: boolean
  /** Generated Webfinger. */
  webfinger: Partial<Webfinger>
}

export const defaults = (site: Lume.Site): Options => ({
  dotdir: true,
  webfinger: {
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
  },
})

export default (userOptions?: Partial<Options>) => (site: Lume.Site) => {
  const { dotdir, webfinger } = merge(defaults(site), userOptions)
  site.addEventListener('beforeRender', (event) =>
    event.pages.push(
      Page.create({
        url: dotdir ? '/.well-known/webfinger' : '/well-known/webfinger',
        content: JSON.stringify(
          webfinger,
          null,
          2,
        ),
      }),
    ))
}
