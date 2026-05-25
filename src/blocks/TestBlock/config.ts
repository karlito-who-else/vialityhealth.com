import type { Block } from "payload";

export const TestBlock: Block = {
  slug: "test-block",
  interfaceName: "TestBlock",
  fields: [
    {
      name: "title",
      type: "text",
    },
  ],
  labels: {
    plural: "Test Blocks",
    singular: "Test Block",
  },
};
