/* vue-property-decorator verson 3.2.1 MIT LICENSE copyright 2016 kaorun343 */
'use strict'
import Vue = require('vue')
import { PropOptions } from 'vue'
import VueClassComponent, { createDecorator } from 'vue-class-component'

export type Constructor = {
  new (...args: any[]): any
}

/**
 * decorator of a prop
 * @param  options the option for the prop
 * @return PropertyDecorator
 */
export function Prop(options: (PropOptions | Constructor | Constructor[]) = { type: null }): PropertyDecorator {
  return createDecorator((componentOptions, key) => {
      (componentOptions.props || (componentOptions.props = {}) as any)[key] = options
    })
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
