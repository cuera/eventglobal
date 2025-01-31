import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import nextPlugin from '@next/eslint-plugin-next'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    plugins: {
      '@next/next': nextPlugin
    },
    rules: {
      '@typescript-eslint/no-empty-interface': 'off',
      '@next/next/no-img-element': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'jsx-a11y/alt-text': 'error',
      '@typescript-eslint/no-empty-object-type': 'off'
    }
  }
];

export default eslintConfig;
