/** vue-property-decorator verson 3.4.0 MIT LICENSE copyright 2017 kaorun343 */

'use strict'
import Vue from 'vue'
import { PropOptions } from 'vue'
import VueClassComponent, { createDecorator } from 'vue-class-component'
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
 * decorator of model
 * @param  event event name
 * @return PropertyDecorator
 */
export function Model(event: string): PropertyDecorator {
  return createDecorator((componentOptions, prop) => {
    componentOptions.model = { prop, event }
  })
}

/**
 * @brief  Makes a decorator for prop.
 *
 * @param  options  The options
 * @param  target   The target
 * @param  key      The key
 *
 * @return PropertyDecorator
 */
function makePropDecorator(options: (PropOptions | Constructor[]) = {}): PropertyDecorator {
  return function (target: Vue, key: string) {
    if (!Array.isArray(options) && typeof options.type === 'undefined') {
      if (typeof Reflect === "object" && typeof Reflect.metadata === "function") {
        options.type = Reflect.getMetadata('design:type', target, key)
      } else {
        options.type = null
      }
    }
    createDecorator((componentOptions, k) => {
      (componentOptions.props || (componentOptions.props = {}) as any)[k] = options
    })(target, key)
  }
}

/**
 * decorator of a prop
 * @param  options the options for the prop
 * @return PropertyDecorator | void
 */
export function Prop(target: Vue, key: string): void
export function Prop(target?: (PropOptions | Constructor[])): PropertyDecorator
export function Prop(options: (Vue | PropOptions | Constructor[]) = {}, key?: string): void | PropertyDecorator {
  if (options instanceof Vue) {
    return makePropDecorator()(options, key!)
  } else {
    return makePropDecorator(options)
  }
}

/**
 * decorator of a watch function
 * @param  path the path or the expression to observe
 * @param  WatchOption
 * @return MethodDecorator
 */
export function Watch(path: string, options: Vue.WatchOptions = {}): MethodDecorator {
  const { deep = false, immediate = false } = options

  return createDecorator((componentOptions, handler) => {
    if (typeof componentOptions.watch !== 'object') {
      componentOptions.watch = Object.create(null)
    }
    (componentOptions.watch as any)[path] = { handler, deep, immediate }
  })
}

export const prop = Prop
export const watch = Watch
export const Component = VueClassComponent
