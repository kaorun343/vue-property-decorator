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

* prop
* watch
* Component (`export Component from 'vue-class-component'`)

```typescript
'use strict'
import * as Vue from 'vue'
import { Component, prop, watch } from 'vue-property-decorator'

@Component
export class Component extends Vue {
  @prop(Number)
  propA: number;

  @prop({
    type: String,
    default: 'default value'
  })
  propB: string;

  @watch('child')
  onChildChanged(val: string, oldVal: string) {}
}

```

is equivalent to

```js
'use strict'
export const Component = Vue.extend({
  props: {
    propA: Number,
    propB: {
      type: String,
      required: true,
      default: ''
    }
  },
  methods: {
    onChildChanged(val, oldVal) {}
  },
  watch: {
    'child': 'onChildChanged'
  }
})
```

## See also

[vuex-class](https://github.com/ktsn/vuex-class/)
