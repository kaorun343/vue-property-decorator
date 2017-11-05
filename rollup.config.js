export default {
  entry: 'lib/vue-property-decorator.js',
  format: 'umd',
  moduleName: 'VuePropertyDecorator',
  dest: 'lib/vue-property-decorator.umd.js',
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
