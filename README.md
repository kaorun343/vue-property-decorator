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

* [`@Prop`](#Prop)
* [`@PropSync`](#PropSync)
* [`@Provide`](#Provide)
* [`@Model`](#Model)
* [`@Watch`](#Watch)
* [`@Inject`](#Provide)
* [`@Provide`](#Provide)
* [`@Emit`](#Emit)
* [`@Filter`](#Filter)
* `@Component` (**provided by** [vue-class-component](https://github.com/vuejs/vue-class-component))
* `Mixins` (the helper function named `mixins` **provided by** [vue-class-component](https://github.com/vuejs/vue-class-component))


## See also

[vuex-class](https://github.com/ktsn/vuex-class/)

### <a id="Prop"></a> `@Prop(options: (PropOptions | Constructor[] | Constructor) = {})` decorator

```ts
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class YourComponent extends Vue {
  @Prop(Number) readonly propA!: number | undefined
  @Prop({ default: 'default value' }) readonly propB!: string
  @Prop([String, Boolean]) readonly propC!: string | boolean | undefined
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

## If you'd like to set `type` property of each prop value from its type definition, you can use [reflect-metadata](https://github.com/rbuckton/reflect-metadata).

1. Set `emitDecoratorMetadata` to `true`.
2. Import `reflect-metadata` **before** importing `vue-property-decorator` (importing `reflect-metadata` is needed just once.)

## Each prop's default value need to be defined as same as the example code shown in above.

It's **not** supported to define each `default` property like `@Prop() prop = 'default value'` .

### <a id="PropSync"></a> `@PropSync(propName: string, options: (PropOptions | Constructor[] | Constructor) = {})` decorator

```ts
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class YourComponent extends Vue {
  @PropSync('name', { type: String }) syncedName!: string
}
```

is equivalent to

```js
export default {
  props: {
    name: {
      type: String
    },
  },
  computed: {
    syncedName: {
      get() {
        return this.name
      },
      set(value) {
        this.$emit('update:name', value)
      }
    }
  }
}
```

Other than that it works just like [`@Prop`](#Prop) other than it takes the propName as an argument of the decorator, in addition to it creates a computed getter and setter behind the scenes. This way you can interface with the property as it was a regular data property whilst making it as easy as appending the `.sync` modifier in the parent component.

### <a id="Model"></a> `@Model(event?: string, options: (PropOptions | Constructor[] | Constructor) = {})` decorator

```ts
import { Vue, Component, Model } from 'vue-property-decorator'

@Component
export default class YourComponent extends Vue {
  @Model('change', { type: Boolean }) readonly checked!: boolean
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

`@Model` property can also set `type` property from its type definition via `reflect-metadata` .

### <a id="Watch"></a> `@Watch(path: string, options: WatchOptions = {})` decorator

```ts
import { Vue, Component, Watch } from 'vue-property-decorator'

@Component
export default class YourComponent extends Vue {
  @Watch('child')
  onChildChanged(val: string, oldVal: string) { }

  @Watch('person', { immediate: true, deep: true })
  onPersonChanged1(val: Person, oldVal: Person) { }

  @Watch('person')
  onPersonChanged2(val: Person, oldVal: Person) { }
}
```

is equivalent to

```js
export default {
  watch: {
    'child': [
      {
        handler: 'onChildChanged',
        immediate: false,
        deep: false
      }
    ],
    'person': [
      {
        handler: 'onPersonChanged1',
        immediate: true,
        deep: true
      },
      {
        handler: 'onPersonChanged2',
        immediate: false,
        deep: false
      }
    ]
  },
  methods: {
    onChildChanged(val, oldVal) { },
    onPersonChanged1(val, oldVal) { },
    onPersonChanged2(val, oldVal) { }
  }
}
```

### <a id="Provide"></a> `@Provide(key?: string | symbol)` / `@Inject(options?: { from?: InjectKey, default?: any } | InjectKey)` decorator

```ts
import { Component, Inject, Provide, Vue } from 'vue-property-decorator'

const symbol = Symbol('baz')

@Component
export class MyComponent extends Vue {
  @Inject() readonly foo!: string
  @Inject('bar') readonly bar!: string
  @Inject({ from: 'optional', default: 'default' }) readonly optional!: string
  @Inject(symbol) readonly baz!: string


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

### <a id="Emit"></a> `@Emit(event?: string)` decorator

The functions decorated by `@Emit` `$emit` their return value followed by their original arguments. If the return value is a promise, it is resolved before being emitted.

If the name of the event is not supplied via the `event` argument, the function name is used instead. In that case, the camelCase name will be converted to kebab-case.

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

  @Emit()
  returnValue() {
    return 10
  }

  @Emit()
  onInputChange(e) {
    return e.target.value
  }

  @Emit()
  promise() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(20)
      }, 0)
    })
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
    },
    returnValue() {
      this.$emit('return-value', 10)
    },
    onInputChange(e) {
      this.$emit('on-input-change', e.target.value, e)
    },
    promise() {
      const promise = new Promise(resolve => {
        setTimeout(() => {
          resolve(20)
        }, 0)
      })

      promise.then(value => {
        this.$emit('promise', value)
      })
    }
  }
}
```

### <a id="Filter"></a> `@Filter(name?: string)` decorator

The functions decorated by `@Filter` are available as `filters` inside the Vue component.

If the name of the filter is not supplied via the `name` argument, the function name is used instead. 

```ts
import { Vue, Component, Filter } from 'vue-property-decorator'

@Component
export default class YourComponent extends Vue {
  @Filter('filterA')
  filterAMethod(value: string) {
    return value + ' A';
  }

  @Filter()
  filterB(value: string) {
    return value + ' B';
  }
}
```

is equivalent to

```js
export default {
  filters: {
    filterA(value) {
      return value + ' A';
    },
    filterB(value) {
      return value + ' B';
    }
  }
}
```