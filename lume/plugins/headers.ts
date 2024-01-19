import { Page } from 'lume/core/file.ts'
import type { Plugin } from 'lume/core/site.ts'
import { merge } from 'lume/core/utils/object.ts'

export interface Options {
  /**
   * If false, the generated rule will use `/well-known` instead of `/.well-known/`.
   * @defaultValue `true`
   */
  dotdir: boolean
  /**
   * Custom headers rule.
   * @example
   * ```ts
   * site.use(headers({
   *   custom: {
   *     '/*': [
   *       'X-Frame-Options: DENY',
   *       'X-XSS-Protection: 1; mode=block',
   *     ],
   *     '/templates/index2.html': [
   *       'X-Frame-Options: SAMEORIGIN',
   *     ],
   *   },
   * }))
   * ```
   */
  custom: Record<string, string[]>
}

export const defaults: Options = {
  dotdir: true,
  custom: {},
}

export default (userOption: Partial<Options>): Plugin => (site: Lume.Site) => {
  const { dotdir, custom } = merge(defaults, userOption)
  const headers = new Map<string, string[]>()

  // webfinger
  headers.set(dotdir ? '/.well-known/webfinger' : '/well-known/webfinger', [
    'Content-Type: application/jrd+json',
  ])

  // nodeinfo
  headers.set(dotdir ? '/.well-known/nodeinfo' : '/well-known/nodeinfo', [
    'Content-Type: application/json',
  ])

  // host-meta
  // host-meta.json has a .json extension, so it is skipped.
  headers.set(dotdir ? '/.well-known/host-meta' : '/well-known/host-meta', [
    'Content-Type: application/xrd+xml',
  ])

  // custom rules
  if (custom) {
    Object.entries(custom).forEach(([key, values]) => headers.set(key, values))
  }

  site.addEventListener('beforeRender', ({ pages }) =>
    pages.push(
      Page.create({
        url: '/_headers',
        content: Array.from(
          headers,
          ([key, values]) =>
            [
              key,
              ...values.map((value) => '  ' + value),
            ].join('\n'),
        ).join('\n'),
      }),
    ))
}
