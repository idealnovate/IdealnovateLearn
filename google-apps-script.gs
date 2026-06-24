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
const SHEET_NAME   = 'Enrollments2';          // Tab name in your Google Sheet
const SHEET_ID     = 'YOUR_GOOGLE_SHEET_ID'; // From the Sheet URL: /d/<THIS_PART>/edit
const FROM_NAME    = 'Idealnovate Africa';
const REPLY_TO     = 'hello@idealnovate.com';
const COHORT_DATE  = 'June 27, 2026';
const WHATSAPP_URL = 'https://chat.whatsapp.com/L0rK9MQNkm229bJE63fNfy?mode=gi_t';
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
        'Phone (WhatsApp)', 'Location', 'Gender', 'How They Heard', 'Has Computer'
      ]);
      sheet.getRange(1, 1, 1, 9).setFontWeight('bold').setBackground('#022c28').setFontColor('#ffffff');
    }

    // Append applicant row
    sheet.appendRow([
      new Date(),
      data.firstName,
      data.lastName,
      data.email,
      data.phone,
      data.location,
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

  const subject = `Welcome to the Idealnovate Africa Data Analysis Bootcamp, ${firstName}!`;

  const htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <style>
    /* ── Base ── */
    body { margin: 0; padding: 0; background: #f0fdf9; font-family: 'Helvetica Neue', Arial, sans-serif; color: #3a3a3a; }
    .outer { padding: 24px 16px; background: #f0fdf9; }
    .wrapper { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; }

    /* ── Header — dark gradient anchored with solid fallback ── */
    .header { background: #022c28; background: linear-gradient(135deg, #022c28 0%, #068276 100%); padding: 40px 40px 32px; text-align: center; }
    .header h1 { color: #ffffff !important; font-size: 22px; font-weight: 700; margin: 20px 0 8px; line-height: 1.3; }
    .header p  { color: #b2dbd7 !important; font-size: 14px; margin: 0; }

    /* ── Body ── */
    .body { padding: 36px 40px; background: #ffffff; }
    .greeting { font-size: 18px; font-weight: 700; color: #022c28; margin-bottom: 16px; }
    .body p { font-size: 15px; line-height: 1.75; color: #3a3a3a; margin-bottom: 16px; }
    .highlight-box { background: #f0fdf9; border-left: 4px solid #068276; border-radius: 0 8px 8px 0; padding: 16px 20px; margin: 24px 0; }
    .highlight-box p { margin: 0; font-size: 14px; color: #022c28; }
    .highlight-box strong { display: block; font-size: 15px; margin-bottom: 6px; color: #068276; }
    .step-text { font-size: 14px; color: #3a3a3a; line-height: 1.6; }

    /* WhatsApp CTA — dark text for contrast on #25D366 green */
    .cta-btn { display: block; text-align: center; background: #25D366; color: #0a2e19 !important; text-decoration: none; font-size: 16px; font-weight: 700; padding: 16px 32px; border-radius: 100px; margin: 28px auto; max-width: 300px; }

    .social-row { text-align: center; margin: 24px 0 8px; }
    .social-row a { display: inline-block; margin: 0 6px; color: #068276; font-size: 13px; text-decoration: none; }

    /* ── Footer ── */
    .footer { background: #022c28; padding: 24px 40px; text-align: center; }
    .footer p { color: #7ab8b3 !important; font-size: 12px; margin: 0; line-height: 1.7; }
    .footer a { color: #a8d8d4 !important; text-decoration: none; }

    /* ── Dark mode ── */
    @media (prefers-color-scheme: dark) {
      body    { background: #0d1f1d !important; }
      .outer  { background: #0d1f1d !important; }
      .wrapper { background: #162b28 !important; }
      .body   { background: #162b28 !important; }
      .greeting { color: #9dd6d0 !important; }
      .body p { color: #c5d8d6 !important; }
      .highlight-box { background: #0f2926 !important; border-left-color: #0a9e90 !important; }
      .highlight-box p { color: #9dd6d0 !important; }
      .highlight-box strong { color: #0a9e90 !important; }
      .step-text { color: #c5d8d6 !important; }
      .social-row a { color: #4db8ae !important; }
    }
  </style>
</head>
<body>
<div class="outer">
<div class="wrapper">

  <!-- Header -->
  <div class="header">
    <h1>You&#8217;re In! &#10003;</h1>
    <p>Idealnovate Africa &mdash; Data Analysis Scholarship Bootcamp</p>
  </div>

  <!-- Body -->
  <div class="body">
    <p class="greeting">Hi ${firstName},</p>
    <p>Congratulations and a huge welcome to the <strong>Idealnovate Africa Data Analysis Scholarship Bootcamp</strong>! We&#8217;ve received your application and we&#8217;re excited to have you on board.</p>

    <div class="highlight-box">
      <strong>Cohort Start Date</strong>
      <p>Your cohort kicks off on <strong>${COHORT_DATE}</strong>. Mark your calendar &mdash; this is where your data analysis journey begins.</p>
    </div>

    <p>Here&#8217;s what happens next:</p>

    <!-- Step 1 — table layout for universal email client support -->
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:14px;">
      <tr>
        <td width="38" valign="top">
          <div style="background:#068276;color:#ffffff;border-radius:50%;width:28px;height:28px;text-align:center;line-height:28px;font-size:13px;font-weight:700;font-family:Arial,sans-serif;">1</div>
        </td>
        <td valign="top" style="padding-top:5px;">
          <span class="step-text"><strong>Join our WhatsApp Community</strong> &mdash; all class links, resources, and announcements are shared there first.</span>
        </td>
      </tr>
    </table>

    <!-- Step 2 -->
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:28px;">
      <tr>
        <td width="38" valign="top">
          <div style="background:#068276;color:#ffffff;border-radius:50%;width:28px;height:28px;text-align:center;line-height:28px;font-size:13px;font-weight:700;font-family:Arial,sans-serif;">2</div>
        </td>
        <td valign="top" style="padding-top:5px;">
          <span class="step-text"><strong>Watch your inbox</strong> &mdash; we will be sending you more updates here.</span>
        </td>
      </tr>
    </table>

    <a href="${WHATSAPP_URL}" class="cta-btn">Join the WhatsApp Community &#8594;</a>

    <p>If you have any questions before the cohort starts, simply reply to this email or reach us on WhatsApp &mdash; we respond within 24 hours.</p>

    <p>We&#8217;ll see you on <strong>${COHORT_DATE}</strong>. Get ready to transform your career!</p>

    <p>With excitement,<br><strong>The Idealnovate Africa Team</strong></p>

    <div class="social-row">
      <a href="https://instagram.com/idealnovate">Instagram</a> &middot;
      <a href="https://x.com/idealnovate">X (Twitter)</a> &middot;
      <a href="https://linkedin.com/company/idealnovate">LinkedIn</a> &middot;
      <a href="https://www.youtube.com/@idealnovate">YouTube</a>
    </div>
  </div>

  <!-- Footer -->
  <div class="footer">
    <p>
      &copy; 2026 Idealnovate Africa. All rights reserved.<br>
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
