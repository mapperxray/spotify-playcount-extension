// Runs in the MAIN world: we listen to the page's own fetch() calls.
// Spotify's web player fetches track/album/playlist data from its internal
// GraphQL endpoint (api-partner.spotify.com/pathfinder/v2/query). We don't
// send any requests ourselves — we just inspect responses the page already
// receives (with its own session, its own auth) and look for objects shaped
// like { "playcount": "...", "uri": "spotify:track:..." }.
//
// We intentionally don't filter by operationName (getAlbum/getPlaylist/etc.)
// since the track objects have the same shape regardless of which query
// produced them — a generic recursive scan is enough and needs no updates
// when Spotify adds new query types.

(function () {
  const MSG_TYPE = "__SPY_PLAYCOUNT_DATA__";
  const TARGET_HOST = "api-partner.spotify.com";

  function walkForPlaycounts(node, out, depth) {
    if (!node || typeof node !== "object" || depth > 12) return;
    if (Array.isArray(node)) {
      for (const item of node) walkForPlaycounts(item, out, depth + 1);
      return;
    }
    if (
      typeof node.playcount !== "undefined" &&
      typeof node.uri === "string" &&
      node.uri.startsWith("spotify:track:")
    ) {
      out[node.uri] = node.playcount;
    }
    for (const key in node) {
      if (Object.prototype.hasOwnProperty.call(node, key)) {
        walkForPlaycounts(node[key], out, depth + 1);
      }
    }
  }

  function report(map) {
    if (Object.keys(map).length === 0) return;
    try {
      window.postMessage({ __type: MSG_TYPE, map }, "*");
    } catch (e) {
      /* swallow — never let this break page functionality */
    }
  }

  const originalFetch = window.fetch;
  window.fetch = async function (...args) {
    const response = await originalFetch.apply(this, args);
    try {
      const url =
        typeof args[0] === "string" ? args[0] : (args[0] && args[0].url) || "";
      if (url.includes(TARGET_HOST)) {
        const clone = response.clone();
        const json = await clone.json();
        const out = {};
        walkForPlaycounts(json, out, 0);
        report(out);
      }
    } catch (e) {
      /* non-JSON or unexpected shape — safe to ignore */
    }
    return response;
  };

  console.log(
    "%c[Play Count for Spotify] hook active, watching pathfinder traffic",
    "color:#1DB954;font-weight:bold;"
  );
})();
