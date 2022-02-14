import Vue, { ComponentOptions, PropOptions } from 'vue'
import { createDecorator } from 'vue-class-component'
import { applyMetadata } from '../helpers/metadata'
import { Constructor } from 'vue/types/options'
import { clone } from '../helpers/cloner'

export function PropClone(propName: string, options: PropOptions | Constructor[] | Constructor = {}) {
  return (target: Vue, key: string) => {
    applyMetadata(options, target, propName)
    createDecorator((componentOptions: ComponentOptions<Vue>, key: string) => {
      (componentOptions.props || ((componentOptions.props = {}) as any))[propName] = options

      componentOptions.mixins ||= []
      componentOptions.mixins.push({
        data(this: Vue) {
          return {
            [key]: clone(this.$props[propName])
          }
        }
      })

      componentOptions.watch ||= {}

      const watch: any = componentOptions.watch

      if (typeof watch[propName] === 'object' && !Array.isArray(watch[propName])) {
        watch[propName] = [watch[propName]]
      } else if (typeof watch[propName] === 'undefined') {
        watch[propName] = []
      }

      watch[propName].push({
        handler(propValue: any) {
          (this as any)[key] = clone(propValue)
        },
        immediate: false,
        deep: true,
      })
    })(target, key)
  }
}
