import type { Block } from "payload";

export const VialityCompliance: Block = {
  slug: "vialityCompliance",
  interfaceName: "VialityComplianceBlock",
  fields: [
    {
      name: "text",
      type: "textarea",
      defaultValue:
        "These statements have not been evaluated by the Food and Drug Administration. These products are not intended to diagnose, treat, cure, or prevent any disease. Individual results may vary. Always consult your healthcare provider before beginning any new wellness routine.",
    },
  ],
  labels: {
    plural: "Viality Compliances",
    singular: "Viality Compliance",
  },
};
