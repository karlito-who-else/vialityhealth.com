import Tagada from "@tagadapay/node-sdk";

import { env } from "@/utilities/env";

export const getTagadaClient = () => {
  const apiKey = env.TAGADAPAY_API_KEY;
  const storeId = env.TAGADAPAY_STORE_ID;

  if (!apiKey || !storeId) {
    return null;
  }

  const tagada = new Tagada(apiKey);

  return { tagada, storeId };
};
