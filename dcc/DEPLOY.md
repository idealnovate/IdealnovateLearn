# DCC Connect — Deploy Guide

**File:** `dcc/index.html`
**Event:** Digital Clinic Circle (DCC) Connect — community hangout in Lagos, Nigeria (proposed Sept 6, date pending final confirmation)
**Tech:** Static HTML/CSS/JS, Google Apps Script backend (same stack as the other Idealnovate/PDU funnels)
**Status:** Full page live — Header/Hero, Why Attend, Partners & Organizers, Activities ("The Lineup"), Convener spotlight, Sponsors, FAQ, Footer, enrollment modal, mobile drawer nav, and `regsuccess/` page. Apps Script deployed and `SCRIPT_URL` wired into `index.html`.

---

## Step 1 — Create the Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) and create a new spreadsheet.
2. Name it **"DCC Connect Registrations"** (or anything you like).
3. Copy the Sheet ID from the URL:
   `https://docs.google.com/spreadsheets/d/**<SHEET_ID>**/edit`

---

## Step 2 — Deploy the Apps Script

1. Open [script.google.com](https://script.google.com) → **New project**
2. Paste the contents of `dcc/google-apps-script.gs`
3. Replace `'YOUR_GOOGLE_SHEET_ID'` with the Sheet ID you copied above
4. Click **Deploy → New deployment**
   - Type: **Web app**
   - Execute as: **Me** (your Idealnovate Gmail account)
   - Who has access: **Anyone**
5. Click **Deploy** and **copy the Web App URL**
6. Authorize on first run — click Run on any function to trigger the OAuth popup and grant Gmail + Sheets access

---

## Step 3 — Wire the URL into the Page

Open `dcc/index.html`, find the script block near the bottom, and replace:

```js
const SCRIPT_URL = 'PASTE_WEB_APP_URL_HERE';
```

with the Web App URL from Step 2.

---

## Step 4 — Images

`dcc/index.html` has no dedicated Pictures folder of its own — everything lives in the shared `IdealnovateLearn/Pictures/` and is referenced as `../Pictures/<filename>`:

- `dcclogo.png`, `dccblacklogo.png`, `dccwhitelogo.png`, `dccicon.jpg` — DCC branding (color, black, white, favicon)
- `dcclg.png` — standalone pulse-icon mark
- `dcclive.jpg`, `dcccolor.png` — real brand/flyer reference used to derive the palette (not referenced by the page itself)
- `dccfill.png` — community group photo used as the hero background
- `ff2.png` — Mr. Favour Francis's portrait, used in the Convener section
- `Idealnovate Logo Dark.png` — Idealnovate Africa logo, used in Partners & Organizers
- `PDU Logo Dark.png` / `PDU Logo White.png` — PDU Africa logo, copied over from `pdu/Pictures/` (originals: `PDU Logo Dark (1).png` / `PDU Logo White (1).png`) since `dcc/` and `pdu/` are separate site roots

---

## Step 5 — Deploy the Static Files

Static folder, no build step. Deploy to any static host:

| Host | Method |
|---|---|
| **Hostinger / cPanel** | Upload `dcc/` folder via File Manager or FTP |
| **Netlify** | Drag-and-drop at [app.netlify.com/drop](https://app.netlify.com/drop) |
| **GitHub Pages** | Push to repo, enable Pages from the branch root |

The page lives at `/dcc/index.html` relative to the Idealnovate Africa root, same pattern as `/campus/` and `/aiblueprint/`.

---

## Re-deploying after Script Changes

1. **Deploy → Manage deployments**
2. Click the pencil (Edit)
3. Version → **New version**
4. Click **Deploy**

The Web App URL stays the same — no change needed in `index.html`.

---

## Key Config Values

| What | Where | Value |
|---|---|---|
| Apps Script endpoint | `dcc/index.html` — `SCRIPT_URL` | Set (2026-08-09) |
| Sheet ID | `dcc/google-apps-script.gs` — `SHEET_ID` | Set (2026-08-09) — spreadsheet named "dccreg1" |
| Event date | Hero, FAQ, Apps Script `EVENT_DATE_NOTE`, `regsuccess/index.html` | Proposed September 6 — phrased tentatively everywhere, not locked in |
| Event location | Hero, modal, Apps Script `EVENT_LOCATION` | Lagos, Nigeria (physical event, no virtual fallback) |
| Spots available | Hero | 50 |
| Telegram community | Modal notice, footer, `regsuccess/index.html`, Apps Script `TELEGRAM_URL` | `t.me/+h4J_onzdEHYzZGFk` |
| Contact email | Footer, Apps Script `REPLY_TO` | `dcc@idealnovate.com` |
| Contact phone | Footer | `+234 905 917 9421` |
| Sponsorship form | Sponsors section CTA | Google Form — `docs.google.com/forms/d/e/1FAIpQLSf9gRKMvrDbF1wEMFjkQJtHr2tYLBNqQNQmpr4QCXQjKEnJDQ/viewform` |
| Convener | Convener section | Mr. Favour Francis, Founder of Idealnovate Africa |
| Fonts | `index.html`, `regsuccess/index.html` | Unbounded (display) + Plus Jakarta Sans (body) — deliberately different from the Montserrat/Jost pairing used on the other Idealnovate/PDU sites |
| Corner radius | Sitewide | `0` everywhere by design — no rounded corners on any element |
| Social links | Footer, `regsuccess/index.html` | Reused Idealnovate org handles: `instagram.com/idealnovate`, `x.com/joinidealnovate`, `linkedin.com/company/idealnovate`, `tiktok.com/@idealnovate`, `youtube.com/@idealnovate` |

---

## Build Progress (session log)

- [x] Header — transparent navbar (logo swaps color/white on scroll), single-column dark-overlay hero over `dccfill.png`, horizontal "Pulse Wave" signature, enrollment modal (9 custom fields, Telegram notice, security notice)
- [x] Why Attend — vertical "vitals strip" of 5 benefits, closing CTA
- [x] Partners & Organizers — Idealnovate Africa (Headline Organizer) + PDU Africa (Partner & Sponsor) stamped logo cards
- [x] Activities ("The Lineup") — 6-session mosaic grid, closing CTA
- [x] Convener — Mr. Favour Francis spotlight (bio, credentials, stats, About DCC), closing CTA
- [x] Sponsors ("Why Sponsor DCC Connect") — editorial two-column value list, "Become a Sponsor" CTA linking to the Google Form
- [x] FAQ — dark index-accordion, 8 questions answered from page content
- [x] Footer — brand/social, quick links, contact (email/phone/Telegram), copyright
- [x] Mobile nav — 4-link header nav (Why Attend / Lineup / Partners / FAQ) + left-to-right sliding drawer below 900px
- [x] `google-apps-script.gs` — writes to Sheet, sends a DCC-branded welcome email (registration confirmation + Telegram community prompt + "more info via email and Telegram" notice)
- [x] `regsuccess/index.html` — modeled on `aiblueprint/regsuccess/`, reskinned to DCC branding/copy, links to the Telegram community instead of WhatsApp
- [x] Script URL set in `index.html` and `SHEET_ID` set in `google-apps-script.gs` (2026-08-09)
- [ ] Exact event time and physical venue address — not yet confirmed, not stated anywhere on the page
