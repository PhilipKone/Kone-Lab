# 🚀 Release v1.2.0 - Static Site Generation (SSG), SEO Schema & PWA Launch

We are excited to announce the launch of **Kone Lab v1.2.0**! This release marks a major leap forward in Search Engine Optimization (SEO), Static Site Generation (SSG), and Progressive Web App (PWA) installation features to ensure lightning-fast load times, seamless offline functionality, and perfect indexability in search engines.

---

## 💎 What's New in v1.2.0

### 1. High-Performance Static Site Generation (SSG) ⚡
To resolve Search Console crawlers experiencing rendering delays, we integrated **`react-snap`** for automatic compile-time static site pre-rendering.
* Pre-renders dynamic JavaScript routes into SEO-friendly, fully static HTML snapshots.
* Introduced a customized `postinstall` utility patcher for headless Chrome compatibility within GitHub Actions and headless environments.
* Bypassed the common `page.removeListener` Puppeteer error under modern Node modules to ensure bulletproof builds.

### 2. Premium SEO Architecture & Brand Metadata Schemas 🔍
* Integrated microdata schemas using structured **JSON-LD JSON injection** for structured rich snippets.
* Standardized semantic titles, meta canonical tags, sitemaps, and indexing properties across major search engines.
* Added support for **Apple Pay merchant verification domains** to establish a secure hardware checkout portal.
* Integrated dynamic OpenGraph (OG) image schemas to ensure high-fidelity social previews on LinkedIn, Twitter, and messaging links.

### 3. Sleek PWA Banner & Skeletons 📱
* Designed a premium **Progressive Web App installation prompt banner** styled with cohesive, modern CSS tokens.
* Integrated responsive glassmorphism prompt banners alongside high-end content layout skeletons, completely avoiding loading jumps (CLS).

---

## 🛠️ Technical Details & Commits
* **react-snap build pipelines:** Configured headless Chromium triggers via `puppeteerArgs: ["--no-sandbox", "--disable-setuid-sandbox"]` to guarantee CI/CD integration safety.
* **Apple Pay integration:** Configured Apple Domain Verification `.well-known` access keys.
* **Service Workers:** Enhanced Service Worker network caching protocols to support ultra-fast page transitions even on sluggish 3G connections.
