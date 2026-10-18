import type { SizeLimitConfig } from "size-limit";

export default [
  {
    limit: "310B",
    path: "./dist/index.mjs",
  },
] satisfies SizeLimitConfig;
