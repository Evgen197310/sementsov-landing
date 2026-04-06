import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST || "";
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "25", 10);
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";
const SMTP_FROM = process.env.SMTP_FROM || "";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://sementsov.ru";
const RECIPIENT_EMAIL = "vsementsov11@mail.ru";

function getTransporter() {
  const opts: nodemailer.TransportOptions & Record<string, unknown> = {
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    tls: { rejectUnauthorized: false },
  };
  if (SMTP_USER && SMTP_PASS) {
    opts.auth = { user: SMTP_USER, pass: SMTP_PASS };
  }
  return nodemailer.createTransport(opts);
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function sendContactNotification(data: {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
}): Promise<void> {
  if (!SMTP_HOST || !SMTP_FROM) {
    console.log("[mailer] SMTP not configured, skipping email");
    return;
  }

  const { name, email, phone, service, message } = data;

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e;">

      <div style="background:#0b1c2b;padding:24px 32px;border-radius:8px 8px 0 0;">
        <h1 style="color:#c9a962;margin:0;font-size:20px;font-weight:600;">МКА «Семенцов и Партнёры»</h1>
        <p style="color:#8b9caa;margin:4px 0 0;font-size:13px;">Новая заявка с сайта</p>
      </div>

      <div style="background:#ffffff;padding:32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px;">

        <table style="width:100%;border-collapse:collapse;font-size:15px;">
          <tr>
            <td style="padding:8px 12px;color:#64748b;font-weight:600;width:120px;vertical-align:top;">Имя:</td>
            <td style="padding:8px 12px;color:#1a1a2e;">${escapeHtml(name)}</td>
          </tr>
          <tr>
            <td style="padding:8px 12px;color:#64748b;font-weight:600;vertical-align:top;">Email:</td>
            <td style="padding:8px 12px;color:#1a1a2e;">
              <a href="mailto:${escapeHtml(email)}" style="color:#2563eb;text-decoration:none;">${escapeHtml(email)}</a>
            </td>
          </tr>
          ${phone ? `
          <tr>
            <td style="padding:8px 12px;color:#64748b;font-weight:600;vertical-align:top;">Телефон:</td>
            <td style="padding:8px 12px;color:#1a1a2e;">
              <a href="tel:${escapeHtml(phone.replace(/[^\d+]/g, ""))}" style="color:#2563eb;text-decoration:none;">${escapeHtml(phone)}</a>
            </td>
          </tr>
          ` : ""}
          ${service ? `
          <tr>
            <td style="padding:8px 12px;color:#64748b;font-weight:600;vertical-align:top;">Услуга:</td>
            <td style="padding:8px 12px;color:#1a1a2e;">${escapeHtml(service)}</td>
          </tr>
          ` : ""}
        </table>

        <div style="background:#f8fafc;border-left:4px solid #c9a962;padding:16px;margin:20px 0;border-radius:0 4px 4px 0;">
          <p style="margin:0;font-size:14px;color:#64748b;font-weight:600;">Сообщение:</p>
          <p style="margin:8px 0 0;font-size:15px;line-height:1.7;color:#1a1a2e;white-space:pre-wrap;">${escapeHtml(message)}</p>
        </div>

        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />

        <p style="font-size:12px;color:#94a3b8;margin:0;">
          Это письмо отправлено автоматически с сайта
          <a href="${SITE_URL}" style="color:#94a3b8;">sementsov.ru</a>
        </p>
      </div>

    </div>
  `;

  try {
    const transporter = getTransporter();
    await transporter.sendMail({
      from: `"МКА Семенцов и Партнёры" <${SMTP_FROM}>`,
      to: RECIPIENT_EMAIL,
      subject: `Заявка с сайта: ${name}`,
      html,
    });
    console.log("[mailer] Contact notification sent to", RECIPIENT_EMAIL);
  } catch (err) {
    console.error("[mailer] Failed to send contact notification:", err);
  }
}
