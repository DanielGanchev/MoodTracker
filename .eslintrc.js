module.exports = {
  extends: ['next/core-web-vitals'],
  rules: {
    // Temporarily disable these rules during build
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
  },
}
