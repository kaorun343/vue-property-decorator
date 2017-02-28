export default {
  entry: './lib/vue-property-decorator.js',
  dest: './lib/vue-property-decorator.common.js',
  format: 'cjs',
  external: ['vue', 'vue-class-component', 'reflect-metadata']
}
