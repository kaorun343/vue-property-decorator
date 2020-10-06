/** vue-property-decorator verson 9.0.2 MIT LICENSE copyright 2020 kaorun343 */
/// <reference types='reflect-metadata'/>
'use strict'
import { Prop, WatchOptions } from 'vue'
import { Options as Component, Vue, createDecorator, mixins } from 'vue-class-component'
import { ComponentOptions } from 'vue'

type PropOptions = Prop<any>;

type InjectKey = string | symbol;

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
      componentOptions.computed![key] = function () {
        const obj = (this as any)[reactiveInjectKey]
        return obj ? obj[fromKey] : defaultVal
      }
      componentOptions.inject[reactiveInjectKey] = reactiveInjectKey
    }
  })
}

interface provideObj {
  managed?: { [k: string]: any }
  managedReactive?: { [k: string]: any }
}
type provideFunc = ((this: any) => Object) & provideObj

function produceProvide(original: any) {
  let provide: provideFunc = function (this: any) {
    let rv = typeof original === 'function' ? original.call(this) : original
    rv = Object.create(rv || null)
    // set reactive services (propagates previous services if necessary)
    rv[reactiveInjectKey] = Object.create(this[reactiveInjectKey] || {})
    for (let i in provide.managed) {
      rv[provide.managed[i]] = this[i]
    }
    for (let i in provide.managedReactive) {
      rv[provide.managedReactive[i]] = this[i] // Duplicates the behavior of `@Provide`
      Object.defineProperty(rv[reactiveInjectKey], provide.managedReactive[i], {
        enumerable: true,
        get: () => this[i],
      })
    }
    return rv
  }
  provide.managed = {}
  provide.managedReactive = {}
  return provide
}

function needToProduceProvide(original: any) {
  return (
    typeof original !== 'function' ||
    (!original.managed && !original.managedReactive)
  )
}

function inheritInjected(componentOptions: ComponentOptions<Vue>) {
  // inject parent reactive services (if any)
  if (!Array.isArray(componentOptions.inject)) {
    componentOptions.inject = componentOptions.inject || {}
    componentOptions.inject[reactiveInjectKey] = {
      from: reactiveInjectKey,
      default: {},
    }
  }
}

/**
 * decorator of a provide
 * @param key key
 * @return PropertyDecorator | void
 */
export function Provide(key?: string | symbol) {
  return createDecorator((componentOptions, k) => {
    let provide: any = componentOptions.provide
    inheritInjected(componentOptions)
    if (needToProduceProvide(provide)) {
      provide = componentOptions.provide = produceProvide(provide)
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
    inheritInjected(componentOptions)
    if (needToProduceProvide(provide)) {
      provide = componentOptions.provide = produceProvide(provide)
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
      const type = Reflect.getMetadata('design:type', target, key)
      if (type !== Object) {
        options.type = type
      }
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
        set(value: any) {
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
  return function (_target: Vue, propertyKey: string, descriptor: any) {
    const key = hyphenate(propertyKey)
    const original = descriptor.value
    descriptor.value = function emitter(...args: any[]) {
      const emit = (returnValue: any) => {
        const emitName = event || key

        if (returnValue === undefined) {
          if (args.length === 0) {
            this.$emit(emitName)
          } else if (args.length === 1) {
            this.$emit(emitName, args[0])
          } else {
            this.$emit(emitName, ...args)
          }
        } else {
          args.unshift(returnValue)
          this.$emit(emitName, ...args)
        }
      }

      const returnValue: any = original.apply(this, args)

      if (isPromise(returnValue)) {
        returnValue.then(emit)
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

function isPromise(obj: any): obj is Promise<any> {
  return obj instanceof Promise || (obj && typeof obj.then === 'function')
}
