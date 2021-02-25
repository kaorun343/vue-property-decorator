import { createDecorator, Vue, VueDecorator } from 'vue-class-component'

/**
 * decorator of a ref prop
 * @param refKey the ref key defined in template
 */
export function Ref(refKey?: string): VueDecorator {
  return createDecorator((componentOptions, key) => {
    if (typeof componentOptions.computed === 'undefined') {
      componentOptions.computed = Object.create(null)
    }
    componentOptions.computed[key] = {
      cache: false,
      get(this: Vue) {
        return this.$refs[refKey || key]
      },
    }
  })
}
