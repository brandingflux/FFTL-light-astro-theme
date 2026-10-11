#!/usr/bin/env python3
"""
Autonomous High-Tech AI News Blogger for FluxFuse Technologies
Powered by Google Gemini (gemini-2.5-flash / gemini-2.0-flash / gemini-1.5-pro)

Features:
1. Tracks real-time high-tech news from multiple RSS feeds (Ars Technica, TechCrunch, The Verge, Hacker News).
2. Deduplicates against existing posts in `src/content/blog/`.
3. Evaluates & selects the most impactful, high-signal story for engineers and builders.
4. Uses Google Gemini with structured prompts to draft deeply engaging, technical, and analytical articles.
5. Formats valid Astro frontmatter and saves directly into `src/content/blog/<slug>.md`.
6. Fully autonomous: supports CLI, scheduled cron, and GitHub Actions.
"""

import os
import re
import sys
import json
import random
import argparse
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from pathlib import Path
from dotenv import load_dotenv

# 1. Load Environment Variables (.env)
ENV_CANDIDATES = [
    Path(".env"),
    Path(__file__).parent.parent / ".env",
    Path("C:/Users/Administrator/Documents/TECH/TTS/ai-shorts-factory/.env"),
]
for env_path in ENV_CANDIDATES:
    if env_path.exists():
        load_dotenv(dotenv_path=env_path)
        break

API_KEY = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")

# 2. Curated Tech News Feeds
NEWS_FEEDS = [
    {
        "name": "Ars Technica",
        "url": "https://feeds.arstechnica.com/arstechnica/technology-lab",
        "category": "Deep Tech & Infrastructure"
    },
    {
        "name": "TechCrunch AI & Tech",
        "url": "https://techcrunch.com/feed/",
        "category": "Startups & Emerging Tech"
    },
    {
        "name": "The Verge Tech",
        "url": "https://www.theverge.com/rss/tech/index.xml",
        "category": "Industry Trends"
    }
]

BLOG_DIR = Path(__file__).parent.parent / "src" / "content" / "blog"
IMAGES_POOL = [
    f"/collections/blog/image-0{i}.webp" for i in range(1, 10)
]

USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"


def get_existing_slugs_and_titles():
    """Scan existing blog posts to prevent duplicate topics."""
    existing = {"slugs": set(), "titles": []}
    if not BLOG_DIR.exists():
        return existing
    
    for f in BLOG_DIR.glob("*.md"):
        existing["slugs"].add(f.stem)
        try:
            content = f.read_text(encoding="utf-8")
            m = re.search(r"^title:\s*['\"]?(.*?)['\"]?\s*$", content, re.MULTILINE)
            if m:
                existing["titles"].append(m.group(1))
        except Exception:
            pass
    return existing


def fetch_hacker_news_stories(limit=15):
    """Fetch top tech stories from Hacker News Firebase API."""
    stories = []
    try:
        req = urllib.request.Request("https://hacker-news.firebaseio.com/v0/topstories.json", headers={"User-Agent": USER_AGENT})
        with urllib.request.urlopen(req, timeout=8) as resp:
            ids = json.loads(resp.read().decode("utf-8"))[:limit]
        
        for item_id in ids[:8]:  # inspect top 8
            try:
                item_req = urllib.request.Request(f"https://hacker-news.firebaseio.com/v0/item/{item_id}.json", headers={"User-Agent": USER_AGENT})
                with urllib.request.urlopen(item_req, timeout=5) as item_resp:
                    data = json.loads(item_resp.read().decode("utf-8"))
                    title = data.get("title", "")
                    url = data.get("url", f"https://news.ycombinator.com/item?id={item_id}")
                    score = data.get("score", 0)
                    
                    # Filter for high-impact tech keywords
                    if any(kw in title.lower() for kw in ["ai", "llm", "model", "gpu", "chip", "agent", "python", "rust", "release", "benchmark", "code", "cloud", "security", "framework", "architecture"]):
                        stories.append({
                            "title": title,
                            "summary": f"Discussion on Hacker News with {score} points. Direct URL: {url}",
                            "link": url,
                            "source": "Hacker News",
                            "score": score
                        })
            except Exception:
                continue
    except Exception as e:
        print(f"[Warning] Failed to fetch Hacker News: {e}")
    return stories


