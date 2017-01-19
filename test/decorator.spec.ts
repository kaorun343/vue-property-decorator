import * as Vue from 'vue'
import * as assert from 'power-assert'
import { Component, prop, watch } from '../src/vue-property-decorator'

declare const process: { env: { NODE_ENV: string } };

describe('prop decorator', () => {
  it('should add props to "props" property', () => {
    @Component
    class Test extends Vue {
      @prop()
      propA: number

      @prop({ default: 'propB' })
      propB: string

      @prop([Boolean, String])
      propC: boolean | string
    }

    const { $options } = new Test()
    const { props } = $options
    if (!(props instanceof Array)) {
      assert.deepEqual(props!['propA'], { type: Number })
      assert.deepEqual(props!['propB'], { type: String, default: 'propB' })
      assert.deepEqual(props!['propC'], { type: [Boolean, String] })
    }

    const test = new Test({ propsData: { propA: 10 } })
    assert.equal(test.propA, 10)
    assert.equal(test.propB, 'propB')
  })

  it('should do well in production mode', () => {
    process.env.NODE_ENV = 'production'
    @Component
    class Test extends Vue {
      @prop()
      propA: number

      @prop({ default: 'propB' })
      propB: string

      @prop([Boolean, String])
      propC: boolean | string
    }

    const { $options } = new Test()
    const { props } = $options
    if (!(props instanceof Array)) {
      assert.deepEqual(props!['propA'], { type: null })
      assert.deepEqual(props!['propB'], { type: null, default: 'propB' })
      assert.deepEqual(props!['propC'], { type: null })
    }
  })
})

describe('watch decorator', () => {
  it('should add expressions to "watch" property', () => {

    let num = 0

    @Component
    class Test extends Vue {
      moreExpression = false

      @watch('expression')
      @watch('moreExpression', { immediate: true })
      method() {
        num = 1
      }
    }

    const { $options } = new Test()
    assert.equal(($options.watch!['expression'] as any).handler, 'method')
    assert.equal(($options.watch!['moreExpression'] as any).immediate, true)

    const test = new Test()

    test.moreExpression = true

    assert.equal(num, 1)
  })
})
