// Runs in the isolated world: collects playcount data reported by hook.js
// and injects it next to each track row in the DOM.
//
// NOTE: the selectors below (data-testid="tracklist-row",
// data-testid="internal-track-link") are the most stable hooks currently
// available in Spotify's web player markup, but Spotify can change its UI
// at any time, which may require selector updates. Rows we can't confidently
// place a badge on are simply skipped (not marked injected), so they'll be
// retried automatically once a matching selector is added.

(function () {
  const MSG_TYPE = "__SPY_PLAYCOUNT_DATA__";
  const playcounts = new Map(); // "spotify:track:xxx" -> "26572"

  window.addEventListener("message", (event) => {
    if (event.source !== window) return;
    const data = event.data;
    if (!data || data.__type !== MSG_TYPE) return;
    let changed = false;
    for (const [uri, count] of Object.entries(data.map)) {
      if (playcounts.get(uri) !== count) {
        playcounts.set(uri, count);
        changed = true;
      }
    }
    if (changed) injectAll();
  });

  function formatCount(raw) {
    const n = Number(raw);
    if (Number.isNaN(n)) return String(raw);
    return n.toLocaleString();
  }

  function extractUriFromRow(row) {
    // href can be locale-prefixed ("/track/..." or "/intl-tr/track/..."),
    // so we key off the stable data-testid instead of the href prefix.
    const link = row.querySelector('a[data-testid="internal-track-link"]');
    if (!link) return null;
    const href = link.getAttribute("href") || "";
    const match = href.match(/\/track\/([a-zA-Z0-9]+)/);
    if (!match) return null;
    return `spotify:track:${match[1]}`;
  }

  function findDurationCell(row) {
    return row.querySelector('[role="gridcell"][aria-colindex="3"]');
  }

  function findDurationEl(cell) {
    if (!cell) return null;
    const divs = cell.querySelectorAll("div");
    for (const d of divs) {
      const t = d.textContent.trim();
      // The first div matching mm:ss (e.g. "2:46") is the duration text.
      if (/^\d{1,2}:\d{2}$/.test(t)) return d;
    }
    return null;
  }

  function injectAll() {
    const rows = document.querySelectorAll(
      '[data-testid="tracklist-row"]:not([data-pc-injected])'
    );
    rows.forEach((row) => {
      const uri = extractUriFromRow(row);
      if (!uri) return;
      const count = playcounts.get(uri);
      if (!count) return; // data may not have arrived yet; retried on next mutation

      const durationCell = findDurationCell(row);
      const durationEl = findDurationEl(durationCell);

      const badge = document.createElement("div");
      badge.textContent = formatCount(count);
      badge.setAttribute("data-pc-badge", "true");
      badge.title = "Play count";
      badge.style.cssText =
        "opacity:0.6;font-size:0.9000rem;margin-right:16px;font-variant-numeric:tabular-nums;white-space:nowrap;";

      if (durationEl && durationEl.parentNode) {
        durationEl.parentNode.insertBefore(badge, durationEl);
        row.setAttribute("data-pc-injected", "true");
      }
      // If we can't find the duration element, this row layout isn't
      // supported yet (e.g. an artist page's "Popular" list uses a
      // different structure). We skip it rather than risk overlapping
      // other UI, and leave it unmarked so it's retried automatically.
    });
  }

  const observer = new MutationObserver(() => {
    injectAll();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });

  injectAll();

  console.log(
    "%c[Play Count for Spotify] content script active",
    "color:#1DB954;font-weight:bold;"
  );
})();
