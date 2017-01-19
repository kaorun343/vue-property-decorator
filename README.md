# Vue Property Decorator

This library fully depends on [vue-class-component](https://github.com/vuejs/vue-class-component).

## License
MIT License

## Install
```
npm i -S vue-property-decorator
```

## Usage

There are 3 decorators:

* `@Prop` (and `@prop`)
* `@Watch` (and `@watch`)
* `@Component` (`export Component from 'vue-class-component'`)

```typescript
import * as Vue from 'vue'
import { Component, Prop, Watch } from 'vue-property-decorator'

@Component
export class Component extends Vue {
  @Prop()
  propA: number

  @Prop({ default: 'default value' })
  propB: string

  // when union type, please add its type manually
  @Prop([String, Boolean])
  propC: string | boolean

  @Watch('child')
  onChildChanged(val: string, oldVal: string) { }

  @Watch('person', { immediate: true, deep: true })
  onPersonChanged(val: Person, oldVal: Person) { }
}

```

is equivalent to

```js
export const Component = Vue.extend({
  name: 'Component',
  props: {
    propA: Number,
    propB: {
      type: String,
      required: true,
      default: ''
    }
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

## See also

[vuex-class](https://github.com/ktsn/vuex-class/)
