import type { CollectionAfterChangeHook } from "payload";

import { getDesignTokens } from "@/email/getDesignTokens";
import { accountCreatedTemplate } from "@/email/templates";

export const sendAccountCreatedEmail: CollectionAfterChangeHook = async ({
  doc,
  operation,
  req,
}) => {
  if (operation !== "create") return;

  const name = doc.name || doc.email;

  try {
    const tokens = await getDesignTokens({ payload: req.payload, req });

    await req.payload.sendEmail({
      to: doc.email,
      subject: "Welcome to Viality",
      html: accountCreatedTemplate(name, tokens),
      from: "hello@mail.vialityhealth.com",
      replyTo: "hello@vialityhealth.com",
    });
  } catch (err) {
    req.payload.logger.error({ msg: "Failed to send account creation email", err });
  }
};
