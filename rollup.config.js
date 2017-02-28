import typescript from 'rollup-plugin-typescript'

export default {
  entry: './src/vue-property-decorator.ts',
  dest: './lib/vue-property-decorator.js',
  format: 'cjs',
  external: ['vue', 'vue-class-component', 'reflect-metadata'],
  plugins: [
    typescript({
      typescript: require('typescript')
    })
  ]
}
