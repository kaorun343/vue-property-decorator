'use strict'
import Vue = require('vue')
import { PropOptions } from 'vue'
import VueClassComponent, { createDecorator } from 'vue-class-component'
import { Constructor } from './vue-property-decorator'
import 'reflect-metadata'

export { Constructor, Watch, Component } from './vue-property-decorator'

/**
 * decorator of a prop
 * @param  options the option for the prop
 * @return PropertyDecorator
 */
export function Prop(options: (PropOptions | Constructor[]) = {}): PropertyDecorator {
  return function (target: Vue, key: string) {
    if (!(options instanceof Array) && typeof options.type === 'undefined') {
      options.type = Reflect.getMetadata('design:type', target, key)
    }
    createDecorator((componentOptions, k) => {
      (componentOptions.props || (componentOptions.props = {}) as any)[k] = options
    })(target, key)
  }
}

export const prop = Prop
