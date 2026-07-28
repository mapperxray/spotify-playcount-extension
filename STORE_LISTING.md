# Chrome Web Store Listing

## Short description (max 132 characters)

Shows each track's play count in the Spotify web player — just like the desktop app used to.

(93 characters — fits comfortably under the 132 limit)

## Detailed description

Play Count for Spotify shows each track's play count directly in the
Spotify web player (open.spotify.com), right next to the track duration —
the same number you used to see in the desktop app.

WHY
The Spotify desktop app shows play counts, but the official Web API doesn't
expose that number, and it's not shown on open.spotify.com. If you like to
check play counts often, this extension saves you from switching to the
desktop app just for that.

HOW IT WORKS
This extension doesn't collect any data or talk to any server of its own.
It simply reads data the Spotify web player already loads for its own
interface and displays the play count inline. No login, no permissions
beyond running on open.spotify.com, no tracking.

WHAT TO EXPECT
- Works on album and playlist tracklists.
- Some pages (like an artist's "Popular" tracks list) aren't supported yet
  — those rows are skipped rather than showing broken UI.
- Relies on data Spotify's own web player loads, so it may occasionally
  break if Spotify changes its site. Updates will follow as needed.

PRIVACY
No data is collected, stored, or transmitted anywhere. Everything runs
locally in your browser.

This is an independent, unofficial project and is not affiliated with,
endorsed by, or sponsored by Spotify AB.

## Privacy practices tab (single purpose description)

Single purpose: Displays each track's existing play-count data (already
loaded by the Spotify web player) inline next to the track listing on
open.spotify.com.

Permission justification: No special permissions are requested beyond
running a content script on https://open.spotify.com/*, required to read
and augment that page's own track listings.

Data usage: This extension does not collect, store, or transmit any user
data. All data stays local to the browser tab.
