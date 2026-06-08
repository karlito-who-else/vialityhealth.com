const baseTemplate = (content: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:40px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;">
          <tr>
            <td style="background-color:#0b3d2c;padding:32px 40px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:700;letter-spacing:-0.5px;">Viality</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;font-size:16px;line-height:1.6;color:#333333;">
              ${content}
            </td>
          </tr>
          <tr>
            <td style="background-color:#f9f9f9;padding:24px 40px;text-align:center;border-top:1px solid #e5e5e5;">
              <p style="margin:0;font-size:13px;color:#888888;">
                Viality Health<br>
                <a href="https://vialityhealth.com" style="color:#0b3d2c;text-decoration:none;">vialityhealth.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

export const passwordResetTemplate = (name: string, resetURL: string): string =>
  baseTemplate(`
    <h2 style="margin:0 0 16px;font-size:20px;color:#0b3d2c;">Reset your password</h2>
    <p style="margin:0 0 20px;">Hi ${name},</p>
    <p style="margin:0 0 20px;">We received a request to reset the password for your Viality account. Click the button below to set a new password.</p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
      <tr>
        <td style="background-color:#0b3d2c;border-radius:6px;">
          <a href="${resetURL}" style="display:inline-block;padding:14px 32px;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;">Reset Password</a>
        </td>
      </tr>
    </table>
    <p style="margin:0 0 20px;">Or copy this link into your browser:</p>
    <p style="margin:0 0 20px;word-break:break-all;font-size:14px;color:#0b3d2c;">${resetURL}</p>
    <p style="margin:0 0 8px;font-size:14px;color:#888888;">If you didn't request this, you can safely ignore this email.</p>
    <p style="margin:0;font-size:14px;color:#888888;">This link expires in 24 hours.</p>
  `);

export const accountCreatedTemplate = (name: string): string =>
  baseTemplate(`
    <h2 style="margin:0 0 16px;font-size:20px;color:#0b3d2c;">Welcome to Viality</h2>
    <p style="margin:0 0 20px;">Hi ${name},</p>
    <p style="margin:0 0 20px;">Your account has been created successfully. You can now browse our range of supplements, track your orders, and manage your preferences.</p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
      <tr>
        <td style="background-color:#0b3d2c;border-radius:6px;">
          <a href="https://vialityhealth.com/shop" style="display:inline-block;padding:14px 32px;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;">Start Shopping</a>
        </td>
      </tr>
    </table>
    <p style="margin:0;font-size:14px;color:#888888;">If you have any questions, feel free to <a href="https://vialityhealth.com/contact" style="color:#0b3d2c;">contact us</a>.</p>
  `);

export const orderConfirmationTemplate = (
  name: string,
  orderID: string,
  items: { title: string; quantity: number; price: string }[],
  total: string,
  orderURL: string,
): string =>
  baseTemplate(`
    <h2 style="margin:0 0 16px;font-size:20px;color:#0b3d2c;">Order confirmed</h2>
    <p style="margin:0 0 20px;">Hi ${name},</p>
    <p style="margin:0 0 20px;">Thank you for your order! We're processing it now. Here's a summary:</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;border-collapse:collapse;">
      <tr>
        <td style="padding:0 0 8px;font-size:14px;color:#888888;">Order #${orderID}</td>
        <td style="padding:0 0 8px;font-size:14px;color:#888888;text-align:right;">${new Date().toLocaleDateString()}</td>
      </tr>
      ${items.map((item) => `
        <tr>
          <td style="padding:8px 0;border-top:1px solid #e5e5e5;font-size:15px;">${item.title} <span style="color:#888888;">× ${item.quantity}</span></td>
          <td style="padding:8px 0;border-top:1px solid #e5e5e5;font-size:15px;text-align:right;">${item.price}</td>
        </tr>
      `).join("")}
      <tr>
        <td style="padding:12px 0 0;border-top:2px solid #0b3d2c;font-size:16px;font-weight:700;">Total</td>
        <td style="padding:12px 0 0;border-top:2px solid #0b3d2c;font-size:16px;font-weight:700;text-align:right;">${total}</td>
      </tr>
    </table>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
      <tr>
        <td style="background-color:#0b3d2c;border-radius:6px;">
          <a href="${orderURL}" style="display:inline-block;padding:14px 32px;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;">View Order</a>
        </td>
      </tr>
    </table>
    <p style="margin:0;font-size:14px;color:#888888;">We'll send you an update when your order ships.</p>
  `);

export const orderStatusTemplate = (
  name: string,
  orderID: string,
  status: string,
  orderURL: string,
): string =>
  baseTemplate(`
    <h2 style="margin:0 0 16px;font-size:20px;color:#0b3d2c;">Order status update</h2>
    <p style="margin:0 0 20px;">Hi ${name},</p>
    <p style="margin:0 0 20px;">Your order <strong>#${orderID}</strong> has been updated to:</p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
      <tr>
        <td style="background-color:#0b3d2c;border-radius:6px;padding:12px 24px;">
          <span style="color:#ffffff;font-size:16px;font-weight:600;text-transform:capitalize;">${status}</span>
        </td>
      </tr>
    </table>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
      <tr>
        <td style="background-color:#0b3d2c;border-radius:6px;">
          <a href="${orderURL}" style="display:inline-block;padding:14px 32px;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;">View Order</a>
        </td>
      </tr>
    </table>
    <p style="margin:0;font-size:14px;color:#888888;">If you have any questions about this update, <a href="https://vialityhealth.com/contact" style="color:#0b3d2c;">contact us</a>.</p>
  `);
