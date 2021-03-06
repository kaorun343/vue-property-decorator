import { createDecorator, PropOptions, VueDecorator } from 'vue-class-component'

type Constructor = (new () => any) | SymbolConstructor

/**
 * Decorator for prop options
 * @param propOptions the options for the prop
 */
export function Prop(
  propOptions?: Constructor | Constructor[] | PropOptions,
): VueDecorator {
  return createDecorator((componentOptions, key) => {
    componentOptions.props ??= Object.create(null)
    componentOptions.props[key] = propOptions
  })
}
