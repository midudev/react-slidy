module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        loose: true,
        modules: process.env.BABEL_ENV === 'test' ? 'commonjs' : 'auto'
      }
    ]
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-syntax-jsx',
    '@babel/plugin-syntax-dynamic-import'
  ]
}
