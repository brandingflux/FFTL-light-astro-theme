// Social Links
// ------------
// Description: Official verified social media profiles and channels for FluxFuse Technologies.

export interface SocialLink {
	name: string
	handle: string
	link: string
	icon?: string
}

export const socialLinks: SocialLink[] = [
	{
		name: 'X',
		handle: '@fluxfuse_',
		link: 'https://x.com/fluxfuse_',
		icon: 'x'
	},
	{
		name: 'Instagram',
		handle: '@fluxfuse',
		link: 'https://www.instagram.com/fluxfuse',
		icon: 'instagram'
	},
	{
		name: 'Threads',
		handle: '@fluxfuse',
		link: 'https://www.threads.net/@fluxfuse',
		icon: 'threads'
	},
	{
		name: 'TikTok',
		handle: '@fluxfuse',
		link: 'https://www.tiktok.com/@fluxfuse',
		icon: 'tiktok'
	},
	{
		name: 'GitHub',
		handle: 'brandingflux',
		link: 'https://github.com/brandingflux',
		icon: 'github'
	},
	{
		name: 'LinkedIn',
		handle: 'fluxfuse',
		link: 'https://linkedin.com/company/fluxfuse',
		icon: 'linkedin'
	}
]
