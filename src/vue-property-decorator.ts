/** vue-property-decorator verson 7.0.0 MIT LICENSE copyright 2018 kaorun343 */

'use strict'
import Vue, { PropOptions, WatchOptions } from 'vue'
import Component, { createDecorator, mixins } from 'vue-class-component'
import { InjectKey } from 'vue/types/options'

export type Constructor = {
  new (...args: any[]): any
}

export { Component, Vue, mixins as Mixins }

/**
 * decorator of an inject
 * @param from key
 * @return PropertyDecorator
 */
export function Inject(
  options?: { from?: InjectKey; default?: any } | InjectKey
): PropertyDecorator {
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
 * decorator of a provide
 * @param key key
 * @return PropertyDecorator | void
 */
export function Provide(key?: string | symbol): PropertyDecorator {
  return createDecorator((componentOptions, k) => {
    let provide: any = componentOptions.provide
    if (typeof provide !== 'function' || !provide.managed) {
      const original = componentOptions.provide
      provide = componentOptions.provide = function(this: any) {
        let rv = Object.create(
          (typeof original === 'function' ? original.call(this) : original) ||
            null
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
 * decorator of model
 * @param  event event name
 * @param options options
 * @return PropertyDecorator
 */
export function Model(
  event?: string,
  options: PropOptions | Constructor[] | Constructor = {}
): PropertyDecorator {
  return createDecorator((componentOptions, k) => {
    ;(componentOptions.props || ((componentOptions.props = {}) as any))[
      k
    ] = options
    componentOptions.model = { prop: k, event: event || k }
  })
}

/**
 * decorator of a prop
 * @param  options the options for the prop
 * @return PropertyDecorator | void
 */
export function Prop(
  options: PropOptions | Constructor[] | Constructor = {}
): PropertyDecorator {
  return createDecorator((componentOptions, k) => {
    ;(componentOptions.props || ((componentOptions.props = {}) as any))[
      k
    ] = options
  })
}

/**
 * decorator of a watch function
 * @param  path the path or the expression to observe
 * @param  WatchOption
 * @return MethodDecorator
 */
export function Watch(
  path: string,
  options: WatchOptions = {}
): MethodDecorator {
  const { deep = false, immediate = false } = options

  return createDecorator((componentOptions, handler) => {
    if (typeof componentOptions.watch !== 'object') {
      componentOptions.watch = Object.create(null)
    }
    ;(componentOptions.watch as any)[path] = { handler, deep, immediate }
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
  return function(target: Vue, key: string, descriptor: any) {
    key = hyphenate(key)
    const original = descriptor.value
    descriptor.value = function emitter(...args: any[]) {
      if (original.apply(this, args) !== false)
        this.$emit(event || key, ...args)
    }
  }
}

/**
 * @hidden
 */
function _debounce(func: any, ms: number, immediate = false) {
  let timeout: any = 0
  return function(...args: any[]) {
    const later = () => {
      timeout = null
      if (!immediate) {
        func.apply(this, args)
      }
    }
    const callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, ms)
    if (callNow) {
      func.apply(this, args)
    }
  }
}

/**
 * Decorator for deferred function execution
 *
 * ```typescript
 * @Component
 * export default class YourComponent extends Vue{
 *   @Debounce(1000)
 *   defferedMethod() {
 *     // The method will be executed after 1000 milliseconds after the call
 *   }
 * }
 * ```
 *
 * @param debounce Debounce milliseconds
 * @param immediate Call the function when you declare
 * @return MethodDecorator
 */
export function Debounce(
  debounce: number,
  immediate: boolean = false
): MethodDecorator {
  return (target: Vue, key: string, descriptor: any) => {
    const original = descriptor.value
    const fn = _debounce(original, debounce, immediate)
    descriptor.value = fn
  }
}
