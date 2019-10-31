/** vue-property-decorator verson 8.2.2 MIT LICENSE copyright 2019 kaorun343 */
/// <reference types='reflect-metadata'/>
'use strict'
import Vue, { PropOptions, WatchOptions } from 'vue'
import Component, { createDecorator, mixins } from 'vue-class-component'
import { InjectKey } from 'vue/types/options'

export type Constructor = {
  new (...args: any[]): any
}

export { Component, Vue, mixins as Mixins }

/** Used for keying reactive provide/inject properties */
const reactiveInjectKey = '__reactiveInject__'

type InjectOptions = { from?: InjectKey; default?: any }

/**
 * decorator of an inject
 * @param from key
 * @return PropertyDecorator
 */
export function Inject(options?: InjectOptions | InjectKey) {
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
export function InjectReactive(options?: InjectOptions | InjectKey) {
  return createDecorator((componentOptions, key) => {
    if (typeof componentOptions.inject === 'undefined') {
      componentOptions.inject = {}
    }
    if (!Array.isArray(componentOptions.inject)) {
      const fromKey = !!options ? (options as any).from || options : key
      const defaultVal = (!!options && (options as any).default) || undefined
      if (!componentOptions.computed) componentOptions.computed = {}
      componentOptions.computed![key] = function() {
        const obj = (this as any)[reactiveInjectKey]
        return obj ? obj[fromKey] : defaultVal
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
export function Provide(key?: string | symbol) {
  return createDecorator((componentOptions, k) => {
    let provide: any = componentOptions.provide
    if (typeof provide !== 'function' || !provide.managed) {
      const original: any = componentOptions.provide
      provide = componentOptions.provide = function(this: any) {
        let rv = Object.create(
          (typeof original === 'function' ? original.call(this) : original) ||
            null,
        )
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
export function ProvideReactive(key?: string | symbol) {
  return createDecorator((componentOptions, k) => {
    let provide: any = componentOptions.provide
    // inject parent reactive services (if any)
    if (!Array.isArray(componentOptions.inject)) {
      componentOptions.inject = componentOptions.inject || {};
      componentOptions.inject[reactiveInjectKey] = { from: reactiveInjectKey, default: {}};
    }
    if (typeof provide !== 'function' || !provide.managedReactive) {
      const original: any = componentOptions.provide
      provide = componentOptions.provide = function(this: any) {
        let rv = typeof original === 'function'
            ? original.call(this)
            : original
        rv = Object.create(rv || null)
        // set reactive services (propagates previous services if necessary)
        rv[reactiveInjectKey] = this[reactiveInjectKey] || {}
        for (let i in provide.managedReactive) {
          rv[provide.managedReactive[i]] = this[i] // Duplicates the behavior of `@Provide`
          Object.defineProperty(rv[reactiveInjectKey], provide.managedReactive[i], {
            enumerable: true,
            get: () => this[i],
          })
        }
        return rv
      }
      provide.managedReactive = {}
    }
    provide.managedReactive[k] = key || k
  })
}

/** @see {@link https://github.com/vuejs/vue-class-component/blob/master/src/reflect.ts} */
const reflectMetadataIsSupported =
  typeof Reflect !== 'undefined' && typeof Reflect.getMetadata !== 'undefined'

function applyMetadata(
  options: PropOptions | Constructor[] | Constructor,
  target: Vue,
  key: string,
) {
  if (reflectMetadataIsSupported) {
    if (
      !Array.isArray(options) &&
      typeof options !== 'function' &&
      typeof options.type === 'undefined'
    ) {
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
export function Model(
  event?: string,
  options: PropOptions | Constructor[] | Constructor = {},
) {
  return (target: Vue, key: string) => {
    applyMetadata(options, target, key)
    createDecorator((componentOptions, k) => {
      ;(componentOptions.props || ((componentOptions.props = {}) as any))[
        k
      ] = options
      componentOptions.model = { prop: k, event: event || k }
    })(target, key)
  }
}

/**
 * decorator of a prop
 * @param  options the options for the prop
 * @return PropertyDecorator | void
 */
export function Prop(options: PropOptions | Constructor[] | Constructor = {}) {
  return (target: Vue, key: string) => {
    applyMetadata(options, target, key)
    createDecorator((componentOptions, k) => {
      ;(componentOptions.props || ((componentOptions.props = {}) as any))[
        k
      ] = options
    })(target, key)
  }
}

/**
 * decorator of a synced prop
 * @param propName the name to interface with from outside, must be different from decorated property
 * @param options the options for the synced prop
 * @return PropertyDecorator | void
 */
export function PropSync(
  propName: string,
  options: PropOptions | Constructor[] | Constructor = {},
): PropertyDecorator {
  // @ts-ignore
  return (target: Vue, key: string) => {
    applyMetadata(options, target, key)
    createDecorator((componentOptions, k) => {
      ;(componentOptions.props || (componentOptions.props = {} as any))[
        propName
      ] = options
      ;(componentOptions.computed || (componentOptions.computed = {}))[k] = {
        get() {
          return (this as any)[propName]
        },
        set(value) {
          // @ts-ignore
          this.$emit(`update:${propName}`, value)
        },
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
export function Watch(path: string, options: WatchOptions = {}) {
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

// Code copied from Vue/src/shared/util.js
const hyphenateRE = /\B([A-Z])/g
const hyphenate = (str: string) => str.replace(hyphenateRE, '-$1').toLowerCase()

/**
 * decorator of an event-emitter function
 * @param  event The name of the event
 * @return MethodDecorator
 */
export function Emit(event?: string) {
  return function(_target: Vue, key: string, descriptor: any) {
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

/**
 * decorator of a ref prop
 * @param refKey the ref key defined in template
 */
export function Ref(refKey?: string) {
  return createDecorator((options, key) => {
    options.computed = options.computed || {}
    options.computed[key] = {
      cache: false,
      get(this: Vue) {
        return this.$refs[refKey || key]
      },
    }
  })
}

export function VModel(propsArgs: PropOptions = {}) {
  return createDecorator((componentOptions, key) => {
    ;(componentOptions.props || (componentOptions.props = {}))['value'] = propsArgs
    ;(componentOptions.computed || (componentOptions.computed = {}))[key] = {
      get() {
        return this.value
      },
      set(value: any) {
        this.$emit('input', value)
      },
    }
  })
}

function isPromise(obj: any): obj is Promise<any> {
  return obj instanceof Promise || (obj && typeof obj.then === 'function')
}
