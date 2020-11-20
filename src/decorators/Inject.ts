import { createDecorator } from 'vue-class-component'
import { InjectKey } from 'vue/types/options'

export type InjectOptions = { from?: InjectKey; default?: any }
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
