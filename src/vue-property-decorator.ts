/** vue-property-decorator verson 6.0.0 MIT LICENSE copyright 2017 kaorun343 */

'use strict'
import Vue, { PropOptions, WatchOptions } from 'vue'
import Component, { createDecorator } from 'vue-class-component'
import 'reflect-metadata'

export type Constructor = {
  new(...args: any[]): any
}

export { Component, Vue }

/**
 * decorator of an inject
 * @param key key
 * @return PropertyDecorator
 */
export function Inject(key?: string | symbol): PropertyDecorator {
  return createDecorator((componentOptions, k) => {
    if (typeof componentOptions.inject === 'undefined') {
      componentOptions.inject = {}
    }
    if (!Array.isArray(componentOptions.inject)) {
      componentOptions.inject[k] = key || k
    }
  })
}

/**
 * decorator of a provide
 * @param key key
 * @return PropertyDecorator | void
 */
export function Provide(key?: string | symbol): PropertyDecorator {
  return createDecorator((componentOptions, k) => {
    let provide: any = componentOptions.provide
    if (typeof provide !== 'function' || !provide.managed) {
      const original = componentOptions.provide
      provide = componentOptions.provide = function (this: any) {
        let rv = Object.create((typeof original === 'function' ? original.call(this) : original) || null)
        for (let i in provide.managed) rv[provide.managed[i]] = this[i]
        return rv
      }
      provide.managed = {}
    }
    provide.managed[k] = key || k
  })
}

/**
 * decorator of model
 * @param  event event name
 * @return PropertyDecorator
 */
export function Model(event?: string, options: (PropOptions | Constructor[] | Constructor) = {}): PropertyDecorator {
  return function (target: Vue, key: string) {
    if (!Array.isArray(options) && typeof (options as PropOptions).type === 'undefined') {
      (options as PropOptions).type = Reflect.getMetadata('design:type', target, key)
    }
    createDecorator((componentOptions, k) => {
      (componentOptions.props || (componentOptions.props = {}) as any)[k] = options
      componentOptions.model = { prop: k, event: event || k }
    })(target, key)
  }
}

/**
 * decorator of a prop
 * @param  options the options for the prop
 * @return PropertyDecorator | void
 */
export function Prop(options: (PropOptions | Constructor[] | Constructor) = {}): PropertyDecorator {
  return function (target: Vue, key: string) {
    if (!Array.isArray(options) && typeof (options as PropOptions).type === 'undefined') {
      (options as PropOptions).type = Reflect.getMetadata('design:type', target, key)
    }
    createDecorator((componentOptions, k) => {
      (componentOptions.props || (componentOptions.props = {}) as any)[k] = options
    })(target, key)
  }
}

/**
 * decorator of a watch function
 * @param  path the path or the expression to observe
 * @param  WatchOption
 * @return MethodDecorator
 */
export function Watch(path: string, options: WatchOptions = {}): MethodDecorator {
  const { deep = false, immediate = false } = options

  return createDecorator((componentOptions, handler) => {
    if (typeof componentOptions.watch !== 'object') {
      componentOptions.watch = Object.create(null)
    }
    (componentOptions.watch as any)[path] = { handler, deep, immediate }
  })
}

// Code copied from Vue/src/shared/util.js
const hyphenateRE = /\B([A-Z])/g
const hyphenate = (str: string) => str.replace(hyphenateRE, '-$1').toLowerCase()

/**
 * decorator of an event-emitter function
 * @param  event The name of the event
 * @return MethodDecorator
 */
export function Emit(event?: string): MethodDecorator {
  return function (target: Vue, key: string, descriptor: any) {
    key = hyphenate(key);
    var original = descriptor.value;
    descriptor.value = function emitter(...args: any[]) {
      if (false !== original.apply(this, args))
        this.$emit(event || key, ...args);
    }
  }
}

/**
 * decorator of $off
 * @param event The name of the event
 * @param method The name of the method
 */
export function Off(event?: string, method?: string): MethodDecorator {
  return function(target: Vue, key: string, descriptor: any) {
    key = hyphenate(key);
    var original = descriptor.value;
    descriptor.value = function offer(...args: any[]) {
      if (false !== original.apply(this, args)) {
        if (method) {
            if (typeof this[method] === 'function') {
              this.$off(event||key, this[method]);
            } else {
              throw new TypeError('must be a method name');
            }
        } else if (event) {
          this.$off(event||key);
        } else {
          this.$off();
        }
      }
    }
  }
}

/**
 * decorator of $on
 * @param event The name of the event
 */
export function On(event?: string): MethodDecorator {
  return createDecorator((componentOptions, k)=>{
    const key = hyphenate(k);
    if (typeof componentOptions.created !== 'function') {
      componentOptions.created= function(){};
    }
    const original=componentOptions.created;
    (componentOptions as any).created=function(){
      original();
      this.$on(event||key, componentOptions.methods[k]);
    };
  });
}

/**
 * decorator of $once
 * @param event The name of the event
 */
export function Once(event?: string): MethodDecorator {
  return createDecorator((componentOptions, k)=>{
    const key = hyphenate(k);
    if (typeof componentOptions.created !== 'function') {
      componentOptions.created= function(){};
    }
    const original=componentOptions.created;
    (componentOptions as any).created=function(){
      original();
      this.$once(event||key, componentOptions.methods[k]);
    };
  });
}

/**
 * decorator of $nextTick
 * 
 * @export
 * @param {string} method 
 * @returns {MethodDecorator} 
 */
export function NextTick(method: string): MethodDecorator {
  return function (target: Vue, key: string, descriptor: any) {
    var original = descriptor.value;
    descriptor.value = function emitter(...args: any[]) {
      if (false !== original.apply(this, args))
          if (typeof this[method] === 'function') {
            this.$nextTick(this[method]);
          } else {
            throw new TypeError('must be a method name');
          }
    }
  }
}
