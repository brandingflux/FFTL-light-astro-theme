// Search Engine and Analytics tracking
// - Google Site Verification: for Google Search Console
// - Bing Site Verification: for Bing Webmaster Tools
// - Google Analytics Measurement ID: for Google Analytics (GA4)
// - Google Tag Manager ID: for Google Tag Manager

export const googleSiteVerification = import.meta.env.PUBLIC_GOOGLE_SITE_VERIFICATION || ''
export const bingSiteVerification = import.meta.env.PUBLIC_BING_SITE_VERIFICATION || ''
export const yandexVerification = import.meta.env.PUBLIC_YANDEX_VERIFICATION || ''
export const googleAnalyticsMeasurementID = import.meta.env.PUBLIC_GA_TRACKING_ID || ''
export const googleTagManagerID = import.meta.env.PUBLIC_GTM_ID || ''
