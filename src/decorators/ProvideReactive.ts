import { createDecorator } from 'vue-class-component'
import {
  inheritInjected,
  needToProduceProvide,
  produceProvide,
} from '../helpers/provideInject'

/**
 * decorator of a reactive provide
 * @param key key
 * @return PropertyDecorator | void
 */
export function ProvideReactive(key?: string | symbol) {
  return createDecorator((componentOptions, k) => {
    let provide: any = componentOptions.provide
    inheritInjected(componentOptions)
    if (needToProduceProvide(provide)) {
      provide = componentOptions.provide = produceProvide(provide)
    }
    provide.managedReactive[k] = key || k
  })
}
