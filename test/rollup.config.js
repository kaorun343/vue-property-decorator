import commonjs from 'rollup-plugin-commonjs'
import typescript from 'rollup-plugin-typescript'

export default {
  input: 'test/decorator.spec.ts',
  output: {
    file: 'test/decorator.spec.js',
    format: 'cjs'
  },
  plugins: [
    typescript({
      typescript: require('typescript'),
      "target": "es5",
      "moduleResolution": "node",
      "strict": true,
      "experimentalDecorators": true,
      "emitDecoratorMetadata": true,
    }),
    commonjs(),
  ]
}
