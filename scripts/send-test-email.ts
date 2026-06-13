import fs from "node:fs";
import { getPayload } from "payload";
import config from "../src/payload.config.js";
import { getDesignTokens } from "../src/email/getDesignTokens.js";
import { accountCreatedTemplate } from "../src/email/templates.js";

async function sendTestEmail() {
  const payload = await getPayload({ config });
  const tokens = await getDesignTokens({ payload });

  const html = accountCreatedTemplate("Karl", tokens);

  const outPath = "email-previews/test-email-logo.html";
  fs.writeFileSync(outPath, html);
  console.log(`Preview written to ${outPath}`);

  await payload.sendEmail({
    to: "karl.podger@gmail.com",
    subject: "Test email from Viality — emailLogo verification",
    html,
  });

  console.log("Test email sent successfully.");
  console.log("Logo HTML used:", tokens.logoHTML.substring(0, 100) + "...");
}

sendTestEmail().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});

sendTestEmail().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
