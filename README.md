# Vue Property Decorator

## License
MIT License

## Install
```
npm i -S vue-property-decorator
```

## Usage
```ts
'use strict'
import VueComponent = require('vue-class-component');
import {event, prop, watch} from 'vue-property-decorator';

@VueComponent
export class Component {
    @event('some:event')
    onEventReceived() {}

    @prop(Number)
    propA: number;

    @prop({
      type: String,
      required: true,
      default: '',
      twoWay: true,
      validator: (value: string) => value.length > 1,
      coerce: (val: string) => val.toLowerCase()
    })
    propB: string;

    data() {
        return {
            child: 'child';
        };
    }

    @watch('child')
    onChildChanged(val: string, oldVal: string) {}
}

```

becomes

```js
'use strict'
export const Component = Vue.extend({
    data() {
        return {
            child: 'child'
        }
    },
    props: {
        propA: Number,
        propB: {
            type: String,
            required: true,
            default: '',
            twoWay: true,
            validator: (value: string) => value.length > 1,
            coerce: (val: string) => val.toLowerCase()
        }
    },
    methods: {
        onEventReceived() {},
        onChildChanged() {}
    }
    events: {
        'some:event': 'onEventReceived'
    },
    watch: {
        'child': 'onChildChanged'
    }
})
```
