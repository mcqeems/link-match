'use server';

import nodemailer from 'nodemailer';

type SendEmailOptions = {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  replyTo?: string;
};

// Create a singleton transporter; Gmail requires either OAuth2 or App Password (preferred)
let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (transporter) return transporter;

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_PASS;

  if (!user || !pass) {
    throw new Error('GMAIL_USER and GMAIL_PASS must be set in environment variables.');
  }

  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user,
      pass,
    },
  });

  return transporter;
}

export async function sendEmail({ to, subject, html, text, replyTo }: SendEmailOptions) {
  const tx = getTransporter();
  const from = process.env.EMAIL_FROM || process.env.GMAIL_USER!;

  await tx.sendMail({
    from,
    to,
    subject,
    text,
    html,
    replyTo,
  });
}

export async function sendConnectionRequestEmail(params: {
  toEmail: string;
  toName?: string | null;
  fromName: string;
  fromProfileUrl?: string;
  fromMessagesUrl?: string;
}) {
  const { toEmail, toName, fromName, fromProfileUrl, fromMessagesUrl } = params;

  const subject = `${fromName} wants to connect with you on LinkMatch`;
  const greeting = toName ? `Hi ${toName},` : 'Hi,';
  const profileLink = fromProfileUrl
    ? `<p>View profile: <a href="${fromProfileUrl}" target="_blank" rel="noreferrer">${fromProfileUrl}</a></p>`
    : '';
  const messageLink = fromMessagesUrl
    ? `<p>View message: <a href="${fromMessagesUrl}" target="_blank" rel="noreferrer">${fromMessagesUrl}</a></p>`
    : '';

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif; line-height:1.6; color:#111;">
      <h2 style="margin:0 0 12px">New connection request</h2>
      <p style="margin:0 0 12px">${greeting}</p>
      <p style="margin:0 0 12px"><strong>${fromName}</strong> would like to connect with you on <strong>LinkMatch</strong>.</p>
      ${messageLink}
      <p style="margin:16px 0 0">You can reply directly in LinkMatch messages.</p>
      <hr style="margin:20px 0; border:none; border-top:1px solid #eee"/>
      <p style="font-size:12px; color:#666; margin:0">This email was sent by LinkMatch notifications.</p>
    </div>
  `;

  const text = `${toName ? `Hi ${toName},` : 'Hi,'}\n\n${fromName} would like to connect with you on LinkMatch.
    \nView message: ${fromMessagesUrl}
  }\n\nYou can reply directly in LinkMatch messages.`;

  await sendEmail({ to: toEmail, subject, html, text });
}
