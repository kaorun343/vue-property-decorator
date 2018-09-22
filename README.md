# Vue Property Decorator

[![npm](https://img.shields.io/npm/v/vue-property-decorator.svg)](https://www.npmjs.com/package/vue-property-decorator)
[![Build Status](https://travis-ci.org/kaorun343/vue-property-decorator.svg?branch=master)](https://travis-ci.org/kaorun343/vue-property-decorator)

This library fully depends on [vue-class-component](https://github.com/vuejs/vue-class-component), so please read its README before using this library.

## License

MIT License

## Install

```bash
npm i -S vue-property-decorator
```

## Usage

There are 7 decorators and 1 function (Mixin):

* `@Emit`
* `@Inject`
* `@Model`
* `@Prop`
* `@Provide`
* `@Watch`
* `@Component` (**from** `vue-class-component`)
* `Mixins` (the helper function named `mixins` defined at `vue-class-component`)

### `@Prop(options: (PropOptions | Constructor[] | Constructor) = {})` decorator

```ts
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class YourComponent extends Vue {
  @Prop(Number) propA!: number
  @Prop({ default: 'default value' }) propB!: string
  @Prop([String, Boolean]) propC: string | boolean
}
```

is equivalent to

```js
export default {
  props: {
    propA: {
      type: Number
    },
    propB: {
      default: 'default value'
    },
    propC: {
      type: [String, Boolean]
    },
  }
}
```

**Note that:**

* `reflect-metada` isn't used in this library and setting `emitDecoratorMetadata` to `true` means nothing.
* Each prop's default value need to be defined as same as the example code shown in above.

### `@Model(event?: string, options: (PropOptions | Constructor[] | Constructor) = {})` decorator

```ts
import { Vue, Component, Model } from 'vue-property-decorator'

@Component
export default class YourComponent extends Vue {
  @Model('change', { type: Boolean }) checked!: boolean
}
```

is equivalent to

```js
export default {
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    checked: {
      type: Boolean
    },
  },
}
```

### `@Watch(path: string, options: WatchOptions = {})` decorator

```ts
import { Vue, Component, Watch } from 'vue-property-decorator'

@Component
export default class YourComponent extends Vue {
  @Watch('child')
  onChildChanged(val: string, oldVal: string) { }

  @Watch('person', { immediate: true, deep: true })
  onPersonChanged(val: Person, oldVal: Person) { }
}
```

is equivalent to

```js
export default {
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
  },
  methods: {
    onChildChanged(val, oldVal) { },
    onPersonChanged(val, oldVal) { }
  }
}
```

### `@Emit(event?: string)` decorator

The functions decorated by `@Emit` `$emit` their arguments after they ran.

```ts
import { Vue, Component, Emit } from 'vue-property-decorator'

@Component
export default class YourComponent extends Vue {
  count = 0

  @Emit()
  addToCount(n: number) {
    this.count += n
  }

  @Emit('reset')
  resetCount() {
    this.count = 0
  }
}
```

is equivalent to

```js
export default {
  data() {
    return {
      count: 0
    }
  },
  methods: {
    addToCount(n) {
      this.count += n
      this.$emit('add-to-count', n)
    },
    resetCount() {
      this.count = 0
      this.$emit('reset')
    }
  }
}
```

### `@Provide(key?: string | symbol)` / `@Inject(options?: { from?: InjectKey, default?: any } | InjectKey)` decorator

```ts
import { Component, Inject, Provide, Vue } from 'vue-property-decorator'

const symbol = Symbol('baz')

@Component
export class MyComponent extends Vue {
  @Inject() foo!: string
  @Inject('bar') bar!: string
  @Inject({ from: 'optional', default: 'default' }) optional!: string
  @Inject(symbol) baz!: string


  @Provide() foo = 'foo'
  @Provide('bar') baz = 'bar'
}
```

is equivalent to

```js
const symbol = Symbol('baz')

export const MyComponent = Vue.extend({

  inject: {
    foo: 'foo',
    bar: 'bar',
    'optional': { from: 'optional', default: 'default' },
    [symbol]: symbol
  },
  data () {
    return {
      foo: 'foo',
      baz: 'bar'
    }
  },
  provide () {
    return {
      foo: this.foo,
      bar: this.baz
    }
  }
})
```

## See also

[vuex-class](https://github.com/ktsn/vuex-class/)
