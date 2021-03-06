import { computed } from 'vue'
import { createDecorator, VueDecorator } from 'vue-class-component'

/**
 * Decorator for provide options
 * @param to to
 */
export function Provide(to?: string): VueDecorator {
  return createDecorator((componentOptions, key) => {
    const originalProvide = componentOptions.provide
    componentOptions.provide = function (this: any) {
      const providedValue =
        typeof originalProvide === 'function'
          ? originalProvide.call(this)
          : originalProvide

      return {
        ...providedValue,
        [to || key]: computed(() => this[key]),
      }
    }
  })
}
