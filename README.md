# Baccarat Edge Analyzer — iPhone PWA

This package is the verified Baccarat Edge Analyzer converted into an installable
offline-capable Progressive Web App (PWA).

Files:
- index.html — app UI
- engine.js — exact baccarat calculation engine
- manifest.json — Home Screen app metadata
- service-worker.js — offline cache

IMPORTANT:
iPhone Safari will NOT reliably run this as an executable app from the Files
app's local HTML preview. A PWA must first be opened from an HTTPS web address.

Recommended deployment:
1. Upload these four files to a static HTTPS host (for example GitHub Pages).
2. Open the HTTPS address in Safari on iPhone.
3. Test the app and tap NEW SHOE.
4. Safari Share -> Add to Home Screen.
5. Launch it from the new Home Screen icon.

After the first successful load, the service worker caches the app so the
calculator can continue to work without an internet connection.

The calculation engine remains client-side. No backend is required.

The app uses the previously verified 8-deck baccarat model and corrected
Lucky 6 / Super Lucky 7 event definitions. The package does not claim that
any particular Londoner/Sands table has these exact settings; verify the
live table's displayed rules and payouts before using it.
