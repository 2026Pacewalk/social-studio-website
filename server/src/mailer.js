import nodemailer from 'nodemailer';

let transporter = null;
if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 465),
    secure: String(process.env.SMTP_SECURE ?? 'true') === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  console.log('[mailer] SMTP configured:', process.env.SMTP_HOST);
} else {
  console.log('[mailer] SMTP not configured — lead emails disabled (leads are still saved).');
}

const esc = (s) => String(s ?? '').replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));

export async function sendLeadAlert(lead) {
  if (!transporter) return;
  const to = (process.env.LEAD_ALERT_TO || process.env.ADMIN_EMAIL || '').split(',').map((s) => s.trim()).filter(Boolean);
  if (!to.length) return;
  const rows = [
    ['Name', lead.name], ['Email', lead.email], ['Phone', lead.phone],
    ['Service', lead.service], ['Preferred Date', lead.event_date],
    ['Brand / Company', lead.brand], ['Budget', lead.budget], ['Message', lead.message],
  ].filter(([, v]) => v)
    .map(([k, v]) => `<tr><td style="padding:6px 12px;color:#888;font-weight:600">${k}</td><td style="padding:6px 12px">${esc(v)}</td></tr>`)
    .join('');
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      replyTo: lead.email || undefined,
      subject: `New ${lead.service || 'enquiry'} — socialstudios.in`,
      html: `<h2 style="font-family:sans-serif">New enquiry from socialstudios.in</h2>
        <table style="font-family:sans-serif;border-collapse:collapse;font-size:14px">${rows}</table>
        <p style="font-family:sans-serif;color:#999;font-size:12px">View it in your admin dashboard.</p>`,
    });
  } catch (e) {
    console.error('[mailer] failed to send lead alert:', e.message);
  }
}
