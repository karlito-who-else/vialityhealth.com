// eslint-disable-next-line typescript/no-restricted-imports
import NextLink from "next/link";
import type { ComponentProps } from "react";

type LinkProps = ComponentProps<typeof NextLink>;

export const Link = (props: LinkProps) => <NextLink {...props} />;
