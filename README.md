# Vue Property Decorator

This library fully depends on [vue-class-component](https://github.com/vuejs/vue-class-component).

## License
MIT License

## Install
```
npm i -S vue-property-decorator
```

## Usage
```typescript
'use strict';
import { Component, prop, watch } from 'vue-property-decorator';

@Component
export class Component {
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
