/**
 * Digital Clinic Circle (DCC) Connect by Idealnovate Africa
 * Google Apps Script: Registration Handler
 *
 * HOW TO DEPLOY:
 * 1. Go to script.google.com → New project
 * 2. Paste this entire file
 * 3. Replace 'YOUR_GOOGLE_SHEET_ID' below with your actual Sheet ID
 * 4. Click Deploy → New deployment → Web app
 *    - Execute as: Me (your Idealnovate Gmail)
 *    - Who has access: Anyone
 * 5. Copy the Web App URL and paste it into dcc/index.html
 *    where it says: const SCRIPT_URL = 'PASTE_WEB_APP_URL_HERE';
 * 6. Each time you edit this script, click Deploy → Manage deployments → edit → new version
 */

// ── CONFIG ───────────────────────────────────────────────────────────────────
const SHEET_NAME    = 'dccreg1'; // Tab name in your Google Sheet
const SHEET_ID       = '14KWcf6da5_aAoehDHVpb2MYcuSs1LCwDE7PCQ-YrtvI'; // From the Sheet URL: /d/<THIS_PART>/edit
const FROM_NAME      = 'Digital Clinic Circle (DCC) by Idealnovate';
const REPLY_TO        = 'dcc@idealnovate.com';
const TELEGRAM_URL   = 'https://t.me/+h4J_onzdEHYzZGFk';
const EVENT_LOCATION = 'Lagos, Nigeria';
const EVENT_DATE_NOTE = 'Proposed for September 6 — the exact date is still pending final confirmation';
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
        'Phone (WhatsApp)', 'Gender', 'Location',
        'Idealnovate/PDU Alumni or Student', 'How They Heard',
        'Attending In Person'
      ]);
      sheet.getRange(1, 1, 1, 10).setFontWeight('bold').setBackground('#0F172A').setFontColor('#ffffff');
    }

    // Append applicant row
    sheet.appendRow([
      new Date(),
      data.firstName,
      data.lastName,
      data.email,
      data.phone,
      data.gender,
      data.location,
      data.alumni,
      data.referral,
      data.attend
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

  const subject = `You're Registered for DCC Connect, ${firstName}!`;

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
    body { margin: 0; padding: 0; background: #F1F5F9; font-family: 'Helvetica Neue', Arial, sans-serif; color: #334155; }
    .outer { padding: 24px 16px; background: #F1F5F9; }
    .wrapper { max-width: 600px; margin: 0 auto; background: #ffffff; overflow: hidden; }

    /* ── Header — dark navy anchored with solid fallback ── */
    .header { background: #0F172A; background: linear-gradient(135deg, #0F172A 0%, #0F766E 100%); padding: 40px 40px 32px; text-align: center; }
    .header h1 { color: #ffffff !important; font-size: 22px; font-weight: 700; margin: 20px 0 8px; line-height: 1.3; }
    .header p  { color: #8FF0E0 !important; font-size: 14px; margin: 0; }

    /* ── Body ── */
    .body { padding: 36px 40px; background: #ffffff; }
    .greeting { font-size: 18px; font-weight: 700; color: #0F172A; margin-bottom: 16px; }
    .body p { font-size: 15px; line-height: 1.75; color: #334155; margin-bottom: 16px; }
    .highlight-box { background: #F1F5F9; border-left: 4px solid #14B8A6; padding: 16px 20px; margin: 24px 0; }
    .highlight-box p { margin: 0; font-size: 14px; color: #0F172A; }
    .highlight-box strong { display: block; font-size: 15px; margin-bottom: 6px; color: #0F766E; }
    .step-text { font-size: 14px; color: #334155; line-height: 1.6; }

    /* Telegram CTA */
    .cta-btn { display: block; text-align: center; background: #229ED9; color: #ffffff !important; text-decoration: none; font-size: 16px; font-weight: 700; padding: 16px 32px; margin: 28px auto; max-width: 300px; }

    .social-row { text-align: center; margin: 24px 0 8px; }
    .social-row a { display: inline-block; margin: 0 6px; color: #0F766E; font-size: 13px; text-decoration: none; }

    /* ── Footer ── */
    .footer { background: #0F172A; padding: 24px 40px; text-align: center; }
    .footer p { color: #94E6D9 !important; font-size: 12px; margin: 0; line-height: 1.7; }
    .footer a { color: #C4F5EB !important; text-decoration: none; }

    /* ── Dark mode ── */
    @media (prefers-color-scheme: dark) {
      body    { background: #0A0F1C !important; }
      .outer  { background: #0A0F1C !important; }
      .wrapper { background: #131C2E !important; }
      .body   { background: #131C2E !important; }
      .greeting { color: #8FF0E0 !important; }
      .body p { color: #C5D3E0 !important; }
      .highlight-box { background: #0F1B2E !important; border-left-color: #14B8A6 !important; }
      .highlight-box p { color: #8FF0E0 !important; }
      .highlight-box strong { color: #14B8A6 !important; }
      .step-text { color: #C5D3E0 !important; }
      .social-row a { color: #4DD0C4 !important; }
    }
  </style>
</head>
<body>
<div class="outer">
<div class="wrapper">

  <!-- Header -->
  <div class="header">
    <h1>You&#8217;re In! &#10003;</h1>
    <p>Digital Clinic Circle (DCC) Connect by Idealnovate</p>
  </div>

  <!-- Body -->
  <div class="body">
    <p class="greeting">Hi ${firstName},</p>
    <p>Congratulations — your spot for <strong>DCC Connect</strong> in ${EVENT_LOCATION} is confirmed! We&#8217;re excited to have you join the Circle for a day of diagnosing bottlenecks, executing plans, and monetizing skills alongside a room full of ambitious peers.</p>

    <div class="highlight-box">
      <strong>Event Date</strong>
      <p>${EVENT_DATE_NOTE}. We&#8217;ll confirm the exact date, venue, and full schedule via email and the Telegram community as we get closer — so keep an eye on both.</p>
    </div>

    <p>Here&#8217;s what happens next:</p>

    <!-- Step 1 — table layout for universal email client support -->
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:14px;">
      <tr>
        <td width="38" valign="top">
          <div style="background:#14B8A6;color:#ffffff;width:28px;height:28px;text-align:center;line-height:28px;font-size:13px;font-weight:700;font-family:Arial,sans-serif;">1</div>
        </td>
        <td valign="top" style="padding-top:5px;">
          <span class="step-text"><strong>Join the DCC Telegram Community</strong> — this is where schedule updates, venue reveal, logistics, and event arrangements are posted first.</span>
        </td>
      </tr>
    </table>

    <!-- Step 2 -->
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:28px;">
      <tr>
        <td width="38" valign="top">
          <div style="background:#14B8A6;color:#ffffff;width:28px;height:28px;text-align:center;line-height:28px;font-size:13px;font-weight:700;font-family:Arial,sans-serif;">2</div>
        </td>
        <td valign="top" style="padding-top:5px;">
          <span class="step-text"><strong>Watch your inbox and the Telegram channel</strong> — more information will be communicated through both as the event approaches.</span>
        </td>
      </tr>
    </table>

    <a href="${TELEGRAM_URL}" class="cta-btn">Join the Telegram Community &#8594;</a>

    <p>If you have any questions before the event, simply reply to this email — we respond within 24 hours.</p>

    <p>See you at the Circle. Let&#8217;s diagnose, execute, and monetize — together.</p>

    <p>With excitement,<br><strong>The Idealnovate Africa Team</strong></p>

    <div class="social-row">
      <a href="https://instagram.com/idealnovate">Instagram</a> &middot;
      <a href="https://x.com/joinidealnovate">X (Twitter)</a> &middot;
      <a href="https://linkedin.com/company/idealnovate">LinkedIn</a> &middot;
      <a href="https://www.youtube.com/@idealnovate">YouTube</a>
    </div>
  </div>

  <!-- Footer -->
  <div class="footer">
    <p>
      &copy; 2026 Digital Clinic Circle by Idealnovate Africa. All rights reserved.<br>
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
