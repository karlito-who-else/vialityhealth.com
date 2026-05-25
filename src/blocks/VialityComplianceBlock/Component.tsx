import React from "react";

import { ComplianceSection } from "@/components/viality";
import type { VialityComplianceBlock as VialityComplianceBlockProps } from "@/payload-types";

export const VialityComplianceBlock: React.FC<VialityComplianceBlockProps> = (props) => {
  const { text, blockName, blockType, id, ...rest } = props;
  return (
    <section {...rest}>
      <ComplianceSection text={text} />
    </section>
  );
};
