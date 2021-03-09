import { computed } from 'vue'
import { createDecorator, VueDecorator } from 'vue-class-component'

export type ProvideOption = {
  to?: string | symbol
  reactive?: boolean
}

/**
 * Decorator for provide options
 */
export function Provide(options?: ProvideOption): VueDecorator {
  return createDecorator((componentOptions, key) => {
    const originalProvide = componentOptions.provide
    componentOptions.provide = function (this: any) {
      const providedValue =
        typeof originalProvide === 'function'
          ? originalProvide.call(this)
          : originalProvide

      return {
        ...providedValue,
        [options?.to || key]: options?.reactive
          ? computed(() => this[key])
          : this[key],
      }
    }
  })
}
