import lume from 'lume/mod.ts'
// import basePath from 'lume/plugins/base_path.ts'
import blog from 'lume_theme_simple_blog/mod.ts'

import nodeinfo from '../../lume/plugins/nodeinfo.ts'
import webfinger from '../../lume/plugins/webfinger.ts'

import actor from '../../lume/plugins/_experimental/actor.ts'
import object_article from '../../lume/plugins/_experimental/object_article.ts'

// import hatsuPlugin from '../../lume/plugins/hatsu.ts'

import 'npm:prismjs/components/prism-markdown.js'
import 'npm:prismjs/components/prism-yaml.js'
import 'npm:prismjs/components/prism-markup-templating.js'
import 'npm:prismjs/components/prism-liquid.js'
import 'npm:prismjs/components/prism-typescript.js'
import 'npm:prismjs/components/prism-json.js'
import 'https://deno.land/x/vento@v0.8.0/prism-vento.js'

// const site = lume({ location: new URL('https://lume.land/blog/') })
const site = lume({ location: new URL('https://aoba-test.netlify.app') })
  .use(blog())
// .use(basePath())

/** {@link https://github.com/lumeland/blog/tree/main/posts} */
new Set([
  'posts/improved-plugins-docs.md',
  'posts/lume-1.13.0-release.md',
  'posts/lume-1.14.0-release.md',
  'posts/lume-1.15.0-release-notes.md',
  'posts/lume-1.16.0-release-notes.md',
  'posts/lume-1.17.0-release-notes.md',
  'posts/lume-1.18.0-release-notes.md',
  'posts/lume-1.19.0-release-notes.md',
  'posts/lume-2.md',
  'posts/lume-cli.md',
  'posts/ondemand-plugin-november-2022.md',
  '_data.yml',
]).forEach((file) =>
  site.remoteFile(
    file,
    `https://github.com/lumeland/blog/raw/main/${file}`,
  )
)

// Aoba
site.use(nodeinfo())
site.use(webfinger())

import 'https://deno.land/std@0.206.0/dotenv/load.ts'

site.use(actor({ publicKeyPem: Deno.env.get('PUBLIC_KEY')! }))
site.use(object_article())
// site.use(hatsuPlugin({
//   instance: new URL('https://mastodon.social'),
// }))

site.copy('_headers')
site.copy('_redirects')

export default site
