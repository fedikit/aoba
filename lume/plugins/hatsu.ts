import type { Plugin } from 'lume/core/site.ts'
import { Page } from 'lume/core/file.ts'
import { read } from 'lume/core/utils/read.ts'

export interface Options {
  /**
   * Hatsu Instance URL.
   * @example
   * ```ts
   * new URL('https://hatsu.local')
   * ```
   */
  instance: URL
  /**
   * Match Routes.
   * @defaultValue `undefined`
   */
  match?: RegExp[] | false
  /**
   * Whether to copy `/.well-known/` files.
   * @defaultValue `undefined`
   */
  wellKnown?: false
}

export const hatsuPlugin = (options: Options): Plugin => (site: Lume.Site) => {
  // copy .well-known files
  if (options.wellKnown !== false) {
    site.addEventListener('beforeRender', async ({ pages }) => {
      pages.push(
        // webfinger (with search params)
        Page.create({
          url: '/.well-known/webfinger',
          content: await read(
            new URL(
              `/.well-known/webfinger?resource=acct:${site.options.location.host}@${options.instance.host}`,
              options.instance,
            ).href,
            false,
          ),
        }),
        // other
        ...await Promise.all(
          ['nodeinfo', 'host-meta', 'host-meta.json']
            .map(async (file) =>
              Page.create({
                url: `/.well-known/${file}`,
                content: await read(
                  new URL(`/.well-known/${file}`, options.instance).href,
                  false,
                ),
              })
            ),
        ),
      )
    })
  }

  // set <link rel="alternate" type="application/activity+json" /> for matched page
  if (options.match) {
    site.process(['.html'], (pages) =>
      pages.forEach((page) => {
        if (
          page.document &&
          ((options.match as RegExp[]).some((matcher) =>
            (page.data.url as string).match(matcher)
          ))
        ) {
          const link = page.document.createElement('link')
          link?.setAttribute('rel', 'alternate')
          link?.setAttribute('type', 'application/activity+json')
          link?.setAttribute(
            'href',
            new URL(
              `/posts/${new URL(page.data.url, site.options.location).href}`,
              options.instance,
            ).href,
          )
          page.document.head.appendChild(link)
        }
      }))
  }
}

export default hatsuPlugin
