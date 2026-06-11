export type DesignTokens = {
  logoHTML: string;
};

const bg = "#f5f2ed";
const cardBg = "#faf8f5";
const foreground = "#272c35";
const muted = "#7a7f8a";
const border = "#e6e0d6";
const accent = "#d4c8ac";
const accentForeground = "#272c35";
const fontFamily = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const radius = "6px";

const baseTemplate = (content: string, tokens: DesignTokens) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background-color:${bg};font-family:${fontFamily};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${bg};padding:40px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:${cardBg};border-radius:${radius};overflow:hidden;">
          <tr>
            <td style="padding:32px 40px;text-align:center;">
              ${tokens.logoHTML}
            </td>
          </tr>
          <tr>
            <td style="padding:0 40px 40px;font-size:16px;line-height:1.6;color:${foreground};">
              ${content}
            </td>
          </tr>
          <tr>
            <td style="background-color:${bg};padding:24px 40px;text-align:center;border-top:1px solid ${border};">
              <p style="margin:0;font-size:13px;color:${muted};">
                Viality Health<br>
                <a href="https://vialityhealth.com" style="color:${foreground};text-decoration:none;">vialityhealth.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

const button = (href: string, label: string) => `
  <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
    <tr>
      <td style="background-color:${foreground};border-radius:${radius};">
        <a href="${href}" style="display:inline-block;padding:14px 32px;color:${cardBg};text-decoration:none;font-size:15px;font-weight:600;">${label}</a>
      </td>
    </tr>
  </table>`;

export const logoMarkup = (logoURL: string, alt: string) =>
  `<img src="${logoURL}" alt="${alt}" style="height:32px;width:auto;display:block;margin:0 auto;" />`;

export const textLogoMarkup = (siteName: string) =>
  `<h1 style="color:${foreground};margin:0;font-size:22px;font-weight:700;letter-spacing:-0.5px;">${siteName}</h1>`;

export type BankTransferSettings = {
  bankTransferHeading?: string | null;
  bankTransferNote?: string | null;
  bankName?: string | null;
  accountName?: string | null;
  accountNumber?: string | null;
  routingNumber?: string | null;
  swiftCode?: string | null;
  bankTransferFooter?: string | null;
};

