import type { CodegenConfig } from "@graphql-codegen/cli";
// Offline generation intentionally reads the sibling backend's authoritative SDL.
// eslint-disable-next-line import/no-relative-packages
import { standaloneGameSchema } from "../daicer/src/lifecycle/graphql/game-contract";

const config: CodegenConfig = {
  overwrite: true,
  schema: standaloneGameSchema,
  documents: "src/features/play/operations.graphql",
  generates: {
    "src/features/play/generated.ts": {
      plugins: ["typescript", "typescript-operations", "typed-document-node"],
      config: { useTypeImports: true, strictScalars: true },
    },
  },
};
export default config;
