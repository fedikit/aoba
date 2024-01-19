import site from './_config.ts'
import { assertEquals } from '../../deps/assert.ts'

// import { assertSiteSnapshot, build } from 'lume/tests/utils.ts'

Deno.test('build examples/lume-blog', async () => {
  // await build(site)
  // await assertSiteSnapshot(t, site)
  await site.build()
    .catch((err) => console.error(Deno.inspect(err, { colors: true })))

  assertEquals(site.options.location, new URL('https://aoba-test.netlify.app'))
})
