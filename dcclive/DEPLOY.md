# DCCON (dcclive) — Deploy Guide

**File:** `dcclive/index.html`
**Event:** Digital Clinic Conference (DCCON) — free, live-streamed virtual conference by Idealnovate Africa × PDU Africa
**When:** Saturday, 17 October 2026, 12:00 PM – 3:30 PM WAT (GMT+1)
**Venue:** YouTube Live, streamed through Google Meet. The link goes out by email and in the WhatsApp channel from Monday 12 Oct 2026
**Seats:** Free, registration compulsory, 500 spots
**Tagline:** Diagnose · Execute · Monetize (same as `dcc/`)
**Tech:** Static HTML/CSS/JS, Google Apps Script backend (same stack as `dcc/` and `aiblueprint/`)
**Status:** Page, success page, Apps Script and calendar file built (2026-10-07); defaults replaced with confirmed details the same day. **Connected (2026-10-07):** Apps Script deployed and `SCRIPT_URL` wired into `index.html`.

---

## Step 1 — Create the Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) and create a new spreadsheet, e.g. **"DCCON Registrations"**.
2. Copy the Sheet ID from the URL:
   `https://docs.google.com/spreadsheets/d/**<SHEET_ID>**/edit`

The script writes to a tab named `dcconreg1` and creates it (with a header row) on the first registration.

---

## Step 2 — Deploy the Apps Script

