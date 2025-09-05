import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      // any 타입 사용 금지
      "@typescript-eslint/no-explicit-any": "error",
      // 사용하지 않는 import 제거
      "@typescript-eslint/no-unused-vars": "error",
      // 명명 컨벤션
      "@typescript-eslint/naming-convention": [
        "error",
        {
          "selector": "default",
          "format": ["camelCase"]
        },
        {
          "selector": "variable",
          "format": ["camelCase", "UPPER_CASE"]
        },
        {
          "selector": "function",
          "format": ["camelCase", "PascalCase"]
        },
        {
          "selector": "typeLike",
          "format": ["PascalCase"]
        },
        {
          "selector": "import",
          "format": null
        },
        {
          "selector": "parameterProperty",
          "modifiers": ["private", "readonly"],
          "format": ["camelCase"],
          "leadingUnderscore": "allow"
        },
        {
          "selector": "objectLiteralProperty",
          "format": ["camelCase", "PascalCase", "UPPER_CASE"],
          "leadingUnderscore": "allow"
        }
      ]
    }
  }
];

export default eslintConfig;
