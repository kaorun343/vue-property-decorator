/** vue-property-decorator verson 8.1.1 MIT LICENSE copyright 2018 kaorun343 */
/// <reference types='reflect-metadata'/>
'use strict'
import Vue, { PropOptions, WatchOptions } from 'vue'
import Component, { createDecorator, mixins } from 'vue-class-component'
import { InjectKey, WatchHandler } from 'vue/types/options'

export type Constructor = {
  new(...args: any[]): any
}

export { Component, Vue, mixins as Mixins }

/** Used for keying reactive provide/inject properties */
const reactiveInjectKey = '__reactiveInject__';

/**
 * decorator of an inject
 * @param from key
 * @return PropertyDecorator
 */
export function Inject(options?: { from?: InjectKey, default?: any } | InjectKey): PropertyDecorator {
  return createDecorator((componentOptions, key) => {
    if (typeof componentOptions.inject === 'undefined') {
      componentOptions.inject = {}
    }
    if (!Array.isArray(componentOptions.inject)) {
      componentOptions.inject[key] = options || key
    }
  })
}

/**
 * decorator of a reactive inject
 * @param from key
 * @return PropertyDecorator
 */
export function InjectReactive(options?: { from?: InjectKey, default?: any } | InjectKey): PropertyDecorator {
  return createDecorator((componentOptions, key) => {
    if (typeof componentOptions.inject === 'undefined') {
      componentOptions.inject = {}
    }
    if (!Array.isArray(componentOptions.inject)) {
      const fromKey = !!options ? (options as any).from || options : key;
      const defaultVal = !!options && (options as any).default || undefined;
      if (!componentOptions.computed) componentOptions.computed = {}
      componentOptions.computed![key] = function () {
        return this[reactiveInjectKey][fromKey] || defaultVal
      }
      componentOptions.inject[reactiveInjectKey] = reactiveInjectKey
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
 * decorator of a reactive provide
 * @param key key
 * @return PropertyDecorator | void
 */
export function ProvideReactive(key?: string | symbol): PropertyDecorator {
  return createDecorator((componentOptions, k) => {
    let provide: any = componentOptions.provide
    if (typeof provide !== 'function' || !provide.managed) {
      const original = componentOptions.provide
      provide = componentOptions.provide = function (this: any) {
        let rv = Object.create((typeof original === 'function' ? original.call(this) : original) || null)
        rv[reactiveInjectKey] = {}
        for (let i in provide.managed) {
          rv[provide.managed[i]] = this[i] // Duplicates the behavior of `@Provide`
          Object.defineProperty(rv[reactiveInjectKey], provide.managed[i], {
            enumerable: true,
            get: () => this[i]
          })
        }
        return rv
      }
      provide.managed = {}
    }
    provide.managed[k] = key || k
  })
}

/** @see {@link https://github.com/vuejs/vue-class-component/blob/master/src/reflect.ts} */
const reflectMetadataIsSupported = typeof Reflect !== 'undefined' && typeof Reflect.getMetadata !== 'undefined'

function applyMetadata(options: (PropOptions | Constructor[] | Constructor), target: Vue, key: string) {
  if (reflectMetadataIsSupported) {
    if (!Array.isArray(options) && typeof options !== 'function' && typeof options.type === 'undefined') {
      options.type = Reflect.getMetadata('design:type', target, key)
    }
  }
}

/**
 * decorator of model
 * @param  event event name
 * @param options options
 * @return PropertyDecorator
 */
export function Model(event?: string, options: (PropOptions | Constructor[] | Constructor) = {}): PropertyDecorator {
  return (target: Vue, key: string) => {
    applyMetadata(options, target, key)
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
  return (target: Vue, key: string) => {
    applyMetadata(options, target, key)
    createDecorator((componentOptions, k) => {
      (componentOptions.props || (componentOptions.props = {}) as any)[k] = options
    })(target, key)
  }
}

/**
 * decorator of a synced prop
 * @param propName the name to interface with from outside, must be different from decorated property
 * @param options the options for the synced prop
 * @return PropertyDecorator | void
 */
export function PropSync(propName: string, options: (PropOptions | Constructor[] | Constructor) = {}): PropertyDecorator {
  // @ts-ignore
  return (target: Vue, key: string) => {
    applyMetadata(options, target, key)
    createDecorator((componentOptions, k) => {
      (componentOptions.props || (componentOptions.props = {} as any))[propName] = options
      ;(componentOptions.computed || (componentOptions.computed = {}))[k] = {
        get() {
          return this[propName]
        },
        set(value) {
          // @ts-ignore
          this.$emit(`update:${propName}`, value)
        }
      }
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

    const watch: any = componentOptions.watch

    if (typeof watch[path] === 'object' && !Array.isArray(watch[path])) {
      watch[path] = [watch[path]]
    } else if (typeof watch[path] === 'undefined') {
      watch[path] = []
    }

    watch[path].push({ handler, deep, immediate })
  })
}

/**
 * decorator of filter function
 * @param name the filter name
 * @return MethodDecorator
 */
export function Filter(name?: string): MethodDecorator {
  return createDecorator((componentOptions, handler) => {
    if (typeof componentOptions.filters !== 'object') {
      componentOptions.filters = {}
    }

    const filters: any = componentOptions.filters
    const methods: any = componentOptions.methods

    if (!name) {
      name = handler
    }

    filters[name] = methods[handler]
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
  return function (_target: Vue, key: string, descriptor: any) {
    key = hyphenate(key)
    const original = descriptor.value
    descriptor.value = function emitter(...args: any[]) {
      const emit = (returnValue: any) => {
        if (returnValue !== undefined) args.unshift(returnValue)
        this.$emit(event || key, ...args)
      }

      const returnValue: any = original.apply(this, args)

      if (isPromise(returnValue)) {
        returnValue.then(returnValue => {
          emit(returnValue)
        })
      } else {
        emit(returnValue)
      }

      return returnValue
    }
  }
}

function isPromise(obj: any): obj is Promise<any> {
  return obj instanceof Promise || (obj && typeof obj.then === 'function')
}
