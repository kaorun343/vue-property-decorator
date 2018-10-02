import Vue from 'vue'
import { Component, Emit, Inject, Model, Prop, Provide, Watch, Mixins } from '../src/vue-property-decorator'
import { test as Test } from 'ava'
const test: typeof Test = require('ava').test

test('@Emit decorator test', async t => {

  @Component
  class Child extends Vue {
    count = 0

    @Emit('reset') resetCount() {
      this.count = 0
    }

    @Emit() increment(n: number) {
      this.count += n
    }

    @Emit() canceled() {
      return false
    }

    @Emit() promise() {
      return Promise.resolve(1)
    }
  }
  const child = new Child()

  let result: {
    called: boolean,
    event: string,
    arg: any,
    [key: string]: any
  } = {
    called: false,
    event: '',
    arg: 0
  }

  child.$emit = (event, ...args) => {
    result.called = true
    result.event = event
    result.arg = args[0]

    return child
  }

  child.resetCount()
  t.is(result.called, true)
  t.is(result.event, 'reset')
  t.is(result.arg, undefined)
  result.called = false

  child.increment(30)
  t.is(result.event, 'increment')
  t.is(result.arg, 30)
  result.called = false

  child.canceled()
  t.is(result.arg, false)
  result.called = false

  await child.promise()
  t.is(result.arg, 1)
  result.called = false
})

test('@Inject decorator test', t => {
  const s = Symbol()
  @Component({
    provide() {
      return {
        [s]: 'one',
        bar: 'two'
      }
    }
  })
  class Parent extends Vue {
  }

  const parent = new Parent()

  @Component
  class Child extends Vue {
    @Inject(s) foo: string
    @Inject() bar: string
    @Inject({ from: 'optional', default: 'default' }) optional: string
  }

  const child = new Child({ parent })
  t.is(child.foo, 'one')
  t.is(child.bar, 'two')
  t.is(child.optional, 'default')

  @Component
  class GrandChild extends Vue {
    @Inject(s) foo: string
    @Inject() bar: string
    @Inject({ from: 'optional', default: 'default' }) optional: string
  }

  const grandChild = new GrandChild({ parent: child })
  t.is(grandChild.foo, 'one')
  t.is(grandChild.bar, 'two')
  t.is(grandChild.optional, 'default')
})

test('@Inject decroator test with @Prop decorator', t => {
  @Component({
    provide() {
      return {
        bar: 'two'
      }
    }
  })
  class Parent extends Vue {
  }

  const parent = new Parent()

  @Component
  class Child extends Vue {
    @Inject() bar: string

    @Prop({
      default() {
        return this.bar
      }
    })
    myFoo: string
  }

  const child = new Child({ parent })

  t.is(child.myFoo, 'two')
})

test('@Model decorator test', t => {
  @Component
  class Test extends Vue {
    @Model('change', Boolean)
    checked: boolean
  }

  const { $options } = new Test()
  t.deepEqual($options.model, { prop: 'checked', event: 'change' })
  const { props } = $options
  if (!(props instanceof Array)) {
    t.deepEqual(props!['checked'], { type: Boolean })
  }
})

test('@Prop decorator test', t => {
  @Component
  class Test extends Vue {

    @Prop(Number) propA: number
    @Prop({ default: 'propB' }) propB: string
    @Prop([Boolean, String]) propC: boolean | string
  }

  const { $options } = new Test()
  const { props } = $options
  if (!(props instanceof Array)) {
    t.deepEqual(props!['propA'], { type: Number })
    t.deepEqual(props!['propB'], { default: 'propB' })
    t.deepEqual(props!['propC'], { type: [Boolean, String] })
  }

  const test = new Test({ propsData: { propA: 10 } })
  t.is(test.propA, 10)
  t.is(test.propB, 'propB')
})

test('@Provide decorator test', t => {
  @Component
  class Parent extends Vue {
    @Provide() one = 'one'
    @Provide('two') twelve = 'two'
  }

  const parent = new Parent()

  @Component
  class Child extends Vue {
    @Inject() one: string
    @Inject() two: string
  }

  const child = new Child({ parent })

  t.is(child.one, 'one')
  t.is(child.two, 'two')
})

test('@Watch decorator test', t => {
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
  t.is(($options.watch!['expression'] as any).handler, 'method')
  t.is(($options.watch!['moreExpression'] as any).immediate, true)

  const test = new Test()

  test.moreExpression = true

  t.is(num, 1)
})


test('Mixins helper test', t => {

  @Component
  class MixinA extends Vue {
    mixinA = 0
  }

  @Component
  class MixinB extends Vue {
    mixinB = 10
  }

  @Component
  class Test extends Mixins(MixinA, MixinB) {
  }
  const test = new Test()

  t.is(test.mixinA, 0)
  t.is(test.mixinB, 10)
})
