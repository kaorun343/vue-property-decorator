/** vue-property-decorator verson 4.0.0 MIT LICENSE copyright 2017 kaorun343 */

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
		var provide: any = componentOptions.provide;
		if('function'!== typeof provide || !provide.managed) {
			var original = provide;
			provide = componentOptions.provide = {
				provide() {
					var i, rv = Object.create(('function'=== typeof original?original.call(this):original)||null);
					for(i in provide.managed) rv[provide.managed[i]] = this[i];
					return rv;
				}
			}.provide;
			provide.managed = {};
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
export function Prop(options: (PropOptions | Constructor[]) = {}): PropertyDecorator {
  return function (target: Vue, key: string) {
    if (!Array.isArray(options) && typeof options.type === 'undefined') {
      options.type = Reflect.getMetadata('design:type', target, key)
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

export { Component }
