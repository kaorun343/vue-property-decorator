import { createDecorator, VueDecorator } from 'vue-class-component'

// Code copied from Vue/src/shared/util.js
const hyphenateRE = /\B([A-Z])/g
const hyphenate = (str: string) => str.replace(hyphenateRE, '-$1').toLowerCase()

/**
 * Decorator of an event-emitter function
 * @param  event The name of the event
 */
export function Emit(event?: string): VueDecorator {
  return createDecorator((componentOptions, propertyKey) => {
    const emitName = event ?? hyphenate(propertyKey)
    componentOptions.emits ??= []
    componentOptions.emits.push(emitName)
    const original = componentOptions.methods[propertyKey]
    componentOptions.methods[propertyKey] = function emitter(...args: any[]) {
      const emit = (returnValue: any) => {
        if (returnValue === undefined) {
          if (args.length === 0) {
            this.$emit(emitName)
          } else if (args.length === 1) {
            this.$emit(emitName, args[0])
          } else {
            this.$emit(emitName, ...args)
          }
        } else {
          args.unshift(returnValue)
          this.$emit(emitName, ...args)
        }
      }

      const returnValue: any = original.apply(this, args)

      if (isPromise(returnValue)) {
        returnValue.then(emit)
      } else {
        emit(returnValue)
      }

      return returnValue
    }
  })
}

function isPromise(obj: any): obj is Promise<any> {
  return obj instanceof Promise || (obj && typeof obj.then === 'function')
}
