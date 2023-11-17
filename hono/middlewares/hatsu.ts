import { createMiddleware } from 'hono/helper.ts'

export interface Options {
  /**
   * Hatsu Instance URL.
   * @example
   * ```ts
   * new URL('https://hatsu.local')
   * ```
   */
  instance: URL
}

/**
 * Redirects `.well-known/*` to a Hatsu instance.
 * @example
 * ```ts
 * import { Hono } from 'hono'
 * const app = new Hono()
 * app.use('/.well-known/*', hatsuWellKnown({
 *   instance: new URL('https://hatsu.local'),
 * }))
 * ```
 */
export const hatsuWellKnown = ({ instance }: Options) =>
  // deno-lint-ignore require-await
  createMiddleware(async (c) => {
    const { pathname, search } = new URL(c.req.url)
    return c.redirect(new URL(pathname + search, instance).href, 308)
  })

/**
 * Redirects `activity+json` requests to the AS2 object of the Hatsu instance.
 * @example
 * ```ts
 * import { Hono } from 'hono'
 * const app = new Hono()
 * app.use('/posts/*', hatsuObject({
 *   instance: new URL('https://hatsu.local')
 * }))
 * ```
 */
export const hatsuObject = ({ instance }: Options) =>
  createMiddleware(async (c, next) => {
    const accept = c.req.header('Accept')
    const url = c.req.url.includes('?') ? c.req.url.split('?')[0] : c.req.url
    if (accept?.includes('application/activity+json')) {
      return c.redirect(new URL(`/o/${url}`, instance).href, 308)
    }
    await next()
  })
