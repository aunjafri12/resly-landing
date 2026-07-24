This folder holds the site's image assets.

resly-wordmark-terracotta.svg — hero logo (wordmark), terracotta gradient, transparent
resly-icon-terracotta.svg     — footer icon logo (28x28), terracotta gradient, transparent
shot-login.png               — sign-in screen (hero carousel)
screenshot-patients.png      — patient list (hero carousel + showcase)
screenshot-anp.png           — assessment & plan cards (hero carousel + how-it-works mockup)
screenshot-dictate.png       — voice dictation screen (hero carousel + showcase)
screenshot-icd.png           — ICD-10 search (showcase)
screenshot-note-vitals.png   — vitals table note (Open Graph share image only — no longer shown on-page)

The two logo files are vector SVGs sourced from the terracotta logo kit —
no need to re-export at different resolutions, they scale cleanly at any size.

Image tags carry a "?v=N" cache-busting query string. If you swap any of
these files for a new version with the SAME filename, bump that version
number in index.html (all instances) or browsers that already visited the
page will keep showing the old cached copy.

If a screenshot file goes missing, the page shows a placeholder box with a
label in its place (no code changes needed — the <img> tags already point here).
