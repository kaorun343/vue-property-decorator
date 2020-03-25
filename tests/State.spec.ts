import Vue from 'vue'
import Vuex from 'vuex'
import { State, Component } from '../src/vue-property-decorator'

describe(State, () => {

  Vue.use(Vuex);

  describe('when key is not given', () => {
    const propertyName = 'PROPERTY_NAME'
    const value = 'VALUE'

    const store = new Vuex.Store({
      state: {
        [propertyName]: value
      }
    });

    @Component
    class Test extends Vue {
      @State() [propertyName]: string
    }

    const component = new Test({ store })

    test('defines computed option', () => {
      const computed = component.$options.computed as any
      expect(computed[propertyName]).toBeInstanceOf(Function)
    })

    test('computed property returns store state value', () => {
      expect(component[propertyName]).toBe(value)
    })
  })

  describe('when key is given', () => {
    const valueSelector = 'VALUE_SELECTOR'
    const propertyName = 'PROPERTY_NAME'
    const value = 'VALUE'

    const store = new Vuex.Store({
      state: {
        [valueSelector]: value
      }
    });

    @Component
    class Test extends Vue {
      @State(valueSelector) [propertyName]: string
    }

    const component = new Test({ store })

    test('defines computed option', () => {
      const computed = component.$options.computed as any
      expect(computed[propertyName]).toBeInstanceOf(Function)
    })

    test('computed property returns store state value', () => {
      expect(component[propertyName]).toBe(value)
    })
  })

  describe('when function selector is given', () => {
    const valueSelector = 'VALUE_SELECTOR'
    const propertyName = 'PROPERTY_NAME'
    const value = 'VALUE'

    const store = new Vuex.Store({
      state: {
        [valueSelector]: value
      }
    });

    @Component
    class Test extends Vue {
      @State((state) => state[valueSelector]) [propertyName]: string
    }

    const component = new Test({ store })

    test('defines computed option', () => {
      const computed = component.$options.computed as any
      expect(computed[propertyName]).toBeInstanceOf(Function)
    })

    test('computed property returns store state value', () => {
      expect(component[propertyName]).toBe(value)
    })
  })

  describe('when options selector is given', () => {
    const valueSelector = 'VALUE_SELECTOR'
    const propertyName = 'PROPERTY_NAME'
    const value = 'VALUE'

    const store = new Vuex.Store({
      state: {
        [valueSelector]: value
      }
    });

    @Component
    class Test extends Vue {
      @State({ selector: valueSelector }) [propertyName]: string
    }

    const component = new Test({ store })

    test('defines computed option', () => {
      const computed = component.$options.computed as any
      expect(computed[propertyName]).toBeInstanceOf(Function)
    })

    test('computed property returns store state value', () => {
      expect(component[propertyName]).toBe(value)
    })
  })

  describe('when options namespace is given', () => {
    const moduleName = 'MODULE_NAME'
    const propertyName = 'PROPERTY_NAME'
    const value = 'VALUE'

    const store = new Vuex.Store({
      modules: {
        [moduleName]: {
          namespaced: true,
          state: {
            [propertyName]: value
          }
        }
      }
    });

    @Component
    class Test extends Vue {
      @State({ namespace: moduleName }) [propertyName]: string
    }

    const component = new Test({ store })

    test('defines computed option', () => {
      const computed = component.$options.computed as any
      expect(computed[propertyName]).toBeInstanceOf(Function)
    })

    test('computed property returns store state value', () => {
      expect(component[propertyName]).toBe(value)
    })
  })

  describe('when options string selector and namespace is given', () => {
    const valueSelector = 'VALUE_SELECTOR'
    const moduleName = 'MODULE_NAME'
    const propertyName = 'PROPERTY_NAME'
    const value = 'VALUE'

    const store = new Vuex.Store({
      modules: {
        [moduleName]: {
          namespaced: true,
          state: {
            [valueSelector]: value
          }
        }
      }
    });

    @Component
    class Test extends Vue {
      @State({ selector: valueSelector, namespace: moduleName }) [propertyName]: string
    }

    const component = new Test({ store })

    test('defines computed option', () => {
      const computed = component.$options.computed as any
      expect(computed[propertyName]).toBeInstanceOf(Function)
    })

    test('computed property returns store state value', () => {
      expect(component[propertyName]).toBe(value)
    })
  })

  describe('when options function selector and namespace is given', () => {
    const valueSelector = 'VALUE_SELECTOR'
    const moduleName = 'MODULE_NAME'
    const propertyName = 'PROPERTY_NAME'
    const value = 'VALUE'

    const store = new Vuex.Store({
      modules: {
        [moduleName]: {
          namespaced: true,
          state: {
            [valueSelector]: value
          }
        }
      }
    });

    @Component
    class Test extends Vue {
      @State({ selector: (state) => state[valueSelector], namespace: moduleName }) [propertyName]: string
    }

    const component = new Test({ store })

    test('defines computed option', () => {
      const computed = component.$options.computed as any
      expect(computed[propertyName]).toBeInstanceOf(Function)
    })

    test('computed property returns store state value', () => {
      expect(component[propertyName]).toBe(value)
    })
  })
})
