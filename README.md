# Vue Property Decorator

This library fully depends on [vue-class-component](https://github.com/vuejs/vue-class-component).

## License

MIT License

## Install

```bash
npm i -S vue-property-decorator
```

## Usage

There are 5 decorators:

* `@Inject`
* `@Model`
* `@Prop` (and `@prop`)
* `@Watch` (and `@watch`)
* `@Component` (`export Component from 'vue-class-component'`)

```typescript
import Vue = require('vue')
import { Component, Model, Prop, Watch } from 'vue-property-decorator'

const s = Symbol('baz')

@Component
export class MyComponent extends Vue {

  @Inject() foo: string
  @Inject('bar') bar: string
  @Inject(s) baz: string

  @Model('change')
  checked: boolean

  @Prop
  propA: number

  @Prop({ default: 'default value' })
  propB: string

  @Prop([String, Boolean])
  propC: string | boolean

  @Prop({ type: null })
  propD: any

  @Watch('child')
  onChildChanged(val: string, oldVal: string) { }

  @Watch('person', { immediate: true, deep: true })
  onPersonChanged(val: Person, oldVal: Person) { }
}

```

is equivalent to

```js
const s = Symbol('baz')

export const MyComponent = Vue.extend({
  name: 'MyComponent',
  inject: {
    foo: 'foo',
    bar: 'bar',
    [s]: s
  },
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    propA: Number,
    propB: {
      type: String,
      default: 'default value'
    },
    propC: [String, Boolean],
    propD: { type: null }
  },
  methods: {
    onChildChanged(val, oldVal) { },
    onPersonChanged(val, oldVal) { }
  },
  watch: {
    'child': {
      handler: 'onChildChanged',
      immediate: false,
      deep: false
    },
    'person': {
      handler: 'onPersonChanged',
      immediate: true,
      deep: true
    }
  }
})
```

As you can see at `propA` and `propB`, the type can be inferred automatically when it's a simple type. For more complex types like enums you do need to specify it specifically.
Also this library needs to have `emitDecoratorMetadata` set to `true` for this to work.

## See also

[vuex-class](https://github.com/ktsn/vuex-class/)
