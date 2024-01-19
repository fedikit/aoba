import type {
  NodeInfo,
  WellKnownNodeInfo,
} from 'fedikit/src/nodeinfo/lib/types.ts'
import { convert } from 'fedikit/src/nodeinfo/lib/convert.ts'
import { merge } from 'lume/core/utils/object.ts'
import { Page } from 'lume/core/file.ts'

export interface Options {
  /**
   * If false, then output `/.well-known/*` files to `/well-known/*`.
   * @defaultValue `true`
   */
  dotdir: boolean
  /** Generated NodeInfo. */
  nodeInfo: NodeInfo<'2.1'>
  /** Generated NodeInfo Discovery. */
  wellKnown: WellKnownNodeInfo
}

export const defaults = (site: Lume.Site): Options => ({
  dotdir: true,
  nodeInfo: {
    version: '2.1',
    software: {
      name: 'aoba',
      version: '0.0.1',
      repository: 'https://github.com/fedikit/aoba',
      homepage: 'https://github.com/fedikit/aoba#readme',
    },
    protocols: ['activitypub'],
    services: {
      inbound: [],
      outbound: ['rss2.0', 'atom1.0'],
    },
    openRegistrations: false,
    usage: {
      users: {
        total: 1,
      },
    },
    metadata: {},
  },
  wellKnown: {
    links: [
      {
        rel: 'http://nodeinfo.diaspora.software/ns/schema/2.1',
        href: new URL('/nodeinfo/2.1.json', site.options.location).href,
      },
      {
        rel: 'http://nodeinfo.diaspora.software/ns/schema/2.0',
        href: new URL('/nodeinfo/2.0.json', site.options.location).href,
      },
    ],
  },
})

export default (userOptions?: Partial<Options>) => (site: Lume.Site) => {
  const { dotdir, nodeInfo, wellKnown } = merge(defaults(site), userOptions)

  site.addEventListener('beforeRender', ({ pages }) =>
    pages.push(
      Page.create({
        url: dotdir ? '/.well-known/nodeinfo' : '/well-known/nodeinfo',
        content: JSON.stringify(wellKnown, null, 2),
      }),
      Page.create({
        url: '/nodeinfo/2.1.json',
        content: JSON.stringify(nodeInfo, null, 2),
      }),
      Page.create({
        url: '/nodeinfo/2.0.json',
        content: JSON.stringify(convert(nodeInfo), null, 2),
      }),
    ))
}