def fetch_rss_stories():
    """Fetch stories from RSS feeds."""
    stories = []
    for feed in NEWS_FEEDS:
        try:
            req = urllib.request.Request(feed["url"], headers={"User-Agent": USER_AGENT})
            with urllib.request.urlopen(req, timeout=8) as resp:
                xml_data = resp.read()
            
            root = ET.fromstring(xml_data)
            items = root.findall(".//item") or root.findall(".//{*}item") or root.findall(".//{*}entry")
            
            for item in items[:6]:
                title_elem = item.find("title")
                if title_elem is None:
                    title_elem = item.find("{*}title")

                link_elem = item.find("link")
                if link_elem is None:
                    link_elem = item.find("{*}link")

                desc_elem = item.find("description")
                if desc_elem is None:
                    desc_elem = item.find("{*}summary")
                if desc_elem is None:
                    desc_elem = item.find("{*}description")
                
                title = title_elem.text.strip() if title_elem is not None and title_elem.text else ""
                
                # Link could be text or href attribute
                link = ""
                if link_elem is not None:
                    link = link_elem.text.strip() if link_elem.text else link_elem.get("href", "")
                
                desc = desc_elem.text.strip() if desc_elem is not None and desc_elem.text else ""
                # Strip HTML from description
                desc = re.sub(r"<[^>]+>", " ", desc).strip()
                desc = " ".join(desc.split())[:350]
                
                if title:
                    stories.append({
                        "title": title,
                        "summary": desc,
                        "link": link,
                        "source": feed["name"],
                        "score": 50
                    })
        except Exception as e:
            print(f"[Warning] Failed to fetch {feed['name']}: {e}")
            continue
    return stories


def collect_latest_tech_news():
    """Aggregate, score, and deduplicate all incoming news stories."""
    existing = get_existing_slugs_and_titles()
    all_stories = []
    
    all_stories.extend(fetch_rss_stories())
    all_stories.extend(fetch_hacker_news_stories())
    
    # Filter out already covered stories
    candidates = []
    for s in all_stories:
        title_lower = s["title"].lower()
        # Check against existing titles
        is_covered = any(
            len(set(title_lower.split()) & set(existing_title.lower().split())) > 4
            for existing_title in existing["titles"]
        )
        if not is_covered:
            candidates.append(s)
            
    print(f"[Tracker] Discovered {len(all_stories)} stories. {len(candidates)} fresh candidates remaining.")
    return candidates


def generate_article_with_gemini(story: dict, custom_topic: str = None) -> dict:
    """Uses Google Gemini to write an engaging, high-retention, technical blog post."""
    if not API_KEY:
        raise ValueError(
            "GEMINI_API_KEY (or GOOGLE_API_KEY) is missing! Please set it in .env or your environment."
        )
    
    from google import genai
    client = genai.Client(api_key=API_KEY)
    
    topic_context = custom_topic if custom_topic else f"Title: {story['title']}\nSource: {story['source']}\nLink: {story['link']}\nSummary: {story['summary']}"
    
    prompt = f"""You are the Lead Tech Editor and Principal Engineer for FluxFuse Technologies Limited (fluxfuse.net), an independent high-impact software studio building developer tools, desktop utilities (Notchgent), and enterprise AI automations.

Write a full-length, deeply engaging, intellectually rigorous tech briefing based on this breaking story:
---
{topic_context}
---

EDITORIAL DIRECTIVES:
1. VOICE & TONE:
   - Engaging, sharp, analytical, developer-first, and thought-provoking (think Simon Willison meets Stratechery or Latent Space).
   - NEVER sound like generic corporate fluff. NO cliches ("In today's fast-paced digital world", "Delving into", "A testament to", "Navigating the complexities").
   - Jump straight into the action with a punchy, hook-driven opening sentence.
2. TECHNICAL DEPTH:
   - Don't just regurgitate the press release. Analyze the underlying architecture, compute economics, latency/throughput tradeoffs, developer implications, or systemic industry shifts.
   - Include realistic markdown architecture snippets, bullet lists, or tables where it enhances understanding.
3. FLUXFUSE PERSPECTIVE:
   - Dedicate a distinct section ("The FluxFuse Perspective") analyzing what this development means for software engineers, product builders, and autonomous workflow creators.
4. STRUCTURE:
   - Header 2 (##): The Breakthrough in 60 Seconds
   - Header 2 (##): Architectural & Technical Deep Dive
   - Header 2 (##): Industry Impact: Who Wins, Who Gets Disrupted?
   - Header 2 (##): The FluxFuse Perspective: What Builders Must Do Now
   - Header 2 (##): Key Takeaways & Source Citation (include a markdown link back to the source: {story.get('link', '#')})

OUTPUT FORMAT:
Return STRICT JSON ONLY with these keys:
{{
  "title": "Engaging, high-converting, intellectual title (60-80 chars)",
  "slug": "url-friendly-kebab-case-slug",
  "description": "Punchy, high-CTR meta description (140-160 chars)",
  "author": "FluxFuse Editorial",
  "content": "Full markdown body text starting with ## The Breakthrough in 60 Seconds..."
}}
"""

    models_to_try = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-pro", "gemini-1.5-flash"]
    last_err = None
    
    for model_name in models_to_try:
        try:
            print(f"[Gemini] Requesting article from {model_name}...")
            response = client.models.generate_content(
                model=model_name,
                contents=prompt,
                config={
                    "response_mime_type": "application/json",
                    "temperature": 0.7,
                }
            )
            raw_text = response.text.strip()
            
            # Clean markdown code block wraps if any
            if raw_text.startswith("```json"):
                raw_text = raw_text[7:]
            if raw_text.startswith("```"):
                raw_text = raw_text[3:]
            if raw_text.endswith("```"):
                raw_text = raw_text[:-3]
            raw_text = raw_text.strip()
            
            data = json.loads(raw_text)
            if "title" in data and "content" in data and "slug" in data:
                return data
        except Exception as e:
            print(f"[Gemini] Error with {model_name}: {e}")
            last_err = e
            continue
            
    raise RuntimeError(f"All Gemini models failed. Last error: {last_err}")


