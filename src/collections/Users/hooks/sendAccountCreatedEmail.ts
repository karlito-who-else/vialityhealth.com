import type { CollectionAfterChangeHook } from "payload";

import { accountCreatedTemplate } from "@/email/templates";

export const sendAccountCreatedEmail: CollectionAfterChangeHook = async ({
  doc,
  operation,
  req,
}) => {
  if (operation !== "create") return;

  const name = doc.name || doc.email;

  try {
    await req.payload.sendEmail({
      to: doc.email,
      subject: "Welcome to Viality",
      html: accountCreatedTemplate(name),
    });
  } catch (err) {
    req.payload.logger.error({ msg: "Failed to send account creation email", err });
  }
};
