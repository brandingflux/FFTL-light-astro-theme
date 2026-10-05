import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'

export const GET: APIRoute = async ({ site }) => {
	const siteUrl = site ? site.toString() : 'https://fluxfuse.net/'
	const posts = await getCollection('blog')
	
	// Sort newest first
	const sortedPosts = posts.sort((a, b) => {
		return new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime()
	})

	const rssItems = sortedPosts
		.map((post) => {
			const postUrl = new URL(`/blog/${post.id}/`, siteUrl).href
			const pubDate = new Date(post.data.pubDate).toUTCString()
			const title = post.data.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
			const description = post.data.description.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
			const author = post.data.author.replace(/&/g, '&amp;')

			return `
    <item>
      <title>${title}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <description>${description}</description>
      <dc:creator xmlns:dc="http://purl.org/dc/elements/1.1/">${author}</dc:creator>
      <pubDate>${pubDate}</pubDate>
    </item>`
		})
		.join('')

	const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>FluxFuse Technologies — Insights &amp; Engineering Blog</title>
    <description>Articles, guides, and engineering insights on AI automation, digital systems, software engineering, and product building from FluxFuse Technologies.</description>
    <link>${siteUrl}</link>
    <atom:link href="${new URL('rss.xml', siteUrl).href}" rel="self" type="application/rss+xml" />
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <managingEditor>contact@fluxfuse.net (FluxFuse Technologies)</managingEditor>
    <webMaster>contact@fluxfuse.net (FluxFuse Technologies)</webMaster>
    <copyright>© ${new Date().getFullYear()} FluxFuse Technologies Limited. All rights reserved.</copyright>
    ${rssItems}
  </channel>
</rss>`.trim()

	return new Response(rss, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, max-age=3600, s-maxage=3600'
		}
	})
}
