import React from "react";

import { Grid } from "@/components/Grid";

export default function Loading() {
  return (
    <Grid className="grid-cols-2 lg:grid-cols-3">
      {Array(12)
        .fill(0)
        .map((_, index) => {
          return <div className="animate-pulse bg-muted" key={index} />;
        })}
    </Grid>
  );
}
