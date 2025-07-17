import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const filename = fileURLToPath(import.meta.url);
const dirname = dirname(filename);

const compat = new FlatCompat({
  baseDirectory: dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
