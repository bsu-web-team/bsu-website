# BSU performance requirements (targets, not measured capacity)

- 1,000 concurrent active public users as initial acceptance goal; 5,000 as scaling target. Specify page mix, think time, API requests and PDF traffic separately; concurrent users are not requests/second.
- Public HTML and assets cache when safe; authenticated pages and restricted documents must never enter shared public cache. Invalidate public caches on approved CMS changes.
- Use static/server components for content; admin bundles, PDF readers and search indexes load only when needed. Keep motion CSS-based and honor reduced motion.
- Images: dimensions, optimized local WebP/AVIF, responsive sizes, lazy loading except essential above-the-fold asset. Monitor JS bundle delta, LCP <=2.5s, INP <=200ms, CLS <=0.1 at p75 under realistic mobile conditions.
- Public HTTP baseline: error rate <1%, p95 <800ms during agreed load. API/DB/resource metrics must be monitored separately; HTTP timing does not measure browser rendering.
- Use scripts/load-public.k6.js against production build on an isolated staging environment with permission. Default 20 VUs. Increase to 100, 500, 1000 only after observing metrics; 3000/5000 later using suitably sized load generators. Never stress production, external AVN, Vercel or other shared infrastructure without explicit authorization and provider limits. k6 only tests public HTML here; add representative search, auth, media, and backend tasks after integration.
- Record CPU, RSS memory, DB connection pool, disk, network, cache hit rate, p95/p99 and error rate. Test cold and warm cache, recovery and backup restore. Single physical server is a failure domain; capacity and uptime cannot be guaranteed by CSS or framework alone.
- Separate library downloads and admin workflows from public HTML rendering. Stream approved local PDF files through web server; do not preload or buffer whole collections.
