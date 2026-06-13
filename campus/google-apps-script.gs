/**
 * Idealnovate Africa — Campus Page (UI/UX Design + Data Analysis)
 * Google Apps Script: Unified Enrollment Handler
 *
 * HOW TO DEPLOY:
 * 1. Go to script.google.com → New project
 * 2. Paste this entire file
 * 3. Replace 'YOUR_GOOGLE_SHEET_ID' below with your Sheet ID
 * 4. Click Deploy → New deployment → Web app
 *    - Execute as: Me (your Idealnovate Gmail)
 *    - Who has access: Anyone
 * 5. Copy the Web App URL and paste it into campus/index.html
 *    where it says: var GOOGLE_SHEET_ENDPOINT = 'PASTE_WEB_APP_URL_HERE';
 * 6. Each time you edit this script: Deploy → Manage deployments → Edit → New version
 */

// ── CONFIG ────────────────────────────────────────────────────────────────────
const SHEET_NAME   = 'Campus Enrollments';
const SHEET_ID     = 'YOUR_GOOGLE_SHEET_ID';
const FROM_NAME    = 'Idealnovate Africa';
const REPLY_TO     = 'hello@idealnovate.com';
const COHORT_DATE  = 'June 27, 2026';
const WHATSAPP_URL = 'https://chat.whatsapp.com/ElMdkHBthmG2ynUeP9dPu2?s=cl&p=i&ilr=2';
// ─────────────────────────────────────────────────────────────────────────────

function doPost(e) {
  try {
    const data  = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME)
                  || SpreadsheetApp.openById(SHEET_ID).insertSheet(SHEET_NAME);

    // Write header row once
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp', 'Bootcamp', 'First Name', 'Last Name',
        'Email', 'Phone (WhatsApp)', 'Gender', 'How They Heard', 'Has Computer'
      ]);
      sheet.getRange(1, 1, 1, 9).setFontWeight('bold').setBackground('#022c28').setFontColor('#ffffff');
    }

    // Append applicant row
    sheet.appendRow([
      new Date(),
      data.bootcamp,
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
  const bootcamp  = data.bootcamp || 'Scholarship Bootcamp';
  const isUIUX    = bootcamp.toLowerCase().includes('ui') || bootcamp.toLowerCase().includes('design');

  const trackName  = isUIUX ? 'UI/UX Design' : 'Data Analysis';
  const trackDesc  = isUIUX
    ? 'You\'ll master Figma, design thinking, prototyping, and end-to-end product design.'
    : 'You\'ll master Microsoft Excel, Power BI, and SQL for real-world data work.';
  const trackColour = isUIUX ? '#f4a85e' : '#217346';

  const subject = `Welcome to the Idealnovate Africa ${trackName} Bootcamp, ${firstName}!`;

  const htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; background: #f0fdf9; font-family: 'Helvetica Neue', Arial, sans-serif; color: #3a3a3a; }
    .outer { padding: 24px 16px; background: #f0fdf9; }
    .wrapper { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; }
    .header { background: #022c28; background: linear-gradient(135deg, #022c28 0%, #068276 100%); padding: 40px 40px 32px; text-align: center; }
    .header h1 { color: #ffffff !important; font-size: 22px; font-weight: 700; margin: 20px 0 8px; line-height: 1.3; }
    .header p  { color: #b2dbd7 !important; font-size: 14px; margin: 0; }
    .track-badge { display: inline-block; background: ${trackColour}22; border: 1px solid ${trackColour}66; color: ${trackColour}; font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 100px; margin-bottom: 14px; }
    .body { padding: 36px 40px; background: #ffffff; }
    .greeting { font-size: 18px; font-weight: 700; color: #022c28; margin-bottom: 16px; }
    .body p { font-size: 15px; line-height: 1.75; color: #3a3a3a; margin-bottom: 16px; }
    .highlight-box { background: #f0fdf9; border-left: 4px solid #068276; border-radius: 0 8px 8px 0; padding: 16px 20px; margin: 24px 0; }
    .highlight-box p { margin: 0; font-size: 14px; color: #022c28; }
    .highlight-box strong { display: block; font-size: 15px; margin-bottom: 6px; color: #068276; }
    .step-text { font-size: 14px; color: #3a3a3a; line-height: 1.6; }
    .cta-btn { display: block; text-align: center; background: #25D366; color: #0a2e19 !important; text-decoration: none; font-size: 16px; font-weight: 700; padding: 16px 32px; border-radius: 100px; margin: 28px auto; max-width: 300px; }
    .footer { background: #022c28; padding: 24px 40px; text-align: center; }
    .footer p { color: #7ab8b3 !important; font-size: 12px; margin: 0; line-height: 1.7; }
    .footer a { color: #a8d8d4 !important; text-decoration: none; }
  </style>
</head>
<body>
<div class="outer">
<div class="wrapper">

  <div class="header">
    <div class="track-badge">${trackName} Bootcamp</div>
    <h1>You&#8217;re In! &#10003;</h1>
    <p>Idealnovate Africa &mdash; ${trackName} Scholarship Bootcamp</p>
  </div>

  <div class="body">
    <p class="greeting">Hi ${firstName},</p>
    <p>Congratulations and a huge welcome to the <strong>Idealnovate Africa ${trackName} Scholarship Bootcamp</strong>! ${trackDesc}</p>
    <p>We&#8217;ve received your application and we&#8217;re excited to have you on board.</p>

    <div class="highlight-box">
      <strong>Cohort Start Date</strong>
      <p>Your cohort kicks off on <strong>${COHORT_DATE}</strong>. Mark your calendar &mdash; this is where your journey begins.</p>
    </div>

    <p>Here&#8217;s what happens next:</p>

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

    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:28px;">
      <tr>
        <td width="38" valign="top">
          <div style="background:#068276;color:#ffffff;border-radius:50%;width:28px;height:28px;text-align:center;line-height:28px;font-size:13px;font-weight:700;font-family:Arial,sans-serif;">2</div>
        </td>
        <td valign="top" style="padding-top:5px;">
          <span class="step-text"><strong>Watch your inbox</strong> &mdash; we will send you more updates and resources before the cohort starts.</span>
        </td>
      </tr>
    </table>

    <a href="${WHATSAPP_URL}" class="cta-btn">Join the WhatsApp Community &#8594;</a>

    <p>If you have any questions before the cohort starts, simply reply to this email or reach us on WhatsApp &mdash; we respond within 24 hours.</p>
    <p>We&#8217;ll see you on <strong>${COHORT_DATE}</strong>. Get ready to transform your career!</p>
    <p>With excitement,<br><strong>The Idealnovate Africa Team</strong></p>
  </div>

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
</html>`;

  GmailApp.sendEmail(email, subject, '', {
    htmlBody: htmlBody,
    name:     FROM_NAME,
    replyTo:  REPLY_TO
  });
}
