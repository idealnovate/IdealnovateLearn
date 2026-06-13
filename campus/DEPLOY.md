# Campus Page — Deploy Guide

**File:** `campus/index.html`  
**Bootcamps:** UI/UX Design + Data Analysis  
**Tech:** Static HTML/CSS/JS, Google Apps Script backend

---

## Step 1 — Create the Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) and create a new spreadsheet.
2. Name it **"Idealnovate Campus Enrollments"** (or anything you like).
3. Copy the Sheet ID from the URL:  
   `https://docs.google.com/spreadsheets/d/**<SHEET_ID>**/edit`

---

## Step 2 — Deploy the Apps Script

1. Open [script.google.com](https://script.google.com) → **New project**
2. Paste the contents of `campus/google-apps-script.gs`
3. Replace `'YOUR_GOOGLE_SHEET_ID'` with the Sheet ID you copied above
4. Click **Deploy → New deployment**
   - Type: **Web app**
   - Execute as: **Me** (your Idealnovate Gmail account)
   - Who has access: **Anyone**
5. Click **Deploy** and **copy the Web App URL**
6. Authorize on first run — click Run on any function to trigger the OAuth popup and grant Gmail + Sheets access

---

## Step 3 — Wire the URL into the Campus Page

Open `campus/index.html` and find:

```js
var GOOGLE_SHEET_ENDPOINT = 'PASTE_WEB_APP_URL_HERE';
```

Replace `PASTE_WEB_APP_URL_HERE` with the Web App URL from Step 2.

---

## Step 4 — Upload Images

Ensure all images referenced as `../Pictures/` exist in `IdealnovateLearn/Pictures/`:

**UI/UX track images** (copied from `pdu/Pictures/`):
- `OibohFelicitOsose2.jpg`, `FadipeIbukunoluwaTemitope2.jpg`, `AyobamiAdeniyiStephen.jpg`
- `SMB.jpg`, `IslamiyatAdeleke.jpg`, `FF.jpg`
- `Tes1.png` – `Tes8.png`
- `WebSample.jpg`

**Data Analysis track images** (already in `IdealnovateLearn/Pictures/`):
- `pro1.jpg` – `pro6.jpg`
- `Rev1.png` – `Rev7.png`
- `Certification.jpg`

**Shared images** (already in `IdealnovateLearn/Pictures/`):
- `Idealnovate Logo Dark.png`, `Idealnovate Logo White.png`
- `Idealnovate Pics 12.jpg`
- `Site Icon.jpg`

---

## Step 5 — Deploy the Static Files

The campus page is a static folder with no build step. Deploy to any static host:

| Host | Method |
|---|---|
| **Hostinger / cPanel** | Upload `campus/` folder via File Manager or FTP |
| **Netlify** | Drag-and-drop at [app.netlify.com/drop](https://app.netlify.com/drop) |
| **GitHub Pages** | Push to repo, enable Pages from the branch root |

The campus page lives at `/campus/index.html` relative to the Idealnovate Africa root.

---

## Re-deploying after Script Changes

Any changes to `google-apps-script.gs` require a new deployment version:

1. **Deploy → Manage deployments**
2. Click the pencil (Edit)
3. Version → **New version**
4. Click **Deploy**

The Web App URL stays the same — no change needed in `index.html`.

---

## Key Config Values

| What | Where | Value |
|---|---|---|
| Apps Script endpoint | `campus/index.html` — `GOOGLE_SHEET_ENDPOINT` | Set after deploy |
| Sheet ID | `campus/google-apps-script.gs` — `SHEET_ID` | Set after creating sheet |
| Cohort date | Hero section, Kickstart section | June 27, 2026 |
| Countdown key | `index.html` JS — `KEY` | `'idealnovate_campus_deadline'` |
| WhatsApp community | Modal notice, Community section | `chat.whatsapp.com/I0yaZzhdyoSExZm3vv1n61` |
| Contact email | FAQ sidebar, Footer | `hello@idealnovate.com` |
| Hiring email | FAQ answer #8 | `hire@idealnovate.com` |
