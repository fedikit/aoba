/** @see {@link https://www.w3.org/ns/activitystreams#Article} */
import type { Site } from 'lume/core.ts'
import { Page } from 'lume/core/filesystem.ts'

export default () => (site: Site) => {
  // site.process(['.md', '.mdx'], (page, pages) => {
  site.process(['.md'], (page, pages) => {
    const match = page.outputPath?.match(/^\/posts\/([^\/?#]+)\/index.html$/)
    if (match?.[1]) {
      // Create Article Object
      pages.push(Page.create(
        `/notice/${match[1]}`,
        JSON.stringify(
          {
            '@context': ['https://www.w3.org/ns/activitystreams'],
            attributedTo: new URL('/actor', site.options.location).href,
            // cc: [],
            // TODO: test
            content: page.data.children,
            id: new URL(`/notice/${match[1]}`, site.options.location).href,
            published: (page.data.date ?? new Date()).toISOString(),
            source: {
              content: page.data.content,
              mediaType: 'text/markdown',
            },
            tag: [],
            to: 'https://www.w3.org/ns/activitystreams#Public',
            type: 'Article',
          },
          null,
          2,
        ),
      ))
      // Set <link rel="alternate" type="application/activity+json" />
      const link = page.document!.createElement('link')
      link?.setAttribute('rel', 'alternate')
      link?.setAttribute('type', 'application/activity+json')
      link?.setAttribute(
        'href',
        new URL(`/notice/${match[1]}`, site.options.location).href,
      )
      page.document!.head.appendChild(link)
    }
  })
}