def save_blog_post(article_data: dict, dry_run: bool = False) -> Path:
    """Format Astro markdown and write to src/content/blog/<slug>.md."""
    BLOG_DIR.mkdir(parents=True, exist_ok=True)
    
    slug = re.sub(r"[^a-z0-9\-]", "", article_data["slug"].lower().replace(" ", "-"))
    if not slug:
        slug = f"tech-briefing-{int(datetime.now().timestamp())}"
        
    now_iso = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.000Z")
    image_choice = random.choice(IMAGES_POOL)
    
    # Escape quotes in title & description
    title = article_data["title"].replace("'", "''")
    description = article_data["description"].replace("'", "''")
    author = article_data.get("author", "FluxFuse Editorial")
    
    frontmatter = f"""---
title: '{title}'
pubDate: {now_iso}
author: '{author}'
description: '{description}'
image: '{image_choice}'
thumbnail: '{image_choice}'
---

{article_data['content']}
"""

    file_path = BLOG_DIR / f"{slug}.md"
    
    if dry_run:
        print(f"\n[DRY RUN] Would save to: {file_path}")
        print("=" * 60)
        print(frontmatter[:500] + "\n...[truncated]...")
        print("=" * 60)
        return file_path
        
    file_path.write_text(frontmatter, encoding="utf-8")
    print(f"\n[Success] Published article to: {file_path}")
    return file_path


def main():
    parser = argparse.ArgumentParser(description="Autonomous High-Tech AI News Blogger for FluxFuse")
    parser.add_argument("--auto", action="store_true", help="Automatically fetch the top breaking story and post it")
    parser.add_argument("--topic", type=str, default=None, help="Custom topic to write about instead of RSS")
    parser.add_argument("--count", type=int, default=1, help="Number of posts to generate")
    parser.add_argument("--dry-run", action="store_true", help="Preview generated content without writing file")
    
    args = parser.parse_args()
    
    print("=" * 60)
    print("  FluxFuse Autonomous AI Tech Blogger (Google Gemini)")
    print("=" * 60)
    
    if args.topic:
        print(f"[Topic Mode] Generating article for topic: '{args.topic}'")
        article = generate_article_with_gemini(story={"title": args.topic, "link": "#", "source": "Editorial Prompt", "summary": args.topic}, custom_topic=args.topic)
        save_blog_post(article, dry_run=args.dry_run)
        return
        
    # Auto RSS Mode
    stories = collect_latest_tech_news()
    if not stories:
        print("[Notice] No new tech stories found that haven't already been covered.")
        return
        
    for i in range(min(args.count, len(stories))):
        chosen_story = stories[i]
        print(f"\n[{i+1}/{args.count}] Selected Story: {chosen_story['title']} ({chosen_story['source']})")
        article = generate_article_with_gemini(chosen_story)
        saved_path = save_blog_post(article, dry_run=args.dry_run)
        print(f"[Done] Article '{article['title']}' ready at {saved_path.name}!")


if __name__ == "__main__":
    main()
