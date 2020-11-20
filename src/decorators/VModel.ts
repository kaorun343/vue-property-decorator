import Vue, { PropOptions } from 'vue'
import { createDecorator } from 'vue-class-component'

/**
 * decorator for capturings v-model binding to component
 * @param options the options for the prop
 */
export function VModel(options: PropOptions = {}) {
  const valueKey: string = 'value'
  return createDecorator((componentOptions, key) => {
    ;(componentOptions.props || ((componentOptions.props = {}) as any))[
      valueKey
    ] = options
    ;(componentOptions.computed || (componentOptions.computed = {}))[key] = {
      get() {
        return (this as any)[valueKey]
      },
      set(this: Vue, value: any) {
        this.$emit('input', value)
      },
    }
  })
}
