import "react";

declare module "react" {
  interface HTMLAttributes<T> {
    toolname?: string;
    tooldescription?: string;
    toolautosubmit?: "" | true;
    toolparamdescription?: string;
  }
}
