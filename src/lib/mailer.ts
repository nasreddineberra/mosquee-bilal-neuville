import nodemailer, { type Transporter } from 'nodemailer';
import fs from 'fs';
import path from 'path';

let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (!transporter) {
    const port = Number(process.env.SMTP_PORT ?? 587);
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return transporter;
}

export async function sendMail(to: string, subject: string, html: string) {
  const t = getTransporter();
  return t.sendMail({
    from: `"${process.env.MAIL_FROM_NAME ?? 'Mosquée Bilal'}" <${process.env.MAIL_FROM_EMAIL}>`,
    to,
    subject,
    html,
  });
}

// Convertit du texte brut en paragraphes HTML
// Double saut de ligne -> nouveau <p>, simple saut de ligne -> <br>
export function textToHtmlParagraphs(text: string): string {
  return text
    .trim()
    .split(/\n\s*\n/)
    .map((para) => {
      const escaped = para
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '<br>');
      return `<p style="margin:0 0 16px 0;font-size:14px;line-height:1.6;color:#111C2D;">${escaped}</p>`;
    })
    .join('\n');
}

// Construit le HTML complet de la newsletter a partir du template
export function buildNewsletterHtml(sujet: string, corpsTexte: string, unsubscribeUrl: string): string {
  const templatePath = path.join(process.cwd(), 'supabase', 'email-templates', 'newsletter.html');
  let template = fs.readFileSync(templatePath, 'utf-8');
  const corpsHtml = textToHtmlParagraphs(corpsTexte);
  const sujetEscaped = sujet.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  template = template.replace(/\{\{SUJET\}\}/g, sujetEscaped);
  template = template.replace(/\{\{CORPS_HTML\}\}/g, corpsHtml);
  template = template.replace(/\{\{UNSUBSCRIBE_URL\}\}/g, unsubscribeUrl);
  return template;
}
