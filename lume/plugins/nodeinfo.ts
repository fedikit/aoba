import type { NodeInfo, WellKnownNodeInfo } from 'fedikit/nodeinfo/lib/types.ts'
import { convert } from 'fedikit/nodeinfo/lib/convert.ts'
import { merge } from 'lume/core/utils.ts'
import type { Site } from 'lume/core.ts'
import { Page } from 'lume/core/filesystem.ts'

export type AobaNodeInfo = {
  nodeInfo: NodeInfo<'2.1'>
  wellKnown: WellKnownNodeInfo
}

export const defaults = (site: Site): AobaNodeInfo => ({
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
      }
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

export default (options?: Partial<AobaNodeInfo>) => (site: Site) => {
  const { nodeInfo, wellKnown } = merge<AobaNodeInfo>(defaults(site), options)

  site.addEventListener('beforeRender', ({ pages }) => {
    pages.push(
      Page.create(
        '/.well-known/nodeinfo',
        JSON.stringify(wellKnown, null, 2),
      ),
      Page.create(
        '/nodeinfo/2.1.json',
        JSON.stringify(nodeInfo, null, 2),
      ),
      Page.create(
        '/nodeinfo/2.0.json',
        JSON.stringify(convert(nodeInfo), null, 2),
      ),
    )
  })
}
