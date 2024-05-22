module.exports = {
  'env': {
    'browser': true,
    'es2021': true
  },
  'extends': [
    'naat',
    'plugin:vue/vue3-strongly-recommended',
    'plugin:storybook/recommended'
  ],
  'overrides': [
    {
      files: ['*.vue'],
      rules: {
        // 300 lines limit seems to short for *.vue files
        'max-lines': 'off'
      }
    }
  ],
  'rules': {
    'vue/multi-word-component-names': 'off'
  }
};
