"use server";

/* oxlint-disable node/no-process-env */

import { z } from "zod/v4";
import { actionClient } from "@/lib/safe-action";

const schema = z.object({
  email: z.string().email(),
});

export const subscribeToWaitlist = actionClient
  .inputSchema(schema)
  .action(async ({ parsedInput: { email } }) => {
    const apiKey = process.env.KLAVIYO_PRIVATE_KEY;
    const listId = process.env.KLAVIYO_LIST_ID_NEWSLETTER;
    const revision = process.env.NEXT_PUBLIC_KLAVIYO_API_REVISION;

    if (!apiKey || !listId || !revision) {
      throw new Error("Missing Klaviyo configuration");
    }

    const headers = {
      "Content-Type": "application/vnd.api+json",
      Authorization: `Klaviyo-API-Key ${apiKey}`,
      revision,
    };

    const profileRes = await fetch("https://a.klaviyo.com/api/profiles/", {
      method: "POST",
      headers,
      body: JSON.stringify({
        data: {
          type: "profile",
          attributes: { email },
        },
      }),
    });

    if (!profileRes.ok) {
      const body = await profileRes.text();
      console.error("Klaviyo create profile failed", profileRes.status, body);
      throw new Error("Failed to create profile");
    }

    const profileData = await profileRes.json() as { data: { id: string } };
    const profileId = profileData.data.id;

    const listRes = await fetch(
      `https://a.klaviyo.com/api/lists/${listId}/relationships/profiles/`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          data: [{ type: "profile", id: profileId }],
        }),
      },
    );

    if (!listRes.ok) {
      const body = await listRes.text();
      console.error("Klaviyo add to list failed", listRes.status, body);
      throw new Error("Failed to add profile to list");
    }

    return { success: true, email };
  });
