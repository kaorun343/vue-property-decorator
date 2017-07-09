/** vue-property-decorator verson 5.1.1 MIT LICENSE copyright 2017 kaorun343 */

'use strict'
import Vue, { PropOptions, WatchOptions } from 'vue'
import Component, { createDecorator } from 'vue-class-component'
import 'reflect-metadata'

export type Constructor = {
  new (...args: any[]): any
}

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
export function Model(event?: string): PropertyDecorator {
  return createDecorator((componentOptions, prop) => {
    componentOptions.model = { prop, event: event || prop }
  })
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

export { Component, Vue }
