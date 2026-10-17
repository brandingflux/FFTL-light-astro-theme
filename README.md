# FluxFuse Technologies Limited — Official Web Platform

<div align="center">

[![Website](https://img.shields.io/badge/Website-fluxfuse.net-FB5700?style=for-the-badge&logo=google-chrome&logoColor=white)](https://fluxfuse.net)
[![Astro](https://img.shields.io/badge/Astro-v7.0-BC52EE?style=for-the-badge&logo=astro&logoColor=white)](https://astro.build)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)
[![Autonomous AI Blog](https://img.shields.io/badge/Editorial_Engine-Gemini_2.5_Flash-4285F4?style=for-the-badge&logo=google-gemini&logoColor=white)](https://ai.google.dev/)

<p align="center">
  <strong>Software for the work that matters.</strong><br />
  High-impact developer tools, desktop utilities, enterprise AI workflow automation, and digital systems.
</p>

</div>

---

## Overview

This repository powers **[fluxfuse.net](https://fluxfuse.net)**, the digital headquarters of **FluxFuse Technologies Limited**. Built with **Astro v7**, **Tailwind CSS v4**, and **TypeScript**, the platform delivers sub-second page loads, enterprise-grade technical SEO, responsive dark/light theming, and an autonomous AI-driven tech publication engine.

---

## Key Features

### 1. High-Performance Modern Frontend
* **Astro v7 Static Site Generation (SSG)**: Lightning-fast HTML output with zero unnecessary client-side JavaScript.
* **Tailwind CSS v4**: Modern `@theme` and `@utility` architecture using `@tailwindcss/vite`.
* **Adaptive Dark / Light Theming**: Smooth theme persistence with custom variable fonts (*Clash Display*, *Clash Grotesk*).
* **Cinematic Components**: Interactive GSAP motion footers, parallax hero headers, and fluid mobile-first responsive grid layouts.

### 2. Autonomous Tech Editorial Engine
* **Automated News Scraping & Ingestion**: Continuously tracks real-time high-tech news from curated feeds (Ars Technica, TechCrunch, The Verge, Hacker News).
* **Powered by Google Gemini**: Synthesizes breaking developments into deep, analytical, developer-first briefings complete with technical teardowns and *"The FluxFuse Perspective"*.
* **Self-Publishing GitHub Actions**: Runs twice daily (06:00 & 18:00 UTC) via `.github/workflows/auto-blog.yml`, creating markdown articles in `src/content/blog/` and automatically pushing updates to `main`.
* **Zero-Intervention Formatting**: Automatically handles frontmatter, deduplication against existing posts, and optimized reading layouts.

### 3. Enterprise Search Engine & AI Optimization (SEO / GEO / AEO)
* **Schema.org Structured Data**: Automatic JSON-LD generation for `Organization`, `WebSite`, `BlogPosting`, `BreadcrumbList`, and `FAQPage`.
* **Automated XML Sitemaps**: Dynamic `sitemap-index.xml` with automatic priority and `lastmod` tracking.
* **Live RSS 2.0 Feed**: Fully compliant `/rss.xml` feed with Dublin Core metadata for Google News, Feedly, and RSS readers.
* **Open Graph & Twitter Cards**: High-CTR social preview cards generated for every post and landing page.

---

## Architecture & Folder Structure

```plaintext
FFTL-light-astro-theme/
├── .github/
│   └── workflows/
│       └── auto-blog.yml       # Scheduled autonomous tech blogging workflow
├── scripts/
│   └── auto_tech_blog.py       # Gemini-powered RSS tracking & article generator
├── public/                     # Static public assets (fonts, images, manifest)
├── src/
│   ├── assets/                 # SVGs, feature graphics, branding assets
│   ├── components/
│   │   ├── blocks/             # Composable page sections (hero, FAQ, CTA, contact)
│   │   ├── scripts/            # Theme, analytics, and scroll observer scripts
│   │   └── ui/                 # Atomic UI primitives (buttons, rows, cols, cards)
│   ├── config/
│   │   ├── config.ts           # Global brand, email, and metadata configuration
│   │   ├── navigation.ts       # Header and menu navigation structures
│   │   └── socialLinks.ts      # Verified social profiles
│   ├── content/
│   │   └── blog/               # Markdown articles published by editorial engine
│   ├── layouts/
│   │   ├── Layout.astro        # Master root layout with SEO & header/footer
│   │   └── BlogLayout.astro    # Reader-optimized article layout with JSON-LD
│   ├── pages/                  # File-based routing (/, /about, /products, /services, /contact, /blog)
│   │   ├── blog/[...id].astro  # Dynamic blog article renderer
│   │   ├── robots.txt.ts       # Search & AI bot crawler directives
│   │   └── rss.xml.ts          # RSS 2.0 syndication feed generator
│   └── styles/
│       └── global.css          # Tailwind CSS v4 styling & typography rules
├── astro.config.mjs            # Astro configuration, plugins & Vercel adapter
└── package.json                # Project dependencies and development scripts
```

---

## Local Development

### Prerequisites
* **Node.js**: `v22.12.0` or higher
* **Python**: `3.10+` (for running the editorial script locally)
* **Package Manager**: `npm`

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/brandingflux/FFTL-light-astro-theme.git
   cd FFTL-light-astro-theme
   ```

2. **Install frontend dependencies**:
   ```bash
   npm install
   ```

3. **Install Python dependencies** (optional, for local blog generation):
   ```bash
   pip install google-genai python-dotenv
   ```

4. **Configure Environment Variables**:
   Create a `.env` file in the project root:
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key_here
   ```

5. **Start local development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:4321](http://localhost:4321) in your browser.

---

## Available Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts local dev server at `localhost:4321` |
| `npm run build` | Type-checks with `astro check` and builds static bundle to `./dist/` |
| `npm run preview` | Previews the production build locally |
| `npm run blog:generate` | Runs the Autonomous Gemini Blogger locally to publish new articles |

---

## Autonomous Blog Engine CLI Usage

You can trigger the AI blogger manually from the command line:

```bash
# Automatically fetch the top breaking tech news and generate an article:
python scripts/auto_tech_blog.py --auto

# Generate an article on a custom topic override:
python scripts/auto_tech_blog.py --topic "Apple M5 Architecture Teardown"

# Dry run (test prompt & JSON response without writing file to disk):
python scripts/auto_tech_blog.py --auto --dry-run
```

---

## Deployment

The website is continuously deployed on **Vercel**:
* **Primary Domain**: [https://fluxfuse.net](https://fluxfuse.net)
* Every commit pushed to `main` triggers an automatic build and deployment.
* GitHub Actions operates with repository secrets (`GEMINI_API_KEY`) and write permissions to push newly generated articles directly back to `main`.

---

## Contact & Inquiries

* **Website**: [fluxfuse.net](https://fluxfuse.net)
* **Support & Help**: [support@fluxfuse.net](mailto:support@fluxfuse.net)
* **Sales & Enterprise Projects**: [sales@fluxfuse.net](mailto:sales@fluxfuse.net)
* **Social**:
  * X (Twitter): [@fluxfuse_](https://x.com/fluxfuse_)
  * LinkedIn: [FluxFuse Technologies](https://linkedin.com/company/fluxfuse)
  * GitHub: [@brandingflux](https://github.com/brandingflux)

---

<div align="center">
  <sub>© 2026 FluxFuse Technologies Limited. All rights reserved.</sub>
</div>
