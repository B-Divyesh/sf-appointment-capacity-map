import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist/**', 'node_modules/**', '.factory/evidence/**'] },
  {
    files: ['src/**/*.ts', 'e2e/**/*.ts', '*.ts'],
    extends: [...tseslint.configs.recommended],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off'
    }
  }
)
