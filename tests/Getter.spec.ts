import Vue from 'vue'
import Vuex from 'vuex'
import { Getter, Component } from '../src/vue-property-decorator'

describe(Getter, () => {

  Vue.use(Vuex)

  describe('when key is not given', () => {
    const propertyName = 'PROPERTY_NAME'
    const value = 'VALUE'

    const store = new Vuex.Store({
      getters: {
        [propertyName]: () => value
      }
    });

    @Component
    class Test extends Vue {
      @Getter() [propertyName]: string
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
    const getterName = 'GETTER_NAME'
    const propertyName = 'PROPERTY_NAME'
    const value = 'VALUE'

    const store = new Vuex.Store({
      getters: {
        [getterName]: () => value
      }
    });

    @Component
    class Test extends Vue {
      @Getter(getterName) [propertyName]: string
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

  describe('when options getter is given', () => {
    const getterName = 'GETTER_NAME'
    const propertyName = 'PROPERTY_NAME'
    const value = 'VALUE'

    const store = new Vuex.Store({
      getters: {
        [getterName]: () => value
      }
    });

    @Component
    class Test extends Vue {
      @Getter({ name: getterName }) [propertyName]: string
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
          getters: {
            [propertyName]: () => value
          }
        }
      }
    });

    @Component
    class Test extends Vue {
      @Getter({ namespace: moduleName }) [propertyName]: string
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

  describe('when options getter and namespace is given', () => {
    const getterName = 'GETTER_NAME'
    const moduleName = 'MODULE_NAME'
    const propertyName = 'PROPERTY_NAME'
    const value = 'VALUE'

    const store = new Vuex.Store({
      modules: {
        [moduleName]: {
          namespaced: true,
          getters: {
            [getterName]: () => value
          }
        }
      }
    });

    @Component
    class Test extends Vue {
      @Getter({ name: getterName, namespace: moduleName }) [propertyName]: string
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
