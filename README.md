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
import Component from 'vue-class-component'
import { Prop, Watch } from 'vue-property-decorator'

@Component
export class Component extends Vue {
  @Prop(Number)
  propA: number

  @Prop({ type: String, default: 'default value' })
  propB: string

  @Prop([String, Boolean])
  propC: string | boolean

  @Prop()
  propD: any

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

Also, there are altanative `@Prop` which adds `PropOptions.type` automatically.
This decorator internally uses decorator metadata.
Please set `emitDecoratorMetadata` to `true`

```typescript
import * as Vue from 'vue'
import Component from 'vue-class-component'
import { Prop, Watch } from 'vue-property-decorator/lib/metadata'

@Component
export class Component extends Vue {
  @Prop()
  propA: number

  @Prop({ default: 'default value' })
  propB: string

  // when union types, please add its types manually
  @Prop([String, Boolean])
  propC: string | boolean

  // when `any`, please set like this manually
  @Prop({ type: null })
  propD: any

  @Watch('child')
  onChildChanged(val: string, oldVal: string) { }

  @Watch('person', { immediate: true, deep: true })
  onPersonChanged(val: Person, oldVal: Person) { }
}

```

## See also

[vuex-class](https://github.com/ktsn/vuex-class/)
