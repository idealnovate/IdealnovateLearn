# Idealnovate Africa — Data Analysis Scholarship Bootcamp

A single-file static landing page for the **Idealnovate Africa Data Analysis Scholarship Bootcamp**. Built with plain HTML, CSS, and vanilla JavaScript — no build step required.

---

## Project Structure

```
IdealnovateLearn/
├── index.html               # Main landing page (all CSS + JS inline)
├── google-apps-script.gs    # Apps Script for form → Google Sheets + welcome email
├── success/
│   └── index.html           # Post-enrollment success page
└── Pictures/                # All image assets (logos, hero, testimonials, etc.)
```

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
| Writes to Sheet | Appends a row with timestamp + 7 applicant fields; auto-creates a formatted header on first run |
| Sends welcome email | Branded HTML email from your Idealnovate Gmail via `GmailApp.sendEmail()` |
| Email content | Cohort start date, WhatsApp community link, inbox update notice |

---

## Key Configuration Values

| Variable | Location | Value to set |
|----------|----------|--------------|
| `SHEET_ID` | `google-apps-script.gs` line 18 | Your Google Sheet ID |
| `SCRIPT_URL` | `index.html` JS block | Your deployed Web App URL |
| Cohort date | `google-apps-script.gs` `COHORT_DATE` | Update per cohort |
| WhatsApp group | `google-apps-script.gs` `WHATSAPP_URL` | Update per cohort |

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
