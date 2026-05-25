import config from "@payload-config";
import { headers } from "next/headers";
import { createLocalReq, getPayload } from "payload";

import { checkRole } from "@/access/utilities";
import { seedVialityMarketing } from "@/endpoints/seed/viality-marketing";

export const maxDuration = 300;

export async function POST(): Promise<Response> {
  const payload = await getPayload({ config });
  const requestHeaders = await headers();

  const { user } = await payload.auth({ headers: requestHeaders });

  if (!user || !checkRole(["admin"], user)) {
    return new Response("Action forbidden.", { status: 403 });
  }

  try {
    const payloadReq = await createLocalReq({ user }, payload);
    await seedVialityMarketing({ payload, req: payloadReq });
    return Response.json({ success: true });
  } catch (e) {
    payload.logger.error({ err: e, message: "Error seeding viality marketing data" });
    return new Response("Error seeding data.", { status: 500 });
  }
}
