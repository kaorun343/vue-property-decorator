export default {
  input: 'lib/vue-property-decorator.js',
  output: {
    file: 'lib/vue-property-decorator.umd.js',
    format: 'umd',
    name: 'VuePropertyDecorator',
    globals: {
      vue: 'Vue',
      'vue-class-component': 'VueClassComponent',
    },
    exports: 'named',
  },
  external: ['vue', 'vue-class-component', 'reflect-metadata'],
}
