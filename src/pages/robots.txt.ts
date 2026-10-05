import type { APIRoute } from 'astro'

export const GET: APIRoute = ({ site }) => {
	const siteUrl = site ? site.toString() : 'https://fluxfuse.net/'
	const sitemapUrl = new URL('sitemap-index.xml', siteUrl).href

	const robotsTxt = `
# ==============================================================================
# FluxFuse Technologies — Enterprise Robots.txt
# High-performance crawler & search indexing instructions
# ==============================================================================

# Search Engine Crawlers (Google, Bing, Yahoo, DuckDuckGo)
User-agent: Googlebot
User-agent: Googlebot-Image
User-agent: Googlebot-News
User-agent: Googlebot-Video
User-agent: Bingbot
User-agent: Slurp
User-agent: DuckDuckBot
User-agent: Baiduspider
User-agent: YandexBot
Allow: /
Disallow: /404

# Generative AI & Answer Engine Crawlers (GEO / AEO - Perplexity, OpenAI, Anthropic, Google Gemini)
User-agent: Google-Extended
User-agent: GPTBot
User-agent: ChatGPT-User
User-agent: ClaudeBot
User-agent: anthropic-ai
User-agent: PerplexityBot
User-agent: Applebot
User-agent: Applebot-Extended
User-agent: cohere-ai
User-agent: Omgilibot
Allow: /
Disallow: /404

# Default Crawlers
User-agent: *
Allow: /
Disallow: /404

# Sitemaps
Sitemap: ${sitemapUrl}
Host: https://fluxfuse.net
`.trim()

	return new Response(robotsTxt, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=86400, s-maxage=86400'
		}
	})
}
