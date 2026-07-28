# Play Count for Spotify

A small Chrome extension that shows each track's **play count** directly in
the Spotify **web player** (open.spotify.com) — the same number the desktop
app used to show next to the track duration. Vibecoded via Claude.AI

> **Unofficial project.** Not affiliated with, endorsed by, or supported by
> Spotify AB. "Spotify" is a trademark of Spotify AB, used here only to
> describe compatibility.

## Why

The Spotify desktop app shows play counts. The official [Web API](https://developer.spotify.com/documentation/web-api)
does not expose this data — only a computed "popularity" score. If you're
someone who checks play counts often, switching back and forth to the
desktop app just for that number gets old fast. This extension reads the
same data the web player already receives for its own UI and displays it
inline, so you never have to leave your browser.

## How it works

Spotify's web player fetches track data from an internal GraphQL endpoint
(`api-partner.spotify.com/pathfinder/v2/query`) that isn't part of the
public developer API. Track objects returned from that endpoint already
include a `playcount` field.

This extension does **not** make any requests of its own, store credentials,
or talk to any third-party server. It simply:

1. Wraps `window.fetch` in the page's own context to observe responses the
   page already receives (using the page's own session).
2. Recursively scans those responses for `{ playcount, uri }` pairs.
3. Matches each track row in the DOM (via `data-testid` attributes) to its
   URI and inserts the play count next to the track duration.

Because it passively observes existing traffic instead of replicating
Spotify's internal request signatures, it's less likely to break when
Spotify tweaks its API — though as with any project relying on an
undocumented interface, breakage is possible if Spotify changes the
response shape or the web player's DOM structure.

## Install (unpacked / developer mode)

1. Download or clone this repository.
2. Open `chrome://extensions` in Chrome.
3. Enable **Developer mode** (top right).
4. Click **Load unpacked** and select this folder.
5. Open [open.spotify.com](https://open.spotify.com), browse to any album
   or playlist, and play counts should appear next to track durations.

## Known limitations

- Only tested on album and playlist tracklists. Some pages (e.g. an
  artist's "Popular" tracks list) use a different row layout that isn't
  supported yet — those rows are simply skipped rather than showing broken
  or overlapping UI.
- Only shows counts for tracks Spotify has already loaded data for on the
  current page (no counts are pre-fetched).
- Relies on an undocumented, private Spotify API. It could stop working at
  any time without notice if Spotify changes it.

## Privacy

This extension collects no data, sends nothing to any external server, and
has no analytics or telemetry. All processing happens locally in your
browser tab.

## Contributing

Issues and pull requests are welcome, especially for:
- Supporting more row layouts (artist pages, search results, "Liked Songs", etc.)
- More robust selectors if Spotify changes its markup

## License

MIT
