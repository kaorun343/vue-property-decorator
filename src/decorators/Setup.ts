import { Ref, SetupContext, ShallowUnwrapRef } from 'vue';

import { createDecorator } from 'vue-class-component';

export function Setup() {
  return createDecorator((options, key) => {
    // get decorated getter definition
    const getter = options.computed ? options.computed[key] : {}
  
    const getSetupFunction = typeof getter === 'function' ? getter : getter.get;
  
    // set component `setup` option
    options.setup = getSetupFunction ? getSetupFunction() : {}
  
    // replace original getter with a getter to `this` to be able to access setup output
    options.computed ? options.computed[key] = {
      get() {
        return this;
      },
    } : options.computed = {}
  })
}

export type UnwrapSetupValue<T> = T extends Ref<infer R>
  ? R
  : ShallowUnwrapRef<T>;

export const setup = <R>(
  setupFunction: (props: Record<string, unknown>, context: SetupContext) => R
): UnwrapSetupValue<R> => {
  return setupFunction as UnwrapSetupValue<R>;
};