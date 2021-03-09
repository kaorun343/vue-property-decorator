# Vue Property Decorator

[![npm](https://img.shields.io/npm/v/vue-property-decorator.svg)](https://www.npmjs.com/package/vue-property-decorator)
[![Build Status](https://travis-ci.org/kaorun343/vue-property-decorator.svg?branch=master)](https://travis-ci.org/kaorun343/vue-property-decorator)

This library fully depends on [vue-class-component](https://github.com/vuejs/vue-class-component), so please read its README **BEFORE** using this library.

## License

MIT License

## Install

```bash
npm i -S vue-property-decorator vue-class-component vue
```

## Usage

There are several decorators:

- [`@Prop`](#Prop)
- [`@Model`](#Model)
- [`@Watch`](#Watch)
- [`@Provide`](#Provide)
- [`@Inject`](#Inject)
- [`@Emit`](#Emit)
- [`@Ref`](#Ref)

Also, these are re-exported from `vue-class-component`

- `@Option`
- `mixins`
- `Vue`

### <a id="Prop"></a> `@Prop` decorator

#### Description

Each prop's default value need to be defined as same as the example code shown in above.
It's **not** supported to define each `default` property like `@Prop() prop = 'default value'` .

#### Example

```ts
import { Vue, Prop } from 'vue-property-decorator'

export default class YourComponent extends Vue {
  @Prop(Number) readonly propA: number | undefined
  @Prop({ default: 'default value' }) readonly propB!: string
  @Prop([String, Boolean]) readonly propC: string | boolean | undefined
}
```

is equivalent to

```js
export default {
  props: {
    propA: Number,
    propB: {
      default: 'default value',
    },
    propC: {
      type: [String, Boolean],
    },
  },
}
```

### <a id="Model"></a> `@Model` decorator

#### Description

The first argument is the prop's name that the component accepts from its parent component. If you set the name as `modelValue`, then the component can use `v-model` .

The second argument is the same with `@Prop` decorator's argument.

#### Example

```ts
import { Vue, Model } from 'vue-property-decorator'

export default class YourComponent extends Vue {
  @Model('modelValue', { type: String, default: 'Default Value' })
  readonly value!: string
}
```

is equivalent to

```js
export default {
  props: {
    modelValue: {
      type: String,
      default: 'Default Value',
    },
  },
  emits: ['update:modelValue'],
  computed: {
    value: {
      get() {
        return this.modelValue
      },
      set(newValue) {
        this.$emit('update:modelValue')
      },
    },
  },
}
```

### <a id="Watch"></a> `@Watch` decorator

#### Example

```ts
import { Vue, Watch } from 'vue-property-decorator'

export default class YourComponent extends Vue {
  @Watch('child')
  onChildChanged(val: string, oldVal: string) {}

  @Watch('person', { immediate: true, deep: true })
  onPersonChanged1(val: Person, oldVal: Person) {}

  @Watch('person')
  onPersonChanged2(val: Person, oldVal: Person) {}
}
```

is equivalent to

```js
export default {
  watch: {
    child: [
      {
        handler: 'onChildChanged',
      },
    ],
    person: [
      {
        handler: 'onPersonChanged1',
        immediate: true,
        deep: true,
      },
      {
        handler: 'onPersonChanged2',
      },
    ],
  },
  methods: {
    onChildChanged(val, oldVal) {},
    onPersonChanged1(val, oldVal) {},
    onPersonChanged2(val, oldVal) {},
  },
}
```

### <a id="Provide"></a> `@Provide` decorator

#### Description

If you set `reactive` to true, the provided value is wrapped with `computed` function.
Provided values with `reactive` option dispatches their new values to child components.

#### Example

```ts
import { Vue, Provide } from 'vue-property-decorator'

const symbolKey = Symbol()

export class MyComponent extends Vue {
  @Provide() foo = 'foo'
  @Provide({ to: 'bar' }) baz = 'bar'
  @Provide({ to: symbolKey }) nice = 'nice'
  @Provide({ reactive: true }) age = 30
}
```

is equivalent to

```js
import { computed } from 'vue'

const symbolKey = Symbol()

export default {
  data() {
    return {
      foo: 'foo',
      baz: 'bar',
      nice: 'nice',
      age: 30,
    }
  },
  provide() {
    return {
      foo: this.key,
      bar: this.baz,
      [symbolKey]: this.nice,
      age: computed(() => this.age),
    }
  },
}
```

#### <a id="Inject"></a> `@Inject` decorator

#### Example

```ts
import { Vue, Inject } from 'vue-property-decorator'

export class MyComponent extends Vue {
  @Inject() foo!: string
  @Inject({ from: 'bar' }) baz!: string
  @Inject({ default: '' }) nice!: string
}
```

is equivalent to

```js
export default {
  inject: {
    foo: 'foo',
    baz: {
      from: 'bar',
    },
    nice: {
      default: '',
    },
  },
}
```

### <a id="Emit"></a> `@Emit` decorator

#### Description

The functions decorated by `@Emit` `$emit` their return value followed by their original arguments. If the return value is a promise, it is resolved before being emitted.

If the name of the event is not supplied via the `event` argument, the function name is used instead. In that case, the camelCase name will be converted to kebab-case.

#### Example

```ts
import { Vue, Emit } from 'vue-property-decorator'

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
    return new Promise((resolve) => {
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
      count: 0,
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
      const promise = new Promise((resolve) => {
        setTimeout(() => {
          resolve(20)
        }, 0)
      })

      promise.then((value) => {
        this.$emit('promise', value)
      })
    },
  },
}
```

### <a id="Ref"></a> `@Ref` decorator

#### Example

```ts
import { Vue, Ref } from 'vue-property-decorator'
import AnotherComponent from '@/path/to/another-component.vue'

export default class YourComponent extends Vue {
  @Ref() readonly anotherComponent!: AnotherComponent
  @Ref('aButton') readonly button!: HTMLButtonElement
}
```

is equivalent to

```js
export default {
  computed() {
    anotherComponent: {
      cache: false,
      get() {
        return this.$refs.anotherComponent as AnotherComponent
      }
    },
    button: {
      cache: false,
      get() {
        return this.$refs.aButton as HTMLButtonElement
      }
    }
  }
}
```
