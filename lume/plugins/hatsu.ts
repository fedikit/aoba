import type { Plugin, Site } from 'lume/core.ts'
import { Page } from 'lume/core/filesystem.ts'
import { read } from 'lume/core/utils.ts'

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
  match?: RegExp[]
}

export const hatsuPlugin = (options: Options): Plugin => (site: Site) => {
  // copy .well-known files
  site.addEventListener('beforeRender', async ({ pages }) => {
    pages.push(
      // webfinger (with search params)
      Page.create(
        '/.well-known/webfinger',
        await read(
          new URL(
            `/.well-known/webfinger?resource=acct:${site.options.location.host}@${options.instance.host}`,
            options.instance,
          ).href,
          false,
        ),
      ),
      // other
      ...await Promise.all(
        ['nodeinfo', 'host-meta', 'host-meta.json']
          .map(async (file) =>
            Page.create(
              `/.well-known/${file}`,
              await read(
                new URL(`/.well-known/${file}`, options.instance).href,
                false,
              ),
            )
          ),
      ),
    )
  })

  // set <link rel="alternate" type="application/activity+json" /> for matched page
  site.process(['.html'], (page) => {
    // console.log(page.outputPath, page.data.url)
    if (
      page.document &&
      page.data.url !== false &&
      options.match?.some((matcher) => (page.data.url as string).match(matcher))
    ) {
      const link = page.document.createElement('link')
      link?.setAttribute('rel', 'alternate')
      link?.setAttribute('type', 'application/activity+json')
      link?.setAttribute(
        'href',
        new URL(
          `/o/${new URL(page.data.url, site.options.location).href}`,
          options.instance,
        ).href,
      )
      page.document.head.appendChild(link)
    }
  })
}

export default hatsuPlugin
