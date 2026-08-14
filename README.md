# Idealnovate Africa — Landing Pages

This repo hosts **four separate lead-gen landing pages**, not just one. The root site below is the Data Analysis bootcamp; three more live in subfolders, each a fully independent static funnel with its own enrollment flow, backend script, and success page.

| Site | Path | Sells |
|---|---|---|
| **Idealnovate main** (this README) | `/` | Data Analysis scholarship bootcamp |
| **Campus** | `campus/` | Dual-track hub — both UI/UX and Data Analysis, with a track-picker modal |
| **AI Income Blueprint** | `aiblueprint/` | Free AI-skills course (website AI, automation, video ads, info products) |
| **DCC Connect** | `dcc/` | Digital Clinic Circle — free community hangout event in Lagos |

Each has its own `google-apps-script.gs` and `DEPLOY.md` (or, for this root site, the config below) — **Script URLs, Sheet IDs/names, and community links are NOT shared between them.** See each subfolder's `DEPLOY.md` for its specific setup.

Built with plain HTML, CSS, and vanilla JavaScript — no build step required, anywhere in this repo.

---

## Project Structure (root — Data Analysis bootcamp)

```
IdealnovateLearn/
├── index.html               # Main landing page (all CSS + JS inline)
├── google-apps-script.gs    # Apps Script for form → Google Sheets + welcome email
├── success/
│   └── index.html           # Post-enrollment success page
├── Pictures/                # Shared image assets — used by ALL FOUR sites, not just this one
├── campus/                  # Dual-track landing page — see campus/DEPLOY.md
├── aiblueprint/              # AI Income Blueprint landing page — see aiblueprint/DEPLOY.md
├── dcc/                      # DCC Connect landing page — see dcc/DEPLOY.md
└── privacypolicy/           # Shared Privacy Policy for main/campus/aiblueprint/dcc (NOT PDU — see below)
```

### Privacy Policy

`privacypolicy/index.html` is a single shared Privacy Policy page covering all four sites in this repo (main, campus, aiblueprint, dcc). It replaced a shared external Google Doc link that main/campus/aiblueprint's footers used to point to for "Privacy Policy" (they still point to that same Google Doc for "Terms of Service," which this page does not cover). DCC's footer previously had no legal links at all — one was added.

**PDU Africa is not covered by this page** — it's a separately operated site with its own Privacy Policy, linked from its own footer.

If site-specific facts change (contact email, address, which third-party services/pixels are in use, WhatsApp numbers), update `privacypolicy/index.html` too — it's real content describing real data practices, not boilerplate to ignore.

---

## Local Development

Open `index.html` directly in a browser — no server needed.

For live reload during editing, use VS Code's **Live Server** extension or any static file server:

```bash
npx serve .
# or
python -m http.server 8080
```

---

## Google Apps Script Setup

The enrollment form posts to a Google Apps Script Web App that writes each applicant to a Google Sheet and sends an automated welcome email.

### Steps

1. **Create a Google Sheet**
   - Go to [sheets.google.com](https://sheets.google.com) and create a new spreadsheet.
   - Copy the Sheet ID from its URL:
     `https://docs.google.com/spreadsheets/d/**<SHEET_ID>**/edit`

2. **Create the Apps Script project**
   - Open [script.google.com](https://script.google.com) → **New project**
   - Delete the default code and paste the full contents of `google-apps-script.gs`
   - Replace `'YOUR_GOOGLE_SHEET_ID'` on line 18 with your actual Sheet ID

3. **Deploy as a Web App**
   - Click **Deploy → New deployment**
   - Type: **Web app**
   - Execute as: **Me** (your Idealnovate Gmail account)
   - Who has access: **Anyone**
   - Click **Deploy** and copy the Web App URL

4. **Wire the URL into the landing page**
   - In `index.html`, find:
     ```js
     const SCRIPT_URL = 'https://script.google.com/macros/s/...';
     ```
   - Replace the URL with the one you copied above.

5. **Re-deploy after edits**
   - Any changes to the Apps Script require a new version:
     **Deploy → Manage deployments → Edit → New version → Deploy**

### What it does

| Action | Detail |
|--------|--------|
| Receives form submission | `doPost(e)` parses JSON body |
| Writes to Sheet | Appends a row with timestamp + 8 applicant fields; auto-creates a formatted header on first run |
| Sends welcome email | Branded HTML email from your Idealnovate Gmail via `GmailApp.sendEmail()`, wrapped in its own try/catch so a failure here (e.g. Gmail's daily send quota) can't get swallowed by the outer handler — the sheet write always completes first regardless |
| Email content | Cohort start date, WhatsApp community link, inbox update notice |
| Redirect | Page always redirects to `success/` regardless of response (uses `mode:'no-cors'`) — a failed welcome email is silent to the applicant, but logged server-side via `Logger.log` in the Apps Script Executions tab |

---

## Key Configuration Values

| Variable | Location | Current value |
|----------|----------|--------------|
| `SHEET_ID` | `google-apps-script.gs` | Your Google Sheet ID |
| `SHEET_NAME` | `google-apps-script.gs` | `'Data Enrollment 9'` |
| `SCRIPT_URL` | `index.html` JS block | Set (deployed 2026-08-12) |
| `REPLY_TO` / footer email | `google-apps-script.gs`, `index.html` footer | `help@idealnovate.com` |
| Cohort date | `google-apps-script.gs` `COHORT_DATE`, hero float card, kickstart urgency banner + step heading | **August 22, 2026** — hardcoded in 4 places on `index.html` alone, not just the hero; grep the whole file when changing it |
| WhatsApp community | `google-apps-script.gs` `WHATSAPP_URL`, modal notice, hero WhatsApp button, `success/index.html` | `chat.whatsapp.com/EO2s9zrjZh45I1lRhHdV4M` |

---

## Deployment

The site is a static folder — deploy to any static host:

- **Hostinger / cPanel** — upload the folder contents via File Manager or FTP
- **Netlify** — drag-and-drop the folder at [app.netlify.com/drop](https://app.netlify.com/drop)
- **GitHub Pages** — push to a repo and enable Pages from the `master` branch root

> **Note:** The `google-apps-script.gs` file is for reference only. It runs on Google's servers — do not upload it to your web host.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Markup | HTML5 |
| Styles | CSS3 (custom properties, grid, flexbox, animations) |
| Scripts | Vanilla JavaScript (ES6+) |
| Animations | [AOS](https://michaelosthege.github.io/aos/) v2.3.4 |
| Icons | [Font Awesome](https://fontawesome.com/) 6.5.0 |
| Fonts | Montserrat + Jost (Google Fonts) |
| Backend | Google Apps Script (serverless) |
| Database | Google Sheets |
| Email | Gmail via `GmailApp` API |

---

© 2026 Idealnovate Africa
