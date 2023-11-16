import type { Site } from 'lume/core.ts'
import { Page } from 'lume/core/filesystem.ts'

export interface Options {
  publicKeyPem: string
}

/** FOR TESTING ONLY */
export default ({ publicKeyPem }: Options) => (site: Site) =>
  site.addEventListener('beforeRender', (event) =>
    event.pages.push(
      Page.create(
        '/actor',
        JSON.stringify(
          {
            '@context': [
              'https://www.w3.org/ns/activitystreams',
              // 'https://w3id.org/security/v1',
            ],
            id: new URL('/actor', site.options.location).href,
            type: 'Person',
            preferredUsername: site.options.location.host,
            name: 'Aoba Test',
            summary: 'FOR TESTING ONLY',
            manuallyApprovesFollowers: true,
            followers: new URL('/followers', site.options.location).href,
            following: new URL('/following', site.options.location).href,
            inbox: new URL('/inbox', site.options.location).href,
            outbox: new URL('/outbox', site.options.location).href,
            url: site.options.location.href,
            icon: {
              type: 'Image',
              mediaType: 'image/png',
              url: 'https://avatars.githubusercontent.com/u/149241322',
            },
            image: {
              type: 'Image',
              mediaType: 'image/png',
              url:
                'https://repository-images.githubusercontent.com/714321660/b8990ce9-c206-4db1-b90a-13510f3bab0b',
            },
            publicKey: {
              id: new URL('/actor#main-key', site.options.location).href,
              owner: new URL('/actor', site.options.location).href,
              publicKeyPem,
            },
          },
          null,
          2,
        ),
      ),
    ))
