import React from "react";

import { PhilosophySection } from "@/components/viality";
import type { VialityPhilosophyBlock as VialityPhilosophyBlockProps } from "@/payload-types";

export const VialityPhilosophyBlock: React.FC<VialityPhilosophyBlockProps> = (props) => {
  const { body, link, blockName: _blockName, blockType: _blockType, id: _id, ...rest } = props;
  return <PhilosophySection {...rest} body={body} link={link} />;
};
