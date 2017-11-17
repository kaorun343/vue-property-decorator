export default {
  input: 'lib/vue-property-decorator.js',
  name: 'VuePropertyDecorator',
  output: {
    file: 'lib/vue-property-decorator.umd.js',
    format: 'umd'
  },
  external: [
    'vue', 'vue-class-component', 'reflect-metadata'
  ],
  exports: 'named',
  name: 'vue-property-decorator',
  globals: {
    'vue': 'Vue',
    'vue-class-component': 'VueClassComponent'
  }
}
