import { Page } from 'lume/core/filesystem.ts'
import type { Plugin, Site } from 'lume/core.ts'
import { merge } from 'lume/core/utils.ts'

export interface Options {
  /**
   * If false, create a rule that redirects `/.well-known/` to `/well-known/`.
   * @defaultValue `true`
   */
  dotdir: boolean
  /** Custom redirects rule */
  custom: string[]
}

export const defaults: Options = {
  dotdir: false,
  custom: [],
}

export default (userOption: Partial<Options>): Plugin => (site: Site) => {
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
      Page.create(
        '/_redirects',
        Array.from(redirects).join('\n'),
      ),
    ))
}
