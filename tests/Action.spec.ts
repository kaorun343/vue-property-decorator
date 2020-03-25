import Vue from 'vue'
import Vuex from 'vuex'
import { Action, Component } from '../src/vue-property-decorator'

describe(Action, () => {

  Vue.use(Vuex)

  describe('when key is not given', () => {
    const propertyName = 'PROPERTY_NAME'
    const mockAction = jest.fn()

    const store = new Vuex.Store({
      actions: {
        [propertyName]: mockAction
      }
    });

    @Component
    class Test extends Vue {
      @Action() [propertyName]: () => void
    }

    const component = new Test({ store })

    test('defines methods option', () => {
      const methods = component.$options.methods as any
      expect(methods[propertyName]).toBeInstanceOf(Function)
    })

    test('method emit action', () => {
      component[propertyName]()
      expect(mockAction).toBeCalled()
    })
  })

  describe('when key is given', () => {
    const actionName = 'ACTION_NAME'
    const propertyName = 'PROPERTY_NAME'
    const mockAction = jest.fn()

    const store = new Vuex.Store({
      actions: {
        [actionName]: mockAction
      }
    });

    @Component
    class Test extends Vue {
      @Action(actionName) [propertyName]: () => void
    }

    const component = new Test({ store })

    test('defines methods option', () => {
      const methods = component.$options.methods as any
      expect(methods[propertyName]).toBeInstanceOf(Function)
    })

    test('method emit action', () => {
      component[propertyName]()
      expect(mockAction).toBeCalled()
    })
  })

  describe('when options action is given', () => {
    const actionName = 'ACTION_NAME'
    const propertyName = 'PROPERTY_NAME'
    const mockAction = jest.fn()

    const store = new Vuex.Store({
      actions: {
        [actionName]: mockAction
      }
    });

    @Component
    class Test extends Vue {
      @Action({ name: actionName }) [propertyName]: () => void
    }

    const component = new Test({ store })

    test('defines methods option', () => {
      const methods = component.$options.methods as any
      expect(methods[propertyName]).toBeInstanceOf(Function)
    })

    test('method emit action', () => {
      component[propertyName]()
      expect(mockAction).toBeCalled()
    })
  })

  describe('when options namespace is given', () => {
    const moduleName = 'MODULE_NAME'
    const propertyName = 'PROPERTY_NAME'
    const mockAction = jest.fn()

    const store = new Vuex.Store({
      modules: {
        [moduleName]: {
          namespaced: true,
          actions: {
            [propertyName]: mockAction
          }
        }
      }
    });

    @Component
    class Test extends Vue {
      @Action({ namespace: moduleName }) [propertyName]: () => void
    }

    const component = new Test({ store })

    test('defines methods option', () => {
      const methods = component.$options.methods as any
      expect(methods[propertyName]).toBeInstanceOf(Function)
    })

    test('method emit action', () => {
      component[propertyName]()
      expect(mockAction).toBeCalled()
    })
  })

  describe('when options action and namespace is given', () => {
    const actionName = 'ACTION_NAME'
    const moduleName = 'MODULE_NAME'
    const propertyName = 'PROPERTY_NAME'
    const mockAction = jest.fn()

    const store = new Vuex.Store({
      modules: {
        [moduleName]: {
          namespaced: true,
          actions: {
            [actionName]: mockAction
          }
        }
      }
    });

    @Component
    class Test extends Vue {
      @Action({ name: actionName, namespace: moduleName }) [propertyName]: () => void
    }

    const component = new Test({ store })

    test('defines methods option', () => {
      const methods = component.$options.methods as any
      expect(methods[propertyName]).toBeInstanceOf(Function)
    })

    test('method emit action', () => {
      component[propertyName]()
      expect(mockAction).toBeCalled()
    })
  })
})
