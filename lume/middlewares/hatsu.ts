import type { Middleware } from 'lume/core/server.ts'
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
    const { origin, pathname, search } = new URL(req.url)

    // redirect .well-known
    if (pathname.startsWith('/.well-known/')) {
      return Response.redirect(
        new URL(pathname + search, options.instance),
      )
    } else if (
      // redirect application/activity+json request
      accept?.includes('application/activity+json') &&
      (!options.match ||
        options.match.some((matcher) => pathname.match(matcher)))
    ) {
      return Response.redirect(
        new URL(
          `/posts/${origin + pathname}`,
          options.instance,
        ),
      )
    } else {
      return await next(req)
    }
  }

export default hatsuMiddleware
