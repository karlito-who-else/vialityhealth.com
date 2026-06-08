import { getPayload } from "payload";
import config from "../src/payload.config.js";

const API_KEY = "4dfe0e8a-72f7-48b4-a545-cebb7bc6df58";

const camelCase = (str: string): string =>
  str
    .replace(/[-_\s]+(.)?/g, (_, chr) => (chr ? chr.toUpperCase() : ""))
    .replace(/^(.)/, (_, chr) => chr.toLowerCase());

async function seedMcpApiKey() {
  const payload = await getPayload({ config });

  const { docs: users } = await payload.find({
    collection: "users",
    limit: 1,
    pagination: false,
  });

  if (users.length === 0) {
    console.error("No users found. Create a user first.");
    process.exit(1);
  }

  const user = users[0];
  console.log(`Using user: ${user.email}`);

  const { docs: existingKeys } = await payload.find({
    collection: "payload-mcp-api-keys",
    where: {
      and: [
        { user: { equals: user.id } },
      ],
    },
    limit: 10,
    pagination: false,
  });

  for (const key of existingKeys) {
    await payload.delete({
      collection: "payload-mcp-api-keys",
      id: key.id,
    });
    console.log(`Deleted existing API key: ${key.id}`);
  }

  const enabledCollections: Record<string, boolean> = {
    pages: true,
    categories: true,
    media: true,
    principles: true,
    faqs: true,
    ingredients: true,
    benefits: true,
    trustItems: true,
    shippingInfo: true,
    trustBadges: true,
    forms: true,
    "form-submissions": true,
    addresses: true,
    variants: true,
    variantTypes: true,
    variantOptions: true,
    products: true,
    carts: true,
    orders: true,
    transactions: true,
    "payload-mcp-api-keys": true,
    "payload-kv": true,
    "payload-locked-documents": true,
    "payload-preferences": true,
    "payload-migrations": true,
  };

  const data: Record<string, unknown> = {
    user: user.id,
    apiKey: API_KEY,
    enableAPIKey: true,
    label: "opencode dev",
    description: "API key for opencode AI coding tool",
  };

  const operations = ["find", "create", "update", "delete"];
  for (const slug of Object.keys(enabledCollections)) {
    const fieldName = camelCase(slug);
    const permissions: Record<string, boolean> = {};
    for (const op of operations) {
      permissions[op] = true;
    }
    data[fieldName] = permissions;
  }

  const result = await payload.create({
    collection: "payload-mcp-api-keys",
    data: data as never,
  });

  console.log(`Created MCP API key: ${result.id}`);
  console.log(`Label: ${result.label}`);
  console.log("API key is ready to use with opencode!");
}

seedMcpApiKey()
  .catch((err) => {
    console.error("Failed to seed MCP API key:", err);
    process.exit(1);
  });
