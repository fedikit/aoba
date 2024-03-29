import type { Plugin } from 'lume/core/site.ts'
import { Page } from 'lume/core/file.ts'
import { merge } from 'lume/core/utils/object.ts'

export interface Options {
  /**
   * If false, create a rule that redirects `/.well-known/` to `/well-known/`.
   * @defaultValue `true`
   */
  dotdir: boolean
  /**
   * Custom redirects rule.
   * @example
   * ```ts
   * site.use(redirects({
   *   custom: [
   *     '/home /',
   *     '/blog/my-post.php /blog/my-post',
   *     '/news /blog',
   *     '/cuties https://www.petsofnetlify.com',
   *     '/authors/c%C3%A9line /authors/about-c%C3%A9line',
   *   ],
   * }))
   * ```
   */
  custom: string[]
}

export const defaults: Options = {
  dotdir: false,
  custom: [],
}

export default (userOption: Partial<Options>): Plugin => (site: Lume.Site) => {
  const options = merge(defaults, userOption)
  const redirects = new Set<string>([])

  if (!options.dotdir) {
    redirects.add('/.well_known/*  /well_known/:splat 200')
  }

  if (options.custom) {
    options.custom.forEach((custom) => redirects.add(custom))
  }

  site.addEventListener('beforeRender', ({ pages }) =>
    pages.push(
      Page.create({
        url: '/_redirects',
        content: Array.from(redirects).join('\n'),
      }),
    ))
}
