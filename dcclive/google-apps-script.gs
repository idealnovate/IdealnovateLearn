/**
 * Digital Clinic Conference (DCCON) by Idealnovate Africa × PDU Africa
 * Google Apps Script: Registration Handler
 *
 * HOW TO DEPLOY:
 * 1. Go to script.google.com → New project
 * 2. Paste this entire file
 * 3. Replace 'YOUR_GOOGLE_SHEET_ID' below with your actual Sheet ID
 * 4. Click Deploy → New deployment → Web app
 *    - Execute as: Me (your Idealnovate Gmail)
 *    - Who has access: Anyone
 * 5. Copy the Web App URL and paste it into dcclive/index.html
 *    where it says: const SCRIPT_URL = 'PASTE_WEB_APP_URL_HERE';
 * 6. Each time you edit this script, click Deploy → Manage deployments → edit → new version
 */

// ── CONFIG ───────────────────────────────────────────────────────────────────
const SHEET_NAME     = 'dcconreg1';                 // Tab name in your Google Sheet
const SHEET_ID       = '1eD8vgsqVvFBFQbHhOwmEbcWfb_TJmZROEtSTaxZJU7I';      // From the Sheet URL: /d/<THIS_PART>/edit
const FROM_NAME      = 'Digital Clinic Conference (DCCON) by Idealnovate';
const REPLY_TO       = 'dcc@idealnovate.com';
const WHATSAPP_URL   = 'https://whatsapp.com/channel/0029Vb8wUVVHVvTU7guI0O35';
const EVENT_TITLE    = 'Digital Clinic Conference (DCCON)';
const EVENT_DATE     = 'Saturday, 17 October 2026';
const EVENT_TIME     = '12:00 PM – 3:30 PM WAT (GMT+1, Nigerian time)';
const EVENT_VENUE    = 'YouTube Live (via Google Meet)';
const TAGLINE        = 'Diagnose · Execute · Monetize';
const LINK_DATE      = 'Monday, 12 October';         // when the live-stream link goes out
// Start/end in UTC. 12:00–15:30 WAT = 11:00–14:30 UTC (3.5 hours). If this
// changes, also update index.html (EVENT_START/END), regsuccess/ calendar links and dccon.ics.
const EVENT_START_UTC = '20261017T110000Z';
const EVENT_END_UTC   = '20261017T143000Z';
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
        'Phone (WhatsApp)', 'Gender', 'Location', 'How They Heard',
        'Attending Virtually'
      ]);
      sheet.getRange(1, 1, 1, 9).setFontWeight('bold').setBackground('#0F172A').setFontColor('#ffffff');
    }

    // Append registrant row
    sheet.appendRow([
      new Date(),
      data.firstName,
      data.lastName,
      data.email,
      data.phone,
      data.gender,
      data.location,
      data.referral,
      data.attend
    ]);

    // Send automated welcome email — failures here (e.g. Gmail's daily
    // send quota) must NOT block registration success, since the
    // registrant's data is already safely recorded in the sheet above.
    try {
      sendWelcomeEmail(data);
    } catch (emailErr) {
      Logger.log('sendWelcomeEmail failed but registration was still recorded: ' + emailErr.message);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ── Calendar helpers ─────────────────────────────────────────────────────────
function calendarDetails() {
  return TAGLINE + '. Free conference by Idealnovate Africa x PDU Africa, streamed live on YouTube via Google Meet. '
       + 'The link is sent by email and posted in the DCC WhatsApp channel from ' + LINK_DATE + ': ' + WHATSAPP_URL;
}

function googleCalendarUrl() {
  return 'https://calendar.google.com/calendar/render?action=TEMPLATE'
    + '&text='     + encodeURIComponent(EVENT_TITLE)
    + '&dates='    + EVENT_START_UTC + '/' + EVENT_END_UTC
    + '&details='  + encodeURIComponent(calendarDetails())
    + '&location=' + encodeURIComponent(EVENT_VENUE);
}

function toIsoUtc(stamp) {
  // 20261017T110000Z → 2026-10-17T11:00:00Z
  return stamp.slice(0, 4) + '-' + stamp.slice(4, 6) + '-' + stamp.slice(6, 8)
       + 'T' + stamp.slice(9, 11) + ':' + stamp.slice(11, 13) + ':' + stamp.slice(13, 15) + 'Z';
}

function outlookCalendarUrl() {
  return 'https://outlook.live.com/calendar/0/action/compose?rru=addevent'
    + '&subject='  + encodeURIComponent(EVENT_TITLE)
    + '&startdt='  + encodeURIComponent(toIsoUtc(EVENT_START_UTC))
    + '&enddt='    + encodeURIComponent(toIsoUtc(EVENT_END_UTC))
    + '&location=' + encodeURIComponent(EVENT_VENUE)
    + '&body='     + encodeURIComponent(calendarDetails());
}

function icsBlob() {
  const stamp = Utilities.formatDate(new Date(), 'UTC', "yyyyMMdd'T'HHmmss'Z'");
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Idealnovate Africa//DCCON 2026//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    'UID:dccon-2026-1017@idealnovate.com',
    'DTSTAMP:' + stamp,
    'DTSTART:' + EVENT_START_UTC,
    'DTEND:' + EVENT_END_UTC,
    'SUMMARY:' + EVENT_TITLE,
    'DESCRIPTION:' + calendarDetails().replace(/,/g, '\\,'),
    'LOCATION:' + EVENT_VENUE,
    'BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:DCCON starts tomorrow at 12:00 PM WAT', 'TRIGGER:-P1D', 'END:VALARM',
    'BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:DCCON starts in 1 hour', 'TRIGGER:-PT1H', 'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ];
  // RFC 5545: fold lines longer than 75 octets with CRLF + space
  const folded = lines.map(function (line) {
    const parts = [];
    while (line.length > 73) { parts.push(line.slice(0, 73)); line = line.slice(73); }
    parts.push(line);
    return parts.join('\r\n ');
  });
  return Utilities.newBlob(folded.join('\r\n'), 'text/calendar', 'DCCON-2026.ics');
}

// ── Welcome email ────────────────────────────────────────────────────────────
function sendWelcomeEmail(data) {
  const firstName = data.firstName;
  const email     = data.email;

  const subject = `You're in for DCCON, ${firstName}! Save the date: 17 October`;

  const htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <style>
    body { margin: 0; padding: 0; background: #F1F5F9; font-family: 'Helvetica Neue', Arial, sans-serif; color: #334155; }
    .outer { padding: 24px 16px; background: #F1F5F9; }
    .wrapper { max-width: 600px; margin: 0 auto; background: #ffffff; overflow: hidden; }

    .header { background: #0F172A; background: linear-gradient(135deg, #0F172A 0%, #0F766E 100%); padding: 40px 40px 32px; text-align: center; }
    .header .kicker { color: #8FF0E0 !important; font-family: 'Courier New', monospace; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; margin: 0 0 14px; }
    .header h1 { color: #ffffff !important; font-size: 24px; font-weight: 700; margin: 0 0 8px; line-height: 1.3; }
    .header p  { color: #8FF0E0 !important; font-size: 14px; margin: 0; }

    .body { padding: 36px 40px; background: #ffffff; }
    .greeting { font-size: 18px; font-weight: 700; color: #0F172A; margin-bottom: 16px; }
    .body p { font-size: 15px; line-height: 1.75; color: #334155; margin-bottom: 16px; }
    .highlight-box { background: #F1F5F9; border-left: 4px solid #14B8A6; padding: 18px 20px; margin: 24px 0; }
    .highlight-box p { margin: 0 0 6px; font-size: 14px; color: #0F172A; }
    .highlight-box p:last-child { margin-bottom: 0; }
    .highlight-box strong { color: #0F766E; }
    .section-title { font-size: 13px; font-weight: 700; color: #0F766E; text-transform: uppercase; letter-spacing: 1px; margin: 28px 0 10px; }
    .step-text { font-size: 14px; color: #334155; line-height: 1.6; }
    .tz { font-size: 13px; color: #64748B; line-height: 1.7; }

    .cal-btn { display: inline-block; background: #ffffff; border: 2px solid #14B8A6; color: #0F766E !important; text-decoration: none; font-size: 14px; font-weight: 700; padding: 11px 18px; margin: 0 6px 8px 0; }
    .cta-btn { display: block; text-align: center; background: #128C7E; color: #ffffff !important; text-decoration: none; font-size: 16px; font-weight: 700; padding: 16px 32px; margin: 28px auto; max-width: 320px; }

    .social-row { text-align: center; margin: 24px 0 8px; }
    .social-row a { display: inline-block; margin: 0 6px; color: #0F766E; font-size: 13px; text-decoration: none; }

    .footer { background: #0F172A; padding: 24px 40px; text-align: center; }
    .footer p { color: #94E6D9 !important; font-size: 12px; margin: 0; line-height: 1.7; }
    .footer a { color: #C4F5EB !important; text-decoration: none; }

    @media (prefers-color-scheme: dark) {
      body    { background: #0A0F1C !important; }
      .outer  { background: #0A0F1C !important; }
      .wrapper { background: #131C2E !important; }
      .body   { background: #131C2E !important; }
      .greeting { color: #8FF0E0 !important; }
      .body p { color: #C5D3E0 !important; }
      .highlight-box { background: #0F1B2E !important; }
      .highlight-box p { color: #E2F7F3 !important; }
      .highlight-box strong { color: #14B8A6 !important; }
      .section-title { color: #4DD0C4 !important; }
      .step-text, .tz { color: #C5D3E0 !important; }
      .cal-btn { background: #131C2E !important; color: #8FF0E0 !important; }
      .social-row a { color: #4DD0C4 !important; }
    }
  </style>
</head>
<body>
<div class="outer">
<div class="wrapper">

  <div class="header">
    <p class="kicker">Seat reserved &middot; DCCON 2026</p>
    <h1>You&#8217;re in for the Digital Clinic Conference</h1>
    <p>${TAGLINE} &middot; Live on YouTube</p>
  </div>

  <div class="body">
    <p class="greeting">Hi ${firstName},</p>
    <p>Your seat at the <strong>Digital Clinic Conference (DCCON)</strong> is reserved. This is a free, live-streamed clinic for skilled people whose careers have stalled. You&#8217;ll leave with a clear roadmap into paid, sustainable work, a practical way to position yourself so the right opportunities can find you, and one simple rule that protects your energy while you build wealth.</p>

    <div class="highlight-box">
      <p><strong>Date:</strong> ${EVENT_DATE}</p>
      <p><strong>Time:</strong> ${EVENT_TIME}</p>
      <p><strong>Venue:</strong> ${EVENT_VENUE}</p>
    </div>

    <p class="section-title">Add it to your calendar</p>
    <p>Save the date now so you get a reminder before we go live. We&#8217;ve also attached a calendar invite (<strong>DCCON-2026.ics</strong>). Open it to add DCCON to Apple Calendar or any other calendar app.</p>
    <a href="${googleCalendarUrl()}" class="cal-btn">+ Google Calendar</a>
    <a href="${outlookCalendarUrl()}" class="cal-btn">+ Outlook Calendar</a>

    <p class="tz">Outside Nigeria? DCCON runs 11:00 AM – 2:30 PM in Ghana, 12:00 – 3:30 PM in the UK, 1:00 – 4:30 PM in South Africa, 2:00 – 5:30 PM in Kenya, and 7:00 – 10:30 AM US Eastern time.</p>

    <p class="section-title">What happens next</p>

    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:14px;">
      <tr>
        <td width="38" valign="top">
          <div style="background:#14B8A6;color:#ffffff;width:28px;height:28px;text-align:center;line-height:28px;font-size:13px;font-weight:700;font-family:Arial,sans-serif;">1</div>
        </td>
        <td valign="top" style="padding-top:5px;">
          <span class="step-text"><strong>Join the DCC WhatsApp Channel.</strong> The live-stream link is posted there from ${LINK_DATE}, along with all event updates.</span>
        </td>
      </tr>
    </table>

    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:14px;">
      <tr>
        <td width="38" valign="top">
          <div style="background:#14B8A6;color:#ffffff;width:28px;height:28px;text-align:center;line-height:28px;font-size:13px;font-weight:700;font-family:Arial,sans-serif;">2</div>
        </td>
        <td valign="top" style="padding-top:5px;">
          <span class="step-text"><strong>Watch your inbox.</strong> We&#8217;ll also email you the YouTube live-stream link from ${LINK_DATE}.</span>
        </td>
      </tr>
    </table>

    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:28px;">
      <tr>
        <td width="38" valign="top">
          <div style="background:#14B8A6;color:#ffffff;width:28px;height:28px;text-align:center;line-height:28px;font-size:13px;font-weight:700;font-family:Arial,sans-serif;">3</div>
        </td>
        <td valign="top" style="padding-top:5px;">
          <span class="step-text"><strong>Show up ready.</strong> Join a few minutes early with a good power supply, enough data for 3.5 hours, and a notebook to write down the key principles you&#8217;ll apply. You can ask questions live.</span>
        </td>
      </tr>
    </table>

    <a href="${WHATSAPP_URL}" class="cta-btn">Join the WhatsApp Channel &#8594;</a>

    <p>Questions before the event? Reply to this email and the team will get back to you.</p>

    <p>Missed part of it? A replay will be available for 7 days after the event.</p>

    <p>See you on the stream.</p>

    <p>With excitement,<br><strong>The Idealnovate Africa &amp; PDU Africa Team</strong></p>

    <div class="social-row">
      <a href="https://instagram.com/idealnovate">Instagram</a> &middot;
      <a href="https://x.com/joinidealnovate">X (Twitter)</a> &middot;
      <a href="https://linkedin.com/company/idealnovate">LinkedIn</a> &middot;
      <a href="https://www.youtube.com/@idealnovate">YouTube</a>
    </div>
  </div>

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
    htmlBody:    htmlBody,
    name:        FROM_NAME,
    replyTo:     REPLY_TO,
    attachments: [icsBlob()]
  });
}
