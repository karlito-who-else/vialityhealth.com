import React from "react";

import { WaitlistSection } from "@/components/viality";
import type { VialityWaitlistBlock as VialityWaitlistBlockProps } from "@/payload-types";

export const VialityWaitlistBlock: React.FC<VialityWaitlistBlockProps> = (props) => {
  const { heading, body, placeholder, buttonLabel, blockName, blockType, id, ...rest } = props;
  return (
    <WaitlistSection
      {...rest}
      heading={heading || "Begin your daily reset."}
      body={body}
      placeholder={placeholder || "YOUR EMAIL ADDRESS"}
      buttonLabel={buttonLabel || "Join Waitlist"}
    />
  );
};
