/**
 * Idealnovate Africa — Data Analysis Scholarship Bootcamp
 * Google Apps Script: Enrollment Handler
 *
 * HOW TO DEPLOY:
 * 1. Go to script.google.com → New project
 * 2. Paste this entire file
 * 3. Click Deploy → New deployment → Web app
 *    - Execute as: Me (your Idealnovate Gmail)
 *    - Who has access: Anyone
 * 4. Copy the Web App URL and paste it into index.html
 *    where it says: const SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
 * 5. Each time you edit this script, click Deploy → Manage deployments → edit → new version
 */

// ── CONFIG ───────────────────────────────────────────────────────────────────
const SHEET_NAME   = 'Enrollments';          // Tab name in your Google Sheet
const SHEET_ID     = 'YOUR_GOOGLE_SHEET_ID'; // From the Sheet URL: /d/<THIS_PART>/edit
const FROM_NAME    = 'Idealnovate Africa';
const REPLY_TO     = 'hello@idealnovate.com';
const COHORT_DATE  = 'June 28, 2026';
const WHATSAPP_URL = 'https://chat.whatsapp.com/I0yaZzhdyoSExZm3vv1n61?s=cl&p=i&ilr=2';
// ─────────────────────────────────────────────────────────────────────────────

function doPost(e) {
  try {
    const data  = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME)
                  || SpreadsheetApp.openById(SHEET_ID).insertSheet(SHEET_NAME);

    // Write header row once
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp', 'First Name', 'Last Name', 'Email',
        'Phone (WhatsApp)', 'Gender', 'How They Heard', 'Has Computer'
      ]);
      sheet.getRange(1, 1, 1, 8).setFontWeight('bold').setBackground('#022c28').setFontColor('#ffffff');
    }

    // Append applicant row
    sheet.appendRow([
      new Date(),
      data.firstName,
      data.lastName,
      data.email,
      data.phone,
      data.gender,
      data.referral,
      data.hasComputer
    ]);

    // Send automated welcome email
    sendWelcomeEmail(data);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function sendWelcomeEmail(data) {
  const firstName = data.firstName;
  const email     = data.email;

  const subject = `🎉 Welcome to the Idealnovate Africa Data Analysis Bootcamp, ${firstName}!`;

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; background: #f0fdf9; font-family: 'Helvetica Neue', Arial, sans-serif; color: #3a3a3a; }
    .wrapper { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(2,44,40,0.08); }
    .header { background: linear-gradient(135deg, #022c28 0%, #068276 100%); padding: 40px 40px 32px; text-align: center; }
    .header img { height: 44px; width: auto; }
    .header h1 { color: #ffffff; font-size: 22px; font-weight: 700; margin: 20px 0 8px; line-height: 1.3; }
    .header p { color: rgba(255,255,255,0.75); font-size: 14px; margin: 0; }
    .body { padding: 36px 40px; }
    .greeting { font-size: 18px; font-weight: 700; color: #022c28; margin-bottom: 16px; }
    .body p { font-size: 15px; line-height: 1.75; color: #3a3a3a; margin-bottom: 16px; }
    .highlight-box { background: #f0fdf9; border-left: 4px solid #068276; border-radius: 0 8px 8px 0; padding: 16px 20px; margin: 24px 0; }
    .highlight-box p { margin: 0; font-size: 14px; color: #022c28; }
    .highlight-box strong { display: block; font-size: 15px; margin-bottom: 6px; color: #068276; }
    .steps { margin: 24px 0; }
    .step { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 14px; }
    .step-num { background: #068276; color: #fff; border-radius: 50%; width: 28px; height: 28px; min-width: 28px; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; }
    .step-text { font-size: 14px; color: #3a3a3a; line-height: 1.6; padding-top: 4px; }
    .cta-btn { display: block; text-align: center; background: #068276; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 700; padding: 16px 32px; border-radius: 100px; margin: 28px auto; max-width: 280px; }
    .social-row { text-align: center; margin: 24px 0 8px; }
    .social-row a { display: inline-block; margin: 0 6px; color: #068276; font-size: 13px; text-decoration: none; }
    .footer { background: #022c28; padding: 24px 40px; text-align: center; }
    .footer p { color: rgba(255,255,255,0.5); font-size: 12px; margin: 0; line-height: 1.7; }
    .footer a { color: rgba(255,255,255,0.7); text-decoration: none; }
  </style>
</head>
<body>
<div style="padding: 24px 16px; background: #f0fdf9;">
<div class="wrapper">

  <div class="header">
    <h1>You're In! 🎉</h1>
    <p>Idealnovate Africa — Data Analysis Scholarship Bootcamp</p>
  </div>

  <div class="body">
    <p class="greeting">Hi ${firstName},</p>
    <p>Congratulations and a huge welcome to the <strong>Idealnovate Africa Data Analysis Scholarship Bootcamp</strong>! We've received your application and we're excited to have you on board.</p>

    <div class="highlight-box">
      <strong>📅 Cohort Start Date</strong>
      <p>Your cohort kicks off on <strong>${COHORT_DATE}</strong>. Mark your calendar — this is where your data analysis journey begins.</p>
    </div>

    <p>Here's what happens next:</p>

    <div class="steps">
      <div class="step">
        <div class="step-num">1</div>
        <div class="step-text"><strong>Join our WhatsApp Community</strong> — all class links, resources, and announcements are shared there first.</div>
      </div>
      <div class="step">
        <div class="step-num">2</div>
        <div class="step-text"><strong>Watch your inbox</strong> — we will be sending you more updates here.</div>
      </div>
    </div>

    <a href="${WHATSAPP_URL}" class="cta-btn">Join the WhatsApp Community →</a>

    <p>If you have any questions before the cohort starts, simply reply to this email or reach us on WhatsApp — we respond within 24 hours.</p>

    <p>We'll see you on <strong>${COHORT_DATE}</strong>. Get ready to transform your career!</p>

    <p>With excitement,<br><strong>The Idealnovate Africa Team</strong></p>

    <div class="social-row">
      <a href="https://instagram.com/idealnovate">Instagram</a> ·
      <a href="https://x.com/idealnovate">X (Twitter)</a> ·
      <a href="https://linkedin.com/company/idealnovate">LinkedIn</a> ·
      <a href="https://www.youtube.com/@idealnovate">YouTube</a>
    </div>
  </div>

  <div class="footer">
    <p>
      © 2026 Idealnovate Africa. All rights reserved.<br>
      73 Hammed Omidiran Way, Osogbo, Osun State, Nigeria<br>
      <a href="mailto:${REPLY_TO}">${REPLY_TO}</a>
    </p>
  </div>

</div>
</div>
</body>
</html>
  `;

  GmailApp.sendEmail(email, subject, '', {
    htmlBody: htmlBody,
    name:     FROM_NAME,
    replyTo:  REPLY_TO
  });
}
