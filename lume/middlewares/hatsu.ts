import type { Middleware } from 'lume/core.ts'
import type { Options as PluginOptions } from '../plugins/hatsu.ts'

export interface Options extends PluginOptions {
  /**
   * Lume Site Location.
   * @defaultValue
   * ```ts
   * new URL(req.url).host
   * ```
   * @example
   * ```ts
   * const site = lume({ location: new URL('https://example.com') })
   * const server = new Server()
   * server.use(hatsuMiddleware({
   *   instance: new URL('https://hatsu.local'),
   *   location: site.options.location,
   * }))
   * ```
   */
  location?: URL
}

export const hatsuMiddleware =
  (options: Options): Middleware => async (req, next) => {
    const accept = req.headers.get('accept')
    const url = new URL(req.url)

    // redirect .well-known
    if (url.pathname.startsWith('/.well-known/')) {
      return Response.redirect(
        new URL(url.pathname + url.search, options.instance),
      )
    } else if (
      // redirect application/activity+json request
      accept?.includes('application/activity+json') &&
      (!options.match ||
        options.match.some((matcher) => url.pathname.match(matcher)))
    ) {
      return Response.redirect(
        new URL(
          // remove search params
          `/o/${url.href.includes('?') ? url.href.split('?')[0] : url.href}`,
          options.instance,
        ),
      )
    } else {
      return await next(req)
    }
  }

export default hatsuMiddleware
