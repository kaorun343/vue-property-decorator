import Vue, { ComponentOptions } from 'vue'

export function needToProduceProvide(original: any) {
  return (
    typeof original !== 'function' ||
    (!original.managed && !original.managedReactive)
  )
}

interface ProvideObj {
  managed?: { [k: string]: any }
  managedReactive?: { [k: string]: any }
}

type ProvideFunc = ((this: any) => Object) & ProvideObj

export function produceProvide(original: any) {
  let provide: ProvideFunc = function (this: any) {
    let rv = typeof original === 'function' ? original.call(this) : original
    rv = Object.create(rv || null)
    // set reactive services (propagates previous services if necessary)
    rv[reactiveInjectKey] = Object.create(this[reactiveInjectKey] || {})
    for (let i in provide.managed) {
      rv[provide.managed[i]] = this[i]
    }
    for (let i in provide.managedReactive) {
      rv[provide.managedReactive[i]] = this[i] // Duplicates the behavior of `@Provide`
      Object.defineProperty(rv[reactiveInjectKey], provide.managedReactive[i], {
        enumerable: true,
        configurable: true,
        get: () => this[i],
      })
    }
    return rv
  }
  provide.managed = {}
  provide.managedReactive = {}
  return provide
}

/** Used for keying reactive provide/inject properties */
export const reactiveInjectKey = '__reactiveInject__'

export function inheritInjected(componentOptions: ComponentOptions<Vue>) {
  // inject parent reactive services (if any)
  if (!Array.isArray(componentOptions.inject)) {
    componentOptions.inject = componentOptions.inject || {}
    componentOptions.inject[reactiveInjectKey] = {
      from: reactiveInjectKey,
      default: {},
    }
  }
}