1. Open [script.google.com](https://script.google.com) → **New project**
2. Paste the contents of `dcclive/google-apps-script.gs`
3. Replace `'YOUR_GOOGLE_SHEET_ID'` with the Sheet ID from Step 1
4. **Deploy → New deployment**
   - Type: **Web app**
   - Execute as: **Me** (your Idealnovate Gmail account)
   - Who has access: **Anyone**
5. Click **Deploy** and **copy the Web App URL**
6. Authorize on first run: click Run on any function to trigger the OAuth popup and grant Gmail + Sheets access

---

## Step 3 — Wire the URL into the Page

In `dcclive/index.html`, near the bottom, replace:

```js
const SCRIPT_URL = 'PASTE_WEB_APP_URL_HERE';
```

with the Web App URL from Step 2. Then submit a test registration and confirm (a) a row lands in the Sheet, (b) the welcome email arrives with the `DCCON-2026.ics` attachment, (c) you land on `regsuccess/`.

---

## Step 4 — Images

Everything lives in the shared `IdealnovateLearn/Pictures/` folder, referenced as `../Pictures/<file>`.

**DCCON photos — web copies.** The originals `DCCON1`–`DCCON8` are 6–10 MB each, too heavy for a landing page. The page uses compressed copies (80–260 KB each). Each copy is cropped to remove the "Digital Clinic **Lagos**" watermark at the bottom, which would confuse people about a virtual event. The originals are untouched.

| Web copy | From | Used in |
|---|---|---|
| `dccon7-web.jpg` | DCCON7 (speaker + full room) | Hero "broadcast monitor" |
| `dccon8-web.jpg` | DCCON8 (facilitator with attendees) | Why Attend |
| `dccon5-web.jpg` | DCCON5 (group photo) | Sponsors, wide photo band |
| `dccon2-web.jpg` | DCCON2 (attendee in photo frame) | Who It's For |
| `dccon3-web.jpg` | DCCON3 (group activity) | What to Expect |
| `dccon4-web.jpg` | DCCON4 (panel speaker) | What to Expect |
| `dccon6-web.jpg` | DCCON6 (three guests) | Not used yet, available |

DCCON1 (empty room) has no web copy and isn't used.

**Brand assets (shared with `dcc/`):** `dccwhitelogo.png` / `dcclogo.png` (nav swaps white → colour on scroll; footer uses white), `dccicon.jpg` (favicon), `Idealnovate Logo Dark.png`, `PDU Logo Dark.png`.

---

## Step 5 — Deploy the Static Files

Upload the whole `dcclive/` folder, **including `dccon.ics`** (the success page's "Apple / Other" calendar button links to it). Lives at `idealnovate.com/dcclive/`, same pattern as `/dcc/`, `/campus/`, `/aiblueprint/`.

`google-apps-script.gs` and this file are reference-only. They don't need to be on the web host.

---

## Re-deploying after Script Changes

**Deploy → Manage deployments → Edit (pencil) → Version: New version → Deploy.** The Web App URL stays the same.

---

## Key Config Values

Several values are hardcoded in more than one file. Grep the whole `dcclive/` folder before changing any of them.

| What | Where | Value |
|---|---|---|
| Apps Script endpoint | `index.html` — `SCRIPT_URL` | Set (2026-10-07) — `script.google.com/macros/s/AKfycbx2HKWM…XsFNfug/exec` |
| Sheet ID / tab | `google-apps-script.gs` — `SHEET_ID`, `SHEET_NAME` | Set (2026-10-07) — `1eD8vgsqVvFBFQbHhOwmEbcWfb_TJmZROEtSTaxZJU7I` / `dcconreg1` |
| Event date + time | Hero facts, monitor bar, time-zone strip, modal kicker, What to Expect CTA, FAQ 02 + 05, `regsuccess/index.html`, Apps Script `EVENT_DATE`/`EVENT_TIME` + email time-zone line, `dccon.ics` | Sat 17 Oct 2026, 12:00 PM – 3:30 PM WAT |
| Start/end (UTC) | `index.html` `EVENT_START`/`EVENT_END` (countdown), Apps Script `EVENT_START_UTC`/`EVENT_END_UTC`, `regsuccess/` Google + Outlook links, `dccon.ics` | 11:00–14:30 UTC (3.5 hours) |
| Venue / platform | Hero facts, monitor bar, live-now message, FAQ 03, success page, Apps Script `EVENT_VENUE`, calendar entries | YouTube Live via Google Meet |
| Link release date | FAQ 04, success page step 2, Apps Script `LINK_DATE`, calendar descriptions, `dccon.ics` | Monday, 12 October 2026 |
| Seats | Hero note, modal subtitle, What to Expect CTA, FAQ 01, sponsor intro | 500, free, registration compulsory |
| Tagline | Hero, monitor lower-third, footer blurb, Apps Script `TAGLINE`, calendar descriptions | Diagnose · Execute · Monetize |
| Replay | FAQ 08, sponsor benefit 3, welcome email | Available for 7 days after the event |
| WhatsApp channel | Modal notice, FAQ 04, footer, `regsuccess/`, Apps Script `WHATSAPP_URL`, calendar descriptions, `dccon.ics` | `whatsapp.com/channel/0029Vb8wUVVHVvTU7guI0O35` |
| Email sender | Apps Script `FROM_NAME`, `REPLY_TO` | "Digital Clinic Conference (DCCON) by Idealnovate" / `dcc@idealnovate.com` |
| Contact | Footer | `dcc@idealnovate.com`, `+234 905 917 9421` |
| Sponsorship form | Sponsors → "Become a Sponsor" | DCCON's own Google Form — `docs.google.com/forms/d/e/1FAIpQLScZTRfu3XlcDGv5dlUqtCV2faOwgHZMSlJ9SYaFIaOpYsL9HA/viewform` (not the `dcc/` one) |
| Fonts | `index.html`, `regsuccess/` | Unbounded + Plus Jakarta Sans (as `dcc/`) + IBM Plex Mono for broadcast data |
| Corner radius | Sitewide | `0` everywhere by design, as on `dcc/` |
| Accent gold `--cash` | `index.html` | `#F2B441`, used only on the word "Monetize" (taken from the "Skills to Cash" lockup on the DCCON photos) |

---

## Form Fields → Sheet Columns

Timestamp · First Name · Last Name · Email · Phone (WhatsApp) · Gender (Male / Female) · Location (Nigeria / Ghana / Kenya / South Africa / Tanzania / USA / UK / Others) · How They Heard (Facebook / Instagram / X (formerly Twitter) / WhatsApp / LinkedIn / TikTok / Telegram / Friend) · Attending Virtually (Yes / No)

Unlike `dcc/`, there's no "Idealnovate/PDU alumnus?" question.

---

## Welcome Email

Sent by `sendWelcomeEmail()` in the Apps Script. It includes:
- seat confirmation and the three takeaways
- a date/time/venue box (12:00 – 3:30 PM WAT, YouTube Live via Google Meet)
- **Add to Google Calendar** and **Add to Outlook Calendar** buttons
- an attached **`DCCON-2026.ics`** invite for Apple Calendar and others, with reminders 1 day and 1 hour before
- start–end times for Ghana, UK, South Africa, Kenya and US Eastern
- three next steps: join the WhatsApp channel (link posted from Mon 12 Oct), watch your inbox for the YouTube link, show up ready (power, data, notebook; live Q&A)
- a note that the replay is available for 7 days
- a WhatsApp channel CTA

A failed email never blocks registration. The Sheet row is written first, and errors are logged to the Apps Script Executions tab.

---

## Page Structure

- **Nav**: logo, 5 links (Why Attend / Sponsors / Who It's For / What to Expect / FAQ), "Reserve My Seat" CTA; left-sliding drawer below 1020px
- **Hero, "The Broadcast Monitor"**: title, "Diagnose · Execute · Monetize", date/time/venue facts, CTA, "Free · Registration required · Only 500 spots", the viewer's local start time (auto-detected, hidden for Lagos). On the right, `dccon7-web.jpg` framed as a live-stream monitor (on-air bar, viewfinder corners, TV lower-third) with a live countdown. After 12:00 WAT it switches to "We're live on YouTube now", and after 3:30 PM WAT to "That's a wrap". Below sits a "Showtime in" strip with start times for 7 cities.
- **Why Attend**: the 3 takeaways styled as a prescription (Rx) slip, beside `dccon8-web.jpg`
- **Sponsors**: Idealnovate (Headline Organizer) + PDU (Partner & Sponsor) stamped logo cards, a group-photo band, then "Back a movement, not an ad slot" with 5 sponsor benefits (pan-African reach, hiring pipeline, stream + 7-day replay visibility, offer in front of ready buyers, impact story + year-round exposure) and the "Become a Sponsor" CTA
- **Who It's For**: 5 personas as "symptoms", beside `dccon2-web.jpg` with a "no prerequisites" note
- **What to Expect**: 3 programme themes (Diagnosis / Wealth / Wellness) as a broadcast rundown, a live Q&A mention, plus 2 photos
- **FAQ** (12): free/500 spots · when & how long · venue · how to get the link · time zones (Nigeria, Ghana, UK, South Africa, Kenya, USA Eastern/Central/Pacific) · what you need · live questions · 7-day replay · no certificate · no Idealnovate/PDU prerequisite · after registering · sponsoring
- **Footer**: same structure as `dcc/`, with this page's links and the WhatsApp channel in place of Telegram
- **Modal**: 8 fields (incl. Gender), WhatsApp channel notice, data-safety notice
- **No speaker/convener section**, by request (2026-10-07). Favour Francis isn't named anywhere on the page.

---

## Open Items

- [x] **Sheet + Script URL.** Deployed and wired in (2026-10-07).
- [x] **End-to-end test.** Real registration tested on the live page and confirmed working (2026-10-07).
