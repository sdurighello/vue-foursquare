module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    '@nuxtjs',
    'plugin:vue/essential'
  ],
  plugins: [
    // 'prettier'
  ],
  // add your custom rules here
  rules: {
    'no-param-reassign': 0,
    'no-multi-assign': 0,
    'indent': ["error", 4, { "SwitchCase": 1 }],
    'import/first': 0,
    'no-console': 0,
    'no-tabs': 0,
    'vue/html-indent': ["error", 4]
  }
}
