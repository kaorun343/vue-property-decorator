import { inject, InjectionKey } from 'vue'
import { createDecorator, VueDecorator } from 'vue-class-component'

export type InjectOptions = {
  from?: string | InjectionKey<any>
  default?: any
}

/**
 * Decorator for inject options
 * @param options the options for the injected value
 */
export function Inject(
  options: InjectOptions = Object.create(null),
): VueDecorator {
  return createDecorator((componentOptions, key) => {
    const originalSetup = componentOptions.setup
    componentOptions.setup = (props, ctx) => {
      const result = originalSetup?.(props, ctx)
      const injectedValue = inject(options.from || key, options.default)
      return {
        ...result,
        [key]: injectedValue,
      }
    }
  })
}
