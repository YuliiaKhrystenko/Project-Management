import pluginVue from 'eslint-plugin-vue'
import vueTsEslintConfig from '@vue/eslint-config-typescript'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },
  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
  },
  {
    name: 'app/vue-config',
    files: ['**/*.vue'],
    rules: {
      ...pluginVue.configs['flat/essential'].rules,
      ...skipFormatting.rules,
    },
  },
  {
    name: 'app/typescript-config',
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      ...vueTsEslintConfig().rules,
      ...skipFormatting.rules,
    },
  },
]
