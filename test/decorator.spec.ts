import * as Vue from 'vue'
import * as assert from 'power-assert'
import { Component, Inject, Model, Prop, Watch } from '../src/vue-property-decorator'

describe('inject decorator', () => {
  it('should add keys to "inject" property', () => {
    const s = Symbol()
    @Component({
      provide() {
        return {
          [s]: 'one',
          bar: 'two'
        }
      }
    })
    class Provider extends Vue {
    }

    const provider = new Provider()

    @Component({
      parent: provider
    })
    class Child extends Vue {
      @Inject(s) foo: string
      @Inject() bar: string
    }

    const child = new Child()
    assert.equal(child.foo, 'one')
    assert.equal(child.bar, 'two')

    @Component({
      parent: child
    })
    class GrandChild extends Vue {
      @Inject(s) foo: string
      @Inject() bar: string
    }

    const grandChild = new GrandChild()
    assert.equal(grandChild.foo, 'one')
    assert.equal(grandChild.bar, 'two')
  })
})

describe('model decorator', () => {
  it('should add options to "model" property', () => {
    @Component
    class Test extends Vue {
      @Model('change')
      checked: boolean
    }

    const { $options } = new Test()
    assert.deepEqual($options.model, { prop: 'checked', event: 'change' })
  })
})

describe('prop decorator', () => {
  it('should add props to "props" property', () => {
    @Component
    class Test extends Vue {

      @Prop(Number)
      propA: number

      @Prop({ default: 'propB' })
      propB: string

      @Prop([Boolean, String])
      propC: boolean | string

      @Prop({ type: null })
      propD: any

      @Prop()
      propE: boolean
    }

    const { $options } = new Test()
    const { props } = $options
    if (!(props instanceof Array)) {
      assert.deepEqual(props!['propA'], { type: Number })
      assert.deepEqual(props!['propB'], { type: String, default: 'propB' })
      assert.deepEqual(props!['propC'], { type: [Boolean, String] })
      assert.deepEqual(props!['propD'], { type: null })
      assert.deepEqual(props!['propE'], { type: Boolean })
    }

    const test = new Test({ propsData: { propA: 10 } })
    assert.equal(test.propA, 10)
    assert.equal(test.propB, 'propB')
  })
})

describe('watch decorator', () => {
  it('should add expressions to "watch" property', () => {

    let num = 0

    @Component
    class Test extends Vue {
      moreExpression = false

      @Watch('expression')
      @Watch('moreExpression', { immediate: true })
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