const bankTransferInfoHTML = (settings: BankTransferSettings, amount?: number | null): string => {
  const hasDetails = settings.bankName || settings.accountName || settings.accountNumber || settings.routingNumber || settings.swiftCode;
  if (!hasDetails) return "";

  const rows: string[] = [];

  if (settings.bankName) {
    rows.push(`<tr><td style="padding:2px 0;font-size:13px;font-weight:600;color:${muted};">Bank</td></tr>
<tr><td style="padding:0 0 6px;font-size:15px;">${settings.bankName}</td></tr>`);
  }
  if (settings.accountName) {
    rows.push(`<tr><td style="padding:2px 0;font-size:13px;font-weight:600;color:${muted};">Account Name</td></tr>
<tr><td style="padding:0 0 6px;font-size:15px;">${settings.accountName}</td></tr>`);
  }
  if (settings.accountNumber) {
    rows.push(`<tr><td style="padding:2px 0;font-size:13px;font-weight:600;color:${muted};">Account Number</td></tr>
<tr><td style="padding:0 0 6px;font-size:15px;">${settings.accountNumber}</td></tr>`);
  }
  if (settings.routingNumber) {
    rows.push(`<tr><td style="padding:2px 0;font-size:13px;font-weight:600;color:${muted};">Routing / Sort Code / BSB</td></tr>
<tr><td style="padding:0 0 6px;font-size:15px;">${settings.routingNumber}</td></tr>`);
  }
  if (settings.swiftCode) {
    rows.push(`<tr><td style="padding:2px 0;font-size:13px;font-weight:600;color:${muted};">SWIFT / BIC</td></tr>
<tr><td style="padding:0 0 6px;font-size:15px;">${settings.swiftCode}</td></tr>`);
  }

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;background-color:${bg};border-radius:${radius};">
      <tr>
        <td style="padding:20px;">
          <h3 style="margin:0 0 8px;font-size:16px;font-weight:600;color:${foreground};">${settings.bankTransferHeading || "Bank Transfer"}</h3>
          ${settings.bankTransferNote ? `<p style="margin:0 0 12px;font-size:14px;color:${muted};">${settings.bankTransferNote}</p>` : ""}
          <table role="presentation" cellpadding="0" cellspacing="0">
            ${rows.join("")}
          </table>
          ${settings.bankTransferFooter ? `<p style="margin:12px 0 0;font-size:12px;color:${muted};">${settings.bankTransferFooter}</p>` : ""}
          ${amount ? `
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;border-top:1px solid ${border};">
            <tr>
              <td style="padding:12px 0 0;font-size:15px;font-weight:700;color:${foreground};">Total to transfer</td>
              <td style="padding:12px 0 0;font-size:15px;font-weight:700;color:${foreground};text-align:right;">AUD ${(amount / 100).toFixed(2)}</td>
            </tr>
          </table>` : ""}
        </td>
      </tr>
    </table>`;
};

export const formatStatus = (status: string): string =>
  status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export const passwordResetTemplate = (name: string, resetURL: string, tokens: DesignTokens): string =>
  baseTemplate(`
    <h2 style="margin:0 0 16px;font-size:20px;color:${foreground};font-weight:600;">Reset your password</h2>
    <p style="margin:0 0 20px;">Hi ${name},</p>
    <p style="margin:0 0 20px;">We received a request to reset the password for your account. Click the button below to set a new password.</p>
    ${button(resetURL, "Reset Password")}
    <p style="margin:0 0 20px;">Or copy this link into your browser:</p>
    <p style="margin:0 0 20px;word-break:break-all;font-size:14px;color:${foreground};">${resetURL}</p>
    <p style="margin:0 0 8px;font-size:14px;color:${muted};">If you didn't request this, you can safely ignore this email.</p>
    <p style="margin:0;font-size:14px;color:${muted};">This link expires in 24 hours.</p>
  `, tokens);

export const accountCreatedTemplate = (name: string, tokens: DesignTokens): string =>
  baseTemplate(`
    <h2 style="margin:0 0 16px;font-size:20px;color:${foreground};font-weight:600;">Welcome to Viality</h2>
    <p style="margin:0 0 20px;">Hi ${name},</p>
    <p style="margin:0 0 20px;">Your account has been created successfully. You can now browse our range of supplements, track your orders, and manage your preferences.</p>
    ${button("https://vialityhealth.com/shop", "Start Shopping")}
    <p style="margin:0;font-size:14px;color:${muted};">If you have any questions, feel free to <a href="https://vialityhealth.com/contact" style="color:${foreground};">contact us</a>.</p>
  `, tokens);

export const orderConfirmationTemplate = (
  name: string,
  orderID: string,
  items: { title: string; quantity: number; price: string }[],
  total: string,
  orderURL: string,
  tokens: DesignTokens,
  bankTransferSettings?: BankTransferSettings | null,
  amount?: number | null,
): string =>
  baseTemplate(`
    <h2 style="margin:0 0 16px;font-size:20px;color:${foreground};font-weight:600;">Order confirmed</h2>
    <p style="margin:0 0 20px;">Hi ${name},</p>
    <p style="margin:0 0 20px;">Thank you for your order! We're processing it now. Here's a summary:</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;border-collapse:collapse;">
      <tr>
        <td style="padding:0 0 8px;font-size:14px;color:${muted};">Order #${orderID}</td>
        <td style="padding:0 0 8px;font-size:14px;color:${muted};text-align:right;">${new Date().toLocaleDateString()}</td>
      </tr>
      ${items.map((item) => `
        <tr>
          <td style="padding:8px 0;border-top:1px solid ${border};font-size:15px;">${item.title} <span style="color:${muted};">× ${item.quantity}</span></td>
          <td style="padding:8px 0;border-top:1px solid ${border};font-size:15px;text-align:right;">${item.price}</td>
        </tr>
      `).join("")}
      <tr>
        <td style="padding:12px 0 0;border-top:2px solid ${foreground};font-size:16px;font-weight:700;">Total</td>
        <td style="padding:12px 0 0;border-top:2px solid ${foreground};font-size:16px;font-weight:700;text-align:right;">${total}</td>
      </tr>
    </table>
    ${bankTransferSettings ? bankTransferInfoHTML(bankTransferSettings, amount) : ""}
    ${button(orderURL, "View Order")}
    <p style="margin:0;font-size:14px;color:${muted};">We'll send you an update when your order ships.</p>
  `, tokens);

export const orderStatusTemplate = (
  name: string,
  orderID: string,
  status: string,
  orderURL: string,
  tokens: DesignTokens,
  shippingTrackingUrl?: string,
  shippingLabels?: { url: string; alt: string }[],
  bankTransferSettings?: BankTransferSettings | null,
  amount?: number | null,
): string =>
  baseTemplate(`
    <h2 style="margin:0 0 16px;font-size:20px;color:${foreground};font-weight:600;">Order status update</h2>
    <p style="margin:0 0 20px;">Hi ${name},</p>
    <p style="margin:0 0 20px;">Your order <strong>#${orderID}</strong> has been updated to:</p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
      <tr>
        <td style="background-color:${accent};border-radius:${radius};padding:12px 24px;">
          <span style="color:${accentForeground};font-size:16px;font-weight:600;">${formatStatus(status)}</span>
        </td>
      </tr>
    </table>
    ${bankTransferSettings ? bankTransferInfoHTML(bankTransferSettings, amount) : ""}
    ${shippingTrackingUrl ? `
    <h3 style="margin:0 0 12px;font-size:16px;color:${foreground};font-weight:600;">Tracking</h3>
    <p style="margin:0 0 24px;">
      <a href="${shippingTrackingUrl}" style="color:${foreground};text-decoration:underline;">Track your shipment</a>
    </p>` : ""}
    ${shippingLabels?.length ? `
    <h3 style="margin:0 0 12px;font-size:16px;color:${foreground};font-weight:600;">Shipping Labels</h3>
    <p style="margin:0 0 20px;font-size:14px;color:${muted};">Images of the shipping labels attached to your package:</p>
    ${shippingLabels.map((label) => `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 16px;">
      <tr>
        <td style="background-color:${bg};border-radius:${radius};padding:8px;">
          <img src="${label.url}" alt="${label.alt}" style="display:block;max-width:100%;height:auto;border-radius:4px;" />
        </td>
      </tr>
    </table>`).join("")}` : ""}
    ${button(orderURL, "View Order")}
    <p style="margin:0;font-size:14px;color:${muted};">If you have any questions about this update, <a href="https://vialityhealth.com/contact" style="color:${foreground};">contact us</a>.</p>
  `, tokens);
