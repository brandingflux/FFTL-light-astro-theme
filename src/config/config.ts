// Config
// ------------
// Description: The enterprise configuration file for FluxFuse Technologies.

export interface Logo {
	src: string
	srcDark: string
	alt: string
}

export type Mode = 'auto' | 'light' | 'dark'

export interface Config {
	siteTitle: string
	siteDescription: string
	siteUrl: string
	companyName: string
	brandName: string
	twitterHandle: string
	instagramHandle: string
	threadsHandle: string
	tiktokHandle: string
	defaultKeywords: string[]
	contactEmail: string
	salesEmail: string
	supportEmail: string
	ogImage: string
	logo: Logo
	canonical: boolean
	noindex: boolean
	mode: Mode
	scrollAnimations: boolean
}

export const configData: Config = {
	siteTitle: 'FluxFuse — Software for the work that matters',
	siteDescription:
		'FluxFuse builds high-impact apps, AI workflow automations, and scalable digital solutions for businesses and individuals.',
	siteUrl: 'https://fluxfuse.net',
	companyName: 'FluxFuse Technologies Limited',
	brandName: 'FluxFuse',
	twitterHandle: '@fluxfuse_',
	instagramHandle: '@fluxfuse',
	threadsHandle: '@fluxfuse',
	tiktokHandle: '@fluxfuse',
	defaultKeywords: [
		'FluxFuse',
		'FluxFuse Technologies',
		'AI Automation',
		'Custom Software Development',
		'Enterprise AI Integration',
		'Software Product Studio',
		'Workflow Automation',
		'SaaS Engineering',
		'Desktop and Mobile Apps',
		'Digital Solutions'
	],
	contactEmail: 'contact@fluxfuse.net',
	salesEmail: 'sales@fluxfuse.net',
	supportEmail: 'support@fluxfuse.net',
	ogImage: '/og.jpg',
	logo: {
		src: '/logo-light.svg',
		srcDark: '/logo-dark.svg',
		alt: 'FluxFuse logo'
	},
	canonical: true,
	noindex: false,
	mode: 'auto',
	scrollAnimations: true
}
