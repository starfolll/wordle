import antfu from '@antfu/eslint-config'

export default antfu({
  vue: true,

  typescript: {
    overrides: {
      'ts/consistent-type-definitions': ['error', 'type'],
    },
  },

  rules: {
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
  },
})
