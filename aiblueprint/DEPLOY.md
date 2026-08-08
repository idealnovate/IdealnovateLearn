# AI Income Blueprint — Deploy Guide

**File:** `aiblueprint/index.html`
**Course:** AI Income Blueprint — "Turn AI Tools into Daily Revenue Streams" (zero tech experience needed)
**Tech:** Static HTML/CSS/JS, Google Apps Script backend (same stack as the other Idealnovate/PDU funnels)
**Status:** 9 of the planned sessions are live (Hero → Info Strip → Consequence → Solution → Curriculum → Testimonials → Value Stack → Community → Kickstart → FAQ). No certification is offered for this free cohort. See the bottom of this file for the full session log.

---

## Step 1 — Create the Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) and create a new spreadsheet.
2. Name it **"AI Blueprint Enrollments"** (or anything you like).
3. Copy the Sheet ID from the URL:
   `https://docs.google.com/spreadsheets/d/**<SHEET_ID>**/edit`

---

## Step 2 — Deploy the Apps Script

1. Open [script.google.com](https://script.google.com) → **New project**
2. Paste the contents of `aiblueprint/google-apps-script.gs`
3. Replace `'YOUR_GOOGLE_SHEET_ID'` with the Sheet ID you copied above
4. Replace `COHORT_DATE` and `WHATSAPP_URL` placeholders with the real values
5. Click **Deploy → New deployment**
   - Type: **Web app**
   - Execute as: **Me** (your Idealnovate Gmail account)
   - Who has access: **Anyone**
6. Click **Deploy** and **copy the Web App URL**
7. Authorize on first run — click Run on any function to trigger the OAuth popup and grant Gmail + Sheets access

---

## Step 3 — Wire the URL into the Page

Open `aiblueprint/index.html`, find the script block near the bottom, and replace:

```js
const SCRIPT_URL = 'PASTE_WEB_APP_URL_HERE';
```

with the Web App URL from Step 2.

---

## Step 4 — Images

`aiblueprint/index.html` has no dedicated Pictures folder of its own — everything lives in the shared `IdealnovateLearn/Pictures/` and is referenced as `../Pictures/<filename>`:
- `Idealnovate Logo Dark.png`, `Idealnovate Logo White.png`, `Site Icon.jpg` — shared branding
- `ava1.jpg`–`ava4.jpg` — hero trust avatars
- `aihero.png` — hero cutout photo (student on laptop)
- `AIRev1.jpg`–`AIRev9.jpg`, `AIRev10.png` — real Discord community screenshots used in Testimonials
- `Idealnovate Pics 12.jpg` — Community section photo (shared org asset)

`AICert.jpg` was used for a Certification session that has since been removed (certification is not part of this free cohort) — the file is no longer referenced.

As new sessions are built (Who-For, Benefits, Tools, etc.), add any AI-Income-Blueprint-specific images to `IdealnovateLearn/Pictures/` and reference them the same way.

---

## Step 5 — Deploy the Static Files

Static folder, no build step. Deploy to any static host:

| Host | Method |
|---|---|
| **Hostinger / cPanel** | Upload `aiblueprint/` folder via File Manager or FTP |
| **Netlify** | Drag-and-drop at [app.netlify.com/drop](https://app.netlify.com/drop) |
| **GitHub Pages** | Push to repo, enable Pages from the branch root |

The page lives at `/aiblueprint/index.html` relative to the Idealnovate Africa root, same pattern as `/campus/`.

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
| Apps Script endpoint | `aiblueprint/index.html` — `SCRIPT_URL` | Set (2026-08-08) |
| Sheet ID | The deployed copy in script.google.com — `SHEET_ID` | **Unverified from here** — confirm it's a real Sheet ID, not still `'YOUR_GOOGLE_SHEET_ID'`, in the script you pasted into script.google.com |
| Cohort date | Apps Script `COHORT_DATE`, `regsuccess/index.html` | `August 15th 2026` |
| Cohort duration | FAQ section | 1 week, 3 live sessions |
| Missed-session policy | FAQ section | Sessions are recorded; replay link posted in the WhatsApp community |
| Countdown key | `index.html` JS — `KEY` | `'aiblueprint_admission_deadline'` |
| WhatsApp community | Modal notice, `regsuccess/index.html`, Apps Script `WHATSAPP_URL` | `chat.whatsapp.com/LZ4SwZoiu7W8zN1VpOKJTQ` |
| Contact email | Footer | `hello@idealnovate.com` (reused) |
| X (Twitter) | Footer, `regsuccess/index.html`, Apps Script welcome email | `x.com/joinidealnovate` — **note:** this differs from the other Idealnovate sites' `x.com/idealnovate`; double-check this specific handle when copying social links between files, it's been fixed twice already after drifting back to the wrong one |
| Meta Pixel | `index.html` | `2085647452368752` (reused Idealnovate account pixel) |
| TikTok Pixel | `index.html` | `D8T8R53C77U8IPSBMNG0` (reused Idealnovate account pixel) |

---

## Build Progress (session log)

- [x] Folder scaffold — copied from the `IdealnovateLearn` base stack (same CSS system, JS engine, modal, countdown, form validation/submission as `campus/`)
- [x] Navbar (4 links: Curriculum / Reviews / What's Inside / FAQ), top countdown banner, footer (full Programme column, all 4 social links), enrollment modal, floating CTA, back-to-top
- [x] Session 1 — Hero: headline "Turn AI Tools into Daily Revenue Streams", a glassmorphic "orbit" visual built around the 4 real skills taught (website AI, automation, video ads, info products)
- [x] Info Strip — replicated from `IdealnovateLearn/index.html`, adapted copy (no fabricated alumni rating; certificate chip later swapped out, see below)
- [x] Session 2 — Consequence ("Work Without AI, Get Left Behind"): rebuilt to replicate the "Who Is This For" numbered-card format, 9 risk cards across 3 audiences
- [x] Session 3 — Solution ("Work With AI. Get Ahead."): mirrors Consequence's format exactly, 9 opportunity cards
- [x] Session 4 — Curriculum: replicates the sidebar + accordion format, all 16 modules / 78 lessons across 4 tracks (Foundations / Business Growth / Career Growth / Freelance Playbook), transcribed from the real curriculum doc
- [x] Session 5 — Testimonials: replicates the dual-row marquee format, 10 real Discord community screenshots (`AIRev1–10`)
- [x] Session 6 — Value Stack ("What's Inside"): premium ledger card, 5 modules itemized at real value (₦553,000 / $410 total), struck through to FREE
- [x] Session 8 — Community: replicates the source format, real curriculum stats used instead of unverified engagement numbers
- [x] Session 9 — Kickstart/Enroll: replicates the source format, working countdown wired to real `ks-cd-*` timer elements
- [x] Session 10 — FAQ: replicates the sidebar + accordion format, 8 questions answered from real page content plus 2 confirmed directly (cohort = 1 week / 3 live sessions; missed sessions are recorded and posted to the WhatsApp community)
- Session 7 (Certification) was built then fully removed by decision on 2026-08-07 — **certification is not part of this free cohort.** All "certificate included" mentions were scrubbed from Info Strip, Curriculum, and Kickstart.
- [ ] Who-For, Benefits, Tools — the only sessions from the original PDU/IdealnovateLearn structure not yet added
- [ ] Sheet ID and deployed Script URL — still placeholders, pending actual Google Sheet + Apps Script deployment
- Real cohort date (August 15th 2026), WhatsApp community link, and X handle (`x.com/joinidealnovate`) are set across `index.html`, `regsuccess/index.html`, and `google-apps-script.gs`
